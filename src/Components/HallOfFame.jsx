import React from "react";

const HALL_OF_FAME = [
  {
    year: 2025,
    podium: [
      { name: "Ashley", position: 1 },
      { name: "Taylor", position: 2 },
      { name: "Ryan", position: 3 },
    ],
  },
  // Add future years here:
  // { year: 2026, podium: [{ name: "...", position: 1 }, ...] },
];

const trophies = { 1: "🏆", 2: "🥈", 3: "🥉" };
const podiumColors = {
  1: "bg-yellow-500",
  2: "bg-gray-400",
  3: "bg-orange-500",
};
const podiumHeights = { 1: "h-36", 2: "h-24", 3: "h-16" };
const podiumOrder = { 1: "order-2", 2: "order-1", 3: "order-3" };

export default function HallOfFame() {
  return (
    <div className="p-4 md:p-6 lg:p-10 bg-page min-h-screen">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold mb-2 text-white">
          Hall of Fame
        </h2>
        <p className="text-lg text-gray-400">Fantasy League Champions</p>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {HALL_OF_FAME.map((season) => (
          <div key={season.year} className="bg-card rounded-xl p-6 border border-gray-700">
            <h3 className="text-2xl font-semibold text-center text-white mb-8">
              {season.year} Season
            </h3>

            {/* Podium */}
            <div className="flex justify-center items-end gap-3 md:gap-6 mb-8">
              {season.podium
                .sort((a, b) => a.position - b.position)
                .map((entry) => (
                  <div
                    key={entry.position}
                    className={`flex flex-col items-center ${podiumOrder[entry.position]}`}
                  >
                    <div className="text-3xl mb-2">{trophies[entry.position]}</div>
                    <div className="text-white text-center mb-2">
                      <div className="font-semibold">{entry.name}</div>
                      <div className="text-xs text-gray-500">
                        {entry.position === 1 ? "Champion" : entry.position === 2 ? "Runner-up" : "3rd Place"}
                      </div>
                    </div>
                    <div
                      className={`w-20 md:w-24 ${podiumHeights[entry.position]} ${podiumColors[entry.position]} rounded-t-lg flex items-end justify-center pb-2`}
                    >
                      <span className="text-black font-bold text-xl">{entry.position}</span>
                    </div>
                  </div>
                ))}
            </div>

            {/* Results Table */}
            <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
              {season.podium
                .sort((a, b) => a.position - b.position)
                .map((entry) => (
                  <div
                    key={entry.position}
                    className={`flex items-center justify-between px-4 py-3 border-b border-gray-700 last:border-b-0`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{trophies[entry.position]}</span>
                      <span className="text-white font-medium">{entry.name}</span>
                    </div>
                    <span className={`text-sm font-medium ${
                      entry.position === 1 ? "text-yellow-400" : entry.position === 2 ? "text-gray-400" : "text-orange-400"
                    }`}>
                      P{entry.position}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        ))}

        <div className="text-center text-gray-600 text-sm pb-8">
          <p>Boaty McBoatface Fantasy F1 — Celebrating our champions since 2025</p>
        </div>
      </div>
    </div>
  );
}
