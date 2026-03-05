import defaultPlayersConfig from "../data/players.json";

export function getPlayerConfig() {
  const saved = localStorage.getItem("f1fantasy_players");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return defaultPlayersConfig;
    }
  }
  return defaultPlayersConfig;
}
