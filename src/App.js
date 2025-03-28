import React from "react";
import { HashRouter as Router, Routes, Route, Link } from "react-router-dom";
import Leaderboard from "./Components/Leaderboard";
import DriverChart from "./Components/DriverStandings";
import PlayerBreakdown from "./Components/PlayerBreakdown";
import "./output.css";

export default function App() {
  return (
    <Router>
      <div>
        <div className="bg-gray-500 p-4">
          <div className="flex items-end justify-center space-x-4 ">
            <h1 className="text-2xl text-white font-bold mb-4 italic">
              Boaty McBoatface Fantasy F1 2025
            </h1>
          </div>
          <div className="flex gap-4 p-5 justify-center">
            <Link
              to="/leaderboard"
              className="bg-red-500 hover:bg-gray-600 text-white py-2 px-4 rounded-xl shadow"
            >
              Leaderboard
            </Link>
            <Link
              to="/driver-chart"
              className="bg-red-500 hover:bg-gray-600 text-white py-2 px-4 rounded-xl shadow"
            >
              Driver Standings
            </Link>
            <Link
              to="/player-breakdown"
              className="bg-red-500 hover:bg-gray-600 text-white py-2 px-4 rounded-xl shadow"
            >
              Player Breakdown
            </Link>
          </div>
        </div>

        <Routes>
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/driver-chart" element={<DriverChart />} />
          <Route path="/player-breakdown" element={<PlayerBreakdown />} />
          <Route
            path="*"
            element={
              <div className="mt-8 flex justify-center gap-8 ">
                <img
                  src="/fernando.gif"
                  alt="GIF 1"
                  className="w-auto h-auto"
                />
                <img src="/max.gif" alt="GIF 2" className="w-auto" />
                <img src="/oscar.gif" alt="GIF 3" className="w-auto" />
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}
