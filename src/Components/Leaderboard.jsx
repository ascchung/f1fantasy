import React, { useEffect, useState } from "react";
import Papa from "papaparse";

const leaderboardUrl = "http://localhost:3001/api/f1-points/leaderboard";

export default function Leaderboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(leaderboardUrl)
      .then((res) => res.json())
      .then((json) => {
        const filtered = json.data.filter((row) => row.Player && row.Points);
        setData(filtered);
      })
      .catch((err) => console.error("Failed to fetch leaderboard", err));
  }, []);

  return (
    <div className="p-4 md:p-6 lg:p-10 bg-black min-h-screen">
      <h2 className="text-4xl font-bold mb-6 text-center text-white">
        Leaderboard
      </h2>
      <table className="min-w-full bg-gray-700 shadow rounded-xl overflow-hidden">
        <thead>
          <tr className="bg-gray-100 text-left text-sm font-semibold">
            <th className="py-3 px-4">Rank</th>
            <th className="py-3 px-4">Player</th>
            <th className="py-3 px-4">Points</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((entry, index) => (
            <tr
              key={entry.Player}
              className="border-t hover:bg-gray-50 text-white"
            >
              <td className="py-2 px-4">
                {index + 1} {index === 0 && "🏆"} {index === 6 && "💀"}
              </td>
              <td className="py-2 px-4">{entry.Player}</td>
              <td className="py-2 px-4">{entry.Points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
