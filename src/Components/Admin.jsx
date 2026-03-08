import React, { useEffect, useState, useRef } from "react";
import { fetchSeasonResults, fetchSeasonQualifying } from "../services/f1Api";
import { getPlayerConfig } from "../services/playerConfig";
import existingOverrides from "../data/raceOverrides.json";

const DRIVER_MAP_2026 = {
  1: "norris", 3: "verstappen", 5: "bortoleto", 6: "hadjar", 10: "gasly",
  11: "perez", 12: "antonelli", 14: "alonso", 16: "leclerc", 18: "stroll",
  23: "albon", 27: "hulkenberg", 30: "lawson", 31: "ocon", 41: "lindblad",
  43: "colapinto", 44: "hamilton", 55: "sainz", 63: "russell", 77: "bottas",
  81: "piastri", 87: "bearman",
};

export default function Admin() {
  const [races, setRaces] = useState([]);
  const [qualifying, setQualifying] = useState([]);
  const [selectedRound, setSelectedRound] = useState(null);
  const [overrides, setOverrides] = useState({});
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const pillsRef = useRef(null);

  useEffect(() => {
    async function loadData() {
      try {
        const playersConfig = getPlayerConfig();
        const [raceData, qualiData] = await Promise.all([
          fetchSeasonResults(playersConfig.season),
          fetchSeasonQualifying(playersConfig.season),
        ]);
        setRaces(raceData);
        setQualifying(qualiData);
        setOverrides(JSON.parse(JSON.stringify(existingOverrides)));
        if (raceData.length > 0) {
          setSelectedRound(raceData[raceData.length - 1].round);
        }
      } catch (err) {
        console.error("Error loading admin data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const selectedRace = races.find(
    (r) => String(r.round) === String(selectedRound)
  );
  const selectedQuali = qualifying.find(
    (q) => String(q.round) === String(selectedRound)
  );

  function getDriverData(driverId) {
    const result = selectedRace?.Results?.find(
      (r) => r.Driver.driverId === driverId
    );
    const qualiResult = selectedQuali?.QualifyingResults?.find(
      (q) => q.Driver.driverId === driverId
    );

    // Infer quali round from Q fields
    let inferredQuali = "Q1";
    if (qualiResult) {
      if (qualiResult.Q3 && qualiResult.Q3 !== "-") inferredQuali = "Q3";
      else if (qualiResult.Q2 && qualiResult.Q2 !== "-") inferredQuali = "Q2";
    }

    const existing = overrides[selectedRound]?.[driverId];
    return {
      position: result ? parseInt(result.position) : null,
      name: result
        ? `${result.Driver.givenName} ${result.Driver.familyName}`
        : driverId,
      team: result?.Constructor?.name || "",
      grid: existing?.grid ?? (result?.grid !== "0" ? parseInt(result.grid) : ""),
      qualifyingRound: existing?.qualifyingRound ?? inferredQuali,
      dnf: existing?.dnf ?? (result?.status === "Retired"),
      apiGrid: result?.grid || "0",
      apiStatus: result?.status || "",
    };
  }

  function handleChange(driverId, field, value) {
    setOverrides((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      if (!next[selectedRound]) next[selectedRound] = {};
      if (!next[selectedRound][driverId]) next[selectedRound][driverId] = {};
      next[selectedRound][driverId][field] = value;
      return next;
    });
  }

  function handleAutoFillGrid() {
    if (!selectedQuali?.QualifyingResults) return;
    setOverrides((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      if (!next[selectedRound]) next[selectedRound] = {};
      for (const qr of selectedQuali.QualifyingResults) {
        const id = qr.Driver.driverId;
        if (!next[selectedRound][id]) next[selectedRound][id] = {};
        if (!next[selectedRound][id].grid && next[selectedRound][id].grid !== 0) {
          next[selectedRound][id].grid = parseInt(qr.position) || 0;
        }
      }
      return next;
    });
  }

  function handleMarkAllFinished() {
    if (!selectedRace?.Results) return;
    setOverrides((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      if (!next[selectedRound]) next[selectedRound] = {};
      for (const result of selectedRace.Results) {
        const id = result.Driver.driverId;
        if (!next[selectedRound][id]) next[selectedRound][id] = {};
        next[selectedRound][id].dnf = false;
      }
      return next;
    });
  }

  function handleCopy() {
    const json = JSON.stringify(overrides, null, 2);
    navigator.clipboard.writeText(json).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleDownload() {
    const json = JSON.stringify(overrides, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "raceOverrides.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  // Get all driver IDs from the race results
  const driverIds = selectedRace
    ? selectedRace.Results.map((r) => r.Driver.driverId)
    : Object.values(DRIVER_MAP_2026);

  const roundsWithOverrides = new Set(Object.keys(overrides).filter(
    (k) => Object.keys(overrides[k]).length > 0
  ));

  if (loading) {
    return (
      <div className="p-10 bg-page min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-400">Loading race data...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-10 bg-page min-h-screen">
      <div className="text-center mb-6">
        <h2 className="text-4xl font-bold mb-2 text-white">Race Data Admin</h2>
        <p className="text-lg text-gray-400">
          Enter grid positions, qualifying rounds, and DNF status
        </p>
      </div>

      {/* Race selector pills */}
      <div className="mb-6 max-w-6xl mx-auto">
        <div
          ref={pillsRef}
          className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {races.map((race) => {
            const isSelected = String(race.round) === String(selectedRound);
            const hasOverrides = roundsWithOverrides.has(race.round);
            const shortName = race.raceName
              .replace(" Grand Prix", "")
              .replace(" GP", "");
            return (
              <button
                key={race.round}
                onClick={() => setSelectedRound(race.round)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-150 relative ${
                  isSelected
                    ? "bg-red-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200"
                }`}
              >
                <span className="md:hidden">R{race.round}</span>
                <span className="hidden md:inline">{shortName}</span>
                {hasOverrides && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected race title */}
      {selectedRace && (
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold text-gray-300">
            Round {selectedRace.round} — {selectedRace.raceName}
          </h3>
        </div>
      )}

      {/* Quick actions */}
      <div className="max-w-4xl mx-auto mb-4 flex flex-wrap gap-2">
        <button
          onClick={handleAutoFillGrid}
          className="px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors"
        >
          Auto-fill grid from quali positions
        </button>
        <button
          onClick={handleMarkAllFinished}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors"
        >
          Mark all as finished
        </button>
      </div>

      {/* Driver override table */}
      <div className="max-w-4xl mx-auto bg-card rounded-xl border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700 text-gray-400">
                <th className="text-left px-4 py-3 font-medium">Pos</th>
                <th className="text-left px-4 py-3 font-medium">Driver</th>
                <th className="text-left px-4 py-3 font-medium hidden md:table-cell">
                  Team
                </th>
                <th className="text-center px-4 py-3 font-medium">Grid</th>
                <th className="text-center px-4 py-3 font-medium">Quali</th>
                <th className="text-center px-4 py-3 font-medium">DNF</th>
              </tr>
            </thead>
            <tbody>
              {driverIds.map((driverId) => {
                const d = getDriverData(driverId);
                return (
                  <tr
                    key={driverId}
                    className="border-b border-gray-800 hover:bg-gray-800/50"
                  >
                    <td className="px-4 py-2 text-gray-400 font-mono">
                      {d.position ? `P${d.position}` : "--"}
                    </td>
                    <td className="px-4 py-2">
                      <div className="text-white font-medium">{d.name}</div>
                      <div className="text-xs text-gray-500 md:hidden">
                        {d.team}
                      </div>
                    </td>
                    <td className="px-4 py-2 text-gray-400 hidden md:table-cell">
                      {d.team}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <input
                        type="number"
                        min="0"
                        max="22"
                        value={d.grid}
                        onChange={(e) =>
                          handleChange(
                            driverId,
                            "grid",
                            parseInt(e.target.value) || 0
                          )
                        }
                        placeholder={d.apiGrid !== "0" ? d.apiGrid : "—"}
                        className="w-14 px-2 py-1 bg-gray-900 border border-gray-600 rounded text-center text-white text-sm focus:border-blue-500 focus:outline-none"
                      />
                    </td>
                    <td className="px-4 py-2 text-center">
                      <select
                        value={d.qualifyingRound}
                        onChange={(e) =>
                          handleChange(
                            driverId,
                            "qualifyingRound",
                            e.target.value
                          )
                        }
                        className="px-2 py-1 bg-gray-900 border border-gray-600 rounded text-white text-sm focus:border-blue-500 focus:outline-none"
                      >
                        <option value="Q3">Q3</option>
                        <option value="Q2">Q2</option>
                        <option value="Q1">Q1</option>
                      </select>
                    </td>
                    <td className="px-4 py-2 text-center">
                      <input
                        type="checkbox"
                        checked={d.dnf}
                        onChange={(e) =>
                          handleChange(driverId, "dnf", e.target.checked)
                        }
                        className="w-4 h-4 accent-red-500"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export section */}
      <div className="max-w-4xl mx-auto mt-6 space-y-4">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleCopy}
            className={`px-6 py-3 rounded-lg font-medium text-sm transition-colors ${
              copied
                ? "bg-green-600 text-white"
                : "bg-red-600 hover:bg-red-500 text-white"
            }`}
          >
            {copied ? "Copied!" : "Copy JSON to Clipboard"}
          </button>
          <button
            onClick={handleDownload}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium text-sm transition-colors"
          >
            Download raceOverrides.json
          </button>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg font-medium text-sm transition-colors"
          >
            {showPreview ? "Hide" : "Preview"} JSON
          </button>
        </div>

        {showPreview && (
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 overflow-x-auto">
            <pre className="text-xs text-gray-300 whitespace-pre">
              {JSON.stringify(overrides, null, 2)}
            </pre>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 text-sm text-gray-400">
          <p className="font-medium text-gray-300 mb-2">
            How to deploy overrides:
          </p>
          <ol className="list-decimal list-inside space-y-1">
            <li>
              Fill in grid positions, qualifying rounds, and DNF status above
            </li>
            <li>Click "Download raceOverrides.json" or copy to clipboard</li>
            <li>
              Replace{" "}
              <code className="text-gray-300 bg-gray-800 px-1 rounded">
                src/data/raceOverrides.json
              </code>{" "}
              with the downloaded file
            </li>
            <li>
              <code className="text-gray-300 bg-gray-800 px-1 rounded">
                git add . && git commit -m "Round X overrides" && git push
              </code>
            </li>
            <li>GitHub Actions will auto-deploy to the live site</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
