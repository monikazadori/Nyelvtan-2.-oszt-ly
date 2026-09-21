import React from 'react';
import { X, Award, CheckCircle2, Lock } from 'lucide-react';
import { StudentProfile } from '../types';
import { BADGES } from '../data/curriculumData';

interface BadgesModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
}

export const BadgesModal: React.FC<BadgesModalProps> = ({ isOpen, onClose, profile }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-amber-200 max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="bg-linear-to-r from-amber-500 to-orange-500 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">
              🏆
            </div>
            <div>
              <h3 className="text-xl font-black">Jelvényeim & Elismerések</h3>
              <p className="text-xs text-amber-100 font-medium">
                Gyűjtsd össze az összes másodikos nyelvtani kitüntetést!
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

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4 bg-amber-50 p-3 rounded-2xl border border-amber-200 text-xs font-bold text-amber-900">
            <span>Feloldott jelvények:</span>
            <span className="font-black text-amber-800">
              {profile.unlockedBadgeIds.length} / {BADGES.length} db
            </span>
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {BADGES.map((badge) => {
              const isUnlocked = profile.unlockedBadgeIds.includes(badge.id);
              return (
                <div
                  key={badge.id}
                  className={`p-3.5 rounded-2xl border flex items-center gap-3.5 transition-all ${
                    isUnlocked
                      ? 'bg-amber-50/70 border-amber-300 shadow-2xs'
                      : 'bg-slate-50 border-slate-200 opacity-60'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-2xs ${
                    isUnlocked ? 'bg-white border border-amber-200' : 'bg-slate-200 text-slate-400'
                  }`}>
                    {isUnlocked ? badge.icon : '🔒'}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className={`text-sm font-black ${isUnlocked ? 'text-slate-800' : 'text-slate-500'}`}>
                        {badge.title}
                      </h4>
                      {isUnlocked && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded-md">
                          Megszerezve
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed mt-0.5">
                      {badge.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 text-center">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-black shadow-xs transition-colors"
            >
              Értem, folytatom a gyakorlást!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
