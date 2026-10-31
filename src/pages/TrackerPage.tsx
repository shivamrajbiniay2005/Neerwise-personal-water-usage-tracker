import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWater } from '../context/WaterContext';
import { WaterEntry, FixtureCategory } from '../types/water';
import { FIXTURE_CATEGORIES, formatVolume, getCategoryDetails } from '../utils/waterScore';

export const TrackerPage: React.FC = () => {
  const { user } = useAuth();
  const {
    entries,
    addEntry,
    updateEntry,
    deleteEntry,
    waterScore,
    setQuickLogModalOpen,
  } = useWater();

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FixtureCategory | 'all'>('all');
  const [selectedDate, setSelectedDate] = useState<string>(''); // empty for all dates or YYYY-MM-DD

  // Inline Editing State
  const [editingEntry, setEditingEntry] = useState<WaterEntry | null>(null);
  const [isNewEntryOpen, setIsNewEntryOpen] = useState(false);

  // Form Fields for Add/Edit
  const [formActivity, setFormActivity] = useState('');
  const [formCategory, setFormCategory] = useState<FixtureCategory>('bathing');
  const [formLiters, setFormLiters] = useState<string>('25');
  const [formDate, setFormDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [formTime, setFormTime] = useState<string>(new Date().toTimeString().slice(0, 5));
  const [formDuration, setFormDuration] = useState<string>('5');
  const [formNotes, setFormNotes] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);

  const target = user?.targetLitersPerDay || 140;

  // Open Edit Form
  const handleStartEdit = (entry: WaterEntry) => {
    setEditingEntry(entry);
    setFormActivity(entry.categoryName);
    setFormCategory(entry.category);
    setFormLiters(entry.volumeLiters.toString());
    const d = new Date(entry.timestamp);
    setFormDate(d.toISOString().split('T')[0]);
    setFormTime(d.toTimeString().slice(0, 5));
    setFormDuration(entry.flowRateDuration ? entry.flowRateDuration.replace(/[^0-9]/g, '') : '');
    setFormNotes(entry.note || '');
    setFormError(null);
    setIsNewEntryOpen(true);
  };

  const handleStartNew = () => {
    setEditingEntry(null);
    setFormActivity('');
    setFormCategory('bathing');
    setFormLiters('25');
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormTime(new Date().toTimeString().slice(0, 5));
    setFormDuration('5');
    setFormNotes('');
    setFormError(null);
    setIsNewEntryOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedLiters = parseFloat(formLiters);
    if (!formActivity.trim()) {
      setFormError('Please provide an activity name.');
      return;
    }
    if (isNaN(parsedLiters) || parsedLiters <= 0) {
      setFormError('Please enter a valid volume greater than 0.');
      return;
    }

    const timestamp = new Date(`${formDate}T${formTime}:00`).toISOString();
    const catDetails = getCategoryDetails(formCategory);

    if (editingEntry) {
      updateEntry(editingEntry.id, {
        category: formCategory,
        categoryName: formActivity.trim(),
        volumeLiters: parsedLiters,
        timestamp,
        flowRateDuration: formDuration ? `${formDuration} min session` : undefined,
        note: formNotes.trim() || undefined,
      });
    } else {
      addEntry({
        category: formCategory,
        categoryName: formActivity.trim() || catDetails.name,
        volumeLiters: parsedLiters,
        timestamp,
        locationNode: 'node-manual',
        locationNodeName: 'Manual Entry Station',
        verificationLevel: 'manual',
        flowRateDuration: formDuration ? `${formDuration} min session` : undefined,
        note: formNotes.trim() || undefined,
      });
    }

    setIsNewEntryOpen(false);
    setEditingEntry(null);
  };

  // Filtered Entries
  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      // Category filter
      if (selectedCategory !== 'all' && entry.category !== selectedCategory) {
        return false;
      }
      // Date filter
      if (selectedDate) {
        const entryDate = new Date(entry.timestamp).toISOString().split('T')[0];
        if (entryDate !== selectedDate) return false;
      }
      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = entry.categoryName.toLowerCase().includes(q);
        const matchesNotes = entry.note?.toLowerCase().includes(q) || false;
        const matchesCategory = entry.category.toLowerCase().includes(q);
        if (!matchesName && !matchesNotes && !matchesCategory) return false;
      }
      return true;
    }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [entries, selectedCategory, selectedDate, searchQuery]);

  // Aggregate stats for filtered view
  const filteredTotalVolume = useMemo(() => {
    return filteredEntries.reduce((sum, item) => sum + item.volumeLiters, 0);
  }, [filteredEntries]);

  // Quick preset logger
  const handleQuickPreset = (preset: { label: string; category: FixtureCategory; liters: number; duration: number }) => {
    const catDetails = getCategoryDetails(preset.category);
    addEntry({
      category: preset.category,
      categoryName: preset.label,
      volumeLiters: preset.liters,
      timestamp: new Date().toISOString(),
      locationNode: 'node-preset',
      locationNodeName: catDetails.name,
      verificationLevel: 'sensor',
      flowRateDuration: `${preset.duration} min draw`,
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#30353f]/30">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono tracking-widest uppercase text-primary">
              HYDRO-TELEMETRY LOGS & FIXTURE CALIBRATION
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-headline font-bold text-white tracking-tight">
            Water Usage Tracker
          </h1>
          <p className="text-sm text-outline mt-1">
            Precision logging of domestic fixtures, flow volumes, and conservation events.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleStartNew}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-primary to-primary-container text-[#00344f] font-semibold text-sm hover:opacity-95 shadow-md shadow-primary/20 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>New Water Log</span>
          </button>
        </div>
      </div>

      {/* Quick Action Presets Bar */}
      <div className="bg-surface-container border border-[#30353f]/60 rounded-xl p-4">
        <div className="text-xs font-mono uppercase text-outline mb-3 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm text-primary">bolt</span>
            Instant Preset Injector
          </span>
          <span className="text-[10px] text-outline/70">Click to record rapid event</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {[
            { label: '5-Min Shower (Aerated)', category: 'bathing' as FixtureCategory, liters: 32, duration: 5, icon: 'shower' },
            { label: 'Dual-Flush Sanitary', category: 'sanitary' as FixtureCategory, liters: 4.5, duration: 1, icon: 'wc' },
            { label: 'Kitchen Eco Sink Wash', category: 'kitchen' as FixtureCategory, liters: 12, duration: 3, icon: 'countertops' },
            { label: 'Drip Irrigation Session', category: 'garden' as FixtureCategory, liters: 25, duration: 15, icon: 'yard' },
          ].map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickPreset(preset)}
              className="flex items-center gap-2.5 p-2.5 rounded-lg bg-surface-container-low border border-[#30353f]/40 hover:border-primary/50 hover:bg-surface-container transition-all text-left group cursor-pointer"
            >
              <div className="p-1.5 rounded-md bg-surface-container-highest text-primary group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-sm">{preset.icon}</span>
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-medium text-white truncate group-hover:text-primary transition-colors">
                  {preset.label}
                </div>
                <div className="text-[10px] font-mono text-outline">
                  {formatVolume(preset.liters, user?.unitSystem)} • {preset.duration}m
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Filter and Query Control Bar */}
      <div className="bg-surface-container border border-[#30353f]/60 rounded-xl p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-outline text-lg">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by activity, notes, or category..."
              className="w-full pl-9 pr-4 py-2 bg-surface-container-lowest border border-[#30353f]/60 rounded-lg text-white text-xs placeholder-outline/60 focus:outline-none focus:border-primary transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-outline hover:text-white"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            )}
          </div>

          {/* Date Filter */}
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-surface-container-lowest border border-[#30353f]/60 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-primary font-mono"
            />
            {selectedDate && (
              <button
                onClick={() => setSelectedDate('')}
                className="text-xs text-outline hover:text-white underline cursor-pointer"
              >
                Clear date
              </button>
            )}
          </div>
        </div>

        {/* Category Pills Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all shrink-0 cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-primary text-[#00344f] font-semibold shadow-sm'
                : 'bg-surface-container-low text-outline hover:text-white border border-[#30353f]/40'
            }`}
          >
            All Categories ({entries.length})
          </button>
          {FIXTURE_CATEGORIES.map((cat) => {
            const count = entries.filter((e) => e.category === cat.key).length;
            const isSelected = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-primary text-[#00344f] font-semibold shadow-sm'
                    : 'bg-surface-container-low text-outline hover:text-white border border-[#30353f]/40'
                }`}
              >
                <span className="material-symbols-outlined text-sm">{cat.icon}</span>
                <span>{cat.label}</span>
                <span className="opacity-70 text-[10px]">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Aggregate Banner for Filtered Results */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-surface-container-low px-4 py-3 rounded-lg border border-[#30353f]/40 text-xs">
        <div className="text-outline">
          Showing <span className="text-white font-mono font-semibold">{filteredEntries.length}</span> recorded telemetry events
          {selectedCategory !== 'all' && <span> in <span className="text-primary capitalize">{selectedCategory}</span></span>}
          {selectedDate && <span> on <span className="text-white font-mono">{selectedDate}</span></span>}
        </div>
        <div className="mt-1 sm:mt-0 font-mono text-white flex items-center gap-3">
          <span>Filtered Volume: <span className="text-primary font-bold">{formatVolume(filteredTotalVolume, user?.unitSystem)}</span></span>
          <span className="text-[#30353f]">|</span>
          <span>Today's Total: <span className="text-secondary font-bold">{formatVolume(waterScore.totalLoggedTodayLiters, user?.unitSystem)}</span> / {formatVolume(target, user?.unitSystem)}</span>
        </div>
      </div>

      {/* Entries List / Table */}
      <div className="bg-surface-container border border-[#30353f]/60 rounded-xl overflow-hidden">
        {filteredEntries.length === 0 ? (
          <div className="text-center py-16 px-4">
            <span className="material-symbols-outlined text-5xl text-outline mb-2">search_off</span>
            <h3 className="text-base font-semibold text-white">No water logs match your criteria</h3>
            <p className="text-xs text-outline mt-1 max-w-sm mx-auto">
              Try adjusting your search filters, selecting a different date, or add a new telemetry event.
            </p>
            <button
              onClick={handleStartNew}
              className="mt-4 px-4 py-2 bg-primary text-[#00344f] rounded-lg text-xs font-semibold cursor-pointer"
            >
              Log New Event
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#30353f]/60 bg-surface-container-high/40 text-outline uppercase font-mono text-[10px]">
                  <th className="py-3 px-4">Event & Fixture</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Volume ({user?.unitSystem === 'gallons' ? 'GAL' : 'L'})</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Notes</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#30353f]/40 font-sans">
                {filteredEntries.map((entry) => {
                  const catDetails = getCategoryDetails(entry.category);
                  const entryDate = new Date(entry.timestamp);

                  return (
                    <tr
                      key={entry.id}
                      className="hover:bg-surface-container-low transition-colors group"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border border-[#30353f]/60"
                            style={{ backgroundColor: `${catDetails.color}15`, color: catDetails.color }}
                          >
                            <span className="material-symbols-outlined text-base">{catDetails.icon}</span>
                          </div>
                          <div>
                            <div className="font-semibold text-white flex items-center gap-1.5">
                              <span>{entry.categoryName}</span>
                              {entry.verificationLevel === 'sensor' && (
                                <span className="text-[9px] font-mono bg-primary/10 text-primary border border-primary/20 px-1 py-0.2 rounded">
                                  AUTO
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-outline font-mono">
                              ID: {entry.id.slice(-6)} • {entry.locationNodeName}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono capitalize">
                        <span
                          className="px-2 py-0.5 rounded text-[11px] font-medium border"
                          style={{
                            borderColor: `${catDetails.color}30`,
                            backgroundColor: `${catDetails.color}10`,
                            color: catDetails.color,
                          }}
                        >
                          {entry.category}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-white text-sm">
                        {formatVolume(entry.volumeLiters, user?.unitSystem)}
                      </td>

                      <td className="py-3.5 px-4 text-outline font-mono">
                        <div>{entryDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                        <div className="text-[10px] text-outline/70">
                          {entryDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-outline font-mono">
                        {entry.flowRateDuration || '—'}
                      </td>

                      <td className="py-3.5 px-4 text-outline max-w-[200px] truncate">
                        {entry.note || <span className="text-outline/40 italic">No notes</span>}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleStartEdit(entry)}
                            className="p-1.5 text-outline hover:text-primary hover:bg-surface-container-highest rounded transition-colors cursor-pointer"
                            title="Edit entry"
                          >
                            <span className="material-symbols-outlined text-base">edit</span>
                          </button>
                          <button
                            onClick={() => deleteEntry(entry.id)}
                            className="p-1.5 text-outline hover:text-error hover:bg-surface-container-highest rounded transition-colors cursor-pointer"
                            title="Delete entry"
                          >
                            <span className="material-symbols-outlined text-base">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Entry Modal */}
      {isNewEntryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-surface-container border border-[#30353f] rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#30353f]/40 mb-5">
              <div>
                <h3 className="text-lg font-headline font-bold text-white">
                  {editingEntry ? 'Edit Telemetry Event' : 'Log New Water Event'}
                </h3>
                <p className="text-xs text-outline mt-0.5">
                  Record exact flow metrics and fixture classification
                </p>
              </div>
              <button
                onClick={() => setIsNewEntryOpen(false)}
                className="text-outline hover:text-white p-1 rounded-lg hover:bg-surface-container-high cursor-pointer"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 rounded-lg bg-error/10 border border-error/20 text-error text-xs flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">warning</span>
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveForm} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-outline mb-1.5">
                  Activity Name *
                </label>
                <input
                  type="text"
                  value={formActivity}
                  onChange={(e) => setFormActivity(e.target.value)}
                  placeholder="e.g., Master Bath Shower, Dishwasher Cycle 2"
                  className="w-full px-3.5 py-2.5 bg-surface-container-lowest border border-[#30353f]/60 rounded-lg text-white text-sm focus:outline-none focus:border-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-outline mb-1.5">
                  Category *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {FIXTURE_CATEGORIES.map((cat) => (
                    <button
                      key={cat.key}
                      type="button"
                      onClick={() => setFormCategory(cat.key)}
                      className={`p-2 rounded-lg border text-xs flex flex-col items-center gap-1 transition-all cursor-pointer ${
                        formCategory === cat.key
                          ? 'border-primary bg-primary/10 text-white font-medium'
                          : 'border-[#30353f]/60 bg-surface-container-low text-outline hover:text-white'
                      }`}
                    >
                      <span className="material-symbols-outlined text-lg">{cat.icon}</span>
                      <span className="truncate w-full text-center text-[11px]">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase text-outline mb-1.5">
                    Volume in Liters *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={formLiters}
                    onChange={(e) => setFormLiters(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-surface-container-lowest border border-[#30353f]/60 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-primary"
                    required
                  />
                  {user?.unitSystem === 'gallons' && (
                    <span className="text-[10px] text-outline font-mono mt-1 block">
                      ≈ {(parseFloat(formLiters || '0') * 0.264172).toFixed(1)} Gallons
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-outline mb-1.5">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formDuration}
                    onChange={(e) => setFormDuration(e.target.value)}
                    placeholder="Optional"
                    className="w-full px-3.5 py-2.5 bg-surface-container-lowest border border-[#30353f]/60 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase text-outline mb-1.5">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-surface-container-lowest border border-[#30353f]/60 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-outline mb-1.5">
                    Time *
                  </label>
                  <input
                    type="time"
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-surface-container-lowest border border-[#30353f]/60 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-primary"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-outline mb-1.5">
                  Telemetry Notes
                </label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Optional notes regarding fixture efficiency, leaks, or adjustments"
                  className="w-full px-3.5 py-2 bg-surface-container-lowest border border-[#30353f]/60 rounded-lg text-white text-xs placeholder-outline/50 focus:outline-none focus:border-primary resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#30353f]/40">
                <button
                  type="button"
                  onClick={() => setIsNewEntryOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs text-outline hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-primary text-[#00344f] font-semibold text-xs hover:opacity-90 shadow-md cursor-pointer"
                >
                  {editingEntry ? 'Save Changes' : 'Record Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
