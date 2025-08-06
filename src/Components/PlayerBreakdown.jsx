import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { mockDrivers } from "../mockData";

const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "/api/f1-points"
    : process.env.REACT_APP_API_URL;

const AchievementBadge = ({ type, player, drivers, totalPlayers }) => {
  const rookieDrivers = [
    "Bearman",
    "Colapinto",
    "Doohan",
    "Lawson",
    "Antonelli",
    "Hadjar",
    "Bortoleto",
  ];

  const badges = {
    "Getting Carried": {
      emoji: "🎒",
      condition: (p, d) => {
        if (d.length === 0 || p.total === 0) return false;
        const driverPoints = d.map((dr) => parseFloat(dr["Race Points"]) || 0);
        const maxPoints = Math.max(...driverPoints);
        return maxPoints / p.total > 0.8;
      },
      color: "from-purple-500 to-pink-500",
    },
    Balanced: {
      emoji: "⚖️",
      condition: (p, d) => {
        if (d.length < 3 || p.total === 0) return false;
        const driverPoints = d.map((dr) => parseFloat(dr["Race Points"]) || 0);
        const avg = p.total / d.length;
        const variance =
          driverPoints.reduce((sum, pts) => sum + Math.pow(pts - avg, 2), 0) /
          d.length;
        return variance < avg * 0.5;
      },
      color: "from-green-500 to-blue-500",
    },
    "Help Needed": {
      emoji: "🆘",
      condition: (p) => p.rank === totalPlayers,
      color: "from-red-500 to-orange-500",
    },
    "Rookie Lover": {
      emoji: "🐣",
      condition: (p, d) => {
        const rookieCount = d.filter((dr) =>
          rookieDrivers.some((rookie) => dr.Driver?.includes(rookie))
        ).length;
        return rookieCount >= 2;
      },
      color: "from-yellow-500 to-green-500",
    },
  };

  const badge = badges[type];
  if (!badge || !badge.condition(player, drivers)) return null;

  return (
    <div
      className={`flex items-center gap-2 bg-gradient-to-r ${badge.color} text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg`}
    >
      <span>{badge.emoji}</span>
      <span>{type}</span>
    </div>
  );
};

const RivalryChart = ({ player1, player2, history }) => {
  const rivalryData = [
    {
      race: "Bahrain",
      player1: Math.floor(Math.random() * 50),
      player2: Math.floor(Math.random() * 50),
    },
    {
      race: "Saudi",
      player1: Math.floor(Math.random() * 50),
      player2: Math.floor(Math.random() * 50),
    },
    {
      race: "Australia",
      player1: Math.floor(Math.random() * 50),
      player2: Math.floor(Math.random() * 50),
    },
    {
      race: "Japan",
      player1: Math.floor(Math.random() * 50),
      player2: Math.floor(Math.random() * 50),
    },
  ];

  return (
    <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-2xl p-6">
      <h3 className="text-xl font-bold text-white mb-4 text-center">
        ⚔️ {player1} vs {player2} ⚔️
      </h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={rivalryData}>
          <XAxis dataKey="race" tick={{ fill: "white", fontSize: 12 }} />
          <YAxis tick={{ fill: "white" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(0,0,0,0.8)",
              border: "none",
              borderRadius: "8px",
              color: "white",
            }}
          />
          <Line
            type="monotone"
            dataKey="player1"
            stroke="#ff6b6b"
            strokeWidth={3}
            dot={{ fill: "#ff6b6b", strokeWidth: 2, r: 6 }}
            name={player1}
          />
          <Line
            type="monotone"
            dataKey="player2"
            stroke="#4ecdc4"
            strokeWidth={3}
            dot={{ fill: "#4ecdc4", strokeWidth: 2, r: 6 }}
            name={player2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

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
    <span className="text-4xl font-mono font-bold text-yellow-400">
      {Math.floor(currentPoints)}
    </span>
  );
};

const PredictionGame = () => {
  const [predictions, setPredictions] = useState({ driver: "", position: "" });
  const [submitted, setSubmitted] = useState(false);

  const drivers = ["Verstappen", "Hamilton", "Leclerc", "Norris", "Russell"];

  const handleSubmit = () => {
    if (predictions.driver && predictions.position) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white">
      <h3 className="text-xl font-bold mb-4 text-center">
        🎯 Next Race Prediction
      </h3>
      {!submitted ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Who will win?
            </label>
            <select
              value={predictions.driver}
              onChange={(e) =>
                setPredictions({ ...predictions, driver: e.target.value })
              }
              className="w-full p-2 rounded-lg bg-black bg-opacity-50 text-white"
            >
              <option value="">Select Driver</option>
              {drivers.map((driver) => (
                <option key={driver} value={driver}>
                  {driver}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleSubmit}
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Submit Prediction
          </button>
        </div>
      ) : (
        <div className="text-center">
          <div className="text-4xl mb-2">🎉</div>
          <p className="text-lg font-bold">Prediction Submitted!</p>
          <p className="text-sm">+5 bonus points if correct!</p>
        </div>
      )}
    </div>
  );
};

export default function PlayerBreakdown() {
  const [drivers, setDrivers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [comparison, setComparison] = useState([]);
  const [playerTotals, setPlayerTotals] = useState([]);
  const [draggedPlayer, setDraggedPlayer] = useState(null);

  useEffect(() => {
    async function fetchDrivers() {
      try {
        if (process.env.NODE_ENV === "development") {
          // Use mock data in development
          setDrivers(mockDrivers.data);
          return;
        }

        const res = await fetch(`${BASE_URL}/drivers`);
        const json = await res.json();
        setDrivers(json.data);
      } catch (err) {
        console.error("Error fetching drivers", err);
        // Fallback to mock data on error
        setDrivers(mockDrivers.data);
      }
    }
    fetchDrivers();
  }, []);

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
      .sort((a, b) => b.total - a.total)
      .map((player, index) => ({ ...player, rank: index + 1 }));

    setPlayerTotals(sorted);
  }, [drivers]);

  const playerDrivers = drivers.filter(
    (d) => d.Players === selected || d["Players 2"] === selected
  );

  const selectedPlayer = playerTotals.find((p) => p.name === selected);

  const teamComposition = playerDrivers.reduce((acc, driver) => {
    acc[driver.Team] = (acc[driver.Team] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(teamComposition).map(([team, count]) => ({
    name: team,
    value: count,
    fill: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
  }));

  return (
    <div className="p-4 md:p-6 lg:p-10 bg-gradient-to-br from-purple-900 via-black to-green-900 min-h-screen">
      <div className="text-center mb-8">
        <h2 className="text-5xl font-bold mb-2 text-white bg-gradient-to-r from-purple-500 to-green-500 bg-clip-text text-transparent">
          Player Fantasy Teams
        </h2>
        <p className="text-xl text-gray-300">Team Analysis & Rivalries</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
        <div className="lg:col-span-3">
          <h3 className="text-2xl font-bold text-white mb-6">
            🏆 Fantasy League Standings
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {playerTotals.map((player, idx) => (
              <div
                key={`pl-${player.name}`}
                onClick={() => setSelected(player.name)}
                onDragStart={() => setDraggedPlayer(player)}
                onDrop={() => {
                  if (
                    draggedPlayer &&
                    draggedPlayer !== player &&
                    comparison.length < 2
                  ) {
                    setComparison([...comparison, draggedPlayer, player]);
                  }
                }}
                onDragOver={(e) => e.preventDefault()}
                draggable
                className={`cursor-pointer p-6 rounded-2xl shadow-xl transform transition-all duration-300 hover:scale-105 ${
                  selected === player.name
                    ? "bg-gradient-to-br from-yellow-400 to-orange-500 ring-4 ring-white scale-105"
                    : idx === 0
                    ? "bg-gradient-to-br from-yellow-600 to-yellow-500"
                    : idx === 1
                    ? "bg-gradient-to-br from-gray-400 to-gray-300"
                    : idx === 2
                    ? "bg-gradient-to-br from-orange-600 to-orange-400"
                    : "bg-gradient-to-br from-blue-600 to-blue-500"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {idx === 0
                        ? "👑"
                        : idx === 1
                        ? "🥈"
                        : idx === 2
                        ? "🥉"
                        : `#${idx + 1}`}
                    </span>
                    <div>
                      <div className="font-bold text-lg text-white">
                        {player.name}
                      </div>
                      <div className="text-sm opacity-80 text-white">
                        Rank #{idx + 1}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <AnimatedPointsCounter targetPoints={player.total} />
                    <div className="text-sm text-white opacity-80">points</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {(() => {
                    const currentPlayerDrivers = drivers.filter(
                      (d) =>
                        d.Players === player.name ||
                        d["Players 2"] === player.name
                    );
                    return (
                      <>
                        <AchievementBadge
                          type="Getting Carried"
                          player={player}
                          drivers={currentPlayerDrivers}
                          totalPlayers={playerTotals.length}
                        />
                        <AchievementBadge
                          type="Balanced"
                          player={player}
                          drivers={currentPlayerDrivers}
                          totalPlayers={playerTotals.length}
                        />
                        <AchievementBadge
                          type="Help Needed"
                          player={player}
                          drivers={currentPlayerDrivers}
                          totalPlayers={playerTotals.length}
                        />
                        <AchievementBadge
                          type="Rookie Lover"
                          player={player}
                          drivers={currentPlayerDrivers}
                          totalPlayers={playerTotals.length}
                        />
                      </>
                    );
                  })()}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <PredictionGame />

          {comparison.length === 2 && (
            <div>
              <RivalryChart
                player1={comparison[0].name}
                player2={comparison[1].name}
              />
              <button
                onClick={() => setComparison([])}
                className="w-full mt-4 bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 rounded-lg"
              >
                Clear Comparison
              </button>
            </div>
          )}
        </div>
      </div>

      {selected && selectedPlayer && (
        <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-3xl font-bold text-white flex items-center gap-3">
              <span>🏎️</span>
              {selected}'s Fantasy Team
              <span>🏎️</span>
            </h3>
            <button
              onClick={() => setSelected(null)}
              className="bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h4 className="text-xl font-bold text-white mb-6">
                Driver Lineup
              </h4>
              <div className="space-y-4">
                {playerDrivers.map((driver, index) => (
                  <div
                    key={`drv-${driver.Driver}`}
                    className="bg-gradient-to-r from-gray-700 to-gray-600 rounded-xl p-4 flex items-center justify-between text-white transform hover:scale-105 transition-transform"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold text-yellow-400">
                        #{index + 1}
                      </span>
                      <div>
                        <div className="font-bold text-lg">{driver.Driver}</div>
                        <div className="text-sm opacity-80">{driver.Team}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-400">
                        {driver["Race Points"]}
                      </div>
                      <div className="text-xs opacity-80">points</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-700 bg-opacity-50 rounded-xl p-6">
                <h4 className="text-lg font-bold text-white mb-4">
                  Team Statistics
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between text-white">
                    <span>Total Points:</span>
                    <span className="font-bold text-yellow-400">
                      {selectedPlayer.total}
                    </span>
                  </div>
                  <div className="flex justify-between text-white">
                    <span>Drivers:</span>
                    <span className="font-bold">{playerDrivers.length}</span>
                  </div>
                  <div className="flex justify-between text-white">
                    <span>Championship Rank:</span>
                    <span className="font-bold text-green-400">
                      #{selectedPlayer.rank}
                    </span>
                  </div>
                </div>
              </div>

              {pieData.length > 0 && (
                <div className="bg-gray-700 bg-opacity-50 rounded-xl p-6">
                  <h4 className="text-lg font-bold text-white mb-4">
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
                          backgroundColor: "rgba(0,0,0,0.8)",
                          border: "none",
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
