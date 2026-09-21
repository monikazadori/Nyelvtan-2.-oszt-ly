import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, Check, X, Sparkles, HelpCircle } from 'lucide-react';
import { StudentProfile } from '../types';
import { soundFx } from '../utils/audio';
import { updateProfileAnswer } from '../utils/storage';

interface TotoQuestion {
  id: number;
  wordDisplay: string;
  options: { label: string; key: '1' | '2' | 'x' }[];
  correctKey: '1' | '2' | 'x';
  fullWord: string;
  explanation: string;
}

const TOTO_DATA: TotoQuestion[] = [
  { id: 1, wordDisplay: 'só...om', options: [{ label: '1 (j)', key: '1' }, { label: '2 (ly)', key: '2' }, { label: 'x (lly)', key: 'x' }], correctKey: '2', fullWord: 'sólyom', explanation: 'A sólyom madárnév ly-nel írandó.' },
  { id: 2, wordDisplay: 'korcso...a', options: [{ label: '1 (j)', key: '1' }, { label: '2 (ly)', key: '2' }, { label: 'x (lly)', key: 'x' }], correctKey: '2', fullWord: 'korcsolya', explanation: 'A korcsolya ly-es szó.' },
  { id: 3, wordDisplay: '...ég', options: [{ label: '1 (j)', key: '1' }, { label: '2 (ly)', key: '2' }, { label: 'x (lly)', key: 'x' }], correctKey: '1', fullWord: 'jég', explanation: 'A szó elején mindig j-t írunk (jég)!' },
  { id: 4, wordDisplay: 'kulcs...uk', options: [{ label: '1 (j)', key: '1' }, { label: '2 (ly)', key: '2' }, { label: 'x (lly)', key: 'x' }], correctKey: '2', fullWord: 'kulcslyuk', explanation: 'A lyuk és összetételei ly-nal íródnak (kulcslyuk).' },
  { id: 5, wordDisplay: 'a...tó', options: [{ label: '1 (j)', key: '1' }, { label: '2 (ly)', key: '2' }, { label: 'x (lly)', key: 'x' }], correctKey: '1', fullWord: 'ajtó', explanation: 'Az ajtó szóban j betű van.' },
  { id: 6, wordDisplay: 'osztá...', options: [{ label: '1 (j)', key: '1' }, { label: '2 (ly)', key: '2' }, { label: 'x (lly)', key: 'x' }], correctKey: '2', fullWord: 'osztály', explanation: 'Az osztály szó végén ly van.' },
  { id: 7, wordDisplay: 'sü...ed', options: [{ label: '1 (j)', key: '1' }, { label: '2 (ly)', key: '2' }, { label: 'x (lly)', key: 'x' }], correctKey: 'x', fullWord: 'süllyed', explanation: 'A süllyed szóban hosszú ly (lly) van!' },
  { id: 8, wordDisplay: 'sú...', options: [{ label: '1 (j)', key: '1' }, { label: '2 (ly)', key: '2' }, { label: 'x (lly)', key: 'x' }], correctKey: '2', fullWord: 'súly', explanation: 'A súly szó ly-nal írandó.' },
  { id: 9, wordDisplay: 'moso...og', options: [{ label: '1 (j)', key: '1' }, { label: '2 (ly)', key: '2' }, { label: 'x (lly)', key: 'x' }], correctKey: '2', fullWord: 'mosolyog', explanation: 'A mosoly és mosolyog ly-es szó.' },
  { id: 10, wordDisplay: 'bó...a', options: [{ label: '1 (j)', key: '1' }, { label: '2 (ly)', key: '2' }, { label: 'x (lly)', key: 'x' }], correctKey: '1', fullWord: 'bója', explanation: 'A vízi bója j-vel írandó!' },
  { id: 11, wordDisplay: 'tu...a', options: [{ label: '1 (j)', key: '1' }, { label: '2 (ly)', key: '2' }, { label: 'x (lly)', key: 'x' }], correctKey: '1', fullWord: 'tuja', explanation: 'A tuja fenyőféle növény j-vel írandó.' },
  { id: 12, wordDisplay: 'ga...', options: [{ label: '1 (j)', key: '1' }, { label: '2 (ly)', key: '2' }, { label: 'x (lly)', key: 'x' }], correctKey: 'x', fullWord: 'gally', explanation: 'A száraz faág a gally, hosszú lly-vel!' },
  { id: 13, wordDisplay: '...áték', options: [{ label: '1 (j)', key: '1' }, { label: '2 (ly)', key: '2' }, { label: 'x (lly)', key: 'x' }], correctKey: '1', fullWord: 'játék', explanation: 'A játék szó elején j áll.' },
  { id: 14, wordDisplay: '13+1: ...ár', options: [{ label: '1 (j)', key: '1' }, { label: '2 (ly)', key: '2' }, { label: 'x (lly)', key: 'x' }], correctKey: '1', fullWord: 'jár', explanation: 'A jár ige szó eleji j-vel írandó.' },
];

interface TotoGameProps {
  profile: StudentProfile;
  onProfileUpdated: (p: StudentProfile) => void;
  onGoToReport: () => void;
}

export const TotoGame: React.FC<TotoGameProps> = ({ profile, onProfileUpdated, onGoToReport }) => {
  const [answers, setAnswers] = useState<Record<number, '1' | '2' | 'x'>>({});
  const [evaluated, setEvaluated] = useState(false);

  const handleSelect = (qId: number, val: '1' | '2' | 'x') => {
    if (evaluated) return;
    setAnswers((prev) => ({ ...prev, [qId]: val }));
  };

  const answeredCount = Object.keys(answers).length;

  const handleCheckSlip = () => {
    if (answeredCount < TOTO_DATA.length) return;

    let correctCount = 0;
    TOTO_DATA.forEach((q) => {
      const isCorrect = answers[q.id] === q.correctKey;
      if (isCorrect) correctCount++;

      // Log in profile
      updateProfileAnswer(
        profile.id,
        {
          exerciseId: `toto-${q.id}`,
          topicId: 'j-ly',
          subtopic: 'Helyesírási totó (j-ly)',
          isCorrect,
          userAnswer: answers[q.id],
          timestamp: Date.now(),
        },
        isCorrect ? 1 : 0,
        isCorrect ? 2 : 0
      );
    });

    setEvaluated(true);
    if (correctCount >= 12) {
      soundFx.playFanfare();
      try {
        confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
      } catch {}
    } else {
      soundFx.playCorrect();
    }
  };

  const calculateCorrect = () => {
    return TOTO_DATA.filter((q) => answers[q.id] === q.correctKey).length;
  };

  const resetToto = () => {
    setAnswers({});
    setEvaluated(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="bg-linear-to-r from-emerald-600 to-teal-600 text-white rounded-3xl p-6 shadow-md mb-6 relative overflow-hidden">
        <div className="flex items-center justify-between gap-4 relative z-10">
          <div>
            <span className="bg-emerald-500/40 text-emerald-100 text-xs font-black px-3 py-1 rounded-full border border-emerald-400/50">
              Munkafüzet 33. oldal
            </span>
            <h2 className="text-2xl font-black mt-2">13 + 1 Helyesírási Totó</h2>
            <p className="text-xs sm:text-sm text-emerald-100 font-medium max-w-lg mt-1">
              Döntsd el, hogy <strong>1 (j)</strong>, <strong>2 (ly)</strong> vagy <strong>X (kettőzött lly)</strong> hiányzik a szavakból! Töltsd ki a totószelvényt!
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-3xl shadow-inner shrink-0">
            🎯
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 pt-4 border-t border-emerald-500/40 flex flex-wrap items-center gap-4 text-xs font-extrabold">
          <span className="bg-white/20 px-3 py-1 rounded-lg">1 = j</span>
          <span className="bg-white/20 px-3 py-1 rounded-lg">2 = ly</span>
          <span className="bg-white/20 px-3 py-1 rounded-lg">X = lly (kettőzött)</span>
          <span className="ml-auto text-emerald-200">
            Kitöltve: {answeredCount} / {TOTO_DATA.length}
          </span>
        </div>
      </div>

      {/* Slip Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-6">
        <div className="divide-y divide-slate-100">
          {TOTO_DATA.map((q) => {
            const userPick = answers[q.id];
            const isRight = evaluated && userPick === q.correctKey;
            const isWrong = evaluated && userPick !== q.correctKey;

            return (
              <div
                key={q.id}
                className={`p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                  isRight ? 'bg-emerald-50/60' : isWrong ? 'bg-rose-50/60' : 'hover:bg-amber-50/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-xl bg-slate-100 text-slate-700 text-xs font-black flex items-center justify-center shrink-0">
                    {q.id === 14 ? '13+1' : q.id}
                  </span>
                  <div>
                    <span className="text-base font-extrabold text-slate-800 tracking-wide">
                      {q.wordDisplay}
                    </span>
                    {evaluated && (
                      <span className="ml-3 text-xs font-black text-slate-500">
                        ({q.fullWord})
                      </span>
                    )}
                  </div>
                </div>

                {/* Option Buttons */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  {(['1', '2', 'x'] as const).map((keyVal) => {
                    const isSelected = userPick === keyVal;
                    let btnColor = 'bg-slate-100 text-slate-700 hover:bg-slate-200';

                    if (isSelected) {
                      btnColor = 'bg-emerald-600 text-white font-black shadow-xs';
                    }

                    if (evaluated) {
                      if (keyVal === q.correctKey) {
                        btnColor = 'bg-emerald-600 text-white font-black ring-2 ring-emerald-300';
                      } else if (isSelected && keyVal !== q.correctKey) {
                        btnColor = 'bg-rose-500 text-white font-black ring-2 ring-rose-300';
                      } else {
                        btnColor = 'bg-slate-100 text-slate-300';
                      }
                    }

                    return (
                      <button
                        key={keyVal}
                        onClick={() => handleSelect(q.id, keyVal)}
                        disabled={evaluated}
                        className={`w-10 h-10 rounded-xl text-sm font-black transition-all flex items-center justify-center ${btnColor}`}
                      >
                        {keyVal.toUpperCase()}
                      </button>
                    );
                  })}

                  {/* Status icon if evaluated */}
                  {evaluated && (
                    <div className="w-7 h-7 flex items-center justify-center shrink-0 ml-1">
                      {isRight ? (
                        <Check className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <X className="w-5 h-5 text-rose-500" />
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Evaluation summary / CTA */}
      {!evaluated ? (
        <div className="flex items-center justify-between bg-amber-100/70 p-4 rounded-2xl border border-amber-300">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-amber-700" />
            <span className="text-xs sm:text-sm font-bold text-amber-900">
              {answeredCount === TOTO_DATA.length
                ? 'Minden mezőt kitöltöttél! Készen állsz az ellenőrzésre?'
                : `Még ${TOTO_DATA.length - answeredCount} mező kitöltése szükséges!`}
            </span>
          </div>

          <button
            onClick={handleCheckSlip}
            disabled={answeredCount < TOTO_DATA.length}
            className={`px-6 py-2.5 rounded-xl font-black text-sm flex items-center gap-1.5 transition-all ${
              answeredCount === TOTO_DATA.length
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-200 hover:scale-102 cursor-pointer'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Szelvény ellenőrzése</span>
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-emerald-300 p-6 shadow-lg text-center animate-fade-in">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl mx-auto mb-3">
            <Trophy className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-black text-slate-800">
            Totó Eredmény: {calculateCorrect()} / 14 találat!
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 font-semibold mt-1 mb-5">
            {calculateCorrect() >= 13
              ? 'Fantasztikus! Te igazi másodikos helyesírási mester vagy!'
              : calculateCorrect() >= 10
              ? 'Nagyon ügyes vagy! Nézd át a pirossal jelölt szavakat!'
              : 'Gyakorolj még egy kicsit, és próbáld meg újra a totót!'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={resetToto}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Totó újraindítása</span>
            </button>
            <button
              onClick={onGoToReport}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-xs transition-colors"
            >
              Részletes visszajelzés & Erősségek megtekintése
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
