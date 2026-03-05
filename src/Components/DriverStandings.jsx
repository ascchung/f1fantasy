import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { fetchSeasonResults } from "../services/f1Api";
import { calculateDriverPoints } from "../services/scoringEngine";
import { getPlayerConfig } from "../services/playerConfig";

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
  Haas: "#B6BABD",
  "Racing Bulls": "#6692FF",
  Cadillac: "#1d1d1b",
};

const DriverCard = ({ driver, index }) => {
  const [flipped, setFlipped] = useState(false);
  const teamColor = teamColors[driver.team] || "#8884d8";

  const lastRaces = driver.raceResults.slice(-3);
  const recentTrend = lastRaces.length >= 2
    ? lastRaces[lastRaces.length - 1].points >= lastRaces[lastRaces.length - 2].points
    : true;
  const momentumColor = recentTrend ? "text-green-400" : "text-red-400";
  const momentumLabel = recentTrend ? "▲" : "▼";

  return (
    <div
      className="perspective-1000 w-full h-28 cursor-pointer"
      onClick={() => setFlipped(!flipped)}
    >
      <div
        className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
          flipped ? "rotate-y-180" : ""
        }`}
      >
        <div
          className="absolute inset-0 backface-hidden rounded-lg border border-gray-700"
          style={{
            background: `linear-gradient(135deg, ${teamColor}15, ${teamColor}30)`,
          }}
        >
          <div className="p-4 h-full flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold text-gray-400">P{index + 1}</span>
              <div>
                <div className="font-medium">
                  {driver.givenName} {driver.familyName}
                </div>
                <div className="text-sm text-gray-400">{driver.team}</div>
              </div>
            </div>
            <div className="text-right flex items-center gap-3">
              <div>
                <div className="text-xl font-semibold">
                  {driver.points}
                </div>
                <div className="text-xs text-gray-500">pts</div>
              </div>
              {driver.raceResults.length > 1 && (
                <span className={`text-sm ${momentumColor}`}>{momentumLabel}</span>
              )}
            </div>
          </div>
        </div>

        <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-lg bg-card border border-gray-700">
          <div className="p-4 h-full flex flex-col justify-center text-white text-center">
            <div className="text-xs text-gray-400 mb-2 uppercase tracking-wider">Driver Stats</div>
            <div className="grid grid-cols-4 gap-2 text-xs">
              <div>
                <div className="font-medium">{driver.podiums}</div>
                <div className="text-gray-500">Podiums</div>
              </div>
              <div>
                <div className="font-medium">{driver.fastestLaps}</div>
                <div className="text-gray-500">FL</div>
              </div>
              <div>
                <div className="font-medium">{driver.dnfs}</div>
                <div className="text-gray-500">DNFs</div>
              </div>
              <div>
                <div className="font-medium">{driver.raceResults.length}</div>
                <div className="text-gray-500">Races</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function DriverChart() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [season, setSeason] = useState(2026);

  useEffect(() => {
    async function loadData() {
      try {
        const playersConfig = getPlayerConfig();
        setSeason(playersConfig.season);
        const races = await fetchSeasonResults(playersConfig.season);
        const driverPoints = calculateDriverPoints(races);
        let driverList = Object.values(driverPoints);
        if (driverList.length === 0) {
          const allDriverIds = [...new Set(playersConfig.players.flatMap((p) => p.drivers))];
          driverList = allDriverIds.map((id) => ({
            driverId: id,
            givenName: "",
            familyName: id.replace(/_/g, " "),
            team: "TBA",
            points: 0,
            podiums: 0,
            fastestLaps: 0,
            dnfs: 0,
            raceResults: [],
          }));
        }
        driverList.sort((a, b) => b.points - a.points);
        setDrivers(driverList);
      } catch (err) {
        console.error("Error loading driver data:", err);
        setError("Failed to load race data. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const barData = drivers.slice(0, 10).map((d) => ({
    driver: d.familyName,
    points: d.points,
    fill: teamColors[d.team] || "#8884d8",
    team: d.team,
  }));

  if (loading) {
    return (
      <div className="p-10 bg-page min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-400">Loading driver standings...</p>
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

  return (
    <div className="p-4 md:p-6 lg:p-10 bg-page min-h-screen">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold mb-2 text-white">
          Driver Championship
        </h2>
        <p className="text-lg text-gray-400">{season} Season Standings</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2">
          <h3 className="text-lg font-semibold text-gray-300 mb-4 uppercase tracking-wider">
            Standings
          </h3>
          <div className="space-y-2">
            {drivers.map((driver, index) => (
              <DriverCard
                key={driver.driverId}
                driver={driver}
                index={index}
              />
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-card rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-gray-300 mb-4 uppercase tracking-wider">
              Points Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <XAxis
                  dataKey="driver"
                  tick={{ fill: "#9ca3af", fontSize: 10 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fill: "#9ca3af" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "white",
                  }}
                />
                <Bar dataKey="points">
                  {barData.map((entry, index) => (
                    <cell key={`cell-${index}`} fill={entry.fill} />
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
