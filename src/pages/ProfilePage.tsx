import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWater } from '../context/WaterContext';
import { formatVolume, getScoreRating } from '../utils/waterScore';

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { waterScore, badges, showToast } = useWater();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [title, setTitle] = useState(user?.title || '');
  const [email, setEmail] = useState(user?.email || '');
  const [householdSize, setHouseholdSize] = useState(user?.householdSize?.toString() || '2');
  const [residenceType, setResidenceType] = useState(user?.residenceType || 'apt');
  const [targetLiters, setTargetLiters] = useState(user?.targetLitersPerDay?.toString() || '140');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const rating = getScoreRating(waterScore.score);
  const unlockedBadges = badges.filter((b) => b.status === 'unlocked');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedTarget = parseFloat(targetLiters);
    const parsedSize = parseInt(householdSize, 10);

    if (!name.trim()) {
      setStatusMessage('Name cannot be empty.');
      return;
    }

    const typeName = residenceType === 'apt' ? 'Urban Apartment' : residenceType === 'single' ? 'Single Family Residence' : 'Eco-Dwelling';

    updateUser({
      name: name.trim(),
      title: title.trim(),
      email: email.trim(),
      householdSize: isNaN(parsedSize) || parsedSize < 1 ? 1 : parsedSize,
      residenceType: residenceType as any,
      residenceTypeName: typeName,
      targetLitersPerDay: isNaN(parsedTarget) || parsedTarget < 30 ? 140 : parsedTarget,
    });

    setIsEditing(false);
    setStatusMessage('Profile information successfully calibrated.');
    showToast('Profile Calibrated', 'Household parameters successfully updated', 'success');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#30353f]/30">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono tracking-widest uppercase text-primary">
              HYDROLOGIC CREDENTIALS & HOUSEHOLD IDENTITY
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-headline font-bold text-white tracking-tight">
            User Profile
          </h1>
          <p className="text-sm text-outline mt-1">
            Manage your personal stewardship identity, household size, and daily volumetric benchmarks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-container border border-[#30353f] hover:border-primary/50 text-white text-xs font-semibold cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-sm">edit</span>
              <span>Edit Profile Parameters</span>
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-lg bg-surface-container-high text-outline hover:text-white text-xs cursor-pointer transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {statusMessage && (
        <div className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">check_circle</span>
            <span>{statusMessage}</span>
          </div>
          <button onClick={() => setStatusMessage(null)} className="text-outline hover:text-white">
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}

      {/* Profile Overview Card */}
      <div className="bg-surface-container border border-[#30353f]/60 rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar */}
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-primary to-secondary p-1 flex items-center justify-center shadow-xl">
              <div className="w-full h-full rounded-[14px] bg-surface-container-lowest flex items-center justify-center overflow-hidden">
                <span className="text-3xl font-mono font-bold text-primary">
                  {user?.name.slice(0, 2).toUpperCase() || 'NW'}
                </span>
              </div>
            </div>
            <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-surface-container flex items-center justify-center text-black" title="Telemetry Verified">
              <span className="material-symbols-outlined text-[13px] font-bold">verified</span>
            </span>
          </div>

          {/* User Details */}
          <div className="flex-1 text-center md:text-left space-y-1.5">
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-headline font-bold text-white">
                {user?.name}
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 self-center md:self-auto uppercase">
                {user?.role || 'Principal Steward'}
              </span>
            </div>
            <p className="text-xs text-outline font-mono">
              {user?.email} • {user?.title || 'Certified Conservation Analyst'}
            </p>
            <p className="text-xs text-outline/80 mt-2 max-w-xl">
              Resident of <strong className="text-white">{user?.residenceTypeName || 'Urban Apartment'}</strong> with <strong className="text-white">{user?.householdSize || 2} household occupants</strong>. Calibrated to sovereign baseline target of <strong className="text-primary">{formatVolume(user?.targetLitersPerDay || 140, user?.unitSystem)}/day</strong>.
            </p>
          </div>

          {/* Score Snapshot Mini Box */}
          <div className="bg-[#090e17] border border-[#30353f]/60 rounded-xl p-4 text-center shrink-0 w-full sm:w-auto">
            <div className="text-[10px] font-mono uppercase text-outline">CURRENT WATER SCORE</div>
            <div className="text-3xl font-mono font-bold text-white my-1" style={{ color: rating.color }}>
              {waterScore.score}
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded border" style={{ borderColor: `${rating.color}50`, color: rating.color }}>
              GRADE {rating.grade} • {rating.label.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Edit Form or Read-Only Parameter Grid */}
      {isEditing ? (
        <form onSubmit={handleSave} className="bg-surface-container border border-[#30353f]/60 rounded-xl p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#30353f]/40">
            <h3 className="text-base font-headline font-semibold text-white">
              Edit Household & Target Calibration
            </h3>
            <span className="text-xs text-outline font-mono">Changes recalculate scoring metrics immediately</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-outline mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-surface-container-lowest border border-[#30353f]/60 rounded-lg text-white text-sm focus:outline-none focus:border-primary"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-outline mb-1.5">
                Professional Title / Role
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-surface-container-lowest border border-[#30353f]/60 rounded-lg text-white text-sm focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-outline mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-surface-container-lowest border border-[#30353f]/60 rounded-lg text-white text-sm focus:outline-none focus:border-primary"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-outline mb-1.5">
                Household Occupants
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={householdSize}
                onChange={(e) => setHouseholdSize(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-surface-container-lowest border border-[#30353f]/60 rounded-lg text-white text-sm focus:outline-none focus:border-primary font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-outline mb-1.5">
                Residence Classification
              </label>
              <select
                value={residenceType}
                onChange={(e) => setResidenceType(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-surface-container-lowest border border-[#30353f]/60 rounded-lg text-white text-sm focus:outline-none focus:border-primary"
              >
                <option value="apt">Urban Apartment / Flat</option>
                <option value="single">Single Family Residence</option>
                <option value="eco">High-Efficiency Eco-Dwelling</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-outline mb-1.5">
                Daily Target Allowance (Liters)
              </label>
              <input
                type="number"
                min="30"
                max="1000"
                value={targetLiters}
                onChange={(e) => setTargetLiters(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-surface-container-lowest border border-[#30353f]/60 rounded-lg text-white text-sm focus:outline-none focus:border-primary font-mono"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#30353f]/40">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-lg text-xs text-outline hover:text-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-primary text-[#00344f] font-semibold text-xs hover:opacity-90 shadow-md cursor-pointer"
            >
              Save Calibration
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-surface-container border border-[#30353f]/60 rounded-xl p-4">
            <div className="text-[11px] font-mono text-outline uppercase mb-1">OCCUPANCY METRIC</div>
            <div className="text-xl font-mono font-bold text-white">{user?.householdSize || 2} Persons</div>
            <div className="text-xs text-outline mt-1">Allocation: ~{Math.round((user?.targetLitersPerDay || 140) / (user?.householdSize || 2))}L per capita</div>
          </div>

          <div className="bg-surface-container border border-[#30353f]/60 rounded-xl p-4">
            <div className="text-[11px] font-mono text-outline uppercase mb-1">RESIDENCE PROFILE</div>
            <div className="text-xl font-mono font-bold text-white">{user?.residenceTypeName || 'Urban Apartment'}</div>
            <div className="text-xs text-outline mt-1">Smart telemetry enabled</div>
          </div>

          <div className="bg-surface-container border border-[#30353f]/60 rounded-xl p-4">
            <div className="text-[11px] font-mono text-outline uppercase mb-1">SOVEREIGN TARGET</div>
            <div className="text-xl font-mono font-bold text-primary">{formatVolume(user?.targetLitersPerDay || 140, user?.unitSystem)}/day</div>
            <div className="text-xs text-outline mt-1">Strictness: {user?.strictness || 'Nominal'}</div>
          </div>
        </div>
      )}

      {/* Earned Badges Showcase */}
      <div className="bg-surface-container border border-[#30353f]/60 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-headline font-semibold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-400 text-lg">military_tech</span>
              Earned Badges & Hydro Credentials ({unlockedBadges.length})
            </h3>
            <p className="text-xs text-outline">Verified planetary stewardship accomplishments</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {unlockedBadges.map((badge) => (
            <div key={badge.id} className="p-3 rounded-lg bg-surface-container-low border border-primary/20 text-center flex flex-col items-center">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-2">
                <span className="material-symbols-outlined text-xl">{badge.icon}</span>
              </div>
              <div className="text-xs font-bold text-white truncate w-full">{badge.name}</div>
              <div className="text-[9px] font-mono text-outline mt-0.5">{badge.tier}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
