import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  Sparkles, 
  Lightbulb, 
  BookOpen, 
  ArrowRight,
  RotateCcw,
  Trophy
} from 'lucide-react';
import { ExerciseItem, StudentProfile, TopicId } from '../types';
import { TOPICS, AVATARS, EXERCISES } from '../data/curriculumData';
import { soundFx } from '../utils/audio';
import { updateProfileAnswer } from '../utils/storage';

interface ExercisePlayerProps {
  topicId: TopicId | null;
  customExerciseList?: ExerciseItem[];
  profile: StudentProfile;
  onProfileUpdated: (updated: StudentProfile) => void;
  onClose: () => void;
  onOpenReport: () => void;
}

export const ExercisePlayer: React.FC<ExercisePlayerProps> = ({
  topicId,
  customExerciseList,
  profile,
  onProfileUpdated,
  onClose,
  onOpenReport,
}) => {
  const currentTopic = TOPICS.find((t) => t.id === topicId);
  const exerciseList = customExerciseList || (topicId ? EXERCISES.filter((e) => e.topicId === topicId) : []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [sessionScore, setSessionScore] = useState({ correct: 0, total: 0 });
  const [sessionFinished, setSessionFinished] = useState(false);

  const currentExercise = exerciseList[currentIndex];
  const mascot = AVATARS.find((a) => a.id === profile.avatar) || AVATARS[0];

  const handleSelectOption = (opt: string) => {
    if (hasSubmitted) return;
    setSelectedOption(opt);
  };

  const handleSubmitAnswer = () => {
    if (!selectedOption || !currentExercise || hasSubmitted) return;

    const correct = selectedOption === currentExercise.correctAnswer;
    setHasSubmitted(true);
    setIsCorrect(correct);

    const starsDelta = correct ? 1 : 0;
    const coinsDelta = correct ? 3 : 1; // encouragement even for trying

    if (correct) {
      soundFx.playCorrect();
    } else {
      soundFx.playWrong();
    }

    setSessionScore((prev) => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1,
    }));

    // Record in local storage
    const { profile: updated, newBadges } = updateProfileAnswer(
      profile.id,
      {
        exerciseId: currentExercise.id,
        topicId: currentExercise.topicId,
        subtopic: currentExercise.subtopic,
        isCorrect: correct,
        userAnswer: selectedOption,
        timestamp: Date.now(),
      },
      starsDelta,
      coinsDelta
    );
    onProfileUpdated(updated);

    if (newBadges.length > 0) {
      try {
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
      } catch {}
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < exerciseList.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setHasSubmitted(false);
      setIsCorrect(false);
      setShowHint(false);
    } else {
      setSessionFinished(true);
      soundFx.playFanfare();
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {}
    }
  };

  if (!currentExercise || exerciseList.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs">
          <span className="text-5xl">🎉</span>
          <h2 className="text-xl font-black text-slate-800 mt-3">
            Nincs több megválaszolatlan feladat ebben a listában!
          </h2>
          <p className="text-slate-500 text-sm mt-1 mb-6">
            Minden feladatot sikeresen teljesítettél, vagy már gyakoroltad őket.
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-xs"
          >
            Vissza a Kalandtérképhez
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Top action bar */}
      <div className="flex items-center justify-between gap-3 mb-5">
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 transition-colors shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Vissza</span>
        </button>

        <div className="text-center">
          <span className="text-xs font-extrabold text-slate-500 block">
            {currentTopic ? currentTopic.title : 'Célzott Ismétlés'}
          </span>
          <span className="text-xs font-black text-orange-600">
            {currentIndex + 1}. / {exerciseList.length} feladat
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="bg-amber-100 text-amber-900 border border-amber-200 text-xs font-black px-2.5 py-1 rounded-xl flex items-center gap-1">
            ⭐ {profile.stars}
          </span>
        </div>
      </div>

      {/* Progress Line */}
      <div className="w-full h-2.5 bg-slate-200/80 rounded-full overflow-hidden mb-6">
        <div
          className="h-full bg-linear-to-r from-orange-400 to-amber-500 transition-all duration-300 rounded-full"
          style={{ width: `${((currentIndex + 1) / exerciseList.length) * 100}%` }}
        />
      </div>

      {!sessionFinished ? (
        <div className="bg-white rounded-3xl border border-amber-200/80 shadow-md p-6 sm:p-8">
          {/* Subtopic pill */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="bg-orange-100 text-orange-800 text-[11px] font-black px-3 py-1 rounded-full">
              {currentExercise.subtopic}
            </span>
            {currentExercise.hint && !hasSubmitted && (
              <button
                onClick={() => setShowHint(!showHint)}
                className="flex items-center gap-1 text-xs font-extrabold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-200 transition-colors"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                <span>Segítség Sünitől</span>
              </button>
            )}
          </div>

          {/* Hint Drawer */}
          {showHint && currentExercise.hint && (
            <div className="mb-4 bg-amber-50/90 border border-amber-300 rounded-2xl p-3 flex items-start gap-2.5 animate-fade-in">
              <span className="text-xl">🦔</span>
              <div>
                <p className="text-xs font-extrabold text-amber-950">Süni Samu súgása:</p>
                <p className="text-xs text-amber-900 font-medium">{currentExercise.hint}</p>
              </div>
            </div>
          )}

          {/* Question Title & Prompt */}
          <h2 className="text-base sm:text-lg font-black text-slate-800 mb-1">
            {currentExercise.title}
          </h2>
          <p className="text-xs text-slate-500 font-bold mb-5">
            {currentExercise.instruction}
          </p>

          <div className="bg-amber-50/50 rounded-2xl border border-amber-100 p-5 mb-6">
            <p className="text-lg sm:text-xl font-black text-slate-900 leading-relaxed text-center">
              {currentExercise.question}
            </p>
          </div>

          {/* Options Grid */}
          <div className="space-y-2.5 mb-6">
            {currentExercise.options?.map((opt, idx) => {
              const isSelected = selectedOption === opt;
              let btnStyle = 'border-slate-200 hover:border-orange-300 hover:bg-orange-50/50 bg-white text-slate-800';

              if (hasSubmitted) {
                if (opt === currentExercise.correctAnswer) {
                  btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-300 font-black';
                } else if (isSelected && !isCorrect) {
                  btnStyle = 'border-rose-400 bg-rose-50 text-rose-900 ring-2 ring-rose-200 font-bold';
                } else {
                  btnStyle = 'border-slate-200 bg-slate-50 text-slate-400 opacity-60';
                }
              } else if (isSelected) {
                btnStyle = 'border-orange-500 bg-orange-100/70 text-orange-950 ring-2 ring-orange-300 font-black';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(opt)}
                  disabled={hasSubmitted}
                  className={`w-full p-4 rounded-2xl border text-left text-sm sm:text-base transition-all flex items-center justify-between ${btnStyle}`}
                >
                  <span className="font-extrabold">{opt}</span>
                  {hasSubmitted && opt === currentExercise.correctAnswer && (
                    <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                  )}
                  {hasSubmitted && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation & NAT Rule feedback on submission */}
          {hasSubmitted && (
            <div className={`p-4 rounded-2xl border mb-6 ${
              isCorrect ? 'bg-emerald-50/80 border-emerald-300' : 'bg-orange-50/80 border-orange-300'
            }`}>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xl">{isCorrect ? '🌟' : '💡'}</span>
                <span className={`text-sm font-black ${isCorrect ? 'text-emerald-900' : 'text-orange-950'}`}>
                  {isCorrect ? 'Ügyes vagy, hibátlan válasz!' : 'Nem baj, ebből tanulunk a legtöbbet!'}
                </span>
                {isCorrect && (
                  <span className="ml-auto text-xs font-black text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
                    +1 ⭐  +3 🪙
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-700 font-semibold mb-2">
                {currentExercise.explanation}
              </p>
              <div className="flex items-start gap-2 text-[11px] font-bold text-slate-800 bg-white/70 p-2.5 rounded-xl border border-slate-200">
                <BookOpen className="w-3.5 h-3.5 text-orange-600 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-orange-800">Nyelvtani aranyszabály:</strong> {currentExercise.ruleQuote}
                </span>
              </div>
            </div>
          )}

          {/* Bottom actions */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-bold text-slate-400">
              {mascot.emoji} {mascot.name} szurkol neked!
            </span>

            {!hasSubmitted ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={!selectedOption}
                className={`px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2 transition-all ${
                  selectedOption
                    ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-200 hover:scale-102 cursor-pointer'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>Válasz ellenőrzése</span>
                <Sparkles className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-6 py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black text-sm flex items-center gap-2 shadow-md shadow-orange-200 transition-all hover:scale-102 cursor-pointer"
              >
                <span>{currentIndex + 1 < exerciseList.length ? 'Következő feladat' : 'Eredmények megtekintése'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* End of Session Summary Card */
        <div className="bg-white rounded-3xl border border-amber-200 shadow-xl p-8 text-center animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-linear-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center text-3xl mx-auto mb-4 shadow-md shadow-orange-200">
            <Trophy className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-black text-slate-800 mb-1">
            Szép munka, {profile.name}!
          </h2>
          <p className="text-sm text-slate-500 font-bold mb-6">
            Befejezted a gyakorlást ebben a körben!
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-md mx-auto mb-6">
            <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl">
              <span className="text-xs font-bold text-amber-800 block">Helyes válasz</span>
              <span className="text-2xl font-black text-amber-900">
                {sessionScore.correct} / {sessionScore.total}
              </span>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl">
              <span className="text-xs font-bold text-emerald-800 block">Pontosság</span>
              <span className="text-2xl font-black text-emerald-900">
                {sessionScore.total > 0 ? Math.round((sessionScore.correct / sessionScore.total) * 100) : 0}%
              </span>
            </div>
            <div className="bg-orange-50 border border-orange-200 p-3.5 rounded-2xl col-span-2 sm:col-span-1">
              <span className="text-xs font-bold text-orange-800 block">Szerzett csillag</span>
              <span className="text-2xl font-black text-orange-900">
                +{sessionScore.correct} ⭐
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => {
                setCurrentIndex(0);
                setSelectedOption(null);
                setHasSubmitted(false);
                setIsCorrect(false);
                setShowHint(false);
                setSessionScore({ correct: 0, total: 0 });
                setSessionFinished(false);
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-sm rounded-xl transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Újra játszom</span>
            </button>

            <button
              onClick={onOpenReport}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm rounded-xl shadow-md shadow-indigo-200 transition-all"
            >
              <span>Visszajelzés és Erősségek</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-sm rounded-xl shadow-md shadow-orange-200 transition-all"
            >
              Vissza a Kalandtérképhez
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
