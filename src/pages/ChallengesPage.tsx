import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWater } from '../context/WaterContext';
import { formatVolume } from '../utils/waterScore';

export const ChallengesPage: React.FC = () => {
  const { user } = useAuth();
  const {
    challenges,
    badges,
    completeChallengeStep,
    waterScore,
  } = useWater();

  const [activeTab, setActiveTab] = useState<'challenges' | 'badges' | 'leaderboard'>('challenges');

  // Sample community leaderboard
  const leaderboard = [
    { rank: 1, name: 'Dr. Samantha Vance', score: waterScore.score, streak: user?.streakDays || 14, district: 'North Basin Eco' },
    { rank: 2, name: 'Kaelen R. (Echo Park)', score: 91, streak: 28, district: 'Central Valley' },
    { rank: 3, name: 'Aria Chen', score: 89, streak: 19, district: 'Highland Park' },
    { rank: 4, name: 'Marcus Sterling', score: 86, streak: 12, district: 'Bay Watershed' },
    { rank: 5, name: 'Elena Rostova', score: 84, streak: 9, district: 'South Delta' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#30353f]/30">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono tracking-widest uppercase text-amber-400">
              COMMUNITY CONSERVATION EXPEDITIONS & MERIT
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-headline font-bold text-white tracking-tight">
            Challenges & Achievements
          </h1>
          <p className="text-sm text-outline mt-1">
            Compete in basin-wide conservation sprints, unlock hydro credentials, and build your planetary streak.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center bg-surface-container p-1 rounded-xl border border-[#30353f]/60 self-start md:self-auto">
          {[
            { id: 'challenges', label: 'Challenges', icon: 'military_tech' },
            { id: 'badges', label: 'Badges', icon: 'verified' },
            { id: 'leaderboard', label: 'Basin Board', icon: 'leaderboard' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-amber-400 text-black font-bold shadow'
                  : 'text-outline hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-sm">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Streak Banner */}
      <div className="bg-gradient-to-r from-amber-500/15 via-surface-container to-surface-container border border-amber-500/30 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/40">
            <span className="material-symbols-outlined text-3xl">local_fire_department</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase text-amber-400 font-bold tracking-wider">
                STEWARD STREAK
              </span>
              <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded font-mono">
                1.5X REWARD BOOST
              </span>
            </div>
            <h2 className="text-xl font-headline font-bold text-white mt-0.5">
              {user?.streakDays || 14} Consecutive Days Under Budget
            </h2>
            <p className="text-xs text-outline">
              Keep your daily volume below {formatVolume(user?.targetLitersPerDay || 140, user?.unitSystem)} today to extend your streak to {(user?.streakDays || 14) + 1} days.
            </p>
          </div>
        </div>

        <div className="text-right sm:border-l sm:border-[#30353f]/60 sm:pl-6 shrink-0 w-full sm:w-auto flex sm:flex-col justify-between items-center sm:items-end">
          <span className="text-[10px] font-mono uppercase text-outline">MERIT CREDITS</span>
          <span className="text-2xl font-mono font-bold text-amber-400">1,280 PTS</span>
        </div>
      </div>

      {/* Tab: Challenges */}
      {activeTab === 'challenges' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {challenges.map((c) => {
              const isFinished = c.percentage >= 100 || c.daysMet >= c.totalDays;

              return (
                <div
                  key={c.id}
                  className="bg-surface-container border border-[#30353f]/60 rounded-xl p-5 flex flex-col justify-between hover:border-primary/40 transition-all group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono tracking-wider text-primary uppercase bg-primary/10 border border-primary/20 px-2 py-0.5 rounded">
                        {c.sprintNumber} • {c.category.toUpperCase()}
                      </span>
                      <span className="text-xs font-mono text-outline">
                        {c.endsInText}
                      </span>
                    </div>

                    <h3 className="text-base font-headline font-bold text-white group-hover:text-primary transition-colors">
                      {c.title}
                    </h3>
                    <p className="text-xs text-outline mt-1 leading-relaxed">
                      {c.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="mt-4 mb-2">
                      <div className="flex justify-between text-xs font-mono mb-1">
                        <span className="text-outline">Day Progress</span>
                        <span className="text-white font-bold">{c.daysMet} / {c.totalDays} Days ({c.percentage}%)</span>
                      </div>
                      <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-primary to-secondary h-full rounded-full transition-all duration-500"
                          style={{ width: `${c.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Footer actions */}
                  <div className="pt-4 mt-3 border-t border-[#30353f]/40 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-amber-400 font-mono">
                      <span className="material-symbols-outlined text-sm">redeem</span>
                      <span>{c.rewardBadge} (+{c.scoreBonus})</span>
                    </div>

                    {isFinished ? (
                      <span className="px-3.5 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-medium">
                        Completed
                      </span>
                    ) : (
                      <button
                        onClick={() => completeChallengeStep(c.id)}
                        className="px-3.5 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-white border border-[#30353f]/80 text-xs font-medium cursor-pointer transition-colors"
                      >
                        Advance Day +1
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab: Badges & Achievements */}
      {activeTab === 'badges' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {badges.map((badge) => {
              const isUnlocked = badge.status === 'unlocked';

              return (
                <div
                  key={badge.id}
                  className={`p-4 rounded-xl border flex flex-col items-center text-center transition-all ${
                    isUnlocked
                      ? 'bg-surface-container border-primary/40 shadow-lg shadow-primary/5'
                      : 'bg-surface-container-lowest/50 border-[#30353f]/40 opacity-50 grayscale'
                  }`}
                >
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 border ${
                      isUnlocked
                        ? 'bg-primary/10 border-primary/30 text-primary'
                        : 'bg-surface-container-highest border-[#30353f]/60 text-outline'
                    }`}
                  >
                    <span className="material-symbols-outlined text-2xl">{badge.icon}</span>
                  </div>
                  <div className="text-xs font-headline font-bold text-white line-clamp-1">{badge.name}</div>
                  <div className="text-[10px] text-outline mt-1 line-clamp-2">{badge.description}</div>
                  <div className="mt-3 pt-2 border-t border-[#30353f]/40 w-full text-[9px] font-mono text-outline">
                    {isUnlocked ? `Unlocked ${badge.unlockedAt || 'Active'}` : 'Locked'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab: Leaderboard */}
      {activeTab === 'leaderboard' && (
        <div className="bg-surface-container border border-[#30353f]/60 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[#30353f]/40 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-headline font-semibold text-white">
                Metropolitan Watershed Leaderboard
              </h3>
              <p className="text-xs text-outline">Top conserving households ranked by composite Water Score</p>
            </div>
            <span className="text-[10px] font-mono text-primary uppercase bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
              UPDATED HOURLY
            </span>
          </div>

          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#30353f]/60 bg-surface-container-high/40 text-outline uppercase font-mono text-[10px]">
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Steward</th>
                <th className="py-3 px-4">Basin Zone</th>
                <th className="py-3 px-4">Streak</th>
                <th className="py-3 px-4 text-right">Water Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#30353f]/40 font-mono">
              {leaderboard.map((item) => (
                <tr
                  key={item.rank}
                  className={`hover:bg-surface-container-low transition-colors ${
                    item.name === user?.name ? 'bg-primary/10 border-l-2 border-primary font-bold' : ''
                  }`}
                >
                  <td className="py-3.5 px-4">
                    <span
                      className={`w-6 h-6 rounded-full inline-flex items-center justify-center text-xs ${
                        item.rank === 1 ? 'bg-amber-400 text-black font-bold' :
                        item.rank === 2 ? 'bg-slate-300 text-black font-bold' :
                        item.rank === 3 ? 'bg-amber-700 text-white font-bold' : 'text-outline'
                      }`}
                    >
                      {item.rank}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-sans text-white">
                    {item.name} {item.name === user?.name && <span className="text-primary text-[10px] font-mono ml-1">(YOU)</span>}
                  </td>
                  <td className="py-3.5 px-4 text-outline font-sans">{item.district}</td>
                  <td className="py-3.5 px-4 text-amber-400">{item.streak} days 🔥</td>
                  <td className="py-3.5 px-4 text-right text-sm font-bold text-primary">{item.score} / 100</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
