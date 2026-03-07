import React from "react";
import scoringConfig from "../data/scoring.json";
import { allStars, risingStars, underdogs, underdogTeams, tierInfo } from "../data/driverTiers";

const positionPoints = scoringConfig.racePositionPoints;
const qualifyingPoints = scoringConfig.qualifyingPoints;
const { fastestLap, polePosition, dnfPenalty, underdogTop5, underdogTop10, streakBreaker, podiumStreak, teamPodium, underdogTeamPodium, placesGained5, placesGained10, underdogPlacesGained5, underdogPlacesGained10 } = scoringConfig.bonuses;

const positionEntries = Object.entries(positionPoints)
  .sort(([a], [b]) => Number(a) - Number(b));

export default function Rules() {
  return (
    <div className="p-4 md:p-6 lg:p-10 bg-page min-h-screen">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold mb-2 text-white">
          Fantasy Rules & Scoring
        </h2>
        <p className="text-lg text-gray-400">How points are earned each race weekend</p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* How It Works */}
        <div className="bg-card rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-3">How It Works</h3>
          <div className="space-y-2 text-gray-400 text-sm">
            <p>Each player drafts <span className="text-white font-medium">3 drivers</span> and picks <span className="text-white font-medium">1 constructor team</span> via a snake draft.</p>
            <p>After every Grand Prix, your drivers earn points based on their finishing position, plus bonuses (or penalties) for special events. Your constructor earns you bonus points for every podium finish by their drivers.</p>
            <p>Your total fantasy score is the <span className="text-white font-medium">sum of all points</span> earned by your 3 drivers + constructor bonuses across the season.</p>
          </div>
        </div>

        {/* Race Position Points */}
        <div className="bg-card rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Race Finish Points</h3>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
            {positionEntries.map(([pos, pts]) => (
              <div
                key={pos}
                className={`rounded-lg p-3 text-center ${
                  pos === "1"
                    ? "bg-yellow-900 border border-yellow-700"
                    : pos === "2"
                    ? "bg-gray-700 border border-gray-500"
                    : pos === "3"
                    ? "bg-orange-900 border border-orange-700"
                    : "bg-gray-900 border border-gray-700"
                }`}
              >
                <div className="text-xs text-gray-400 mb-1">P{pos}</div>
                <div className={`text-xl font-bold ${
                  pos === "1" ? "text-yellow-400" : pos === "2" ? "text-gray-300" : pos === "3" ? "text-orange-400" : "text-white"
                }`}>
                  {pts}
                </div>
                <div className="text-xs text-gray-500">pts</div>
              </div>
            ))}
          </div>
          <p className="text-gray-600 text-xs mt-3">Positions 16th and below score 0 points.</p>
        </div>

        {/* Sprint Race Points */}
        <div className="bg-card rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Sprint Race Points</h3>
          <p className="text-gray-400 text-sm mb-4">Sprint races award points to the top 8 finishers. Sprint points are added to that round's total.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {Object.entries(scoringConfig.sprintPositionPoints)
              .sort(([a], [b]) => Number(a) - Number(b))
              .map(([pos, pts]) => (
                <div
                  key={`sprint-${pos}`}
                  className={`rounded-lg p-3 text-center ${
                    pos === "1"
                      ? "bg-yellow-900 border border-yellow-700"
                      : pos === "2"
                      ? "bg-gray-700 border border-gray-500"
                      : pos === "3"
                      ? "bg-orange-900 border border-orange-700"
                      : "bg-gray-900 border border-gray-700"
                  }`}
                >
                  <div className="text-xs text-gray-400 mb-1">P{pos}</div>
                  <div className={`text-xl font-bold ${
                    pos === "1" ? "text-yellow-400" : pos === "2" ? "text-gray-300" : pos === "3" ? "text-orange-400" : "text-white"
                  }`}>
                    {pts}
                  </div>
                  <div className="text-xs text-gray-500">pts</div>
                </div>
              ))}
          </div>
          <p className="text-gray-600 text-xs mt-3">Not every race weekend has a sprint. Sprint points stack with the main race for that round.</p>
        </div>

        {/* Qualifying Points */}
        <div className="bg-card rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Qualifying Points</h3>
          <p className="text-gray-400 text-sm mb-4">Every driver earns points based on their qualifying exit round. Drivers eliminated earlier get more points to keep underdogs competitive.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-gray-900 rounded-lg p-4 text-center border border-blue-900">
              <div className="text-xs text-gray-400 mb-1">Q1 Exit (P16-P20)</div>
              <div className="text-2xl font-bold text-blue-400">+{qualifyingPoints.Q1}</div>
              <div className="text-xs text-gray-500 mt-1">eliminated in round 1</div>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 text-center border border-blue-900">
              <div className="text-xs text-gray-400 mb-1">Q2 Exit (P11-P15)</div>
              <div className="text-2xl font-bold text-blue-400">+{qualifyingPoints.Q2}</div>
              <div className="text-xs text-gray-500 mt-1">eliminated in round 2</div>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 text-center border border-blue-900">
              <div className="text-xs text-gray-400 mb-1">Q3 (P1-P10)</div>
              <div className="text-2xl font-bold text-blue-400">+{qualifyingPoints.Q3}</div>
              <div className="text-xs text-gray-500 mt-1">made it to final round</div>
            </div>
          </div>
        </div>

        {/* Bonuses & Penalties */}
        <div className="bg-card rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Bonuses & Penalties</h3>

          <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">Race Bonuses</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-5">
            <div className="bg-gray-900 rounded-lg p-4 text-center border border-gray-700">
              <div className="text-sm font-medium text-gray-300 mb-1">Fastest Lap</div>
              <div className="text-2xl font-bold text-green-400">+{fastestLap}</div>
              <div className="text-xs text-gray-500 mt-1">must finish top 10</div>
            </div>

            <div className="bg-gray-900 rounded-lg p-4 text-center border border-gray-700">
              <div className="text-sm font-medium text-gray-300 mb-1">Pole Position</div>
              <div className="text-2xl font-bold text-green-400">+{polePosition}</div>
              <div className="text-xs text-gray-500 mt-1">bonus point</div>
            </div>

            <div className="bg-gray-900 rounded-lg p-4 text-center border border-gray-700">
              <div className="text-sm font-medium text-gray-300 mb-1">Podium Streak</div>
              <div className="text-2xl font-bold text-green-400">+{podiumStreak}</div>
              <div className="text-xs text-gray-500 mt-1">consecutive podiums (P1-P3)</div>
            </div>
          </div>

          <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">Places Gained</h4>
          <p className="text-gray-500 text-xs mb-3">Bonus for finishing higher than your grid position. Underdog drivers earn more.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <div className="bg-gray-900 rounded-lg p-4 text-center border border-emerald-900">
              <div className="text-sm font-medium text-emerald-300 mb-1">5-9 Places Gained</div>
              <div className="text-2xl font-bold text-green-400">+{placesGained5}</div>
              <div className="text-xs text-gray-500 mt-1">all drivers</div>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 text-center border border-emerald-900">
              <div className="text-sm font-medium text-emerald-300 mb-1">10+ Places Gained</div>
              <div className="text-2xl font-bold text-green-400">+{placesGained10}</div>
              <div className="text-xs text-gray-500 mt-1">all drivers</div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
            <div className="bg-gray-900 rounded-lg p-4 text-center border border-orange-900">
              <div className="text-sm font-medium text-orange-300 mb-1">Underdog 5-9 Places</div>
              <div className="text-2xl font-bold text-green-400">+{underdogPlacesGained5}</div>
              <div className="text-xs text-gray-500 mt-1">underdog drivers</div>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 text-center border border-orange-900">
              <div className="text-sm font-medium text-orange-300 mb-1">Underdog 10+ Places</div>
              <div className="text-2xl font-bold text-green-400">+{underdogPlacesGained10}</div>
              <div className="text-xs text-gray-500 mt-1">underdog drivers</div>
            </div>
          </div>

          <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">Underdog Bonuses</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-5">
            <div className="bg-gray-900 rounded-lg p-4 text-center border border-orange-900">
              <div className="text-sm font-medium text-orange-300 mb-1">Underdog Top 5</div>
              <div className="text-2xl font-bold text-green-400">+{underdogTop5}</div>
              <div className="text-xs text-gray-500 mt-1">underdog driver finishes P1-P5</div>
            </div>

            <div className="bg-gray-900 rounded-lg p-4 text-center border border-orange-900">
              <div className="text-sm font-medium text-orange-300 mb-1">Underdog Top 10</div>
              <div className="text-2xl font-bold text-green-400">+{underdogTop10}</div>
              <div className="text-xs text-gray-500 mt-1">underdog driver finishes P6-P10</div>
            </div>

            <div className="bg-gray-900 rounded-lg p-4 text-center border border-orange-900">
              <div className="text-sm font-medium text-orange-300 mb-1">Underdog Team Podium</div>
              <div className="text-2xl font-bold text-green-400">+{underdogTeamPodium}</div>
              <div className="text-xs text-gray-500 mt-1">per podium by underdog constructor</div>
            </div>
          </div>

          <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">Constructor Bonus</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
            <div className="bg-gray-900 rounded-lg p-4 text-center border border-gray-700">
              <div className="text-sm font-medium text-gray-300 mb-1">Team Podium</div>
              <div className="text-2xl font-bold text-green-400">+{teamPodium}</div>
              <div className="text-xs text-gray-500 mt-1">per podium by your constructor</div>
            </div>

            <div className="bg-gray-900 rounded-lg p-4 text-center border border-gray-700">
              <div className="text-sm font-medium text-gray-300 mb-1">Underdog Team Podium</div>
              <div className="text-2xl font-bold text-green-400">+{underdogTeamPodium}</div>
              <div className="text-xs text-gray-500 mt-1">if your constructor is an underdog team</div>
            </div>
          </div>

          <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">Streak Bonuses</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
            <div className="bg-gray-900 rounded-lg p-4 text-center border border-green-900">
              <div className="text-sm font-medium text-green-300 mb-1">Podium Streak</div>
              <div className="text-2xl font-bold text-green-400">+{podiumStreak}</div>
              <div className="text-xs text-gray-500 mt-1">back-to-back podiums (P1-P3)</div>
            </div>

            <div className="bg-gray-900 rounded-lg p-4 text-center border border-teal-900">
              <div className="text-sm font-medium text-teal-300 mb-1">Losing Streak Breaker</div>
              <div className="text-2xl font-bold text-green-400">+{streakBreaker}</div>
              <div className="text-xs text-gray-500 mt-1">P13+ for 2 races, then scores points</div>
            </div>
          </div>

          <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">Penalties</h4>
          <div className="max-w-xs mx-auto">
            <div className="bg-gray-900 rounded-lg p-4 text-center border border-red-900">
              <div className="text-sm font-medium text-gray-300 mb-1">DNF Penalty</div>
              <div className="text-2xl font-bold text-red-400">{dnfPenalty}</div>
              <div className="text-xs text-gray-500 mt-1">penalty per DNF</div>
            </div>
          </div>
        </div>

        {/* Driver Tiers */}
        <div className="bg-card rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-2">Driver Tiers</h3>
          <p className="text-gray-500 text-sm mb-4">Based on 2025 season performance and experience level.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-yellow-900 bg-opacity-30 rounded-lg p-4 border border-yellow-800">
              <div className="text-center mb-3">
                <div className="text-sm font-semibold text-yellow-400">{tierInfo.allStar.label}</div>
                <div className="text-xs text-gray-500 mt-0.5">Top 6 in 2025</div>
              </div>
              <div className="space-y-0.5">
                {allStars.map((id) => (
                  <div key={id} className="text-sm text-gray-300 text-center capitalize">
                    {id.replace(/_/g, " ")}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-cyan-900 bg-opacity-30 rounded-lg p-4 border border-cyan-800">
              <div className="text-center mb-3">
                <div className="text-sm font-semibold text-cyan-400">{tierInfo.risingStar.label}</div>
                <div className="text-xs text-gray-500 mt-0.5">1st or 2nd year</div>
              </div>
              <div className="space-y-0.5">
                {risingStars.map((id) => (
                  <div key={id} className="text-sm text-gray-300 text-center capitalize">
                    {id.replace(/_/g, " ")}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-orange-900 bg-opacity-30 rounded-lg p-4 border border-orange-800">
              <div className="text-center mb-3">
                <div className="text-sm font-semibold text-orange-400">{tierInfo.underdog.label}</div>
                <div className="text-xs text-gray-500 mt-0.5">Bottom 6 in 2025</div>
              </div>
              <div className="space-y-0.5">
                {underdogs.map((id) => (
                  <div key={id} className="text-sm text-gray-300 text-center capitalize">
                    {id.replace(/_/g, " ")}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <p className="text-gray-600 text-xs mt-3">Some drivers may appear in multiple tiers. Drivers not in any tier are mid-field veterans.</p>
        </div>

        {/* Underdog Teams */}
        <div className="bg-card rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-2">Underdog Constructors</h3>
          <p className="text-gray-500 text-sm mb-4">Bottom 5 from 2025 constructors standings + Cadillac (new team). These teams earn <span className="text-orange-400 font-medium">+{underdogTeamPodium}</span> per podium instead of <span className="text-white font-medium">+{teamPodium}</span>.</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {underdogTeams.map((team) => (
              <div key={team} className="bg-orange-900 bg-opacity-30 rounded-lg p-3 text-center border border-orange-800">
                <div className="text-sm font-medium text-orange-300">{team}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Snake Draft Explanation */}
        <div className="bg-card rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-3">Snake Draft</h3>
          <div className="space-y-2 text-gray-400 text-sm">
            <p>The draft uses a <span className="text-white font-medium">snake order</span> across 3 rounds to keep things fair:</p>
            <div className="bg-gray-900 rounded-lg p-3 font-mono text-xs space-y-1 border border-gray-700">
              <div><span className="text-gray-300">Round 1:</span> Player 1 → Player 2 → ... → Player N</div>
              <div><span className="text-gray-300">Round 2:</span> Player N → ... → Player 2 → Player 1</div>
              <div><span className="text-gray-300">Round 3:</span> Player 1 → Player 2 → ... → Player N</div>
            </div>
            <p>The player who picks last in one round picks first in the next.</p>
          </div>
        </div>

        {/* Example */}
        <div className="bg-card rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-3">Scoring Example</h3>
          <div className="text-gray-400 text-sm space-y-2">
            <p>If your driver qualifies <span className="font-medium text-white">in Q3</span>, wins the <span className="font-medium text-white">sprint</span>, finishes <span className="font-medium text-white">P1</span> in the race, and sets the <span className="font-medium text-white">fastest lap</span>:</p>
            <div className="bg-gray-900 rounded-lg p-3 font-mono text-xs space-y-1 border border-gray-700">
              <div>Qualifying (Q3):        <span className="text-blue-400">+{qualifyingPoints.Q3}</span></div>
              <div>Sprint win (P1):        <span className="text-yellow-400">+{scoringConfig.sprintPositionPoints["1"]}</span></div>
              <div>Race win (P1):          <span className="text-white">+{positionPoints["1"]}</span></div>
              <div>Fastest lap bonus:      <span className="text-green-400">+{fastestLap}</span></div>
              <div className="border-t border-gray-700 pt-1 text-white font-medium">
                Total:                  {qualifyingPoints.Q3 + scoringConfig.sprintPositionPoints["1"] + positionPoints["1"] + fastestLap} pts
              </div>
            </div>
            <p className="text-xs text-gray-500">If that same driver DNF'd in the race instead, they'd still keep qualifying and sprint points, but get {dnfPenalty} penalty (no race position points).</p>
          </div>
        </div>
      </div>
    </div>
  );
}
