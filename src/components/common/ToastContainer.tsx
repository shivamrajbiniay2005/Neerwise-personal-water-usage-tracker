import React from 'react';
import { useWater } from '../../context/WaterContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useWater();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const borderColors = {
          success: 'border-[#00f0ff]/50 bg-[#161c25]/95 text-[#dee2f0]',
          info: 'border-[#94ccff]/50 bg-[#161c25]/95 text-[#dee2f0]',
          warning: 'border-[#ffb4ab]/50 bg-[#161c25]/95 text-[#dee2f0]',
          error: 'border-[#ffb4ab] bg-[#93000a]/90 text-[#ffdad6]',
        }[toast.type || 'success'];

        const iconColors = {
          success: 'text-[#00f0ff]',
          info: 'text-[#94ccff]',
          warning: 'text-[#ffb4ab]',
          error: 'text-[#ffdad6]',
        }[toast.type || 'success'];

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-xl border shadow-2xl backdrop-blur-xl flex items-start gap-3 transition-all animate-in fade-in slide-in-from-bottom-3 duration-200 ${borderColors}`}
          >
            <span className={`material-symbols-outlined text-[20px] mt-0.5 shrink-0 ${iconColors}`}>
              {toast.icon || 'verified'}
            </span>
            <div className="flex-1 min-w-0">
              <div className="font-['Space_Grotesk'] text-sm font-semibold tracking-tight text-[#dbfcff]">
                {toast.title}
              </div>
              <div className="font-['Hanken_Grotesk'] text-xs text-[#b9cacb] mt-0.5 leading-snug">
                {toast.message}
              </div>
            </div>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="text-[#849495] hover:text-[#dee2f0] transition-colors p-1 -mr-1 -mt-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        );
      })}
    </div>
  );
};
