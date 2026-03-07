import React, { useEffect, useState } from "react";
import { fetchSeasonResults, fetchSeasonQualifying, fetchSeasonSprints } from "../services/f1Api";
import { calculateDriverPoints, calculatePlayerStandings } from "../services/scoringEngine";
import { getPlayerConfig } from "../services/playerConfig";

const PodiumPosition = ({ player, position, points }) => {
  const heights = { 1: "h-32", 2: "h-24", 3: "h-20" };
  const colors = {
    1: "bg-yellow-500",
    2: "bg-gray-400",
    3: "bg-orange-500",
  };
  const positions = { 1: "order-2", 2: "order-1", 3: "order-3" };
  const trophies = { 1: "🏆", 2: "🥈", 3: "🥉" };

  return (
    <div className={`flex flex-col items-center ${positions[position]}`}>
      <div className="text-4xl mb-2">{trophies[position]}</div>
      <div className="text-white text-center mb-2">
        <div className="font-semibold text-lg">{player}</div>
        <div className="text-sm text-gray-400">{points} pts</div>
      </div>
      <div
        className={`w-20 md:w-24 ${heights[position]} ${colors[position]} rounded-t-lg flex items-end justify-center pb-2`}
      >
        <span className="text-black font-bold text-2xl">{position}</span>
      </div>
    </div>
  );
};

export default function Leaderboard() {
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [season, setSeason] = useState(2026);

  useEffect(() => {
    async function loadData() {
      try {
        const playersConfig = getPlayerConfig();
        setSeason(playersConfig.season);
        const [races, qualifyingRaces, sprintRaces] = await Promise.all([
          fetchSeasonResults(playersConfig.season),
          fetchSeasonQualifying(playersConfig.season),
          fetchSeasonSprints(playersConfig.season),
        ]);
        const driverPoints = calculateDriverPoints(races, qualifyingRaces, sprintRaces);
        const playerStandings = calculatePlayerStandings(driverPoints, playersConfig.players, races);
        setStandings(playerStandings);
      } catch (err) {
        console.error("Error loading leaderboard:", err);
        setError("Failed to load race data. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="p-10 bg-page min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-400">Loading race data...</p>
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

  const podiumPlayers = standings.slice(0, 3);

  return (
    <div className="p-4 md:p-6 lg:p-10 bg-page min-h-screen">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold mb-2 text-white">
          Championship Standings
        </h2>
        <p className="text-lg text-gray-400">Season {season}</p>
      </div>

      {podiumPlayers.length >= 3 && (
        <div className="mb-12">
          <h3 className="text-xl font-semibold text-center text-gray-300 mb-8 uppercase tracking-wider">
            Podium
          </h3>
          <div className="flex justify-center items-end gap-3 md:gap-8 mb-8">
            {podiumPlayers.map((player, index) => (
              <PodiumPosition
                key={player.name}
                player={player.name}
                position={index + 1}
                points={player.points}
              />
            ))}
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <h3 className="text-xl font-semibold text-center text-gray-300 mb-6 uppercase tracking-wider">
          Full Championship Table
        </h3>
        <div className="bg-card rounded-xl border border-gray-700 overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-900 text-left text-sm font-medium text-gray-400 uppercase tracking-wider">
                <th className="py-3 px-6">Pos</th>
                <th className="py-3 px-6">Player</th>
                <th className="py-3 px-6">Points</th>
                <th className="py-3 px-6">Status</th>
              </tr>
            </thead>
            <tbody>
              {standings.map((entry, index) => (
                <tr
                  key={entry.name}
                  className={`border-t border-gray-700 hover:bg-gray-800 text-white transition-colors duration-150 ${
                    index < 3 ? "bg-gray-900" : ""
                  }`}
                >
                  <td className="py-3 px-6 font-medium flex items-center gap-2">
                    {index === 0 ? (
                      <span className="text-yellow-400 font-bold">P1</span>
                    ) : index === 1 ? (
                      <span className="text-gray-300 font-bold">P2</span>
                    ) : index === 2 ? (
                      <span className="text-orange-400 font-bold">P3</span>
                    ) : (
                      <span className="text-gray-400">P{index + 1}</span>
                    )}
                  </td>
                  <td className="py-3 px-6 font-medium">
                    {entry.name}
                  </td>
                  <td className="py-3 px-6">
                    <span className="font-semibold text-white">
                      {entry.points}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">pts</span>
                  </td>
                  <td className="py-3 px-6">
                    {index === 0 ? (
                      <span className="bg-yellow-600 text-white px-2 py-0.5 rounded text-xs font-medium">
                        LEADER
                      </span>
                    ) : index < 3 ? (
                      <span className="bg-gray-700 text-gray-300 px-2 py-0.5 rounded text-xs font-medium">
                        PODIUM
                      </span>
                    ) : (
                      <span className="text-gray-500 text-xs">
                        +{entry.points > 0 ? (standings[0].points - entry.points) : 0}
                      </span>
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
