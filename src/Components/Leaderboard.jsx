import React, { useEffect, useState } from "react";

const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "/api/f1-points"
    : process.env.REACT_APP_API_URL;

export default function Leaderboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch(`${BASE_URL}/leaderboard`);
        const json = await res.json();
        setData(json.data);
      } catch (err) {
        console.error("Error fetching leaderboard", err);
        setData([]);
      }
    };

    fetchLeaderboard();
  }, []);

  const sorted = [...data].sort(
    (a, b) => parseFloat(b.Points) - parseFloat(a.Points)
  );

  return (
    <div className="p-4 md:p-6 lg:p-10 bg-black min-h-screen">
      <h2 className="text-4xl font-bold mb-6 text-center text-white">
        Leaderboard
      </h2>
      <table className="min-w-full bg-gray-700 shadow rounded-xl overflow-hidden">
        <thead>
          <tr className="bg-gray-100 text-left text-sm font-semibold text-black">
            <th className="py-3 px-4">Rank</th>
            <th className="py-3 px-4">Player</th>
            <th className="py-3 px-4">Points</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((entry, index) => (
            <tr
              key={`${entry.Standings}-${entry.Points}`}
              className="border-t hover:bg-gray-600 text-white"
            >
              <td className="py-2 px-4 font-medium flex items-center gap-2">
                {index === 0 ? (
                  <span className="text-yellow-400 animate-pulse">🏆</span>
                ) : index === sorted.length - 1 ? (
                  <span className="text-red-500 animate-bounce">💀</span>
                ) : (
                  index + 1
                )}
              </td>
              <td className="py-2 px-4">{entry.Standings}</td>
              <td className="py-2 px-4">{entry.Points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
