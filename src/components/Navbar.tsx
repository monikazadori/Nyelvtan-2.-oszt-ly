import React from 'react';
import { Sparkles, Award, Users, Volume2, VolumeX, UserPlus } from 'lucide-react';
import { StudentProfile } from '../types';
import { AVATARS } from '../data/curriculumData';
import { soundFx } from '../utils/audio';

interface NavbarProps {
  currentProfile: StudentProfile | null;
  onOpenProfileModal: () => void;
  onOpenClassReport: () => void;
  onOpenBadges: () => void;
  activeTab: 'map' | 'toto' | 'report';
  setActiveTab: (tab: 'map' | 'toto' | 'report') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentProfile,
  onOpenProfileModal,
  onOpenClassReport,
  onOpenBadges,
  activeTab,
  setActiveTab,
}) => {
  const [soundOn, setSoundOn] = React.useState(true);

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    soundFx.setSoundEnabled(next);
  };

  const currentAvatar = AVATARS.find((a) => a.id === currentProfile?.avatar) || AVATARS[0];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-amber-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Logo & App Title */}
        <div 
          onClick={() => setActiveTab('map')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-2xl bg-linear-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-md shadow-orange-200 group-hover:scale-105 transition-transform">
            <span className="text-2xl">🦔</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-lg sm:text-xl text-slate-800 tracking-tight">
                Nyelvtan Kalandor
              </h1>
              <span className={`text-xs font-black px-2 py-0.5 rounded-full border ${
                currentProfile?.className?.startsWith('3')
                  ? 'bg-indigo-100 text-indigo-700 border-indigo-200'
                  : 'bg-orange-100 text-orange-700 border-orange-200'
              }`}>
                {currentProfile?.className?.startsWith('3') ? '3. osztály (év eleji)' : '2. osztály'}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium hidden sm:block">
              {currentProfile?.className?.startsWith('3')
                ? 'Év eleji diagnosztikai ismétlés & felmérés'
                : 'NAT 2020 tananyag ismétlése játékosan'}
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center bg-slate-100 p-1 rounded-xl gap-1">
          <button
            onClick={() => setActiveTab('map')}
            className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'map'
                ? 'bg-white text-orange-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>🗺️</span>
            <span>Kalandtérkép</span>
          </button>
          <button
            onClick={() => setActiveTab('toto')}
            className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'toto'
                ? 'bg-white text-emerald-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>🎯</span>
            <span>Nyelvtani Totó</span>
          </button>
          <button
            onClick={() => setActiveTab('report')}
            className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'report'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>📊</span>
            <span>Visszajelzés</span>
          </button>
        </nav>

        {/* User Status & Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Audio toggle */}
          <button
            onClick={toggleSound}
            title={soundOn ? 'Hang kikapcsolása' : 'Hang bekapcsolása'}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-amber-100/50 rounded-xl transition-colors"
          >
            {soundOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 text-slate-400" />}
          </button>

          {/* Teacher / Class view quick button */}
          <button
            onClick={onOpenClassReport}
            title="Osztályszintű diagnosztika"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
          >
            <Users className="w-4 h-4 text-slate-500" />
            <span>Osztály riport</span>
          </button>

          {/* Badges Button */}
          <button
            onClick={onOpenBadges}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 rounded-xl text-xs font-bold transition-all shadow-2xs"
            title="Jelvényeim és elismerések"
          >
            <Award className="w-4 h-4 text-amber-500" />
            <span className="hidden sm:inline">Jelvények</span>
            <span className="bg-amber-200 text-amber-800 text-[10px] px-1.5 py-0.2 rounded-full font-black">
              {currentProfile?.unlockedBadgeIds.length || 0}
            </span>
          </button>

          {/* Profile Card / Selector */}
          {currentProfile ? (
            <button
              onClick={onOpenProfileModal}
              className="flex items-center gap-2 pl-2 pr-3 py-1 bg-linear-to-r from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100 border border-orange-200 rounded-2xl transition-all text-left shadow-2xs"
            >
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-lg border border-orange-200 shadow-2xs">
                {currentAvatar.emoji}
              </div>
              <div className="leading-tight">
                <div className="font-extrabold text-xs text-slate-800 flex items-center gap-1">
                  <span>{currentProfile.name}</span>
                  <span className="text-[10px] text-orange-600 bg-orange-100 px-1 rounded font-bold">
                    {currentProfile.className}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
                  <span className="text-amber-600 flex items-center gap-0.5">
                    <Sparkles className="w-3 h-3 fill-amber-400 text-amber-500" />
                    {currentProfile.stars}
                  </span>
                  <span className="text-emerald-600 flex items-center gap-0.5">
                    🪙 {currentProfile.coins}
                  </span>
                </div>
              </div>
            </button>
          ) : (
            <button
              onClick={onOpenProfileModal}
              className="flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-extrabold shadow-md shadow-orange-200 transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>Regisztráció</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
