import React, { useEffect, useState } from "react";
import Papa from "papaparse";

const csvUrl =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTT5gN6c7rrGgkgBNtuN9YH6vbctMRzPhg7xeS8rV067dz9wkYM-SOGGhqTnOfPBA/pub?gid=1917170938&single=true&output=csv";

export default function PlayerBreakdown() {
  const [drivers, setDrivers] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    Papa.parse(csvUrl, {
      download: true,
      header: true,
      complete: (results) => {
        const filtered = results.data.filter(
          (row) =>
            row.Driver &&
            row["Race Points"] &&
            (row.Players || row["Players 2"])
        );
        const normalized = filtered.map((d) => ({
          name: d.Driver,
          points: parseInt(d["Race Points"]) || 0,
          players: [d.Players?.trim(), d["Players 2"]?.trim()].filter(Boolean),
        }));
        setDrivers(normalized);
      },
    });
  }, []);

  const allPlayers = [...new Set(drivers.flatMap((d) => d.players))];
  const playerDrivers = drivers.filter((d) => d.players.includes(selected));

  return (
    <div className="p-4 md:p-6 lg:p-10 bg-black min-h-screen">
      <h2 className="text-4xl font-bold mb-6 text-center text-white">
        Player Team Breakdown
      </h2>
      <div className="flex flex-wrap gap-3 mb-6 justify-center">
        {allPlayers.map((p) => (
          <button
            key={p}
            onClick={() => setSelected(p)}
            className={`py-2 px-4 rounded-lg shadow text-white ${
              selected === p
                ? "bg-indigo-600"
                : "bg-indigo-400 hover:bg-indigo-500"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {selected && (
        <div className="flex justify-center">
          <div className="w-1/2 p-4 md:p-6 lg:p-10 bg-gray-200">
            <h3 className="text-xl font-medium mb-2">{selected}'s Team</h3>
            <ul className="bg-gray-700 shadow rounded-xl divide-y">
              {playerDrivers.map((d) => (
                <li
                  key={d.name}
                  className="flex justify-between px-4 py-2 text-white"
                >
                  <span>{d.name}</span>
                  <span className="font-semibold text-white">
                    {d.points} pts
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
