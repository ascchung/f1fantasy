import React, { useEffect, useState } from "react";
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { fetchSeasonResults, fetchSeasonQualifying } from "../services/f1Api";
import { calculateDriverPoints, calculatePlayerStandings } from "../services/scoringEngine";
import { getPlayerConfig } from "../services/playerConfig";
import { getDriverTier, tierInfo } from "../data/driverTiers";

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

const tierColors = {
  allStar: "bg-yellow-900 text-yellow-300",
  risingStar: "bg-cyan-900 text-cyan-300",
  underdog: "bg-orange-900 text-orange-300",
};

const driverNicknames = {
  sainz: { label: "Smooth Operator", emoji: "😎", color: "bg-red-900 text-red-300" },
};

function DriverTierBadge({ driverId }) {
  const nickname = driverNicknames[driverId];
  if (nickname) {
    return (
      <span className={`${nickname.color} px-2 py-0.5 rounded text-xs font-medium`}>
        {nickname.emoji} {nickname.label}
      </span>
    );
  }
  const tier = getDriverTier(driverId);
  if (!tier) return null;
  const info = tierInfo[tier];
  return (
    <span className={`${tierColors[tier]} px-2 py-0.5 rounded text-xs font-medium`}>
      {info.emoji} {info.label}
    </span>
  );
}

const AnimatedPointsCounter = ({ targetPoints, duration = 2000 }) => {
  const [currentPoints, setCurrentPoints] = useState(0);

  useEffect(() => {
    const increment = targetPoints / (duration / 50);
    const timer = setInterval(() => {
      setCurrentPoints((prev) => {
        if (prev >= targetPoints) {
          clearInterval(timer);
          return targetPoints;
        }
        return Math.min(prev + increment, targetPoints);
      });
    }, 50);

    return () => clearInterval(timer);
  }, [targetPoints, duration]);

  return (
    <span className="text-3xl font-mono font-semibold text-white">
      {Math.floor(currentPoints)}
    </span>
  );
};

export default function PlayerBreakdown() {
  const [playerStandings, setPlayerStandings] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const playersConfig = getPlayerConfig();
        const [races, qualifyingRaces] = await Promise.all([
          fetchSeasonResults(playersConfig.season),
          fetchSeasonQualifying(playersConfig.season),
        ]);
        const driverPoints = calculateDriverPoints(races, qualifyingRaces);
        const standings = calculatePlayerStandings(driverPoints, playersConfig.players, races);
        setPlayerStandings(standings);
      } catch (err) {
        console.error("Error loading player data:", err);
        setError("Failed to load race data. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const selectedPlayer = playerStandings.find((p) => p.name === selected);

  const pieData = selectedPlayer
    ? (() => {
        const teamComposition = selectedPlayer.drivers.reduce((acc, driver) => {
          acc[driver.team] = (acc[driver.team] || 0) + 1;
          return acc;
        }, {});
        return Object.entries(teamComposition).map(([team, count]) => ({
          name: team,
          value: count,
          fill: teamColors[team] || "#8884d8",
        }));
      })()
    : [];

  if (loading) {
    return (
      <div className="p-10 bg-page min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-400">Loading team data...</p>
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
          Player Fantasy Teams
        </h2>
        <p className="text-lg text-gray-400">Team Analysis & Rivalries</p>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-300 mb-4 uppercase tracking-wider">
          Fantasy League Standings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {playerStandings.map((player, idx) => (
            <div
              key={`pl-${player.name}`}
              onClick={() => setSelected(player.name)}
              className={`cursor-pointer p-5 rounded-xl border transition-colors duration-150 ${
                selected === player.name
                  ? "bg-gray-900 border-white"
                  : "bg-card border-gray-700 hover:bg-gray-800 hover:border-gray-700"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className={`text-lg font-bold ${
                    idx === 0 ? "text-yellow-400" : idx === 1 ? "text-gray-400" : idx === 2 ? "text-orange-400" : "text-gray-500"
                  }`}>
                    P{idx + 1}
                  </span>
                  <div>
                    <div className="font-medium text-white">
                      {player.name}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <AnimatedPointsCounter targetPoints={player.points} />
                  <div className="text-xs text-gray-500">pts</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-1">
                {player.drivers.map((d) => (
                  <DriverTierBadge key={d.driverId} driverId={d.driverId} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selected && selectedPlayer && (
        <div className="bg-card rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-semibold text-white">
              {selected}'s Fantasy Team
            </h3>
            <button
              onClick={() => setSelected(null)}
              className="text-gray-400 hover:text-white px-3 py-1 rounded transition-colors"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <h4 className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wider">
                Driver Lineup
              </h4>
              <div className="space-y-2">
                {selectedPlayer.drivers.map((driver, index) => (
                  <div
                    key={driver.driverId}
                    className="bg-gray-900 rounded-lg p-4 flex items-center justify-between text-white border border-gray-700"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-bold text-gray-500">
                        #{index + 1}
                      </span>
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          {driver.givenName} {driver.familyName}
                          <DriverTierBadge driverId={driver.driverId} />
                        </div>
                        <div className="text-sm text-gray-400">{driver.team}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold">
                        {driver.points}
                      </div>
                      <div className="text-xs text-gray-500">pts</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                <h4 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">
                  Statistics
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-300">
                    <span>Total Points</span>
                    <span className="font-medium text-white">{selectedPlayer.points}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Drivers</span>
                    <span className="font-medium text-white">{selectedPlayer.drivers.length}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Rank</span>
                    <span className="font-medium text-white">#{selectedPlayer.rank}</span>
                  </div>
                </div>
              </div>

              {pieData.length > 0 && (
                <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                  <h4 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">
                    Team Composition
                  </h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1f2937",
                          border: "1px solid #374151",
                          borderRadius: "8px",
                          color: "white",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
