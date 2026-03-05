// Driver tier classifications for the 2026 season
// Based on 2025 final standings and career year

// Rising Stars: 1st or 2nd year drivers in F1
// Lindblad = true rookie (1st season), rest are 2nd year in 2026
export const risingStars = [
  "antonelli",    // 2nd year (debuted 2025)
  "hadjar",       // 2nd year (debuted 2025)
  "bearman",      // 2nd year (debuted 2025)
  "bortoleto",    // 2nd year (debuted 2025)
  "colapinto",    // 1st full season (partial 2024/2025)
  "lindblad",     // Rookie (1st season)
];

// All Stars: Top 6 in 2025 final driver standings
export const allStars = [
  "norris",       // P1 - 423 pts (2025 World Champion)
  "verstappen",   // P2 - 421 pts
  "piastri",      // P3 - 410 pts
  "russell",      // P4 - 319 pts
  "leclerc",      // P5 - 242 pts
  "hamilton",     // P6 - 156 pts
];

// Underdogs: Bottom 6 in 2025 final driver standings
export const underdogs = [
  "stroll",       // P16 - 33 pts
  "tsunoda",      // P17 - 33 pts (not on 2026 grid but kept for reference)
  "gasly",        // P18 - 22 pts
  "bortoleto",    // P19 - 19 pts (also a Rising Star)
  "colapinto",    // P20 - 0 pts (also a Rising Star)
  "doohan",       // P21 - 0 pts (not on 2026 grid but kept for reference)
];

export function getDriverTier(driverId) {
  if (allStars.includes(driverId)) return "allStar";
  if (risingStars.includes(driverId)) return "risingStar";
  if (underdogs.includes(driverId)) return "underdog";
  return null;
}

// Underdog constructors: Bottom 5 from 2025 constructors standings + Cadillac (new team)
export const underdogTeams = [
  "Racing Bulls",   // P6 - 92 pts
  "Aston Martin",   // P7 - 89 pts
  "Haas",           // P8 - 79 pts
  "Audi",           // P9 - 70 pts (was Kick Sauber)
  "Alpine",         // P10 - 22 pts
  "Cadillac",       // New team for 2026
];

export const tierInfo = {
  allStar: { label: "All Star", emoji: "⭐", color: "from-yellow-500 to-amber-500" },
  risingStar: { label: "Rising Star", emoji: "🌟", color: "from-cyan-500 to-blue-500" },
  underdog: { label: "Underdog", emoji: "🐺", color: "from-orange-500 to-red-500" },
};
