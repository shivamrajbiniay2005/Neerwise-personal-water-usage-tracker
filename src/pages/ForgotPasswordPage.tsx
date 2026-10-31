import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ForgotPasswordPage: React.FC = () => {
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState('chief.operator@facility.eco');
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await requestPasswordReset(email);
      if (res.success) {
        setConfirmationMessage(res.message);
      } else {
        setError(res.message);
      }
    } catch {
      setError('Unable to dispatch recovery key at this time.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0e141d] font-['Hanken_Grotesk'] text-[#dee2f0] antialiased flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#00f0ff]/10 rounded-full blur-3xl pointer-events-none"></div>

      <main className="w-full max-w-md bg-[#161c25]/90 backdrop-blur-xl border border-[#30353f]/60 rounded-2xl p-6 sm:p-8 shadow-2xl relative z-10">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="relative w-16 h-16 mb-3 rounded-2xl bg-[#252a34]/70 border border-[#30353f] shadow-lg flex items-center justify-center p-1">
            <img
              src="/assets/aistudio/Image_1_1a05da32.jpeg"
              alt="Neerwise Logo"
              className="w-full h-full object-contain rounded-xl"
            />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#30353f]/60 text-[#94ccff] font-['JetBrains_Mono'] text-[11px] uppercase tracking-wider mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-ping"></span>
            <span>Security Credential Recovery</span>
          </div>

          <h1 className="font-['Space_Grotesk'] text-2xl font-bold text-[#dbfcff] tracking-tight">
            Recover Access Token
          </h1>
          <p className="font-['Hanken_Grotesk'] text-xs text-[#b9cacb] max-w-xs mt-1">
            Re-authorize your node cryptographic key and reset your hydro-telemetry access credentials.
          </p>
        </div>

        {confirmationMessage ? (
          <div className="flex flex-col gap-4 text-center animate-in fade-in duration-300">
            <div className="p-4 rounded-xl bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-left">
              <div className="flex items-center gap-2 text-[#00f0ff] font-['Space_Grotesk'] font-semibold text-sm mb-1">
                <span className="material-symbols-outlined text-[20px]">mark_email_read</span>
                <span>Recovery Token Dispatched</span>
              </div>
              <p className="text-xs text-[#dee2f0] leading-relaxed">
                {confirmationMessage}
              </p>
              <div className="mt-3 pt-3 border-t border-[#00f0ff]/20 font-['JetBrains_Mono'] text-[11px] text-[#89f5e7]">
                Node ID: #VNC-104-T (Temporary Re-entry Active)
              </div>
            </div>

            <p className="text-xs text-[#b9cacb]">
              Did not receive the recovery transmission?{' '}
              <button
                type="button"
                onClick={() => setConfirmationMessage(null)}
                className="text-[#00f0ff] hover:underline font-semibold"
              >
                Try another email
              </button>
            </p>

            <Link
              to="/login"
              className="w-full mt-2 py-2.5 px-4 rounded-lg bg-[#252a34] hover:bg-[#30353f] text-[#dbfcff] font-['Space_Grotesk'] text-sm font-semibold transition-all inline-flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              <span>Return to Sign In</span>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="p-3 rounded-lg bg-[#93000a]/20 border border-[#ffb4ab]/40 text-[#ffb4ab] text-xs flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">error</span>
                <span>{error}</span>
              </div>
            )}

            <div className="flex flex-col gap-1">
              <label htmlFor="recovery-email" className="font-['JetBrains_Mono'] text-[11px] uppercase text-[#b9cacb] flex items-center justify-between">
                <span>Telemetry ID / Registered Email</span>
              </label>
              <div className="relative flex items-center bg-[#090e17]/80 border border-[#30353f] rounded-lg focus-within:border-[#00f0ff] transition-colors">
                <span className="material-symbols-outlined text-[#849495] ml-3 select-none text-[18px]">mail</span>
                <input
                  id="recovery-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="chief.operator@facility.eco"
                  required
                  className="w-full bg-transparent px-3 py-2.5 text-[#dee2f0] text-sm focus:outline-none placeholder-[#849495]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-lg font-['Space_Grotesk'] text-sm text-[#00363a] font-bold bg-gradient-to-r from-[#00f0ff] to-[#0378b7] shadow-[0_0_24px_rgba(0,240,255,0.35)] hover:shadow-[0_0_32px_rgba(0,240,255,0.6)] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <span className="material-symbols-outlined text-[18px] animate-spin">refresh</span>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">send</span>
                  <span>Dispatch Recovery Key</span>
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <Link to="/login" className="text-xs text-[#b9cacb] hover:text-[#00f0ff] transition-colors inline-flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">arrow_back</span>
                <span>Back to Sign In</span>
              </Link>
            </div>
          </form>
        )}
      </main>
    </div>
  );
};
