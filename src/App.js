import React, { useState } from "react";
import { HashRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import Leaderboard from "./Components/Leaderboard";
import DriverChart from "./Components/DriverStandings";
import PlayerBreakdown from "./Components/PlayerBreakdown";
import "./output.css";

const NavigationBar = () => {
  const location = useLocation();
  const [activeButton, setActiveButton] = useState('');

  const handleNavClick = (path) => {
    setActiveButton(path);
    setTimeout(() => setActiveButton(''), 300);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="bg-gradient-to-r from-red-600 via-black to-red-600 p-6 shadow-2xl">
      <div className="flex items-end justify-center space-x-4 text-center mb-6">
        <h1 className="text-4xl text-white font-bold mb-4 italic flex items-center justify-center animate-pulse">
          <span className="text-5xl mr-3">🏎️</span>
          <span className="bg-gradient-to-r from-red-400 to-yellow-400 bg-clip-text text-transparent">
            Boaty McBoatface Fantasy F1 2025
          </span>
          <span className="text-5xl ml-3">🏁</span>
        </h1>
      </div>
      
      <div className="flex gap-6 p-5 justify-center text-center items-center">
        <Link
          to="/leaderboard"
          onClick={() => handleNavClick('/leaderboard')}
          className={`h-24 px-8 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white font-bold rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-110 hover:rotate-1 flex items-center justify-center relative overflow-hidden ${
            isActive('/leaderboard') ? 'ring-4 ring-yellow-400 scale-105' : ''
          } ${activeButton === '/leaderboard' ? 'animate-bounce' : ''}`}
        >
          <span className="relative z-10 flex items-center gap-2">
            🏆 Leaderboard
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 hover:opacity-20 transform -skew-x-12 transition-opacity duration-300" />
        </Link>
        
        <Link
          to="/driver-chart"
          onClick={() => handleNavClick('/driver-chart')}
          className={`h-24 px-8 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white font-bold rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-110 hover:-rotate-1 flex items-center justify-center relative overflow-hidden ${
            isActive('/driver-chart') ? 'ring-4 ring-yellow-400 scale-105' : ''
          } ${activeButton === '/driver-chart' ? 'animate-bounce' : ''}`}
        >
          <span className="relative z-10 flex items-center gap-2">
            📊 Driver Standings
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 hover:opacity-20 transform -skew-x-12 transition-opacity duration-300" />
        </Link>
        
        <Link
          to="/player-breakdown"
          onClick={() => handleNavClick('/player-breakdown')}
          className={`h-24 px-8 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white font-bold rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-110 hover:rotate-1 flex items-center justify-center relative overflow-hidden ${
            isActive('/player-breakdown') ? 'ring-4 ring-yellow-400 scale-105' : ''
          } ${activeButton === '/player-breakdown' ? 'animate-bounce' : ''}`}
        >
          <span className="relative z-10 flex items-center gap-2">
            👥 Player Teams
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 hover:opacity-20 transform -skew-x-12 transition-opacity duration-300" />
        </Link>
      </div>
    </div>
  );
};

const AppContent = () => {
  return (
    <div>
      <NavigationBar />
      <Routes>
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/driver-chart" element={<DriverChart />} />
        <Route path="/player-breakdown" element={<PlayerBreakdown />} />
        <Route
          path="*"
          element={
            <div className="bg-gradient-to-br from-black via-gray-900 to-red-900 min-h-screen pt-8">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-white mb-4">Welcome to F1 Fantasy</h2>
                <p className="text-xl text-gray-300">Select a page above to get started!</p>
              </div>
              <div className="flex justify-center gap-8 px-8">
                <img
                  src="/fernando.gif"
                  alt="Fernando Alonso"
                  className="w-auto h-auto rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300"
                />
                <img 
                  src="/max.gif" 
                  alt="Max Verstappen" 
                  className="w-auto h-auto rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300"
                />
                <img 
                  src="/oscar.gif" 
                  alt="Oscar Piastri" 
                  className="w-auto h-auto rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          }
        />
      </Routes>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
