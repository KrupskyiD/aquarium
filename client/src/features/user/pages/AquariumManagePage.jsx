import React from 'react';
import { ChevronLeft, Fish, Home, Activity, User } from 'lucide-react';

const AquariumManagePage = ({ onNavigate, temp, salt }) => {
  return (
    <div className="min-h-screen bg-[#0B1120] text-white p-5 pb-24 font-sans relative">
      
      {/* Шапка */}
      <header className="mb-8 flex items-center justify-center py-2 relative">
        <button 
          className="absolute left-0 p-1 text-gray-400 active:scale-95 transition-transform" 
          onClick={() => onNavigate('profile')}
        >
          <ChevronLeft size={28} />
        </button>
        <h1 className="text-xl font-bold">Správa akvária</h1>
      </header>

      {/* Картка акваріума */}
      <div className="bg-[#111827] border border-gray-800 p-5 rounded-3xl mb-6 shadow-lg">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mr-4">
            <Fish size={24} color="white" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-white leading-tight">Hlavní nádrž</h2>
            <p className="text-xs text-gray-400 font-medium tracking-tight">250 litrů · mořské</p>
          </div>
          <span className="px-3 py-1 bg-green-500/10 text-green-500 text-[10px] font-bold rounded-full border border-green-500/20 uppercase tracking-wider">
            Online
          </span>
        </div>

        {/* Датчики */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-900/50 p-4 rounded-2xl border border-gray-800 flex flex-col items-center">
            <p className="text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-widest">Salinita</p>
            <div className="flex items-baseline text-white">
              <span className="text-2xl font-bold">{salt || '34.8'}</span>
              <span className="text-xs text-gray-400 ml-1 font-medium lowercase">ppt</span>
            </div>
          </div>
          
          <div className="bg-gray-900/50 p-4 rounded-2xl border border-gray-800 flex flex-col items-center">
            <p className="text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-widest text-center">Teplota</p>
            <div className="flex items-baseline text-white">
              <span className="text-2xl font-bold">{temp || '25.4'}</span>
              <span className="text-xs text-gray-400 ml-1 font-medium">°C</span>
            </div>
          </div>
        </div>
      </div>

      {/* Нижня навігація */}
      <nav className="fixed bottom-0 left-0 w-full bg-[#0B1120] border-t border-gray-800 flex justify-around py-3 px-2 pb-6 z-50">
        <div className="flex flex-col items-center text-gray-600 cursor-pointer transition-colors" onClick={() => onNavigate('profile')}>
          <Home size={24} />
          <span className="text-[10px] mt-1 font-bold">Přehled</span>
        </div>
        <div className="flex flex-col items-center text-gray-600 cursor-pointer transition-colors">
          <Activity size={24} />
          <span className="text-[10px] mt-1 font-bold">Grafy</span>
        </div>
        <div className="flex flex-col items-center text-blue-500 cursor-pointer transition-colors" onClick={() => onNavigate('profile')}>
          <User size={24} />
          <span className="text-[10px] mt-1 font-bold">Profil</span>
        </div>
      </nav>
    </div>
  );
};

export default AquariumManagePage;