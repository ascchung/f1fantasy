import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const driverStatsUrl =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTT5gN6c7rrGgkgBNtuN9YH6vbctMRzPhg7xeS8rV067dz9wkYM-SOGGhqTnOfPBA/pub?gid=1917170938&single=true&output=csv";

const raceScoresUrl =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTT5gN6c7rrGgkgBNtuN9YH6vbctMRzPhg7xeS8rV067dz9wkYM-SOGGhqTnOfPBA/pub?gid=1617059325&single=true&output=csv";

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
  const [standings, setStandings] = useState([]);
  const [barData, setBarData] = useState([]);
  const [raceScores, setRaceScores] = useState([]);
  const [availableRaces, setAvailableRaces] = useState([]);
  const [selectedRace, setSelectedRace] = useState("");

  useEffect(() => {
    Papa.parse(driverStatsUrl, {
      download: true,
      header: true,
      complete: (results) => {
        const drivers = results.data.filter(
          (row) =>
            row.Driver && row["Race Points"] && !isNaN(row["Race Points"])
        );

        const formatted = drivers.map((d) => ({
          driver: d.Driver.trim(),
          team: d.Team?.trim() || "",
          points: parseFloat(d["Race Points"]),
          fill: teamColors[d.Team?.trim()] || "#8884d8",
        }));

        const sorted = [...formatted].sort((a, b) => b.points - a.points);

        setStandings(sorted);
        setBarData(sorted);
      },
    });
  }, []);

  useEffect(() => {
    Papa.parse(raceScoresUrl, {
      download: true,
      header: true,
      complete: (results) => {
        const rows = results.data.filter((r) => r["Grand Prix"]);
        setRaceScores(rows);
        setAvailableRaces(rows.map((r) => r["Grand Prix"]));
        setSelectedRace(rows[0]["Grand Prix"]);
      },
    });
  }, []);

  const selectedRaceRow = raceScores.find(
    (r) => r["Grand Prix"] === selectedRace
  );
  const racePointsTable = selectedRaceRow
    ? Object.entries(selectedRaceRow)
        .filter(([key]) => key !== "Grand Prix")
        .map(([driver, points]) => ({ driver, points }))
        .sort((a, b) => parseFloat(b.points) - parseFloat(a.points))
    : [];

  return (
    <div className="p-4 md:p-6 lg:p-10 bg-black min-h-screen">
      <h2 className="text-4xl font-bold mb-6 text-center text-white">
        Standings
      </h2>
      <div className="flex flex-col lg:flex-row gap-8">
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
              {standings.map((entry, index) => (
                <tr
                  key={entry.driver}
                  className="border-t hover:bg-gray-100 text-white"
                >
                  <td className="py-2 px-4 font-medium">{index + 1}</td>
                  <td className="py-2 px-4">{entry.driver}</td>
                  <td className="py-2 px-4">{entry.team}</td>
                  <td className="py-2 px-4">{entry.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-xl bg-gray-700 shadow-md overflow-hidden">
          <div className="px-4 pt-3">
            <label className="block font-semibold mb-2 text-white">
              Filter by Grand Prix:
            </label>
            <select
              value={selectedRace}
              onChange={(e) => setSelectedRace(e.target.value)}
              className="mb-4 p-2 border rounded w-full"
            >
              {availableRaces.map((race) => (
                <option key={race} value={race}>
                  {race}
                </option>
              ))}
            </select>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left bg-white">
                <th className="py-3 px-4">Driver</th>
                <th className="py-3 px-4">Points</th>
              </tr>
            </thead>
            <tbody>
              {racePointsTable.map(({ driver, points }) => (
                <tr
                  key={driver}
                  className="border-t hover:bg-gray-100 text-white"
                >
                  <td className="py-2 px-4">{driver}</td>
                  <td className="py-2 px-4">{points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-12">
        <h3 className="text-xl font-semibold mb-4 text-center text-white">
          Total Points by Driver (Color Coded by Team)
        </h3>
        <div className="bg-gray-700 p-4 rounded-xl shadow-md">
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
              {barData.map((entry) => (
                <Bar
                  key={entry.driver}
                  dataKey="points"
                  name={entry.driver}
                  fill={entry.fill}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
