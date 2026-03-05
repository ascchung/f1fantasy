import React, { useState, useEffect, useCallback } from "react";
import { getDriverTier, tierInfo, underdogTeams } from "../data/driverTiers";

const DRIVER_POOL = [
  { id: "verstappen", name: "Max Verstappen", team: "Red Bull" },
  { id: "hadjar", name: "Isack Hadjar", team: "Red Bull" },
  { id: "leclerc", name: "Charles Leclerc", team: "Ferrari" },
  { id: "hamilton", name: "Lewis Hamilton", team: "Ferrari" },
  { id: "norris", name: "Lando Norris", team: "McLaren" },
  { id: "piastri", name: "Oscar Piastri", team: "McLaren" },
  { id: "russell", name: "George Russell", team: "Mercedes" },
  { id: "antonelli", name: "Kimi Antonelli", team: "Mercedes" },
  { id: "alonso", name: "Fernando Alonso", team: "Aston Martin" },
  { id: "stroll", name: "Lance Stroll", team: "Aston Martin" },
  { id: "gasly", name: "Pierre Gasly", team: "Alpine" },
  { id: "colapinto", name: "Franco Colapinto", team: "Alpine" },
  { id: "albon", name: "Alexander Albon", team: "Williams" },
  { id: "sainz", name: "Carlos Sainz", team: "Williams" },
  { id: "lawson", name: "Liam Lawson", team: "Racing Bulls" },
  { id: "lindblad", name: "Arvid Lindblad", team: "Racing Bulls" },
  { id: "bearman", name: "Oliver Bearman", team: "Haas" },
  { id: "ocon", name: "Esteban Ocon", team: "Haas" },
  { id: "hulkenberg", name: "Nico Hulkenberg", team: "Audi" },
  { id: "bortoleto", name: "Gabriel Bortoleto", team: "Audi" },
  { id: "bottas", name: "Valtteri Bottas", team: "Cadillac" },
  { id: "perez", name: "Sergio Perez", team: "Cadillac" },
];

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

function generateDraftOrder(players, rounds) {
  const order = [];
  for (let r = 0; r < rounds; r++) {
    const roundOrder = r % 2 === 0 ? [...players] : [...players].reverse();
    roundOrder.forEach((player) => {
      order.push({ round: r + 1, player });
    });
  }
  return order;
}

const CONSTRUCTOR_LIST = [
  "Red Bull", "Ferrari", "McLaren", "Mercedes", "Aston Martin",
  "Alpine", "Williams", "Racing Bulls", "Haas", "Audi", "Cadillac",
];

const DRAFT_PROGRESS_KEY = "f1fantasy_draft_progress";

function shuffleArray(arr) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function loadDraftProgress() {
  try {
    const saved = localStorage.getItem(DRAFT_PROGRESS_KEY);
    if (saved) return JSON.parse(saved);
  } catch { /* ignore */ }
  return null;
}

export default function FantasyDraft() {
  const [phase, setPhase] = useState("setup");
  const [playerNames, setPlayerNames] = useState([]);
  const [nameInput, setNameInput] = useState("");
  const [lastYearWinner, setLastYearWinner] = useState("");
  const [draftOrderNames, setDraftOrderNames] = useState([]);

  const [draftOrder, setDraftOrder] = useState([]);
  const [currentPickIndex, setCurrentPickIndex] = useState(0);
  const [picks, setPicks] = useState([]);
  const [playerTeams, setPlayerTeams] = useState({});

  const [playerConstructors, setPlayerConstructors] = useState({});
  const [teamPickIndex, setTeamPickIndex] = useState(0);

  const [restored, setRestored] = useState(false);

  const hasSavedDraft = !!localStorage.getItem("f1fantasy_players");

  const pickedDriverIds = picks.map((p) => p.driver.id);

  // Save draft progress to localStorage
  const saveDraftProgress = useCallback((overrides = {}) => {
    const state = {
      phase: overrides.phase ?? phase,
      playerNames: overrides.playerNames ?? playerNames,
      lastYearWinner: overrides.lastYearWinner ?? lastYearWinner,
      draftOrderNames: overrides.draftOrderNames ?? draftOrderNames,
      draftOrder: overrides.draftOrder ?? draftOrder,
      currentPickIndex: overrides.currentPickIndex ?? currentPickIndex,
      picks: overrides.picks ?? picks,
      playerTeams: overrides.playerTeams ?? playerTeams,
      playerConstructors: overrides.playerConstructors ?? playerConstructors,
      teamPickIndex: overrides.teamPickIndex ?? teamPickIndex,
    };
    localStorage.setItem(DRAFT_PROGRESS_KEY, JSON.stringify(state));
  }, [phase, playerNames, lastYearWinner, draftOrderNames, draftOrder, currentPickIndex, picks, playerTeams, playerConstructors, teamPickIndex]);

  const clearDraftProgress = () => {
    localStorage.removeItem(DRAFT_PROGRESS_KEY);
  };

  // Restore draft progress on mount
  useEffect(() => {
    const saved = loadDraftProgress();
    if (saved && saved.phase && saved.phase !== "setup") {
      setPhase(saved.phase);
      setPlayerNames(saved.playerNames || []);
      setLastYearWinner(saved.lastYearWinner || "");
      setDraftOrderNames(saved.draftOrderNames || []);
      setDraftOrder(saved.draftOrder || []);
      setCurrentPickIndex(saved.currentPickIndex || 0);
      setPicks(saved.picks || []);
      setPlayerTeams(saved.playerTeams || {});
      setPlayerConstructors(saved.playerConstructors || {});
      setTeamPickIndex(saved.teamPickIndex || 0);
      setRestored(true);
    }
  }, []);

  const addPlayer = () => {
    const trimmed = nameInput.trim();
    if (trimmed && !playerNames.includes(trimmed)) {
      setPlayerNames([...playerNames, trimmed]);
      setNameInput("");
    }
  };

  const removePlayer = (name) => {
    setPlayerNames(playerNames.filter((n) => n !== name));
  };

  const startDraft = () => {
    const winner = lastYearWinner.trim();
    let orderedNames;
    if (winner && playerNames.includes(winner)) {
      const others = playerNames.filter((n) => n !== winner);
      orderedNames = [...shuffleArray(others), winner];
    } else {
      orderedNames = shuffleArray(playerNames);
    }
    const order = generateDraftOrder(orderedNames, 3);
    const teams = {};
    orderedNames.forEach((name) => { teams[name] = []; });

    setDraftOrderNames(orderedNames);
    setDraftOrder(order);
    setCurrentPickIndex(0);
    setPicks([]);
    setPlayerTeams(teams);
    setPhase("draft");

    saveDraftProgress({
      phase: "draft",
      playerNames,
      lastYearWinner,
      draftOrderNames: orderedNames,
      draftOrder: order,
      currentPickIndex: 0,
      picks: [],
      playerTeams: teams,
      playerConstructors: {},
      teamPickIndex: 0,
    });
  };

  const pickDriver = (driver) => {
    if (pickedDriverIds.includes(driver.id)) return;
    const current = draftOrder[currentPickIndex];
    const newPick = { round: current.round, player: current.player, driver };
    const newPicks = [...picks, newPick];
    const newTeams = { ...playerTeams, [current.player]: [...playerTeams[current.player], driver.id] };

    setPicks(newPicks);
    setPlayerTeams(newTeams);

    if (currentPickIndex + 1 >= draftOrder.length) {
      setTeamPickIndex(0);
      setPhase("teamPick");
      saveDraftProgress({
        phase: "teamPick",
        picks: newPicks,
        playerTeams: newTeams,
        currentPickIndex: currentPickIndex + 1,
        teamPickIndex: 0,
      });
    } else {
      setCurrentPickIndex(currentPickIndex + 1);
      saveDraftProgress({
        picks: newPicks,
        playerTeams: newTeams,
        currentPickIndex: currentPickIndex + 1,
      });
    }
  };

  const pickConstructor = (team) => {
    const currentPlayer = playerNames[teamPickIndex];
    const updated = { ...playerConstructors, [currentPlayer]: team };
    setPlayerConstructors(updated);

    if (teamPickIndex + 1 >= playerNames.length) {
      setPhase("complete");
      saveDraftProgress({
        phase: "complete",
        playerConstructors: updated,
        teamPickIndex: teamPickIndex + 1,
      });
    } else {
      setTeamPickIndex(teamPickIndex + 1);
      saveDraftProgress({
        playerConstructors: updated,
        teamPickIndex: teamPickIndex + 1,
      });
    }
  };

  const saveDraft = () => {
    const config = {
      season: 2026,
      players: Object.entries(playerTeams).map(([name, drivers]) => ({
        name,
        drivers,
        constructor: playerConstructors[name] || null,
      })),
    };
    localStorage.setItem("f1fantasy_players", JSON.stringify(config));
    clearDraftProgress();
    alert("Draft saved! Navigate to other pages to see your teams in action.");
  };

  const resetDraft = () => {
    clearDraftProgress();
    setPhase("setup");
    setPlayerNames([]);
    setNameInput("");
    setLastYearWinner("");
    setDraftOrderNames([]);
    setDraftOrder([]);
    setCurrentPickIndex(0);
    setPicks([]);
    setPlayerTeams({});
    setPlayerConstructors({});
    setTeamPickIndex(0);
    setRestored(false);
  };

  const clearSavedDraft = () => {
    localStorage.removeItem("f1fantasy_players");
    alert("Saved draft cleared. Pages will now use default placeholder data.");
  };

  const hasInProgressDraft = !!loadDraftProgress()?.phase && loadDraftProgress().phase !== "setup";

  // ─── SETUP PHASE ───
  if (phase === "setup") {
    return (
      <div className="p-4 md:p-6 lg:p-10 bg-page min-h-screen">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold mb-2 text-white">
            Fantasy Draft
          </h2>
          <p className="text-lg text-gray-400">Snake Draft - 3 Rounds</p>
        </div>

        <div className="max-w-xl mx-auto space-y-6">
          {hasSavedDraft && (
            <div className="bg-card border border-green-800 rounded-xl p-5 text-center">
              <p className="text-green-400 font-medium mb-2">A saved draft is active</p>
              <p className="text-gray-500 text-sm mb-3">Leaderboard and Player Teams are using your drafted rosters.</p>
              <button
                onClick={clearSavedDraft}
                className="px-4 py-2 bg-red-900 hover:bg-red-800 text-red-300 font-medium rounded-lg text-sm transition-colors"
              >
                Clear Saved Draft
              </button>
            </div>
          )}

          {hasInProgressDraft && (
            <div className="bg-card border border-yellow-800 rounded-xl p-5 text-center">
              <p className="text-yellow-400 font-medium mb-2">Draft in progress</p>
              <p className="text-gray-500 text-sm mb-3">You have an unfinished draft. Resume where you left off or start over.</p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => {
                    const saved = loadDraftProgress();
                    if (saved) {
                      setPhase(saved.phase);
                      setPlayerNames(saved.playerNames || []);
                      setLastYearWinner(saved.lastYearWinner || "");
                      setDraftOrderNames(saved.draftOrderNames || []);
                      setDraftOrder(saved.draftOrder || []);
                      setCurrentPickIndex(saved.currentPickIndex || 0);
                      setPicks(saved.picks || []);
                      setPlayerTeams(saved.playerTeams || {});
                      setPlayerConstructors(saved.playerConstructors || {});
                      setTeamPickIndex(saved.teamPickIndex || 0);
                      setRestored(true);
                    }
                  }}
                  className="px-4 py-2 bg-white text-gray-900 font-semibold rounded-lg text-sm transition-colors hover:bg-gray-200"
                >
                  Resume Draft
                </button>
                <button
                  onClick={() => {
                    clearDraftProgress();
                    setRestored(false);
                  }}
                  className="px-4 py-2 bg-gray-900 text-gray-300 font-medium rounded-lg text-sm transition-colors hover:bg-gray-700 border border-gray-700"
                >
                  Start Over
                </button>
              </div>
            </div>
          )}

          <div className="bg-card rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Add Players</h3>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addPlayer()}
                placeholder="Enter player name..."
                className="flex-1 px-3 py-2 rounded-lg bg-gray-900 text-white placeholder-gray-500 outline-none border border-gray-700 focus:border-gray-500"
              />
              <button
                onClick={addPlayer}
                disabled={!nameInput.trim()}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors disabled:opacity-40"
              >
                Add
              </button>
            </div>

            {playerNames.length > 0 && (
              <div className="space-y-2 mb-4">
                {playerNames.map((name, i) => (
                  <div
                    key={name}
                    className="flex items-center justify-between bg-gray-900 rounded-lg px-3 py-2 text-white border border-gray-700"
                  >
                    <span className="text-sm">
                      <span className="text-gray-500 mr-2">#{i + 1}</span>
                      {name}
                      {lastYearWinner && name === lastYearWinner.trim() && (
                        <span className="ml-2 text-yellow-500 text-xs">Defending Champ</span>
                      )}
                    </span>
                    <button
                      onClick={() => removePlayer(name)}
                      className="text-gray-500 hover:text-red-400 text-sm transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="mb-4">
              <label className="block text-gray-500 text-sm mb-1">
                Last year's winner (gets last pick in Round 1)
              </label>
              <input
                type="text"
                value={lastYearWinner}
                onChange={(e) => setLastYearWinner(e.target.value)}
                placeholder="Optional..."
                className="w-full px-3 py-2 rounded-lg bg-gray-900 text-white placeholder-gray-500 outline-none border border-gray-700 focus:border-gray-500"
              />
              {lastYearWinner.trim() && !playerNames.includes(lastYearWinner.trim()) && (
                <p className="text-yellow-500 text-xs mt-1">Name doesn't match any added player.</p>
              )}
            </div>

            <div className="text-center">
              <p className="text-gray-600 text-xs mb-3">Draft order will be randomized</p>
              <button
                onClick={startDraft}
                disabled={playerNames.length < 2}
                className="px-6 py-3 bg-white text-gray-900 font-semibold rounded-lg transition-colors hover:bg-gray-200 disabled:opacity-40 disabled:hover:bg-white"
              >
                Start Draft ({playerNames.length} players)
              </button>
              {playerNames.length < 2 && (
                <p className="text-gray-500 text-xs mt-2">Add at least 2 players to start</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── DRAFT PHASE ───
  if (phase === "draft") {
    const current = draftOrder[currentPickIndex];
    const overallPick = currentPickIndex + 1;
    const totalPicks = draftOrder.length;

    return (
      <div className="p-4 md:p-6 lg:p-10 bg-page min-h-screen">
        {restored && (
          <div className="max-w-7xl mx-auto mb-4">
            <div className="bg-card border border-yellow-800 rounded-lg px-4 py-2 text-yellow-400 text-sm text-center">
              Draft resumed from where you left off
            </div>
          </div>
        )}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-white mb-1">
            Round {current.round}, Pick {overallPick} of {totalPicks}
          </h2>
          <p className="text-xl text-white font-semibold">
            {current.player}'s turn
          </p>
          <p className="text-gray-500 text-sm mt-1">
            Order: {draftOrderNames.join(" → ")}
          </p>
        </div>

        <div className="max-w-4xl mx-auto mb-6">
          <div className="flex flex-wrap gap-1 justify-center">
            {draftOrder.map((slot, i) => (
              <div
                key={i}
                className={`px-2 py-1 rounded text-xs font-medium ${
                  i < currentPickIndex
                    ? "bg-gray-900 text-gray-600 line-through"
                    : i === currentPickIndex
                    ? "bg-white text-gray-900"
                    : "bg-gray-900 text-gray-400"
                }`}
              >
                {slot.player}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          <div className="xl:col-span-3">
            <h3 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">Available Drivers</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {DRIVER_POOL.map((driver) => {
                const taken = pickedDriverIds.includes(driver.id);
                const color = teamColors[driver.team] || "#666";
                const tier = getDriverTier(driver.id);
                const info = tier ? tierInfo[tier] : null;
                return (
                  <button
                    key={driver.id}
                    disabled={taken}
                    onClick={() => pickDriver(driver)}
                    className={`p-3 rounded-lg text-left transition-colors duration-150 border ${
                      taken
                        ? "opacity-20 cursor-not-allowed bg-card border-gray-700"
                        : "border-gray-700 hover:border-gray-600 cursor-pointer"
                    }`}
                    style={
                      taken
                        ? {}
                        : { background: `linear-gradient(135deg, ${color}10, ${color}25)` }
                    }
                  >
                    <div className="font-medium text-white text-sm">{driver.name}</div>
                    <div className="text-xs mt-0.5 text-gray-400">
                      {driver.team}
                    </div>
                    {info && (
                      <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-xs text-gray-300 bg-gray-900">
                        {info.label}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Draft History</h3>
              <button
                onClick={resetDraft}
                className="text-xs text-gray-500 hover:text-red-400 transition-colors"
              >
                Abandon Draft
              </button>
            </div>
            <div className="bg-card rounded-xl p-3 border border-gray-700 max-h-96 overflow-y-auto space-y-1">
              {picks.length === 0 ? (
                <p className="text-gray-600 text-sm text-center py-2">No picks yet</p>
              ) : (
                picks.map((pick, i) => (
                  <div
                    key={i}
                    className="bg-gray-900 rounded px-2 py-1.5 text-sm"
                  >
                    <span className="text-gray-500">R{pick.round}.</span>{" "}
                    <span className="text-white font-medium">{pick.player}</span>{" "}
                    <span className="text-gray-500">-</span>{" "}
                    <span className="text-gray-300">{pick.driver.name}</span>
                  </div>
                ))
              )}
            </div>

            <h3 className="text-sm font-medium text-gray-400 mt-6 mb-3 uppercase tracking-wider">Teams</h3>
            <div className="space-y-2">
              {draftOrderNames.map((name) => (
                <div key={name} className="bg-card rounded-lg p-3 border border-gray-700">
                  <div className="text-white font-medium text-sm mb-1">{name}</div>
                  {playerTeams[name].length === 0 ? (
                    <div className="text-gray-600 text-xs">No drivers yet</div>
                  ) : (
                    playerTeams[name].map((dId) => {
                      const d = DRIVER_POOL.find((dr) => dr.id === dId);
                      return (
                        <div key={dId} className="text-gray-400 text-xs">
                          {d ? d.name : dId}
                        </div>
                      );
                    })
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── TEAM PICK PHASE ───
  if (phase === "teamPick") {
    const currentPlayer = playerNames[teamPickIndex];
    const pickedConstructors = Object.values(playerConstructors);

    return (
      <div className="p-4 md:p-6 lg:p-10 bg-page min-h-screen">
        {restored && (
          <div className="max-w-3xl mx-auto mb-4">
            <div className="bg-card border border-yellow-800 rounded-lg px-4 py-2 text-yellow-400 text-sm text-center">
              Draft resumed from where you left off
            </div>
          </div>
        )}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-1">
            Pick Your Constructor
          </h2>
          <p className="text-xl text-white font-semibold">
            {currentPlayer}'s turn
          </p>
          <p className="text-gray-500 mt-1">Pick {teamPickIndex + 1} of {playerNames.length}</p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {CONSTRUCTOR_LIST.map((team) => {
              const taken = pickedConstructors.includes(team);
              const color = teamColors[team] || "#666";
              const isUnderdog = underdogTeams.includes(team);
              return (
                <button
                  key={team}
                  disabled={taken}
                  onClick={() => pickConstructor(team)}
                  className={`p-4 rounded-lg text-center transition-colors duration-150 border ${
                    taken
                      ? "opacity-20 cursor-not-allowed bg-card border-gray-700"
                      : "border-gray-700 hover:border-gray-600 cursor-pointer"
                  }`}
                  style={
                    taken
                      ? {}
                      : { background: `linear-gradient(135deg, ${color}10, ${color}25)` }
                  }
                >
                  <div
                    className="w-4 h-4 rounded-full mx-auto mb-2"
                    style={{ backgroundColor: color }}
                  />
                  <div className="font-medium text-white text-sm">{team}</div>
                  {isUnderdog ? (
                    <div className="text-xs text-orange-400 mt-1">+1 per podium</div>
                  ) : (
                    <div className="text-xs text-gray-500 mt-1">+0.5 per podium</div>
                  )}
                </button>
              );
            })}
          </div>
          <div className="text-center mt-6">
            <button
              onClick={resetDraft}
              className="text-xs text-gray-500 hover:text-red-400 transition-colors"
            >
              Abandon Draft
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── COMPLETE PHASE ───
  return (
    <div className="p-4 md:p-6 lg:p-10 bg-page min-h-screen">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold mb-2 text-white">
          Draft Complete
        </h2>
        <p className="text-lg text-gray-400">Here are your fantasy teams</p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {Object.entries(playerTeams).map(([name, driverIds]) => (
            <div
              key={name}
              className="bg-card rounded-xl p-5 border border-gray-700"
            >
              <h3 className="text-lg font-semibold text-white mb-3">{name}</h3>
              {playerConstructors[name] && (
                <div
                  className="rounded-lg px-3 py-2 mb-2 flex items-center gap-2 border border-gray-700"
                  style={{ background: `linear-gradient(135deg, ${teamColors[playerConstructors[name]] || "#666"}10, ${teamColors[playerConstructors[name]] || "#666"}25)` }}
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: teamColors[playerConstructors[name]] || "#666" }}
                  />
                  <div className="font-medium text-white text-sm">{playerConstructors[name]}</div>
                  <div className="text-xs text-gray-500 ml-auto">Constructor</div>
                </div>
              )}
              <div className="space-y-1.5">
                {driverIds.map((dId) => {
                  const d = DRIVER_POOL.find((dr) => dr.id === dId);
                  const color = d ? teamColors[d.team] || "#666" : "#666";
                  return (
                    <div
                      key={dId}
                      className="rounded-lg px-3 py-2 border border-gray-700"
                      style={{ background: `linear-gradient(135deg, ${color}10, ${color}25)` }}
                    >
                      <div className="font-medium text-white text-sm">
                        {d ? d.name : dId}
                      </div>
                      <div className="text-xs text-gray-500">
                        {d ? d.team : ""}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3 justify-center">
          <button
            onClick={saveDraft}
            className="px-6 py-3 bg-white text-gray-900 font-semibold rounded-lg transition-colors hover:bg-gray-200"
          >
            Save & Start Season
          </button>
          <button
            onClick={resetDraft}
            className="px-6 py-3 bg-gray-900 text-gray-300 font-medium rounded-lg transition-colors hover:bg-gray-700 border border-gray-700"
          >
            Reset Draft
          </button>
        </div>
      </div>
    </div>
  );
}
