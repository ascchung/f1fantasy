import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const BASE_URL = "https://f1fantasy-o25v.onrender.com/api/f1-points";

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
    const fetchDrivers = async () => {
      try {
        const res = await fetch(`${BASE_URL}/drivers`);
        const json = await res.json();
        setStandings(json.data);
      } catch (err) {
        console.error("Error fetching drivers", err);
      }
    };

    fetchDrivers();
  }, []);

  useEffect(() => {
    const fetchRaceScores = async () => {
      try {
        const res = await fetch(`${BASE_URL}/race-scores`);
        const json = await res.json();
        setRaceScores(json.data);
      } catch (err) {
        console.error("Error fetching race scores", err);
      }
    };

    fetchRaceScores();
  }, []);

  useEffect(() => {
    const races = raceScores.map((row) => row["Grand Prix"]).filter(Boolean);
    setAvailableRaces(races);
  }, [raceScores]);

  useEffect(() => {
    const data = standings.map((driver) => ({
      driver: driver.Driver,
      points: parseFloat(driver["Race Points"]),
      fill: teamColors[driver.Team] || "#8884d8",
    }));
    setBarData(data);
  }, [standings]);

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
                  key={entry.Driver}
                  className="border-t hover:bg-gray-100 text-white"
                >
                  <td className="py-2 px-4 font-medium">{index + 1}</td>
                  <td className="py-2 px-4">{entry.Driver}</td>
                  <td className="py-2 px-4">{entry.Team}</td>
                  <td className="py-2 px-4">{entry["Race Points"]}</td>
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
              <option value="">Select a race</option>
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
  );
}
