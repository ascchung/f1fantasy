import scoringConfig from "../data/scoring.json";
import { underdogs, underdogTeams } from "../data/driverTiers";

/**
 * Calculate fantasy points for each driver across all races.
 * Returns a map of driverId -> { driverId, givenName, familyName, team, points, podiums, fastestLaps, dnfs, raceResults }
 */
export function calculateDriverPoints(races) {
  const drivers = {};

  for (const race of races) {
    const results = race.Results || [];
    for (const result of results) {
      const id = result.Driver.driverId;
      if (!drivers[id]) {
        drivers[id] = {
          driverId: id,
          givenName: result.Driver.givenName,
          familyName: result.Driver.familyName,
          team: result.Constructor.name,
          points: 0,
          podiums: 0,
          fastestLaps: 0,
          dnfs: 0,
          raceResults: [],
        };
      }

      const pos = parseInt(result.position, 10);
      const posPoints =
        scoringConfig.racePositionPoints[String(pos)] || 0;

      let racePoints = posPoints;
      let fastestLapBonus = 0;
      let dnfPenaltyVal = 0;
      let underdogBonus = 0;
      let streakBonus = 0;

      // Fastest lap bonus (must finish in top 10 per real F1 rules)
      const hasFastestLap = result.FastestLap?.rank === "1";
      if (hasFastestLap) {
        drivers[id].fastestLaps++;
        if (pos <= 10) {
          fastestLapBonus = scoringConfig.bonuses.fastestLap;
          racePoints += fastestLapBonus;
        }
      }

      // DNF tracking
      const isDnf =
        result.status !== "Finished" && !result.status?.startsWith("+");
      if (isDnf) {
        drivers[id].dnfs++;
        dnfPenaltyVal = scoringConfig.bonuses.dnfPenalty;
        racePoints += dnfPenaltyVal;
      }

      // Underdog top-5 bonus
      if (pos <= 5 && underdogs.includes(id)) {
        underdogBonus = scoringConfig.bonuses.underdogTop5;
        racePoints += underdogBonus;
      }

      // Podium tracking + consecutive podium streak bonus
      if (pos <= 3) {
        drivers[id].podiums++;
        const prevResults = drivers[id].raceResults;
        if (prevResults.length > 0 && prevResults[prevResults.length - 1].position <= 3) {
          streakBonus = scoringConfig.bonuses.podiumStreak;
          racePoints += streakBonus;
        }
      }

      drivers[id].points += racePoints;
      drivers[id].raceResults.push({
        round: race.round,
        raceName: race.raceName,
        position: pos,
        points: racePoints,
        status: result.status,
        fastestLap: hasFastestLap,
        grid: parseInt(result.grid, 10),
        basePoints: posPoints,
        fastestLapBonus,
        dnfPenalty: dnfPenaltyVal,
        underdogBonus,
        streakBonus,
      });
    }
  }

  return drivers;
}

/**
 * Count podiums per constructor across all races.
 * Returns { "McLaren": 5, "Red Bull": 3, ... }
 */
function countTeamPodiums(races) {
  const counts = {};
  for (const race of races) {
    for (const result of race.Results || []) {
      const pos = parseInt(result.position, 10);
      if (pos <= 3) {
        const team = result.Constructor.name;
        counts[team] = (counts[team] || 0) + 1;
      }
    }
  }
  return counts;
}

/**
 * Calculate player standings from driver points and player config.
 * Returns sorted array of { name, points, drivers: [{ driverId, familyName, team, points }], constructor, constructorBonus }
 */
export function calculatePlayerStandings(driverPoints, players, races = []) {
  const teamPodiums = countTeamPodiums(races);

  return players
    .map((player) => {
      const playerDrivers = player.drivers.map((driverId) => {
        const driver = driverPoints[driverId];
        return {
          driverId,
          familyName: driver?.familyName || driverId,
          givenName: driver?.givenName || "",
          team: driver?.team || "Unknown",
          points: driver?.points || 0,
          podiums: driver?.podiums || 0,
          fastestLaps: driver?.fastestLaps || 0,
          dnfs: driver?.dnfs || 0,
        };
      });
      const driverTotal = playerDrivers.reduce((sum, d) => sum + d.points, 0);

      // Constructor podium bonus
      const chosenTeam = player.constructor || null;
      let constructorBonus = 0;
      if (chosenTeam && teamPodiums[chosenTeam]) {
        const podiumCount = teamPodiums[chosenTeam];
        const bonusPerPodium = underdogTeams.includes(chosenTeam)
          ? scoringConfig.bonuses.underdogTeamPodium
          : scoringConfig.bonuses.teamPodium;
        constructorBonus = podiumCount * bonusPerPodium;
      }

      return {
        name: player.name,
        points: driverTotal + constructorBonus,
        drivers: playerDrivers,
        constructor: chosenTeam,
        constructorBonus,
      };
    })
    .sort((a, b) => b.points - a.points)
    .map((player, index) => ({ ...player, rank: index + 1 }));
}

/**
 * Get a per-race point breakdown for all drivers.
 * Returns array of { round, raceName, results: [{ driverId, familyName, position, points }] }
 */
export function getRaceBreakdown(races) {
  return races.map((race) => ({
    round: race.round,
    raceName: race.raceName,
    results: (race.Results || []).map((result) => {
      const pos = parseInt(result.position, 10);
      const posPoints =
        scoringConfig.racePositionPoints[String(pos)] || 0;
      const hasFastestLap = result.FastestLap?.rank === "1";
      let points = posPoints;
      if (hasFastestLap && pos <= 10) {
        points += scoringConfig.bonuses.fastestLap;
      }
      return {
        driverId: result.Driver.driverId,
        familyName: result.Driver.familyName,
        position: pos,
        points,
        fastestLap: hasFastestLap,
      };
    }),
  }));
}
