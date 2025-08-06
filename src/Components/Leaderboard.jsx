import React, { useEffect, useState } from "react";
import { mockLeaderboard } from "../mockData";

const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "/api/f1-points"
    : process.env.REACT_APP_API_URL;

const PodiumPosition = ({ player, position, points }) => {
  const heights = { 1: 'h-32', 2: 'h-24', 3: 'h-20' };
  const colors = { 1: 'bg-gradient-to-t from-yellow-400 to-yellow-300', 2: 'bg-gradient-to-t from-gray-400 to-gray-300', 3: 'bg-gradient-to-t from-orange-400 to-orange-300' };
  const positions = { 1: 'order-2', 2: 'order-1', 3: 'order-3' };
  const trophies = { 1: '🏆', 2: '🥈', 3: '🥉' };
  
  return (
    <div className={`flex flex-col items-center ${positions[position]} animate-bounce`}>
      <div className="text-6xl mb-2 animate-pulse">{trophies[position]}</div>
      <div className="text-white text-center mb-2">
        <div className="font-bold text-lg">{player}</div>
        <div className="text-sm opacity-90">{points} pts</div>
      </div>
      <div className={`w-24 ${heights[position]} ${colors[position]} rounded-t-lg shadow-lg transform transition-all duration-1000 hover:scale-105 flex items-end justify-center pb-2`}>
        <span className="text-black font-bold text-2xl">{position}</span>
      </div>
    </div>
  );
};

const ParticleEffect = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-ping opacity-75"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 2}s`
          }}
        />
      ))}
    </div>
  );
};

export default function Leaderboard() {
  const [data, setData] = useState([]);
  const [showFireworks, setShowFireworks] = useState(false);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        console.log("Loading leaderboard data...");
        if (process.env.NODE_ENV === "development") {
          console.log("Using mock data in development");
          // Use mock data in development
          setData(mockLeaderboard.data);
          setShowFireworks(true);
          setTimeout(() => setShowFireworks(false), 5000);
          return;
        }
        
        const res = await fetch(`${BASE_URL}/leaderboard`);
        const json = await res.json();
        setData(json.data);
        if (json.data.length > 0) {
          setShowFireworks(true);
          setTimeout(() => setShowFireworks(false), 5000);
        }
      } catch (err) {
        console.error("Error fetching leaderboard", err);
        // Fallback to mock data on error
        console.log("Using mock data as fallback");
        setData(mockLeaderboard.data);
        setShowFireworks(true);
        setTimeout(() => setShowFireworks(false), 3000);
      }
    };

    fetchLeaderboard();
  }, []);

  const sorted = [...data].sort(
    (a, b) => parseFloat(b.Points) - parseFloat(a.Points)
  );

  const podiumPlayers = sorted.slice(0, 3);

  return (
    <div className="p-4 md:p-6 lg:p-10 bg-gradient-to-br from-gray-900 via-black to-red-900 min-h-screen relative">
      {showFireworks && <ParticleEffect />}
      
      <div className="text-center mb-8">
        <h2 className="text-5xl font-bold mb-2 text-white bg-gradient-to-r from-red-500 to-yellow-500 bg-clip-text text-transparent">
          🏁 Championship Standings 🏁
        </h2>
        <p className="text-xl text-gray-300">Season 2025</p>
      </div>

      {podiumPlayers.length >= 3 && (
        <div className="mb-12">
          <h3 className="text-3xl font-bold text-center text-white mb-8">🏆 PODIUM 🏆</h3>
          <div className="flex justify-center items-end gap-8 mb-8">
            {podiumPlayers.slice(0, 3).map((player, index) => (
              <PodiumPosition 
                key={player.Standings}
                player={player.Standings}
                position={index + 1}
                points={player.Points}
              />
            ))}
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <h3 className="text-2xl font-bold text-center text-white mb-6">Full Championship Table</h3>
        <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gradient-to-r from-red-600 to-red-500 text-left text-sm font-semibold text-white">
                <th className="py-4 px-6">Position</th>
                <th className="py-4 px-6">Driver</th>
                <th className="py-4 px-6">Points</th>
                <th className="py-4 px-6">Status</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((entry, index) => (
                <tr
                  key={`${entry.Standings}-${entry.Points}`}
                  className={`border-t border-gray-600 hover:bg-red-900 hover:bg-opacity-30 text-white transition-all duration-300 ${
                    index < 3 ? 'bg-gradient-to-r from-yellow-900 to-transparent bg-opacity-20' : ''
                  }`}
                >
                  <td className="py-4 px-6 font-medium flex items-center gap-3">
                    {index === 0 ? (
                      <>
                        <span className="text-yellow-400 animate-pulse text-2xl">👑</span>
                        <span className="text-yellow-400 font-bold">P{index + 1}</span>
                      </>
                    ) : index === 1 ? (
                      <>
                        <span className="text-gray-300 text-xl">🥈</span>
                        <span className="text-gray-300 font-bold">P{index + 1}</span>
                      </>
                    ) : index === 2 ? (
                      <>
                        <span className="text-orange-400 text-xl">🥉</span>
                        <span className="text-orange-400 font-bold">P{index + 1}</span>
                      </>
                    ) : index === sorted.length - 1 ? (
                      <>
                        <span className="text-red-500 animate-bounce text-xl">💀</span>
                        <span className="text-red-400 font-bold">P{index + 1}</span>
                      </>
                    ) : (
                      <span className="text-gray-300 font-bold">P{index + 1}</span>
                    )}
                  </td>
                  <td className="py-4 px-6 font-semibold text-lg">{entry.Standings}</td>
                  <td className="py-4 px-6">
                    <span className="text-2xl font-bold text-yellow-400">{entry.Points}</span>
                    <span className="text-sm text-gray-300 ml-1">pts</span>
                  </td>
                  <td className="py-4 px-6">
                    {index === 0 ? (
                      <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold animate-pulse">CHAMPION</span>
                    ) : index < 3 ? (
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">PODIUM</span>
                    ) : index < 10 ? (
                      <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold">POINTS</span>
                    ) : (
                      <span className="bg-gray-500 text-white px-3 py-1 rounded-full text-xs font-bold">FIGHTING</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
