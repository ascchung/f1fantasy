import React, { useState } from "react";
import { getDriverTier, tierInfo } from "../data/driverTiers";

const teamColors = {
  "Red Bull": "#1E41FF",
  Ferrari: "#DC0000",
  McLaren: "#FF8700",
  Mercedes: "#00D2BE",
  "Aston Martin": "#006F62",
  Alpine: "#0090FF",
  Williams: "#005AFF",
  "Racing Bulls": "#6692FF",
  Haas: "#B6BABD",
  Audi: "#1d1d1b",
  Cadillac: "#1d1d1b",
};

const TEAMS = [
  {
    name: "Red Bull",
    raceDrivers: [
      { id: "verstappen", name: "Max Verstappen", number: 1 },
      { id: "hadjar", name: "Isack Hadjar", number: 20 },
    ],
    reserveDrivers: [
      { id: "tsunoda", name: "Yuki Tsunoda", role: "Reserve" },
    ],
  },
  {
    name: "Ferrari",
    raceDrivers: [
      { id: "leclerc", name: "Charles Leclerc", number: 16 },
      { id: "hamilton", name: "Lewis Hamilton", number: 44 },
    ],
    reserveDrivers: [
      { id: "giovinazzi", name: "Antonio Giovinazzi", role: "Reserve" },
    ],
  },
  {
    name: "McLaren",
    raceDrivers: [
      { id: "norris", name: "Lando Norris", number: 4 },
      { id: "piastri", name: "Oscar Piastri", number: 81 },
    ],
    reserveDrivers: [
      { id: "oward", name: "Pato O'Ward", role: "Reserve" },
      { id: "fornaroli", name: "Leonardo Fornaroli", role: "Reserve" },
    ],
  },
  {
    name: "Mercedes",
    raceDrivers: [
      { id: "russell", name: "George Russell", number: 63 },
      { id: "antonelli", name: "Kimi Antonelli", number: 12 },
    ],
    reserveDrivers: [
      { id: "vesti", name: "Fred Vesti", role: "Reserve" },
    ],
  },
  {
    name: "Aston Martin",
    raceDrivers: [
      { id: "alonso", name: "Fernando Alonso", number: 14 },
      { id: "stroll", name: "Lance Stroll", number: 18 },
    ],
    reserveDrivers: [
      { id: "crawford", name: "Jak Crawford", role: "Reserve" },
      { id: "vandoorne", name: "Stoffel Vandoorne", role: "Reserve" },
    ],
  },
  {
    name: "Alpine",
    raceDrivers: [
      { id: "gasly", name: "Pierre Gasly", number: 10 },
      { id: "colapinto", name: "Franco Colapinto", number: 43 },
    ],
    reserveDrivers: [
      { id: "paul_aron", name: "Paul Aron", role: "Reserve" },
      { id: "maini", name: "Kush Maini", role: "Development" },
    ],
  },
  {
    name: "Williams",
    raceDrivers: [
      { id: "albon", name: "Alexander Albon", number: 23 },
      { id: "sainz", name: "Carlos Sainz", number: 55 },
    ],
    reserveDrivers: [
      { id: "luke_browning", name: "Luke Browning", role: "Reserve" },
    ],
  },
  {
    name: "Racing Bulls",
    raceDrivers: [
      { id: "lawson", name: "Liam Lawson", number: 30 },
      { id: "lindblad", name: "Arvid Lindblad", number: 27 },
    ],
    reserveDrivers: [
      { id: "tsunoda", name: "Yuki Tsunoda", role: "Reserve" },
      { id: "iwasa", name: "Ayumu Iwasa", role: "Reserve" },
    ],
  },
  {
    name: "Haas",
    raceDrivers: [
      { id: "bearman", name: "Oliver Bearman", number: 87 },
      { id: "ocon", name: "Esteban Ocon", number: 31 },
    ],
    reserveDrivers: [
      { id: "doohan", name: "Jack Doohan", role: "Reserve" },
      { id: "hirakawa", name: "Ryo Hirakawa", role: "Reserve" },
    ],
  },
  {
    name: "Audi",
    raceDrivers: [
      { id: "hulkenberg", name: "Nico Hulkenberg", number: 27 },
      { id: "bortoleto", name: "Gabriel Bortoleto", number: 5 },
    ],
    reserveDrivers: [],
  },
  {
    name: "Cadillac",
    raceDrivers: [
      { id: "bottas", name: "Valtteri Bottas", number: 77 },
      { id: "perez", name: "Sergio Perez", number: 11 },
    ],
    reserveDrivers: [
      { id: "zhou", name: "Zhou Guanyu", role: "Reserve" },
    ],
  },
];

function TierBadge({ driverId }) {
  const tier = getDriverTier(driverId);
  if (!tier) return null;
  const info = tierInfo[tier];
  return (
    <span className="inline-block ml-2 px-1.5 py-0.5 rounded text-xs text-gray-300 bg-gray-700">
      {info.label}
    </span>
  );
}

export default function Roster() {
  const [expandedTeam, setExpandedTeam] = useState(null);

  const toggleTeam = (teamName) => {
    setExpandedTeam(expandedTeam === teamName ? null : teamName);
  };

  return (
    <div className="p-4 md:p-6 lg:p-10 bg-page min-h-screen">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold mb-2 text-white">
          2026 F1 Roster
        </h2>
        <p className="text-lg text-gray-400">All teams, race drivers & reserves</p>
        <p className="text-sm text-gray-600 mt-1">{TEAMS.length} teams &middot; {TEAMS.reduce((sum, t) => sum + t.raceDrivers.length, 0)} race drivers &middot; {TEAMS.reduce((sum, t) => sum + t.reserveDrivers.length, 0)} reserve/development drivers</p>
      </div>

      <div className="max-w-5xl mx-auto space-y-2">
        {TEAMS.map((team) => {
          const color = teamColors[team.name] || "#666";
          const isExpanded = expandedTeam === team.name;

          return (
            <div key={team.name} className="rounded-xl overflow-hidden border border-gray-700">
              <button
                onClick={() => toggleTeam(team.name)}
                className="w-full p-4 flex items-center justify-between text-white bg-card hover:bg-gray-800 transition-colors duration-150 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-8 rounded-sm"
                    style={{ backgroundColor: color }}
                  />
                  <div className="text-left">
                    <div className="text-lg font-semibold">{team.name}</div>
                    <div className="text-xs text-gray-500">
                      {team.raceDrivers.length} drivers
                      {team.reserveDrivers.length > 0 && ` + ${team.reserveDrivers.length} reserve`}
                    </div>
                  </div>
                </div>
                <div className="text-gray-500 text-sm transition-transform duration-200" style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }}>
                  ▾
                </div>
              </button>

              {isExpanded && (
                <div className="bg-card border-t border-gray-700 p-4">
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Race Drivers</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                    {team.raceDrivers.map((driver) => (
                      <div
                        key={driver.id}
                        className="flex items-center gap-3 rounded-lg p-3 bg-gray-900 border border-gray-700"
                      >
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white"
                          style={{ backgroundColor: `${color}60` }}
                        >
                          {driver.number}
                        </div>
                        <div>
                          <div className="font-medium text-white text-sm">
                            {driver.name}
                            <TierBadge driverId={driver.id} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {team.reserveDrivers.length > 0 && (
                    <>
                      <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Reserve & Development</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {team.reserveDrivers.map((driver) => (
                          <div
                            key={driver.id}
                            className="flex items-center gap-3 bg-gray-900 bg-opacity-50 rounded-lg p-3 border border-gray-700"
                          >
                            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-gray-400 text-xs font-medium">
                              RSV
                            </div>
                            <div>
                              <div className="font-medium text-gray-300 text-sm">
                                {driver.name}
                                <TierBadge driverId={driver.id} />
                              </div>
                              <div className="text-xs text-gray-500">{driver.role}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
