import React, { useState, useEffect } from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import Leaderboard from "./Components/Leaderboard";
import DriverChart from "./Components/DriverStandings";
import PlayerBreakdown from "./Components/PlayerBreakdown";
import FantasyDraft from "./Components/FantasyDraft";
import Rules from "./Components/Rules";
import Roster from "./Components/Roster";
import HallOfFame from "./Components/HallOfFame";
import Results from "./Components/Results";
import "./output.css";

const navItems = [
  { path: "/leaderboard", label: "Leaderboard" },
  { path: "/driver-chart", label: "Standings" },
  { path: "/player-breakdown", label: "Player Teams" },
  { path: "/results", label: "Results" },
  { path: "/draft", label: "Draft" },
  { path: "/roster", label: "Roster" },
  { path: "/hall-of-fame", label: "Hall of Fame" },
  { path: "/rules", label: "Rules" },
];

const NavigationBar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isActive = (path) => location.pathname === path;

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <nav className="bg-card border-b border-gray-700 px-4 md:px-6 py-3 md:py-4 relative z-50">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <Link
          to="/"
          className="text-lg md:text-xl font-semibold text-white tracking-tight"
        >
          Fr1ends Fantasy F1 <span className="text-red-500">2026</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex gap-1">
          {navItems.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                isActive(path)
                  ? "bg-gray-900 text-white"
                  : "text-gray-400 hover:text-gray-200 hover:bg-gray-900"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Hamburger button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden mt-3 pb-1 border-t border-gray-700 pt-3">
          <div className="flex flex-col gap-1">
            {navItems.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-150 ${
                  isActive(path)
                    ? "bg-gray-900 text-white"
                    : "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

const AppContent = () => {
  return (
    <div className="bg-page min-h-screen">
      <NavigationBar />
      <Routes>
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/driver-chart" element={<DriverChart />} />
        <Route path="/player-breakdown" element={<PlayerBreakdown />} />
        <Route path="/results" element={<Results />} />
        <Route path="/draft" element={<FantasyDraft />} />
        <Route path="/rules" element={<Rules />} />
        <Route path="/roster" element={<Roster />} />
        <Route path="/hall-of-fame" element={<HallOfFame />} />
        <Route
          path="*"
          element={
            <div className="bg-page min-h-screen">
              {/* Hero Banner */}
              <div className="relative w-full h-80 md:h-96 overflow-hidden">
                <img
                  src={`${process.env.PUBLIC_URL}/hero-banner.jpg`}
                  alt="Formula 1 car"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-page via-transparent to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-page via-transparent to-transparent opacity-40" />
                <div className="absolute bottom-8 left-0 right-0 text-center">
                  <h2 className="text-5xl md:text-6xl font-bold text-white mb-2 drop-shadow-lg">
                    Fr1ends Fantasy
                  </h2>
                  <p className="text-xl md:text-2xl text-gray-200 font-light drop-shadow">
                    Fantasy F1{" "}
                    <span className="text-red-500 font-semibold">2026</span>
                  </p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="max-w-5xl mx-auto px-4 md:px-8 -mt-6 relative z-10">
                <div className="grid grid-cols-3 gap-2 md:gap-4 mb-12">
                  <div className="bg-card rounded-xl p-4 border border-gray-700 text-center">
                    <div className="text-3xl font-bold text-white">22</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">
                      Drivers
                    </div>
                  </div>
                  <div className="bg-card rounded-xl p-4 border border-gray-700 text-center">
                    <div className="text-3xl font-bold text-white">11</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">
                      Teams
                    </div>
                  </div>
                  <div className="bg-card rounded-xl p-4 border border-gray-700 text-center">
                    <div className="text-3xl font-bold text-white">24</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">
                      Races
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature Cards */}
              <div className="max-w-5xl mx-auto px-4 md:px-8 pb-16">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
                  Get Started
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Link
                    to="/draft"
                    className="bg-card rounded-xl p-5 border border-gray-700 hover:border-gray-500 transition-colors group"
                  >
                    <div className="text-red-500 text-2xl mb-3">01</div>
                    <h4 className="text-white font-semibold mb-1 group-hover:text-red-400 transition-colors">
                      Draft Your Team
                    </h4>
                    <p className="text-sm text-gray-500">
                      Snake draft 3 drivers and pick a constructor
                    </p>
                  </Link>
                  <Link
                    to="/leaderboard"
                    className="bg-card rounded-xl p-5 border border-gray-700 hover:border-gray-500 transition-colors group"
                  >
                    <div className="text-red-500 text-2xl mb-3">02</div>
                    <h4 className="text-white font-semibold mb-1 group-hover:text-red-400 transition-colors">
                      Leaderboard
                    </h4>
                    <p className="text-sm text-gray-500">
                      Track championship standings and podium positions
                    </p>
                  </Link>
                  <Link
                    to="/driver-chart"
                    className="bg-card rounded-xl p-5 border border-gray-700 hover:border-gray-500 transition-colors group"
                  >
                    <div className="text-red-500 text-2xl mb-3">03</div>
                    <h4 className="text-white font-semibold mb-1 group-hover:text-red-400 transition-colors">
                      Driver Standings
                    </h4>
                    <p className="text-sm text-gray-500">
                      Dive into driver performance and analytics
                    </p>
                  </Link>
                  <Link
                    to="/rules"
                    className="bg-card rounded-xl p-5 border border-gray-700 hover:border-gray-500 transition-colors group"
                  >
                    <div className="text-red-500 text-2xl mb-3">04</div>
                    <h4 className="text-white font-semibold mb-1 group-hover:text-red-400 transition-colors">
                      Scoring Rules
                    </h4>
                    <p className="text-sm text-gray-500">
                      Points, bonuses, penalties, and tier breakdowns
                    </p>
                  </Link>
                </div>

                <div className="mt-8 text-center">
                  <p className="text-gray-600 text-xs">
                    Season 2 of Fr1ends Fantasy F1
                  </p>
                </div>
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
