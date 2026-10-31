import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { QuickLogModal } from '../common/QuickLogModal';
import { ToastContainer } from '../common/ToastContainer';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0e141d] text-[#dee2f0] flex flex-col font-['Hanken_Grotesk'] relative selection:bg-[#00f0ff] selection:text-[#00363a]">
      {/* Shared Ambient Glow Backdrops */}
      <div className="fixed -top-40 left-1/4 w-96 h-96 bg-[#00f0ff]/8 rounded-full blur-[140px] pointer-events-none -z-10"></div>
      <div className="fixed top-96 right-10 w-80 h-80 bg-[#0378b7]/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>

      <Navbar />

      <main className="w-full pt-20 flex-1 flex flex-col">
        <Outlet />
      </main>

      <Footer />
      <QuickLogModal />
      <ToastContainer />
    </div>
  );
};
