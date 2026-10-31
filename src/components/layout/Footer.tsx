import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#090e17] border-t border-[#30353f]/40 shadow-[0_1px_8px_rgba(0,0,0,0.04)] mt-auto">
      <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-12 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link to="/about" className="flex items-center gap-2">
            <span className="font-['Space_Grotesk'] text-lg font-bold text-[#dbfcff]">Neerwise</span>
            <span className="text-[#b9cacb] font-['Hanken_Grotesk'] text-sm">Telemetry Platform</span>
          </Link>
          <span className="hidden sm:inline text-[#3b494b]">•</span>
          <span className="hidden sm:inline text-xs text-[#849495] font-['JetBrains_Mono']">
            ISO 46001 Calibrated
          </span>
        </div>

        <div className="flex items-center gap-6 font-['Hanken_Grotesk'] text-sm text-[#b9cacb]">
          <Link to="/about" className="hover:text-[#00f0ff] transition-colors">
            About
          </Link>
          <Link to="/settings" className="hover:text-[#00f0ff] transition-colors">
            Security
          </Link>
          <Link to="/analytics" className="hover:text-[#00f0ff] transition-colors">
            Compliance Metrics
          </Link>
          <Link to="/tracker" className="hover:text-[#00f0ff] transition-colors">
            Audit Ledger
          </Link>
        </div>

        <div className="font-['JetBrains_Mono'] text-[11px] text-[#849495]">
          © 2025 Neerwise Systems Inc. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
