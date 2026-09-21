import React, { useState } from 'react';
import { X, UserPlus, Check, Sparkles, GraduationCap } from 'lucide-react';
import { StudentProfile } from '../types';
import { AVATARS } from '../data/curriculumData';
import { createProfile } from '../utils/storage';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  profiles: StudentProfile[];
  currentProfileId: string | null;
  onSelectProfile: (id: string) => void;
  onProfileCreated: (newProfile: StudentProfile) => void;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  profiles,
  currentProfileId,
  onSelectProfile,
  onProfileCreated,
}) => {
  const [isRegisteringNew, setIsRegisteringNew] = useState(false);
  const [name, setName] = useState('');
  const [className, setClassName] = useState('2.a');
  const [selectedAvatar, setSelectedAvatar] = useState('suni');
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('all');
  const [errorMsg, setErrorMsg] = useState('');

  const filteredProfiles = selectedClassFilter === 'all'
    ? profiles
    : profiles.filter((p) => p.className === selectedClassFilter);

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Kérlek add meg a keresztnevedet vagy a neved!');
      return;
    }
    const newStudent = createProfile(name, className, selectedAvatar);
    onProfileCreated(newStudent);
    setName('');
    setIsRegisteringNew(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-amber-200 max-w-lg w-full overflow-hidden">
        {/* Modal Header */}
        <div className="bg-linear-to-r from-orange-400 to-amber-400 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-2xl backdrop-blur-xs">
              🎓
            </div>
            <div>
              <h2 className="text-xl font-black">Tanulói Rendszer</h2>
              <p className="text-xs text-orange-100 font-medium">
                Válaszd ki a profilod, vagy hozz létre egy újat!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {!isRegisteringNew ? (
            <div>
              {/* Class Filter Bar */}
              <div className="mb-4 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-orange-500" />
                    <span>Válassz osztályt:</span>
                  </span>
                  <span className="text-[11px] font-bold text-slate-500">
                    {selectedClassFilter === 'all' 
                      ? `Összes tanuló (${profiles.length})` 
                      : `${selectedClassFilter} osztály (${filteredProfiles.length} fő)`}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(['all', '2.a', '2.b', '2.c', '2.d'] as const).map((cls) => (
                    <button
                      key={cls}
                      type="button"
                      onClick={() => setSelectedClassFilter(cls)}
                      className={`px-3 py-1 rounded-xl text-xs font-black transition-all ${
                        selectedClassFilter === cls
                          ? 'bg-orange-500 text-white shadow-xs scale-102'
                          : 'bg-white text-slate-600 border border-slate-200 hover:border-orange-300'
                      }`}
                    >
                      {cls === 'all' ? 'Összes osztály' : `${cls} osztály`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                  {selectedClassFilter === 'all' ? 'Összes regisztrált diák' : `${selectedClassFilter} tanulói`}
                </span>
                <button
                  onClick={() => {
                    if (selectedClassFilter !== 'all') {
                      setClassName(selectedClassFilter);
                    }
                    setIsRegisteringNew(true);
                  }}
                  className="flex items-center gap-1 text-xs font-extrabold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-xl transition-all"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Új tanuló felvétele</span>
                </button>
              </div>

              {/* Profiles list */}
              {filteredProfiles.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <p className="text-xs font-bold text-slate-500 mb-2">
                    A(z) {selectedClassFilter} osztályban még nincs regisztrált tanuló.
                  </p>
                  <button
                    onClick={() => {
                      if (selectedClassFilter !== 'all') setClassName(selectedClassFilter);
                      setIsRegisteringNew(true);
                    }}
                    className="px-4 py-2 bg-orange-500 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-orange-600 transition-colors"
                  >
                    + Tanuló hozzáadása a {selectedClassFilter} osztályhoz
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-64 overflow-y-auto pr-1">
                  {filteredProfiles.map((p) => {
                    const avatarObj = AVATARS.find((a) => a.id === p.avatar) || AVATARS[0];
                    const isCurrent = p.id === currentProfileId;
                    return (
                      <button
                        key={p.id}
                        onClick={() => {
                          onSelectProfile(p.id);
                          onClose();
                        }}
                        className={`flex items-center gap-3 p-3 rounded-2xl border text-left transition-all ${
                          isCurrent
                            ? 'border-orange-500 bg-orange-50/80 shadow-xs ring-2 ring-orange-200'
                            : 'border-slate-200 hover:border-orange-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="w-11 h-11 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-2xl shadow-2xs shrink-0">
                          {avatarObj.emoji}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <p className="font-extrabold text-sm text-slate-800 truncate">{p.name}</p>
                            <span className="text-[10px] font-black px-1.5 py-0.5 bg-orange-100 text-orange-700 rounded-md border border-orange-200">
                              {p.className}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mt-0.5">
                            <span className="text-amber-600 flex items-center gap-0.5">
                              ⭐ {p.stars}
                            </span>
                            <span className="text-emerald-600">🪙 {p.coins}</span>
                          </div>
                        </div>
                        {isCurrent && <Check className="w-5 h-5 text-orange-500 shrink-0 ml-1" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* New Student Form */
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Tanuló neve (vagy beceneve) *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setErrorMsg('');
                  }}
                  placeholder="pl. Dorka, Máté, Kovács Peti..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-orange-400 focus:border-orange-400 font-bold text-slate-800 placeholder:text-slate-400"
                  autoFocus
                />
                {errorMsg && <p className="text-xs font-bold text-rose-500 mt-1">{errorMsg}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Osztály
                  </label>
                  <select
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-orange-400 font-bold text-slate-800 bg-white"
                  >
                    <option value="2.a">2.a osztály</option>
                    <option value="2.b">2.b osztály</option>
                    <option value="2.c">2.c osztály</option>
                    <option value="2.d">2.d osztály</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Kezdő rang
                  </label>
                  <div className="px-3 py-2.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold flex items-center gap-1">
                    <GraduationCap className="w-4 h-4 text-orange-500" />
                    <span>2. osztályos Kalandor</span>
                  </div>
                </div>
              </div>

              {/* Avatar Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5">
                  Válassz kabalafigurát a tankönyvből!
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {AVATARS.map((av) => {
                    const isSelected = selectedAvatar === av.id;
                    return (
                      <button
                        type="button"
                        key={av.id}
                        onClick={() => setSelectedAvatar(av.id)}
                        className={`flex flex-col items-center p-2 rounded-2xl border transition-all ${
                          isSelected
                            ? 'border-orange-500 bg-orange-100/60 ring-2 ring-orange-300 scale-105'
                            : 'border-slate-200 hover:border-orange-200 hover:bg-slate-50'
                        }`}
                      >
                        <span className="text-2xl mb-1">{av.emoji}</span>
                        <span className="text-[10px] font-extrabold text-slate-700 leading-tight text-center truncate w-full">
                          {av.name.split(' ')[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsRegisteringNew(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold transition-colors"
                >
                  Mégse
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-black shadow-md shadow-orange-200 transition-all hover:scale-102"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Profil mentése és belépés</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
