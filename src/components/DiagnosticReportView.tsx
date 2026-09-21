import React, { useState } from 'react';
import { 
  Trophy, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  ArrowRight, 
  Users, 
  BookOpen,
  Printer,
  ChevronRight,
  TrendingUp,
  Target
} from 'lucide-react';
import { StudentProfile } from '../types';
import { generateStudentDiagnostic, generateClassDiagnostic } from '../utils/diagnostic';
import { getProfiles } from '../utils/storage';
import { EXERCISES, AVATARS, TOPICS } from '../data/curriculumData';

interface DiagnosticReportViewProps {
  currentProfile: StudentProfile;
  onLaunchTargetedPractice: (exerciseIds: string[]) => void;
  onSelectTopic: (topicId: string) => void;
  initialClassMode?: boolean;
}

export const DiagnosticReportView: React.FC<DiagnosticReportViewProps> = ({
  currentProfile,
  onLaunchTargetedPractice,
  onSelectTopic,
  initialClassMode = false,
}) => {
  const [viewMode, setViewMode] = useState<'individual' | 'class'>(
    initialClassMode ? 'class' : 'individual'
  );
  const [selectedClass, setSelectedClass] = useState<string>(currentProfile.className || '2.a');

  const allProfiles = getProfiles();
  const studentDiag = generateStudentDiagnostic(currentProfile);
  const classDiag = generateClassDiagnostic(allProfiles, selectedClass);

  const mascot = AVATARS.find((a) => a.id === currentProfile.avatar) || AVATARS[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Mode Switcher Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-black text-slate-800">
            {viewMode === 'individual' ? 'Tanulói Értékelés & Diagnosztika' : 'Osztályszintű Nyelvtani Riport'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            {viewMode === 'individual'
              ? `${currentProfile.name} (${currentProfile.className}) részletes visszajelzése az erősségekről és hiányosságokról`
              : `A ${selectedClass} osztály összesített nyelvtan-helyesírás felmérése`}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="bg-slate-100 p-1 rounded-2xl flex items-center gap-1 border border-slate-200">
            <button
              onClick={() => setViewMode('individual')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                viewMode === 'individual'
                  ? 'bg-white text-orange-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>{mascot.emoji}</span>
              <span>Egyéni visszajelzés</span>
            </button>
            <button
              onClick={() => setViewMode('class')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                viewMode === 'class'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Osztály riport</span>
            </button>
          </div>

          <button
            onClick={handlePrint}
            title="Bizonyítvány nyomtatása / PDF mentése"
            className="p-2.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-xl transition-colors shadow-2xs"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {viewMode === 'individual' ? (
        /* INDIVIDUAL DIAGNOSTIC VIEW */
        <div className="space-y-6">
          {/* Top Score Banner */}
          <div className="bg-linear-to-r from-amber-500 via-orange-500 to-amber-600 text-white rounded-3xl p-6 shadow-md relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
              <div className="flex items-center gap-4 text-center sm:text-left">
                <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-4xl shadow-inner border border-white/30 shrink-0">
                  {mascot.emoji}
                </div>
                <div>
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <h3 className="text-2xl font-black">{currentProfile.name} bizonyítványa</h3>
                    <span className="bg-white/25 text-white font-extrabold text-xs px-2 py-0.5 rounded-full">
                      {currentProfile.className}
                    </span>
                  </div>
                  <p className="text-xs text-amber-100 font-bold mt-1">
                    Összes megválaszolt feladat: {studentDiag.totalAnswered} db • Helyes: {studentDiag.correctTotal} db
                  </p>
                </div>
              </div>

              {/* Big Stat Pill */}
              <div className="flex items-center gap-3 bg-white/15 px-5 py-3 rounded-2xl border border-white/20 backdrop-blur-xs">
                <div>
                  <span className="text-[11px] font-bold text-amber-100 block uppercase tracking-wider">
                    Összesített pontosság
                  </span>
                  <span className="text-3xl font-black">{studentDiag.accuracyRate}%</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-amber-400/50 flex items-center justify-center text-xl">
                  {studentDiag.accuracyRate >= 80 ? '🌟' : studentDiag.accuracyRate >= 50 ? '🌱' : '✍️'}
                </div>
              </div>
            </div>
          </div>

          {/* TWO MAIN COLUMNS: ERŐSSÉGEK vs. FEJLESZTENDŐ TERÜLETEK */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* ERŐSSÉGEK (Strengths) */}
            <div className="bg-white rounded-3xl p-6 border border-emerald-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-slate-800">
                      Erősségeid a 2. osztályban
                    </h4>
                    <span className="text-xs text-emerald-700 font-bold">
                      Amiben már most kiváló vagy!
                    </span>
                  </div>
                </div>

                {studentDiag.topStrengths.length > 0 ? (
                  <ul className="space-y-2.5">
                    {studentDiag.topStrengths.map((str, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2.5 bg-emerald-50/60 p-3 rounded-2xl border border-emerald-100 text-xs font-bold text-emerald-950 leading-relaxed"
                      >
                        <span className="text-emerald-600 text-base leading-none">✓</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-500 font-medium italic p-3">
                    Oldj meg még néhány feladatot a témakörökből az erősségek elemzéséhez!
                  </p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500">
                <span>Dicséret Süni Samutól:</span>
                <span className="text-emerald-700 font-black">Csak így tovább! 👏</span>
              </div>
            </div>

            {/* FEJLESZTENDŐ TERÜLETEK (Areas to develop) */}
            <div className="bg-white rounded-3xl p-6 border border-orange-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-black">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-slate-800">
                      Fejlesztendő területek & Tanácsok
                    </h4>
                    <span className="text-xs text-orange-700 font-bold">
                      Ezekre a szabályokra figyelj jobban!
                    </span>
                  </div>
                </div>

                {studentDiag.priorityImprovements.length > 0 ? (
                  <div className="space-y-3">
                    {studentDiag.priorityImprovements.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-orange-50/70 p-3.5 rounded-2xl border border-orange-200 text-xs text-slate-800"
                      >
                        <div className="flex items-center gap-1.5 font-extrabold text-orange-900 mb-1">
                          <BookOpen className="w-3.5 h-3.5 text-orange-600" />
                          <span>{item.topicTitle}</span>
                        </div>
                        <p className="font-semibold text-slate-700 mb-1.5">{item.advice}</p>
                        <div className="bg-white/80 p-2 rounded-xl text-[11px] font-bold text-orange-950 border border-orange-100">
                          <strong>Megjegyzendő:</strong> {item.rule}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 text-center">
                    <span className="text-2xl">🎉</span>
                    <p className="text-xs font-extrabold text-emerald-900 mt-1">
                      Nincs kiemelt fejlesztendő terület! Mindent nagyon ügyesen megoldottál!
                    </p>
                  </div>
                )}
              </div>

              {/* Targeted Practice Action Button */}
              {studentDiag.missedExerciseIds.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => onLaunchTargetedPractice(studentDiag.missedExerciseIds)}
                    className="w-full py-2.5 px-4 bg-orange-500 hover:bg-orange-600 text-white font-black text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-md shadow-orange-200 transition-all hover:scale-101"
                  >
                    <Target className="w-4 h-4" />
                    <span>Célzott ismétlés: Csak a tévesztett feladatok ({studentDiag.missedExerciseIds.length} db)</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* TOPIC BY TOPIC BREAKDOWN TABLE */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            <h4 className="text-base font-black text-slate-800 mb-1">
              Részletes eredmények témakörönként
            </h4>
            <p className="text-xs text-slate-500 font-medium mb-4">
              A 2. osztályos tankönyvi fejezetek szerinti teljesítés
            </p>

            <div className="divide-y divide-slate-100">
              {studentDiag.categoryReports.map((cat) => {
                const topicMeta = TOPICS.find((t) => t.id === cat.topicId);
                return (
                  <div
                    key={cat.topicId}
                    className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-slate-800">
                          {cat.topicTitle}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold bg-slate-100 px-1.5 py-0.5 rounded">
                          {topicMeta?.textbookRef}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 font-medium">
                        <span>
                          Megoldva: {cat.totalAnswered} feladat • Helyes: {cat.correctCount}
                        </span>
                        {cat.tips.length > 0 && (
                          <span className="text-orange-600 font-bold truncate hidden sm:inline">
                            💡 {cat.tips[0]}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 self-end sm:self-center">
                      <div className="text-right">
                        <span className="text-sm font-black text-slate-800 block">
                          {cat.percentage}%
                        </span>
                        <span className={`text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                          cat.status === 'mastered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : cat.status === 'developing'
                            ? 'bg-amber-100 text-amber-800'
                            : cat.status === 'needs-practice'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-slate-100 text-slate-500'
                        }`}>
                          {cat.status === 'mastered'
                            ? 'Mesteri'
                            : cat.status === 'developing'
                            ? 'Fejlődő'
                            : cat.status === 'needs-practice'
                            ? 'Gyakorlandó'
                            : 'Még nincs adat'}
                        </span>
                      </div>

                      <button
                        onClick={() => onSelectTopic(cat.topicId)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-orange-100 text-slate-700 hover:text-orange-800 rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
                      >
                        <span>Gyakorlás</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* CLASSROOM VIEW (Osztály riport tanároknak és diákoknak) */
        <div className="space-y-6">
          {/* Class summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
                Osztály létszám
              </span>
              <span className="text-3xl font-black text-slate-800 mt-1 block">
                {classDiag.studentCount} tanuló
              </span>
              <span className="text-xs font-semibold text-slate-500 mt-1 block">
                {selectedClass} osztályban regisztráltak
              </span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
                Osztályátlag pontosság
              </span>
              <span className="text-3xl font-black text-indigo-600 mt-1 block">
                {classDiag.classAverageAccuracy}%
              </span>
              <span className="text-xs font-semibold text-emerald-600 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{classDiag.totalExercisesDone} kitöltött feladat alapján</span>
              </span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
                Legerősebb tananyag
              </span>
              <span className="text-lg font-black text-emerald-700 mt-1 block truncate">
                {classDiag.strongestTopic}
              </span>
              <span className="text-xs text-orange-600 font-bold block truncate mt-1">
                Legtöbb tévesztés: {classDiag.mostChallengingTopic}
              </span>
            </div>
          </div>

          {/* Class topic performance bars */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            <h4 className="text-base font-black text-slate-800 mb-1">
              Osztályszintű eredmények tananyagonként
            </h4>
            <p className="text-xs text-slate-500 font-medium mb-5">
              Megmutatja, mely témaköröket érdemes a tanórán közösen átismételni
            </p>

            <div className="space-y-4">
              {classDiag.topicAverages.map((t) => (
                <div key={t.topicId} className="space-y-1">
                  <div className="flex justify-between text-xs font-extrabold text-slate-700">
                    <span>{t.title}</span>
                    <span>{t.averagePct}%</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        t.averagePct >= 80
                          ? 'bg-emerald-500'
                          : t.averagePct >= 50
                          ? 'bg-amber-500'
                          : 'bg-orange-500'
                      }`}
                      style={{ width: `${t.averagePct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Student Leaderboard & Progress Table */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs overflow-hidden">
            <h4 className="text-base font-black text-slate-800 mb-1">
              Tanulók eredményei a {selectedClass} osztályban
            </h4>
            <p className="text-xs text-slate-500 font-medium mb-4">
              Csillagok, tallérok és elért haladás
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 text-xs font-black uppercase tracking-wider">
                    <th className="pb-3 pl-2">Tanuló</th>
                    <th className="pb-3 text-center">Megoldott</th>
                    <th className="pb-3 text-center">Pontosság</th>
                    <th className="pb-3 text-center">Csillagok</th>
                    <th className="pb-3 text-center">Tallérok</th>
                    <th className="pb-3 text-right pr-2">Jelvények</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-bold text-slate-700">
                  {allProfiles
                    .filter((p) => p.className === selectedClass)
                    .map((p) => {
                      const av = AVATARS.find((a) => a.id === p.avatar) || AVATARS[0];
                      const tot = p.answerLogs.length;
                      const cor = p.answerLogs.filter((l) => l.isCorrect).length;
                      const pct = tot > 0 ? Math.round((cor / tot) * 100) : 0;
                      return (
                        <tr key={p.id} className="hover:bg-amber-50/40 transition-colors">
                          <td className="py-3 pl-2 flex items-center gap-2.5">
                            <span className="text-xl">{av.emoji}</span>
                            <div>
                              <span className="font-extrabold text-slate-900 block">{p.name}</span>
                              <span className="text-[10px] text-slate-400 font-medium">
                                {p.id === currentProfile.id ? '(Jelenlegi tanuló)' : ''}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 text-center text-slate-600">{tot} db</td>
                          <td className="py-3 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-[11px] font-black ${
                              pct >= 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {pct}%
                            </span>
                          </td>
                          <td className="py-3 text-center text-amber-600">⭐ {p.stars}</td>
                          <td className="py-3 text-center text-emerald-600">🪙 {p.coins}</td>
                          <td className="py-3 text-right pr-2 text-slate-500 font-black">
                            {p.unlockedBadgeIds.length} db
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
