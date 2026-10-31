import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWater } from '../context/WaterContext';
import { UnitSystem, StrictnessLevel } from '../types/water';

export const SettingsPage: React.FC = () => {
  const { user, updateUser, logout } = useAuth();
  const { entries, showToast, resetToDefaults, exportCsv } = useWater();
  const navigate = useNavigate();

  // Settings State
  const [unitSystem, setUnitSystem] = useState<UnitSystem>(user?.unitSystem || 'liters');
  const [strictness, setStrictness] = useState<StrictnessLevel>(user?.strictness || 'nominal');
  const [climateAutoAdjust, setClimateAutoAdjust] = useState(user?.climateAutoAdjust ?? true);
  const [dailySummary, setDailySummary] = useState(true);
  const [leakAlerts, setLeakAlerts] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(true);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      unitSystem,
      strictness,
      climateAutoAdjust,
    });
    setSavedSuccess(true);
    showToast('Preferences Saved', 'Unit and strictness settings successfully updated', 'success');
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({ user, entries }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `neerwise_telemetry_export_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Telemetry Exported', 'Dataset exported as JSON', 'info');
  };

  const handleResetDemoData = () => {
    if (window.confirm('Reset all water records to default factory demo baseline?')) {
      resetToDefaults();
      showToast('Baseline Restored', 'Reset to initial factory calibration', 'info');
    }
  };

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#30353f]/30">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono tracking-widest uppercase text-primary">
              PLATFORM CONFIGURATION & PREFERENCES
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-headline font-bold text-white tracking-tight">
            Application Settings
          </h1>
          <p className="text-sm text-outline mt-1">
            Configure telemetry units, algorithmic scoring strictness, notifications, and sovereign data portability.
          </p>
        </div>

        {savedSuccess && (
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-lg flex items-center gap-1.5 animate-fade-in">
            <span className="material-symbols-outlined text-sm">check_circle</span>
            Preferences Saved
          </span>
        )}
      </div>

      <form onSubmit={handleSavePreferences} className="space-y-8">
        {/* Measurement & Display Units */}
        <div className="bg-surface-container border border-[#30353f]/60 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#30353f]/40">
            <span className="material-symbols-outlined text-primary text-xl">straighten</span>
            <div>
              <h2 className="text-base font-headline font-semibold text-white">Measurement Standard</h2>
              <p className="text-xs text-outline">Select your preferred liquid volume units across all charts and logs</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label
              className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                unitSystem === 'liters'
                  ? 'border-primary bg-primary/10 shadow-sm'
                  : 'border-[#30353f]/60 bg-surface-container-low hover:border-primary/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="unitSystem"
                  value="liters"
                  checked={unitSystem === 'liters'}
                  onChange={() => setUnitSystem('liters')}
                  className="accent-primary"
                />
                <div>
                  <div className="text-sm font-semibold text-white">Metric Standard (Liters)</div>
                  <div className="text-xs text-outline">International standard (1 L = 0.264 Gal)</div>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-primary">L / LPCD</span>
            </label>

            <label
              className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                unitSystem === 'gallons'
                  ? 'border-primary bg-primary/10 shadow-sm'
                  : 'border-[#30353f]/60 bg-surface-container-low hover:border-primary/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="unitSystem"
                  value="gallons"
                  checked={unitSystem === 'gallons'}
                  onChange={() => setUnitSystem('gallons')}
                  className="accent-primary"
                />
                <div>
                  <div className="text-sm font-semibold text-white">Imperial (US Gallons)</div>
                  <div className="text-xs text-outline">Common in North America (1 Gal = 3.785 L)</div>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-primary">GAL</span>
            </label>
          </div>
        </div>

        {/* Algorithmic Strictness */}
        <div className="bg-surface-container border border-[#30353f]/60 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#30353f]/40">
            <span className="material-symbols-outlined text-secondary text-xl">tune</span>
            <div>
              <h2 className="text-base font-headline font-semibold text-white">Water Score Calibration Strictness</h2>
              <p className="text-xs text-outline">Adjust the mathematical penalty curve applied when exceeding baseline allowance</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                id: 'tolerant',
                title: 'Tolerant',
                factor: '0.9x penalty',
                desc: 'Gentle decay curve. Best for multi-generational homes or regional heatwaves.',
              },
              {
                id: 'nominal',
                title: 'Nominal (Standard)',
                factor: '1.0x balanced',
                desc: 'Standard hydro-conservation standard calibrated to WHO domestic baselines.',
              },
              {
                id: 'rigorous',
                title: 'Rigorous (Strict)',
                factor: '1.15x steep',
                desc: 'Zero-tolerance penalty curve for drought-declared basins and eco-zealots.',
              },
            ].map((s) => (
              <label
                key={s.id}
                className={`p-4 rounded-xl border flex flex-col justify-between cursor-pointer transition-all ${
                  strictness === s.id
                    ? 'border-secondary bg-secondary/10 shadow-sm'
                    : 'border-[#30353f]/60 bg-surface-container-low hover:border-secondary/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-white">{s.title}</span>
                    <input
                      type="radio"
                      name="strictness"
                      value={s.id}
                      checked={strictness === s.id}
                      onChange={() => setStrictness(s.id as StrictnessLevel)}
                      className="accent-secondary"
                    />
                  </div>
                  <p className="text-xs text-outline leading-relaxed">{s.desc}</p>
                </div>
                <div className="text-[10px] font-mono text-secondary mt-3 pt-2 border-t border-[#30353f]/40">
                  {s.factor}
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Telemetry & Notifications */}
        <div className="bg-surface-container border border-[#30353f]/60 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#30353f]/40">
            <span className="material-symbols-outlined text-amber-400 text-xl">notifications</span>
            <div>
              <h2 className="text-base font-headline font-semibold text-white">Telemetry Alerts & Notifications</h2>
              <p className="text-xs text-outline">Manage browser and email notifications for domestic hydro events</p>
            </div>
          </div>

          <div className="space-y-3">
            {[
              {
                title: 'Daily Water Score Digest',
                desc: 'Receive end-of-day summary of daily liters logged, budget delta, and score update',
                checked: dailySummary,
                onChange: setDailySummary,
              },
              {
                title: 'Continuous Flow & Leak Alerts',
                desc: 'Immediate warning if background acoustic sensor detects non-stop flow > 45 minutes',
                checked: leakAlerts,
                onChange: setLeakAlerts,
              },
              {
                title: 'Weekly Conservation Diagnostic',
                desc: 'Receive coach tips, fixture efficiency scores, and weekly savings potential every Monday',
                checked: weeklyReport,
                onChange: setWeeklyReport,
              },
            ].map((item, idx) => (
              <label
                key={idx}
                className="flex items-center justify-between p-3.5 rounded-lg bg-surface-container-low border border-[#30353f]/40 hover:border-primary/40 cursor-pointer transition-colors"
              >
                <div>
                  <div className="text-xs font-semibold text-white">{item.title}</div>
                  <div className="text-[11px] text-outline mt-0.5">{item.desc}</div>
                </div>
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={(e) => item.onChange(e.target.checked)}
                  className="w-4 h-4 accent-primary rounded cursor-pointer"
                />
              </label>
            ))}
          </div>
        </div>

        {/* Data Sovereignty & Account Actions */}
        <div className="bg-surface-container border border-[#30353f]/60 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#30353f]/40">
            <span className="material-symbols-outlined text-outline text-xl">security</span>
            <div>
              <h2 className="text-base font-headline font-semibold text-white">Data Sovereignty & Session Management</h2>
              <p className="text-xs text-outline">Download your complete telemetry history or safely terminate active session</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={exportCsv}
              className="p-3.5 rounded-lg bg-surface-container-low border border-[#30353f]/40 hover:border-primary/60 text-left cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2 text-primary text-xs font-semibold mb-1">
                <span className="material-symbols-outlined text-sm">download</span>
                <span>Export Telemetry (CSV)</span>
              </div>
              <div className="text-[11px] text-outline">Download all logged events in tabular CSV format</div>
            </button>

            <button
              type="button"
              onClick={handleResetDemoData}
              className="p-3.5 rounded-lg bg-surface-container-low border border-[#30353f]/40 hover:border-amber-400/60 text-left cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold mb-1">
                <span className="material-symbols-outlined text-sm">restart_alt</span>
                <span>Reset Demo Baseline</span>
              </div>
              <div className="text-[11px] text-outline">Restore mock seed data and calibration</div>
            </button>

            <button
              type="button"
              onClick={handleSignOut}
              className="p-3.5 rounded-lg bg-surface-container-low border border-[#30353f]/40 hover:border-error/60 text-left cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2 text-error text-xs font-semibold mb-1">
                <span className="material-symbols-outlined text-sm">logout</span>
                <span>Sign Out of Neerwise</span>
              </div>
              <div className="text-[11px] text-outline">Terminate session and return to login screen</div>
            </button>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-container text-[#00344f] font-headline font-bold text-sm hover:opacity-95 shadow-lg shadow-primary/20 cursor-pointer transition-all"
          >
            Save All Preferences
          </button>
        </div>
      </form>
    </div>
  );
};
