import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useWater } from '../../context/WaterContext';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { setQuickLogModalOpen } = useWater();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Water Usage Tracker', path: '/tracker' },
    { name: 'Analytics & Insights', path: '/analytics' },
    { name: 'Water Saving Coach', path: '/coach' },
    { name: 'Challenges & Achievements', path: '/challenges' },
    { name: 'Profile', path: '/profile' },
    { name: 'Settings', path: '/settings' },
    { name: 'About Neerwise', path: '/about' },
  ];

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#090e17]/85 backdrop-blur-xl border-b border-[#30353f]/40 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-20 w-full px-4 sm:px-6 lg:px-12 flex items-center justify-between gap-4">
        {/* Brand Crest & Wordmark */}
        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-full overflow-hidden flex items-center justify-center p-0.5 bg-gradient-to-tr from-[#00f0ff]/30 to-transparent">
              <img
                src="/assets/aistudio/Image_1_1a05da32.jpeg"
                alt="Neerwise Logo"
                className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-['Space_Grotesk'] text-lg font-bold tracking-tight text-[#dbfcff]">
                Neerwise
              </span>
              <span className="font-['JetBrains_Mono'] text-[10px] text-[#b9cacb] uppercase tracking-wider hidden sm:inline-block">
                Know Your Water. Save Every Drop.
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `px-3 py-1.5 font-['Hanken_Grotesk'] text-sm rounded-lg transition-all ${
                    isActive
                      ? 'bg-[#00f0ff] text-[#00363a] font-semibold shadow-[0_0_12px_rgba(0,240,255,0.35)]'
                      : 'text-[#b9cacb] hover:text-[#dee2f0] hover:bg-[#252a34]'
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center gap-3">
          {/* Grid Sync Active Status Pill */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#161c25] border border-[#30353f]/40 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-pulse"></span>
            <span className="font-['JetBrains_Mono'] text-[11px] text-[#7df4ff] uppercase tracking-wider">
              Grid Sync Active
            </span>
          </div>

          {/* Quick Log Button */}
          <button
            type="button"
            onClick={() => setQuickLogModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#00f0ff] text-[#00363a] font-['Space_Grotesk'] text-xs font-semibold hover:bg-[#00dbe9] transition-all shadow-[0_0_16px_rgba(0,240,255,0.3)] active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">water_drop</span>
            <span>Quick Log</span>
          </button>

          {/* User Profile Avatar Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="w-9 h-9 rounded-full bg-[#dbfcff] text-[#00363a] flex items-center justify-center font-bold hover:ring-2 hover:ring-[#00f0ff] transition-all cursor-pointer"
              title={user?.name || 'User Profile'}
            >
              {user?.name ? (
                <span className="font-['Space_Grotesk'] text-sm">
                  {user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                </span>
              ) : (
                <span className="material-symbols-outlined text-[18px]">person</span>
              )}
            </button>

            {profileDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-64 rounded-xl bg-[#161c25] border border-[#30353f] shadow-2xl p-2 z-50 text-left font-['Hanken_Grotesk']"
                onClick={() => setProfileDropdownOpen(false)}
              >
                <div className="p-3 border-b border-[#30353f]/60 mb-1">
                  <div className="font-semibold text-[#dee2f0] text-sm truncate">{user?.name}</div>
                  <div className="text-xs text-[#b9cacb] font-mono truncate">{user?.email}</div>
                  <div className="mt-1 text-[11px] text-[#00f0ff] font-mono">{user?.hardwareNode || '#VNC-104-T'}</div>
                </div>
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-3 py-2 text-sm text-[#b9cacb] hover:text-[#dee2f0] hover:bg-[#252a34] rounded-lg transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">account_circle</span>
                  <span>View Profile & Quotas</span>
                </Link>
                <Link
                  to="/settings"
                  className="flex items-center gap-2 px-3 py-2 text-sm text-[#b9cacb] hover:text-[#dee2f0] hover:bg-[#252a34] rounded-lg transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">tune</span>
                  <span>Platform Settings</span>
                </Link>
                <div className="my-1 border-t border-[#30353f]/60"></div>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#ffb4ab] hover:bg-[#93000a]/20 rounded-lg transition-colors text-left cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-lg bg-[#161c25] text-[#dee2f0] hover:bg-[#252a34] transition-colors cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            <span className="material-symbols-outlined text-[22px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-[#30353f]/60 bg-[#090e17]/95 px-4 py-3 flex flex-col gap-1 max-h-[calc(100vh-5rem)] overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `px-3 py-2.5 font-['Hanken_Grotesk'] text-sm rounded-lg transition-all flex items-center justify-between ${
                  isActive
                    ? 'bg-[#00f0ff] text-[#00363a] font-semibold'
                    : 'text-[#b9cacb] hover:text-[#dee2f0] hover:bg-[#252a34]'
                }`
              }
            >
              <span>{item.name}</span>
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </NavLink>
          ))}
          <div className="pt-2 border-t border-[#30353f]/40 flex items-center justify-between">
            <span className="text-xs text-[#b9cacb] font-mono">Demo Telemetry Mode Active</span>
            <button
              type="button"
              onClick={handleSignOut}
              className="text-xs text-[#ffb4ab] hover:underline"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
