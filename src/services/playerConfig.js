import defaultPlayersConfig from "../data/players.json";

export function getPlayerConfig() {
  const saved = localStorage.getItem("f1fantasy_players");
  if (saved) {
    try {
      const config = JSON.parse(saved);
      // Merge substitutions from default config into saved config
      // (substitutions are managed in players.json, not localStorage)
      const defaultSubs = {};
      for (const dp of defaultPlayersConfig.players || []) {
        if (dp.substitutions) defaultSubs[dp.name] = dp.substitutions;
      }
      for (const player of config.players || []) {
        if (defaultSubs[player.name]) {
          player.substitutions = defaultSubs[player.name];
        }
      }
      return config;
    } catch {
      return defaultPlayersConfig;
    }
  }
  return defaultPlayersConfig;
}
