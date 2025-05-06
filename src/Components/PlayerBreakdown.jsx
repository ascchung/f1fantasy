import React, { useEffect, useState } from "react";

const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "/api/f1-points"
    : process.env.REACT_APP_API_URL;

export default function PlayerBreakdown() {
  const [drivers, setDrivers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [playerTotals, setPlayerTotals] = useState([]);

  // 1) Fetch driver assignments from the sheet
  useEffect(() => {
    async function fetchDrivers() {
      try {
        const res = await fetch(`${BASE_URL}/drivers`);
        const json = await res.json();
        setDrivers(json.data);
      } catch (err) {
        console.error("Error fetching drivers", err);
        setDrivers([]);
      }
    }
    fetchDrivers();
  }, []);

  // 2) Compute each player's total based on the sheet's "Race Points"
  useEffect(() => {
    if (!drivers.length) return;

    const totals = {};
    drivers.forEach((d) => {
      const pts = parseFloat(d["Race Points"]) || 0;
      const players = [d.Players, d["Players 2"]].filter(Boolean);
      players.forEach((p) => {
        totals[p] = (totals[p] || 0) + pts;
      });
    });

    const sorted = Object.entries(totals)
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total);

    setPlayerTotals(sorted);
  }, [drivers]);

  // 3) Which drivers did the selected player pick?
  const playerDrivers = drivers.filter(
    (d) => d.Players === selected || d["Players 2"] === selected
  );

  return (
    <div className="p-4 md:p-6 lg:p-10 bg-black min-h-screen">
      <h2 className="text-4xl font-bold mb-6 text-center text-white">
        Player Team Breakdown
      </h2>

      {/* Player list */}
      <div className="flex flex-wrap gap-3 mb-6 justify-center">
        {playerTotals.map((p, idx) => (
          <button
            key={`pl-${p.name}`}
            onClick={() => setSelected(p.name)}
            className={`py-2 px-4 rounded-lg shadow text-white flex items-center gap-2 ${
              selected === p.name
                ? "bg-indigo-600"
                : "bg-indigo-400 hover:bg-indigo-500"
            }`}
          >
            <span className="font-semibold">
              #{idx + 1} {p.name}
            </span>
            <span className="px-2 py-0.5 text-xs rounded-full">
              {p.total} pts
            </span>
          </button>
        ))}
      </div>

      {/* Selected player’s drivers */}
      {selected && (
        <div className="flex justify-center">
          <div className="w-full md:w-2/3 lg:w-1/2 p-6 bg-gray-800 rounded-xl shadow-md">
            <h3 className="text-2xl font-semibold mb-4 text-white">
              {selected}'s Team
            </h3>
            <ul className="divide-y divide-gray-600">
              {playerDrivers.map((d) => (
                <li
                  key={`drv-${d.Driver}`}
                  className="flex justify-between px-4 py-3 text-white"
                >
                  <span>{d.Driver}</span>
                  <span className="font-semibold">{d["Race Points"]} pts</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
