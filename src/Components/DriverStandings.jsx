import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "/api/f1-points"
    : process.env.REACT_APP_API_URL;

const teamColors = {
  "Red Bull": "#1E41FF",
  Mercedes: "#00D2BE",
  Ferrari: "#DC0000",
  McLaren: "#FF8700",
  "Aston Martin": "#006F62",
  Alpine: "#0090FF",
  Williams: "#005AFF",
  "Kick Sauber": "#52E252",
  RB: "#6692FF",
  Haas: "#B6BABD",
};

export default function DriverChart() {
  const [drivers, setDrivers] = useState([]);
  const [barData, setBarData] = useState([]);

  // 1) Fetch from the Sheets /drivers endpoint
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

  // 2) Build the bar-chart data from the sheet's "Race Points"
  useEffect(() => {
    const data = drivers.map((d) => ({
      driver: d.Driver,
      points: parseFloat(d["Race Points"]) || 0,
      fill: teamColors[d.Team] || "#8884d8",
    }));
    setBarData(data);
  }, [drivers]);

  // 3) Sort by points for the table
  const sorted = [...drivers].sort(
    (a, b) => parseFloat(b["Race Points"]) - parseFloat(a["Race Points"])
  );

  return (
    <div className="p-4 md:p-6 lg:p-10 bg-black min-h-screen">
      <h2 className="text-4xl font-bold mb-6 text-center text-white">
        Driver Standings
      </h2>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Table */}
        <div className="flex-1 rounded-xl bg-gray-700 shadow-md overflow-hidden">
          <h3 className="text-lg font-semibold bg-gray-100 px-4 py-3 border-b">
            Total Points Standings
          </h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left bg-white">
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Driver</th>
                <th className="py-3 px-4">Team</th>
                <th className="py-3 px-4">Points</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((entry, idx) => (
                <tr
                  key={`drv-${entry.Driver}-${entry["Race Points"]}`}
                  className="border-t hover:bg-gray-100 text-white"
                >
                  <td className="py-2 px-4 font-medium">{idx + 1}</td>
                  <td className="py-2 px-4">{entry.Driver}</td>
                  <td className="py-2 px-4">{entry.Team}</td>
                  <td className="py-2 px-4">{entry["Race Points"]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bar Chart */}
        <div className="flex-1 rounded-xl bg-gray-700 shadow-md overflow-hidden">
          <h3 className="text-lg font-semibold bg-gray-100 px-4 py-3 border-b text-white">
            Points by Driver
          </h3>
          <div className="bg-gray-700 p-4">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={barData}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <XAxis
                  dataKey="driver"
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  tick={{ fill: "white" }}
                />
                <YAxis tick={{ fill: "white" }} />
                <Tooltip />
                <Bar dataKey="points">
                  {barData.map((entry) => (
                    <cell key={`cell-${entry.driver}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
