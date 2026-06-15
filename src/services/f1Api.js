// Ergast/Jolpica as primary data source, OpenF1 as optional fallback
// OpenF1 locks out during live sessions (401 Unauthorized) so cannot be primary
import raceOverrides from "../data/raceOverrides.json";

const OPENF1_BASE = "https://api.openf1.org/v1";
const ERGAST_BASE = "https://api.jolpi.ca/ergast/f1";

// ---- 2026 Driver Number Map ----
const DRIVER_MAP_2026 = {
  1:  { driverId: "norris",     givenName: "Lando",     familyName: "Norris",     team: "McLaren" },
  3:  { driverId: "verstappen", givenName: "Max",       familyName: "Verstappen", team: "Red Bull" },
  5:  { driverId: "bortoleto",  givenName: "Gabriel",   familyName: "Bortoleto",  team: "Audi" },
  6:  { driverId: "hadjar",     givenName: "Isack",     familyName: "Hadjar",     team: "Red Bull" },
  10: { driverId: "gasly",      givenName: "Pierre",    familyName: "Gasly",      team: "Alpine" },
  11: { driverId: "perez",      givenName: "Sergio",    familyName: "Perez",      team: "Cadillac" },
  12: { driverId: "antonelli",  givenName: "Kimi",      familyName: "Antonelli",  team: "Mercedes" },
  14: { driverId: "alonso",     givenName: "Fernando",  familyName: "Alonso",     team: "Aston Martin" },
  16: { driverId: "leclerc",    givenName: "Charles",   familyName: "Leclerc",    team: "Ferrari" },
  18: { driverId: "stroll",     givenName: "Lance",     familyName: "Stroll",     team: "Aston Martin" },
  23: { driverId: "albon",      givenName: "Alexander",  familyName: "Albon",      team: "Williams" },
  27: { driverId: "hulkenberg", givenName: "Nico",      familyName: "Hulkenberg", team: "Audi" },
  30: { driverId: "lawson",     givenName: "Liam",      familyName: "Lawson",     team: "Racing Bulls" },
  31: { driverId: "ocon",       givenName: "Esteban",   familyName: "Ocon",       team: "Haas" },
  41: { driverId: "lindblad",   givenName: "Arvid",     familyName: "Lindblad",   team: "Racing Bulls" },
  43: { driverId: "colapinto",  givenName: "Franco",    familyName: "Colapinto",  team: "Alpine" },
  44: { driverId: "hamilton",   givenName: "Lewis",     familyName: "Hamilton",   team: "Ferrari" },
  55: { driverId: "sainz",      givenName: "Carlos",    familyName: "Sainz",      team: "Williams" },
  63: { driverId: "russell",    givenName: "George",    familyName: "Russell",    team: "Mercedes" },
  77: { driverId: "bottas",     givenName: "Valtteri",  familyName: "Bottas",     team: "Cadillac" },
  81: { driverId: "piastri",    givenName: "Oscar",     familyName: "Piastri",    team: "McLaren" },
  87: { driverId: "bearman",    givenName: "Oliver",    familyName: "Bearman",    team: "Haas" },
};

// Reverse lookup: driverId -> driver info
const DRIVER_INFO = {};
for (const d of Object.values(DRIVER_MAP_2026)) {
  DRIVER_INFO[d.driverId] = d;
}

// ---- Ergast driverId normalization ----
// Ergast uses different IDs for some drivers
const ERGAST_ID_NORMALIZE = {
  "max_verstappen": "verstappen",
  "arvid_lindblad": "lindblad",
};

function normalizeDriverId(ergastId) {
  return ERGAST_ID_NORMALIZE[ergastId] || ergastId;
}

// ---- Team Name Normalization ----
const TEAM_NAME_MAP = {
  "Red Bull Racing": "Red Bull",
  "Kick Sauber": "Audi",
  "Sauber": "Audi",
  "Stake F1 Team Kick Sauber": "Audi",
  "Haas F1 Team": "Haas",
  "MoneyGram Haas F1 Team": "Haas",
  "RB": "Racing Bulls",
  "RB F1 Team": "Racing Bulls",
  "Visa Cash App RB": "Racing Bulls",
  "Visa Cash App RB F1 Team": "Racing Bulls",
  "AlphaTauri": "Racing Bulls",
  "Alpine F1 Team": "Alpine",
  "Cadillac F1 Team": "Cadillac",
  "TWG x Cadillac F1 Team": "Cadillac",
};

function normalizeTeamName(name) {
  if (!name) return "Unknown";
  return TEAM_NAME_MAP[name] || name;
}

// ---- Status Normalization ----
// Ergast uses "Lapped" for drivers who finished but were lapped,
// and "Did not start" for DNS. Normalize to scoring-compatible values.
function normalizeStatus(status) {
  if (!status) return "Finished";
  if (status === "Finished") return "Finished";
  if (status.startsWith("+")) return status; // "+1 Lap" etc
  if (status === "Lapped") return "Finished"; // finished race, just lapped
  if (status === "Retired" || status === "Did not finish") return "Retired";
  if (status === "Did not start" || status === "DNS") return "Retired";
  if (status === "Disqualified") return "Retired";
  return "Finished";
}

// ---- Fetching Helpers ----

async function fetchJSON(url) {
  try {
    const resp = await fetch(url);
    if (!resp.ok) return [];
    return resp.json();
  } catch (e) {
    console.warn(`Fetch failed: ${url}`, e.message);
    return [];
  }
}

async function fetchErgastJSON(url) {
  try {
    const resp = await fetch(url);
    if (!resp.ok) return null;
    return resp.json();
  } catch (e) {
    console.warn(`Ergast fetch failed: ${url}`, e.message);
    return null;
  }
}

// ---- Promise-based Cache ----
const cache = {};

function cachedFetch(key, fetchFn) {
  if (!cache[key]) {
    cache[key] = fetchFn().catch((err) => {
      delete cache[key];
      throw err;
    });
  }
  return cache[key];
}

// ---- OpenF1 Helpers (used as fallback only) ----

function getAllSessions(year) {
  return cachedFetch(`sessions_${year}`, () =>
    fetchJSON(`${OPENF1_BASE}/sessions?year=${year}`)
  );
}

function extractFinalPositions(positionEntries) {
  const latest = {};
  for (const entry of positionEntries) {
    const num = entry.driver_number;
    if (!latest[num] || entry.date > latest[num].date) {
      latest[num] = entry;
    }
  }
  return latest;
}

// Build a date→{round, raceName} map from the Ergast schedule
// Used to assign proper round numbers to OpenF1 sessions
function buildDateToScheduleMap(schedule) {
  const map = {};
  for (const race of schedule) {
    if (race.date) {
      map[race.date] = { round: race.round, raceName: race.raceName };
    }
  }
  return map;
}

// Match an OpenF1 session to a schedule entry by date
// OpenF1 date_start is ISO like "2026-03-08T05:00:00+00:00"
// Schedule date is "2026-03-08"
function findScheduleEntryForSession(session, dateToSchedule) {
  if (!session.date_start) return null;
  const sessionDate = session.date_start.split("T")[0];
  // Try exact match first
  if (dateToSchedule[sessionDate]) return dateToSchedule[sessionDate];
  // For qualifying/sprint, the session date may be 1-2 days before the race date
  // Try matching by meeting_key through nearby dates (±2 days)
  const d = new Date(sessionDate);
  for (let offset = 1; offset <= 2; offset++) {
    const later = new Date(d);
    later.setDate(later.getDate() + offset);
    const laterStr = later.toISOString().split("T")[0];
    if (dateToSchedule[laterStr]) return dateToSchedule[laterStr];
  }
  return null;
}

function toDriverId(lastName) {
  if (!lastName) return "unknown";
  return lastName.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s+/g, "_");
}

function resolveDriver(driverNumber, openF1Drivers = []) {
  if (DRIVER_MAP_2026[driverNumber]) return DRIVER_MAP_2026[driverNumber];
  const of1 = openF1Drivers.find((d) => d.driver_number === driverNumber);
  if (of1 && of1.last_name) {
    return {
      driverId: toDriverId(of1.last_name),
      givenName: of1.first_name || "",
      familyName: of1.last_name || "",
      team: normalizeTeamName(of1.team_name),
    };
  }
  return { driverId: `driver_${driverNumber}`, givenName: "", familyName: `Driver #${driverNumber}`, team: "Unknown" };
}

// ---- Ergast → internal format converters ----

function ergastRaceToInternal(ergastRace) {
  return {
    round: ergastRace.round,
    raceName: ergastRace.raceName,
    Results: (ergastRace.Results || []).map((r) => {
      const driverId = normalizeDriverId(r.Driver.driverId);
      const info = DRIVER_INFO[driverId];
      return {
        position: r.position,
        Driver: {
          driverId,
          givenName: info?.givenName || r.Driver.givenName || "",
          familyName: info?.familyName || r.Driver.familyName || "",
        },
        Constructor: { name: normalizeTeamName(r.Constructor?.name) },
        FastestLap: r.FastestLap?.rank === "1" ? { rank: "1" } : undefined,
        status: normalizeStatus(r.status),
        grid: r.grid || "0",
      };
    }),
  };
}

// ---- Apply manual overrides ----

function applyResultOverrides(races) {
  for (const race of races) {
    const roundOverrides = raceOverrides[race.round];
    if (!roundOverrides) continue;
    for (const result of race.Results) {
      const driverOverride = roundOverrides[result.Driver.driverId];
      if (!driverOverride) continue;
      if (driverOverride.grid !== undefined) {
        result.grid = String(driverOverride.grid);
      }
      if (driverOverride.dnf === true) {
        result.status = "Retired";
      } else if (driverOverride.dnf === false) {
        const isBadStatus = result.status !== "Finished" && !result.status?.startsWith("+");
        if (isBadStatus) {
          result.status = "Finished";
        }
      }
    }
  }
}

function applyQualifyingOverrides(qualiData) {
  for (const race of qualiData) {
    const roundOverrides = raceOverrides[race.round];
    if (!roundOverrides) continue;
    for (const qr of race.QualifyingResults || []) {
      const driverOverride = roundOverrides[qr.Driver.driverId];
      if (!driverOverride || !driverOverride.qualifyingRound) continue;
      const qRound = driverOverride.qualifyingRound;
      qr.Q1 = qr.Q1 || "1:30.000";
      qr.Q2 = qRound === "Q1" ? "-" : (qr.Q2 !== "-" ? qr.Q2 : "1:29.000");
      qr.Q3 = qRound === "Q3" ? (qr.Q3 !== "-" ? qr.Q3 : "1:28.000") : "-";
    }
  }
}

// ---- Main Exports ----

export async function fetchSeasonResults(year) {
  return cachedFetch(`results_${year}`, async () => {
    let races = [];

    // 1. Try Ergast as primary source (always available)
    try {
      const ergastJson = await fetchErgastJSON(
        `${ERGAST_BASE}/${year}/results/?limit=500`
      );
      const ergastRaces = ergastJson?.MRData?.RaceTable?.Races || [];
      if (ergastRaces.length > 0) {
        races = ergastRaces.map(ergastRaceToInternal);
      }
    } catch (e) {
      // Fall through to OpenF1
    }

    // 2. Supplement with OpenF1 for any rounds Ergast is missing
    try {
      const ergastRounds = new Set(races.map((r) => r.round));

      const [allSessions, schedule] = await Promise.all([
        getAllSessions(year),
        fetchSeasonSchedule(year),
      ]);
      const dateToSchedule = buildDateToScheduleMap(schedule);

      const raceSessions = allSessions
        .filter((s) => s.session_name === "Race")
        .sort((a, b) => new Date(a.date_start) - new Date(b.date_start));

      // Only process sessions whose round is NOT already covered by Ergast
      const missingSessions = raceSessions.filter((session) => {
        const entry = findScheduleEntryForSession(session, dateToSchedule);
        return entry && !ergastRounds.has(entry.round);
      });

      if (missingSessions.length > 0) {
        const racePromises = missingSessions.map(async (session) => {
          const entry = findScheduleEntryForSession(session, dateToSchedule);
          if (!entry) return null;

          const [positions, drivers, laps] = await Promise.all([
            fetchJSON(`${OPENF1_BASE}/position?session_key=${session.session_key}`),
            fetchJSON(`${OPENF1_BASE}/drivers?session_key=${session.session_key}`),
            fetchJSON(`${OPENF1_BASE}/laps?session_key=${session.session_key}`),
          ]);

          if (!positions || positions.length === 0) return null;
          const finalPositions = extractFinalPositions(positions);
          if (Object.keys(finalPositions).length === 0) return null;

          let fastestLapDriver = null;
          let fastestLapTime = Infinity;
          for (const lap of laps) {
            if (lap.lap_duration && lap.lap_duration > 0 && !lap.is_pit_out_lap) {
              if (lap.lap_duration < fastestLapTime) {
                fastestLapTime = lap.lap_duration;
                fastestLapDriver = lap.driver_number;
              }
            }
          }

          const driverMaxLap = {};
          for (const lap of laps) {
            if (lap.driver_number && lap.lap_number) {
              const num = lap.driver_number;
              driverMaxLap[num] = Math.max(driverMaxLap[num] || 0, lap.lap_number);
            }
          }
          const maxLapsInRace = Math.max(...Object.values(driverMaxLap), 0);

          const results = Object.entries(finalPositions)
            .sort((a, b) => a[1].position - b[1].position)
            .map(([numStr, posData]) => {
              const num = parseInt(numStr);
              const dInfo = resolveDriver(num, drivers);
              const completedLaps = driverMaxLap[num] || 0;
              let status = "Finished";
              if (maxLapsInRace > 0 && completedLaps > 0) {
                if (completedLaps < maxLapsInRace * 0.9) status = "Retired";
                else if (completedLaps < maxLapsInRace) {
                  const lapsDown = maxLapsInRace - completedLaps;
                  status = `+${lapsDown} Lap${lapsDown > 1 ? "s" : ""}`;
                }
              }
              return {
                position: String(posData.position),
                Driver: { driverId: dInfo.driverId, givenName: dInfo.givenName, familyName: dInfo.familyName },
                Constructor: { name: dInfo.team },
                FastestLap: num === fastestLapDriver ? { rank: "1" } : undefined,
                status,
                grid: "0",
              };
            });

          return { round: entry.round, raceName: entry.raceName, Results: results };
        });

        const supplementalRaces = (await Promise.all(racePromises)).filter(Boolean);
        races = races.concat(supplementalRaces);
      }

      // Sort by round number
      races.sort((a, b) => parseInt(a.round) - parseInt(b.round));
    } catch (e) {
      // OpenF1 supplement failed, continue with Ergast-only data
    }

    // 3. Manual overrides: final authority for grid, DNF status
    applyResultOverrides(races);

    return races;
  });
}

export async function fetchSeasonQualifying(year) {
  return cachedFetch(`qualifying_${year}`, async () => {
    let qualiData = [];

    // 1. Try Ergast first for proper Q1/Q2/Q3 timing data
    try {
      const ergastJson = await fetchErgastJSON(
        `${ERGAST_BASE}/${year}/qualifying/?limit=500`
      );
      const ergastRaces = ergastJson?.MRData?.RaceTable?.Races || [];
      if (ergastRaces.length > 0) {
        // Normalize driverIds
        qualiData = ergastRaces.map((race) => ({
          ...race,
          QualifyingResults: (race.QualifyingResults || []).map((qr) => ({
            ...qr,
            Driver: { ...qr.Driver, driverId: normalizeDriverId(qr.Driver.driverId) },
          })),
        }));
      }
    } catch (e) {
      // Fall through to OpenF1
    }

    // 2. Supplement with OpenF1 for any rounds Ergast is missing
    try {
      const ergastRounds = new Set(qualiData.map((r) => r.round));

      const [allSessions, schedule] = await Promise.all([
        getAllSessions(year),
        fetchSeasonSchedule(year),
      ]);
      const dateToSchedule = buildDateToScheduleMap(schedule);

      const qualiSessions = allSessions
        .filter((s) => s.session_name === "Qualifying")
        .sort((a, b) => new Date(a.date_start) - new Date(b.date_start));

      const missingSessions = qualiSessions.filter((session) => {
        const entry = findScheduleEntryForSession(session, dateToSchedule);
        return entry && !ergastRounds.has(entry.round);
      });

      if (missingSessions.length > 0) {
        const qualiPromises = missingSessions.map(async (session) => {
          const entry = findScheduleEntryForSession(session, dateToSchedule);
          if (!entry) return null;

          const [positions, drivers] = await Promise.all([
            fetchJSON(`${OPENF1_BASE}/position?session_key=${session.session_key}`),
            fetchJSON(`${OPENF1_BASE}/drivers?session_key=${session.session_key}`),
          ]);
          if (!positions || positions.length === 0) return null;

          const finalPos = extractFinalPositions(positions);
          const qualifyingResults = Object.entries(finalPos)
            .sort((a, b) => a[1].position - b[1].position)
            .map(([numStr, posData]) => {
              const num = parseInt(numStr);
              const dInfo = resolveDriver(num, drivers);
              const pos = posData.position;
              let q1 = "1:30.000", q2 = "-", q3 = "-";
              if (pos <= 10) { q2 = "1:29.000"; q3 = "1:28.000"; }
              else if (pos <= 15) { q2 = "1:29.000"; }
              return { Driver: { driverId: dInfo.driverId }, position: String(pos), Q1: q1, Q2: q2, Q3: q3 };
            });

          return { round: entry.round, raceName: entry.raceName, QualifyingResults: qualifyingResults };
        });

        const supplementalQuali = (await Promise.all(qualiPromises)).filter(Boolean);
        qualiData = qualiData.concat(supplementalQuali);
      }

      // Sort by round number
      qualiData.sort((a, b) => parseInt(a.round) - parseInt(b.round));
    } catch (e) {
      // OpenF1 supplement failed, continue with Ergast-only data
    }

    // 3. Manual overrides: final authority for qualifying rounds
    applyQualifyingOverrides(qualiData);

    return qualiData;
  });
}

export async function fetchSeasonSprints(year) {
  return cachedFetch(`sprints_${year}`, async () => {
    let sprintData = [];

    // 1. Try Ergast first
    try {
      const ergastJson = await fetchErgastJSON(
        `${ERGAST_BASE}/${year}/sprint/?limit=500`
      );
      const ergastRaces = ergastJson?.MRData?.RaceTable?.Races || [];
      if (ergastRaces.length > 0) {
        sprintData = ergastRaces.map((race) => ({
          ...race,
          SprintResults: (race.SprintResults || []).map((r) => ({
            ...r,
            Driver: { ...r.Driver, driverId: normalizeDriverId(r.Driver.driverId) },
          })),
        }));
      }
    } catch (e) {
      // Fall through to OpenF1
    }

    // 2. Supplement with OpenF1 for any rounds Ergast is missing
    try {
      const ergastRounds = new Set(sprintData.map((r) => r.round));

      const [allSessions, schedule] = await Promise.all([
        getAllSessions(year),
        fetchSeasonSchedule(year),
      ]);
      const dateToSchedule = buildDateToScheduleMap(schedule);

      const sprintSessions = allSessions
        .filter((s) => s.session_name === "Sprint")
        .sort((a, b) => new Date(a.date_start) - new Date(b.date_start));

      const missingSessions = sprintSessions.filter((session) => {
        const entry = findScheduleEntryForSession(session, dateToSchedule);
        return entry && !ergastRounds.has(entry.round);
      });

      if (missingSessions.length > 0) {
        const sprintPromises = missingSessions.map(async (session) => {
          const entry = findScheduleEntryForSession(session, dateToSchedule);
          if (!entry) return null;

          const [positions, drivers] = await Promise.all([
            fetchJSON(`${OPENF1_BASE}/position?session_key=${session.session_key}`),
            fetchJSON(`${OPENF1_BASE}/drivers?session_key=${session.session_key}`),
          ]);
          if (!positions || positions.length === 0) return null;

          const finalPos = extractFinalPositions(positions);
          const sprintResults = Object.entries(finalPos)
            .sort((a, b) => a[1].position - b[1].position)
            .map(([numStr, posData]) => {
              const num = parseInt(numStr);
              const dInfo = resolveDriver(num, drivers);
              return { position: String(posData.position), Driver: { driverId: dInfo.driverId } };
            });

          return { round: entry.round, raceName: entry.raceName, SprintResults: sprintResults };
        });

        const supplementalSprints = (await Promise.all(sprintPromises)).filter(Boolean);
        sprintData = sprintData.concat(supplementalSprints);
      }

      // Sort by round number
      sprintData.sort((a, b) => parseInt(a.round) - parseInt(b.round));
    } catch (e) {
      // OpenF1 supplement failed, continue with Ergast-only data
    }

    return sprintData;
  });
}

export async function fetchRaceResult(year, round) {
  const races = await fetchSeasonResults(year);
  return races.find((r) => r.round === String(round)) || null;
}

export async function fetchDriverStandings(year) {
  return cachedFetch(`driverStandings_${year}`, async () => {
    try {
      const ergastJson = await fetchErgastJSON(
        `${ERGAST_BASE}/${year}/driverStandings/?limit=30`
      );
      const lists = ergastJson?.MRData?.StandingsTable?.StandingsLists || [];
      if (lists.length > 0) {
        const standings = {};
        for (const entry of lists[0].DriverStandings || []) {
          const driverId = normalizeDriverId(entry.Driver.driverId);
          standings[driverId] = {
            position: parseInt(entry.positionText) || 0,
            points: parseFloat(entry.points) || 0,
            wins: parseInt(entry.wins) || 0,
          };
        }
        return standings;
      }
    } catch (e) {
      // Standings unavailable
    }
    return {};
  });
}

export async function fetchSeasonSchedule(year) {
  return cachedFetch(`schedule_${year}`, async () => {
    // 1. Try Ergast for schedule
    try {
      const ergastJson = await fetchErgastJSON(
        `${ERGAST_BASE}/${year}/?limit=30`
      );
      const ergastRaces = ergastJson?.MRData?.RaceTable?.Races || [];
      if (ergastRaces.length > 0) {
        return ergastRaces.map((r) => ({
          round: r.round,
          raceName: r.raceName,
          date: r.date || "",
          Circuit: {
            circuitName: r.Circuit?.circuitName || "",
            Location: {
              country: r.Circuit?.Location?.country || "",
              locality: r.Circuit?.Location?.locality || "",
            },
          },
        }));
      }
    } catch (e) {
      // Fall through to OpenF1
    }

    // 2. Fallback: OpenF1
    try {
      const allSessions = await getAllSessions(year);
      const raceSessions = allSessions
        .filter((s) => s.session_name === "Race")
        .sort((a, b) => new Date(a.date_start) - new Date(b.date_start));

      const countryCounts = {};
      for (const s of raceSessions) {
        const name = s.country_name || "";
        countryCounts[name] = (countryCounts[name] || 0) + 1;
      }

      return raceSessions.map((s, i) => ({
        round: String(i + 1),
        raceName: countryCounts[s.country_name] > 1
          ? `${s.location || s.country_name} Grand Prix`
          : `${s.country_name} Grand Prix`,
        date: s.date_start?.split("T")[0] || "",
        Circuit: {
          circuitName: s.circuit_short_name || "",
          Location: {
            country: s.country_name || "",
            locality: s.location || "",
          },
        },
      }));
    } catch (e) {
      return [];
    }
  });
}
