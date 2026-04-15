import React from 'react';
import { Fish, LogOut, ChevronRight, Home, Activity, User } from 'lucide-react';

const ProfilePage = ({ onNavigate }) => {
  const user = {
    initials: 'JN',
    name: 'Jan Novák',
    email: 'jan.novak@email.cz'
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-white p-5 pb-24 font-sans relative">
      
      {/* Шапка */}
      <header className="mb-8 flex items-center justify-center py-2 relative">
        <h1 className="text-xl font-bold">Profil</h1>
      </header>

      {/* Інформація користувача */}
      <div className="flex flex-col items-center mb-10 text-center">
        <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mb-4 shadow-lg">
          {user.initials}
        </div>
        <h2 className="text-xl font-semibold">{user.name}</h2>
        <p className="text-gray-400 text-sm">{user.email}</p>
      </div>

      {/* Меню */}
      <div className="flex flex-col gap-4">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-2">Akvárium</p>
        <button 
          className="w-full flex items-center bg-[#111827] border border-gray-800 p-4 rounded-xl active:bg-gray-800 transition-colors mb-4" 
          onClick={() => onNavigate('aquarium')}
        >
          <Fish size={22} className="text-blue-500 mr-4" />
          <span className="flex-1 text-left font-medium">Správa akvária</span>
          <ChevronRight size={20} className="text-gray-600" />
        </button>

        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-2 mt-2">Uživatel</p>
        <button 
          className="w-full flex items-center bg-[#111827] border border-gray-800 p-4 rounded-xl active:bg-gray-800 transition-colors mb-4" 
          onClick={() => alert('Odhlášení')}
        >
          <LogOut size={22} className="text-orange-500 mr-4" />
          <span className="flex-1 text-left font-medium text-orange-500">Odhlásit</span>
        </button>
      </div>

      {/* Нижня навігація */}
      <nav className="fixed bottom-0 left-0 w-full bg-[#0B1120] border-t border-gray-800 flex justify-around py-3 px-2 pb-6 z-50">
        <div className="flex flex-col items-center text-gray-600 cursor-pointer transition-colors">
          <Home size={24} />
          <span className="text-[10px] mt-1 font-bold">Přehled</span>
        </div>
        <div className="flex flex-col items-center text-gray-600 cursor-pointer transition-colors">
          <Activity size={24} />
          <span className="text-[10px] mt-1 font-bold">Grafy</span>
        </div>
        <div className="flex flex-col items-center text-blue-500 cursor-pointer transition-colors">
          <User size={24} />
          <span className="text-[10px] mt-1 font-bold">Profil</span>
        </div>
      </nav>
    </div>
  );
};

export default ProfilePage;