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
            <div className="bg-gradient-to-br from-black via-gray-900 to-red-900 min-h-screen pt-8 relative overflow-hidden">
              {/* Animated Background Elements */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-20 left-10 w-4 h-4 bg-yellow-400 rounded-full animate-ping opacity-75"></div>
                <div className="absolute top-40 right-20 w-3 h-3 bg-red-500 rounded-full animate-pulse opacity-60"></div>
                <div className="absolute bottom-32 left-1/4 w-2 h-2 bg-green-400 rounded-full animate-bounce opacity-80"></div>
                <div className="absolute bottom-20 right-1/3 w-3 h-3 bg-blue-400 rounded-full animate-ping opacity-70"></div>
              </div>

              <div className="text-center mb-12 relative z-10">
                <div className="mb-6">
                  <div className="text-8xl mb-4 animate-bounce">🏁</div>
                  <h2 className="text-6xl font-bold text-white mb-4 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 bg-clip-text text-transparent">
                    Welcome to F1 Fantasy
                  </h2>
                  <p className="text-2xl text-gray-300 mb-8">The Ultimate Racing Experience</p>
                </div>
                
                <div className="flex justify-center mb-8">
                  <div className="racing-track relative">
                    <div className="text-6xl animate-bounce" style={{animationDelay: '0s'}}>🏎️</div>
                    <div className="absolute -top-2 left-16 text-4xl animate-bounce opacity-75" style={{animationDelay: '0.5s'}}>🏎️</div>
                    <div className="absolute -top-4 left-28 text-3xl animate-bounce opacity-50" style={{animationDelay: '1s'}}>🏎️</div>
                  </div>
                </div>
              </div>

              {/* F1 Themed Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-8 max-w-6xl mx-auto">
                {/* Championship Card */}
                <div className="bg-gradient-to-br from-yellow-600 to-yellow-500 rounded-2xl p-8 shadow-2xl transform hover:scale-105 transition-all duration-300 hover:rotate-1">
                  <div className="text-center text-black">
                    <div className="text-5xl mb-4 animate-pulse">🏆</div>
                    <h3 className="text-2xl font-bold mb-3">Championship</h3>
                    <p className="text-sm mb-4">Track the leaders and see who's dominating the season</p>
                    <div className="flex justify-center space-x-2">
                      <div className="w-3 h-3 bg-black rounded-full animate-bounce"></div>
                      <div className="w-3 h-3 bg-black rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-3 h-3 bg-black rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>

                {/* Driver Stats Card */}
                <div className="bg-gradient-to-br from-blue-600 to-blue-500 rounded-2xl p-8 shadow-2xl transform hover:scale-105 transition-all duration-300 hover:-rotate-1">
                  <div className="text-center text-white">
                    <div className="text-5xl mb-4">📊</div>
                    <h3 className="text-2xl font-bold mb-3">Driver Analytics</h3>
                    <p className="text-sm mb-4">Deep dive into performance metrics and team comparisons</p>
                    <div className="relative">
                      <div className="w-full bg-black bg-opacity-30 rounded-full h-2 mb-2">
                        <div className="bg-yellow-400 h-2 rounded-full animate-pulse" style={{width: '85%'}}></div>
                      </div>
                      <div className="w-full bg-black bg-opacity-30 rounded-full h-2 mb-2">
                        <div className="bg-red-400 h-2 rounded-full animate-pulse" style={{width: '72%', animationDelay: '0.5s'}}></div>
                      </div>
                      <div className="w-full bg-black bg-opacity-30 rounded-full h-2">
                        <div className="bg-green-400 h-2 rounded-full animate-pulse" style={{width: '68%', animationDelay: '1s'}}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fantasy Teams Card */}
                <div className="bg-gradient-to-br from-green-600 to-green-500 rounded-2xl p-8 shadow-2xl transform hover:scale-105 transition-all duration-300 hover:rotate-1">
                  <div className="text-center text-white">
                    <div className="text-5xl mb-4">👥</div>
                    <h3 className="text-2xl font-bold mb-3">Fantasy Teams</h3>
                    <p className="text-sm mb-4">Build your dream team and compete with friends</p>
                    <div className="flex justify-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <div 
                          key={i}
                          className="w-6 h-6 bg-black bg-opacity-30 rounded-full flex items-center justify-center animate-pulse"
                          style={{animationDelay: `${i * 0.2}s`}}
                        >
                          <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Racing Track Animation */}
              <div className="mt-16 relative">
                <div className="w-full h-4 bg-gray-700 rounded-full relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
                  <div className="racing-stripes absolute inset-0 opacity-20"></div>
                </div>
                <div className="text-center mt-4">
                  <p className="text-gray-400 text-sm">Select a page above to start your F1 Fantasy journey!</p>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="fixed bottom-10 right-10 animate-bounce">
                <div className="text-3xl opacity-70">🏁</div>
              </div>
              <div className="fixed bottom-20 left-10 animate-pulse">
                <div className="text-2xl opacity-60">⚡</div>
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
