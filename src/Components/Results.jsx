import React, { useEffect, useState, useRef } from "react";
import { fetchSeasonResults, fetchSeasonQualifying } from "../services/f1Api";
import {
  calculateDriverPoints,
  calculatePlayerStandings,
} from "../services/scoringEngine";
import { getPlayerConfig } from "../services/playerConfig";
import { underdogTeams } from "../data/driverTiers";
import scoringConfig from "../data/scoring.json";

const teamColors = {
  "Red Bull": "#1E41FF",
  Mercedes: "#00D2BE",
  Ferrari: "#DC0000",
  McLaren: "#FF8700",
  "Aston Martin": "#006F62",
  Alpine: "#0090FF",
  Williams: "#005AFF",
  Audi: "#1d1d1b",
  RB: "#6692FF",
  "Racing Bulls": "#6692FF",
  Haas: "#B6BABD",
  Cadillac: "#1d1d1b",
};

function getPositionColor(pos) {
  if (pos === 1) return "bg-yellow-500 text-black";
  if (pos === 2) return "bg-gray-400 text-black";
  if (pos === 3) return "bg-orange-500 text-black";
  if (pos <= 10) return "bg-gray-700 text-white";
  return "bg-gray-800 text-gray-400";
}

function BonusBadge({ label, value, color }) {
  if (value === 0) return null;
  const sign = value > 0 ? "+" : "";
  return (
    <span
      className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${color}`}
    >
      {sign}
      {value} {label}
    </span>
  );
}

function ConstructorBonusRow({ constructor, races, round }) {
  if (!constructor) return null;

  const race = races.find((r) => String(r.round) === String(round));
  if (!race) return null;

  let podiumCount = 0;
  for (const result of race.Results || []) {
    const pos = parseInt(result.position, 10);
    if (pos <= 3 && result.Constructor.name === constructor) {
      podiumCount++;
    }
  }

  if (podiumCount === 0) return null;

  const bonusPerPodium = underdogTeams.includes(constructor)
    ? scoringConfig.bonuses.underdogTeamPodium
    : scoringConfig.bonuses.teamPodium;
  const totalBonus = podiumCount * bonusPerPodium;

  return (
    <div className="mt-3 pt-3 border-t border-gray-700 flex items-center justify-between text-sm">
      <div className="flex items-center gap-2">
        <span
          className="w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: teamColors[constructor] || "#6b7280" }}
        />
        <span className="text-gray-400">
          {constructor} constructor bonus
        </span>
      </div>
      <span className="text-green-400 font-medium">+{totalBonus}</span>
    </div>
  );
}

export default function Results() {
  const [driverPoints, setDriverPoints] = useState({});
  const [standings, setStandings] = useState([]);
  const [races, setRaces] = useState([]);
  const [selectedRound, setSelectedRound] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [season, setSeason] = useState(2026);
  const pillsRef = useRef(null);

  useEffect(() => {
    async function loadData() {
      try {
        const playersConfig = getPlayerConfig();
        setSeason(playersConfig.season);
        const [raceData, qualifyingData] = await Promise.all([
          fetchSeasonResults(playersConfig.season),
          fetchSeasonQualifying(playersConfig.season),
        ]);
        setRaces(raceData);
        const dp = calculateDriverPoints(raceData, qualifyingData);
        setDriverPoints(dp);
        const ps = calculatePlayerStandings(dp, playersConfig.players, raceData);
        setStandings(ps);
        if (raceData.length > 0) {
          setSelectedRound(raceData[raceData.length - 1].round);
        }
      } catch (err) {
        console.error("Error loading results:", err);
        setError("Failed to load race data. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="p-10 bg-page min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-400">Loading race data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 bg-page min-h-screen flex items-center justify-center">
        <p className="text-lg text-red-400">{error}</p>
      </div>
    );
  }

  const selectedRace = races.find(
    (r) => String(r.round) === String(selectedRound)
  );

  // For each player, find their drivers' results for the selected round
  const playerCards = standings.map((player) => {
    const driverResults = player.drivers.map((d) => {
      const driverData = driverPoints[d.driverId];
      const raceResult = driverData?.raceResults?.find(
        (rr) => String(rr.round) === String(selectedRound)
      );
      return {
        driverId: d.driverId,
        givenName: driverData?.givenName || d.givenName || "",
        familyName: driverData?.familyName || d.familyName,
        team: driverData?.team || d.team,
        raceResult,
      };
    });

    const driverRaceTotal = driverResults.reduce(
      (sum, d) => sum + (d.raceResult?.points || 0),
      0
    );

    // Constructor bonus for this specific race
    let constructorRaceBonus = 0;
    if (player.constructor && selectedRace) {
      let podiumCount = 0;
      for (const result of selectedRace.Results || []) {
        const pos = parseInt(result.position, 10);
        if (pos <= 3 && result.Constructor.name === player.constructor) {
          podiumCount++;
        }
      }
      if (podiumCount > 0) {
        const bonusPerPodium = underdogTeams.includes(player.constructor)
          ? scoringConfig.bonuses.underdogTeamPodium
          : scoringConfig.bonuses.teamPodium;
        constructorRaceBonus = podiumCount * bonusPerPodium;
      }
    }

    return {
      ...player,
      driverResults,
      raceTotal: driverRaceTotal + constructorRaceBonus,
      constructorRaceBonus,
    };
  });

  // Sort by race total for this GP
  playerCards.sort((a, b) => b.raceTotal - a.raceTotal);

  return (
    <div className="p-4 md:p-6 lg:p-10 bg-page min-h-screen">
      <div className="text-center mb-6">
        <h2 className="text-4xl font-bold mb-2 text-white">Race Results</h2>
        <p className="text-lg text-gray-400">Season {season}</p>
      </div>

      {/* Race selector pills */}
      <div className="mb-8 max-w-6xl mx-auto">
        <div
          ref={pillsRef}
          className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {races.map((race) => {
            const isSelected = String(race.round) === String(selectedRound);
            // Extract short GP name (e.g. "Australian Grand Prix" -> "Australia")
            const shortName = race.raceName
              .replace(" Grand Prix", "")
              .replace(" GP", "");
            return (
              <button
                key={race.round}
                onClick={() => setSelectedRound(race.round)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-150 ${
                  isSelected
                    ? "bg-red-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200"
                }`}
              >
                <span className="md:hidden">R{race.round}</span>
                <span className="hidden md:inline">{shortName}</span>
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

      {/* Player cards */}
      <div className="max-w-4xl mx-auto space-y-4">
        {playerCards.map((player, idx) => (
          <div
            key={player.name}
            className="bg-card rounded-xl border border-gray-700 p-4 md:p-5"
          >
            {/* Player header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span
                  className={`text-lg font-bold ${
                    idx === 0
                      ? "text-yellow-400"
                      : idx === 1
                      ? "text-gray-400"
                      : idx === 2
                      ? "text-orange-400"
                      : "text-gray-500"
                  }`}
                >
                  #{idx + 1}
                </span>
                <span className="text-white font-semibold text-lg">
                  {player.name}
                </span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-white">
                  {player.raceTotal}
                </span>
                <span className="text-sm text-gray-500 ml-1">pts</span>
              </div>
            </div>

            {/* Driver rows */}
            <div className="space-y-2">
              {player.driverResults.map((d) => {
                const rr = d.raceResult;
                if (!rr) {
                  return (
                    <div
                      key={d.driverId}
                      className="bg-gray-900 rounded-lg p-3 flex items-center justify-between border border-gray-700"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-gray-800 text-gray-500 flex items-center justify-center text-xs font-bold">
                          --
                        </span>
                        <div>
                          <div className="text-white text-sm font-medium">
                            {d.givenName} {d.familyName}
                          </div>
                          <div className="text-xs text-gray-500">{d.team}</div>
                        </div>
                      </div>
                      <span className="text-gray-500 text-sm">No result</span>
                    </div>
                  );
                }

                return (
                  <div
                    key={d.driverId}
                    className="bg-gray-900 rounded-lg p-3 border border-gray-700"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${getPositionColor(
                            rr.position
                          )}`}
                        >
                          P{rr.position}
                        </span>
                        <div>
                          <div className="text-white text-sm font-medium">
                            {d.givenName} {d.familyName}
                          </div>
                          <div className="text-xs text-gray-500">{d.team}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-white font-semibold">
                          {rr.points}
                        </span>
                        <span className="text-xs text-gray-500 ml-1">pts</span>
                      </div>
                    </div>

                    {/* Itemized bonuses */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {rr.basePoints > 0 && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-gray-700 text-gray-300">
                          +{rr.basePoints} Pos
                        </span>
                      )}
                      <BonusBadge
                        label={rr.qualiRound || "Quali"}
                        value={rr.qualifyingBonus}
                        color="bg-blue-900 text-blue-300"
                      />
                      <BonusBadge
                        label="FL"
                        value={rr.fastestLapBonus}
                        color="bg-purple-900 text-purple-300"
                      />
                      <BonusBadge
                        label="DNF"
                        value={rr.dnfPenalty}
                        color="bg-red-900 text-red-300"
                      />
                      <BonusBadge
                        label="Underdog"
                        value={rr.underdogBonus}
                        color="bg-orange-900 text-orange-300"
                      />
                      <BonusBadge
                        label="Streak"
                        value={rr.streakBonus}
                        color="bg-green-900 text-green-300"
                      />
                      <BonusBadge
                        label="Streak Breaker"
                        value={rr.streakBreakerBonus}
                        color="bg-teal-900 text-teal-300"
                      />
                      <BonusBadge
                        label={`+${rr.placesGained} Places`}
                        value={rr.placesGainedBonus}
                        color="bg-emerald-900 text-emerald-300"
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Constructor bonus */}
            <ConstructorBonusRow
              constructor={player.constructor}
              races={races}
              round={selectedRound}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
