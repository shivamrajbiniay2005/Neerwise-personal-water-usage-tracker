import React, { useState } from 'react';
import { useWater } from '../../context/WaterContext';
import { FixtureCategory } from '../../types/water';
import { getCategoryDetails } from '../../utils/waterScore';

export const QuickLogModal: React.FC = () => {
  const { quickLogModalOpen, setQuickLogModalOpen, addEntry } = useWater();

  const [category, setCategory] = useState<FixtureCategory>('bathing');
  const [volume, setVolume] = useState<number>(25);
  const [locationNode, setLocationNode] = useState('node-02');
  const [verificationLevel, setVerificationLevel] = useState<'sensor' | 'manual' | 'appliance' | 'aerator'>('sensor');
  const [timestamp, setTimestamp] = useState(() => new Date().toISOString().slice(0, 16));
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!quickLogModalOpen) return null;

  const categories: { id: FixtureCategory; label: string; desc: string; icon: string }[] = [
    { id: 'bathing', label: 'Bathing / Shower', desc: 'Eco aerated standard', icon: 'shower' },
    { id: 'laundry', label: 'Washing Clothes', desc: 'Cold Eco 45L cycle', icon: 'local_laundry_service' },
    { id: 'kitchen', label: 'Dishwashing', desc: 'EnergyStar Machine / Hand', icon: 'countertops' },
    { id: 'sanitary', label: 'Toilet Flushing', desc: 'Dual Flush Half / Full', icon: 'wc' },
    { id: 'garden', label: 'Balcony & Garden', desc: 'Drip timer / Sprayer', icon: 'yard' },
    { id: 'cleaning', label: 'Cleaning & Mop', desc: 'Bucket mop & wipe down', icon: 'mop' },
    { id: 'custom', label: 'Acoustic Anomaly', desc: 'Investigate micro-leak', icon: 'warning' },
  ];

  const locationNodes = [
    { id: 'node-02', name: 'Master Bath (Node #02)' },
    { id: 'node-03', name: 'Kitchen Gateway Sink (Node #03)' },
    { id: 'node-01', name: 'Utility Room (Node #01)' },
    { id: 'node-05', name: 'Guest Powder Room (Node #05)' },
    { id: 'node-06', name: 'Balcony Zone (Node #06)' },
    { id: 'node-ext', name: 'External Garden Sprinkler (Node #07)' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const categoryDetail = getCategoryDetails(category);
    const selectedNodeObj = locationNodes.find((n) => n.id === locationNode);

    setTimeout(() => {
      addEntry({
        category,
        categoryName: categoryDetail.name,
        volumeLiters: Number(volume),
        timestamp: new Date(timestamp).toISOString(),
        locationNode,
        locationNodeName: selectedNodeObj ? selectedNodeObj.name : 'Primary Gateway',
        verificationLevel,
        flowRateDuration: `${volume > 30 ? 'Heavy flow' : 'Standard flow'} session`,
        note: note.trim() || undefined,
      });

      setIsSubmitting(false);
      setQuickLogModalOpen(false);
      // Reset form defaults
      setVolume(25);
      setNote('');
    }, 350);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#090e17]/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) setQuickLogModalOpen(false);
      }}
    >
      <div className="w-full max-w-xl bg-[#161c25] border border-[#30353f] rounded-2xl shadow-[0_0_50px_rgba(0,240,255,0.15)] p-6 my-8 flex flex-col gap-5 text-[#dee2f0] relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#30353f]/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#00f0ff]/20 text-[#00f0ff] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">water_drop</span>
            </div>
            <div>
              <h2 className="font-['Space_Grotesk'] text-lg font-semibold text-[#dbfcff]">
                Record Telemetry Entry
              </h2>
              <p className="font-['Hanken_Grotesk'] text-xs text-[#b9cacb]">
                Real-time acoustic flow logging or manual fixture consumption
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setQuickLogModalOpen(false)}
            className="w-8 h-8 rounded-lg bg-[#1a2029] hover:bg-[#252a34] text-[#b9cacb] hover:text-[#dee2f0] flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Category Selector */}
          <div className="flex flex-col gap-2">
            <label className="font-['JetBrains_Mono'] text-[11px] text-[#b9cacb] uppercase tracking-wider">
              1. Select Fixture Category & Operating Mode
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {categories.map((cat) => {
                const isActive = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`p-2.5 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#00f0ff]/15 border-[#00f0ff] text-[#dbfcff] shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                        : 'bg-[#1a2029] border-[#30353f]/60 hover:bg-[#252a34] text-[#b9cacb]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`material-symbols-outlined text-[20px] ${isActive ? 'text-[#00f0ff]' : 'text-[#849495]'}`}>
                        {cat.icon}
                      </span>
                      <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-[#00f0ff]' : 'bg-transparent'}`}></span>
                    </div>
                    <span className="font-['Space_Grotesk'] text-xs font-semibold">{cat.label}</span>
                    <span className="text-[10px] text-[#849495] truncate">{cat.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Volume Input & Presets */}
          <div className="p-4 rounded-xl bg-[#1a2029] border border-[#30353f]/60 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <label htmlFor="modal-vol-input" className="font-['JetBrains_Mono'] text-[11px] text-[#b9cacb] uppercase tracking-wider">
                2. Calibrated Estimated / Metered Volume
              </label>
              <div className="flex items-center gap-1">
                {[6, 15, 25, 60].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setVolume(val)}
                    className="px-2 py-0.5 rounded bg-[#252a34] hover:bg-[#343944] text-[#00f0ff] font-['JetBrains_Mono'] text-[10px] transition-colors cursor-pointer"
                  >
                    {val}L
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              <div className="sm:col-span-8 flex flex-col gap-1">
                <input
                  type="range"
                  min="1"
                  max="250"
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="w-full h-2 bg-[#30353f] rounded-lg appearance-none cursor-pointer accent-[#00f0ff]"
                />
                <div className="flex justify-between font-['JetBrains_Mono'] text-[10px] text-[#849495]">
                  <span>1 L (Rinse)</span>
                  <span>125 L (Heavy)</span>
                  <span>250 L (Bulk)</span>
                </div>
              </div>
              <div className="sm:col-span-4 flex items-center justify-end relative">
                <input
                  id="modal-vol-input"
                  type="number"
                  min="1"
                  max="500"
                  step="0.5"
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="w-full bg-[#161c25] border border-[#30353f] px-3 py-2 rounded-lg font-['JetBrains_Mono'] text-xl text-[#00f0ff] text-right font-bold focus:outline-none focus:border-[#00f0ff]"
                />
                <span className="absolute right-3 font-['JetBrains_Mono'] text-xs text-[#849495] pointer-events-none">
                  L
                </span>
              </div>
            </div>
          </div>

          {/* Node, Verification & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="font-['JetBrains_Mono'] text-[11px] text-[#b9cacb] uppercase tracking-wider">
                Location Node
              </label>
              <select
                value={locationNode}
                onChange={(e) => setLocationNode(e.target.value)}
                className="bg-[#1a2029] border border-[#30353f] px-3 py-2 rounded-lg text-sm text-[#dee2f0] focus:outline-none focus:border-[#00f0ff]"
              >
                {locationNodes.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-['JetBrains_Mono'] text-[11px] text-[#b9cacb] uppercase tracking-wider">
                Verification Source
              </label>
              <select
                value={verificationLevel}
                onChange={(e) => setVerificationLevel(e.target.value as any)}
                className="bg-[#1a2029] border border-[#30353f] px-3 py-2 rounded-lg text-sm text-[#dee2f0] focus:outline-none focus:border-[#00f0ff]"
              >
                <option value="sensor">Acoustic Smart Sensor Sync</option>
                <option value="manual">Manual User Observation</option>
                <option value="appliance">Smart Appliance Telemetry</option>
                <option value="aerator">Certified Aerated Flow Spec</option>
              </select>
            </div>

            <div className="flex flex-col gap-1 sm:col-span-2">
              <label className="font-['JetBrains_Mono'] text-[11px] text-[#b9cacb] uppercase tracking-wider">
                Timestamp
              </label>
              <input
                type="datetime-local"
                value={timestamp}
                onChange={(e) => setTimestamp(e.target.value)}
                className="bg-[#1a2029] border border-[#30353f] px-3 py-2 rounded-lg text-sm text-[#dee2f0] focus:outline-none focus:border-[#00f0ff]"
              />
            </div>

            <div className="flex flex-col gap-1 sm:col-span-2">
              <label className="font-['JetBrains_Mono'] text-[11px] text-[#b9cacb] uppercase tracking-wider">
                Stewardship Annotations / Notes
              </label>
              <input
                type="text"
                placeholder="e.g. Aerator attachment verified active, 5.2 L/min restrictor in place"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="bg-[#1a2029] border border-[#30353f] px-3 py-2 rounded-lg text-sm text-[#dee2f0] focus:outline-none focus:border-[#00f0ff] placeholder-[#849495]"
              />
            </div>
          </div>

          {/* Dynamic Forecast Bar */}
          <div className="p-3 rounded-lg bg-[#1a2029] border border-[#30353f]/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#00f0ff] text-[18px]">auto_awesome</span>
              <span className="font-['Hanken_Grotesk'] text-xs text-[#b9cacb]">
                {volume <= 30
                  ? 'Entries under 30L preserve daily conservation bonus'
                  : volume <= 65
                  ? 'Balanced consumption cycle within municipal baseline'
                  : 'High volume draws down remaining safe allowance'}
              </span>
            </div>
            <span
              className={`font-['JetBrains_Mono'] text-xs font-bold px-2 py-0.5 rounded-full ${
                volume <= 30
                  ? 'bg-[#7fecde]/20 text-[#89f5e7]'
                  : volume <= 65
                  ? 'bg-[#94ccff]/20 text-[#94ccff]'
                  : 'bg-[#ffdad6]/20 text-[#ffb4ab]'
              }`}
            >
              {volume <= 30 ? '+1.5 pts' : volume <= 65 ? '+0.5 pts' : '-2.0 pts'}
            </span>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setQuickLogModalOpen(false)}
              className="px-4 py-2 rounded-lg text-sm text-[#b9cacb] hover:text-[#dee2f0] hover:bg-[#252a34] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-lg bg-[#00f0ff] text-[#00363a] font-['Space_Grotesk'] text-sm font-semibold hover:bg-[#00dbe9] shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined text-[18px] animate-spin">refresh</span>
                  <span>Committing to Grid...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">done_all</span>
                  <span>Record Telemetry Entry</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
