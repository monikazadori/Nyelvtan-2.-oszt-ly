import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Award, 
  Target, 
  RotateCcw, 
  BookOpen, 
  ArrowRight, 
  GraduationCap, 
  CheckCircle2, 
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { StudentProfile, TopicId, ExerciseItem } from './types';
import { TOPICS, EXERCISES, AVATARS } from './data/curriculumData';
import { getProfiles, getActiveProfileId, setActiveProfileId } from './utils/storage';
import { generateStudentDiagnostic } from './utils/diagnostic';
import { Navbar } from './components/Navbar';
import { RegistrationModal } from './components/RegistrationModal';
import { TopicCard } from './components/TopicCard';
import { ExercisePlayer } from './components/ExercisePlayer';
import { TotoGame } from './components/TotoGame';
import { DiagnosticReportView } from './components/DiagnosticReportView';
import { BadgesModal } from './components/BadgesModal';

export default function App() {
  const [profiles, setProfiles] = useState<StudentProfile[]>([]);
  const [activeProfileId, setActiveProfileIdState] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'map' | 'toto' | 'report'>('map');
  const [activeTopicId, setActiveTopicId] = useState<TopicId | null>(null);
  const [customExerciseList, setCustomExerciseList] = useState<ExerciseItem[] | null>(null);

  // Modals
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isBadgesModalOpen, setIsBadgesModalOpen] = useState(false);
  const [isClassReportMode, setIsClassReportMode] = useState(false);

  useEffect(() => {
    const loadedProfiles = getProfiles();
    setProfiles(loadedProfiles);
    const activeId = getActiveProfileId();
    if (activeId && loadedProfiles.some((p) => p.id === activeId)) {
      setActiveProfileIdState(activeId);
    } else if (loadedProfiles.length > 0) {
      setActiveProfileIdState(loadedProfiles[0].id);
      setActiveProfileId(loadedProfiles[0].id);
    } else {
      setIsProfileModalOpen(true);
    }
  }, []);

  const currentProfile = profiles.find((p) => p.id === activeProfileId) || profiles[0] || null;

  const handleSelectProfile = (id: string) => {
    setActiveProfileIdState(id);
    setActiveProfileId(id);
  };

  const handleProfileCreated = (newProfile: StudentProfile) => {
    setProfiles(getProfiles());
    setActiveProfileIdState(newProfile.id);
  };

  const handleProfileUpdated = (updated: StudentProfile) => {
    setProfiles((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  // Launch a topic
  const handleStartTopic = (topicId: string) => {
    setActiveTopicId(topicId as TopicId);
    setCustomExerciseList(null);
  };

  // Launch targeted practice for missed questions
  const handleLaunchTargetedPractice = (exerciseIds: string[]) => {
    const missedList = EXERCISES.filter((e) => exerciseIds.includes(e.id));
    if (missedList.length > 0) {
      setCustomExerciseList(missedList);
      setActiveTopicId(null);
    }
  };

  const currentMascot = AVATARS.find((a) => a.id === currentProfile?.avatar) || AVATARS[0];

  // Calculate Level based on stars
  const getLevelInfo = (stars: number) => {
    if (stars >= 25) return { level: 5, title: 'Anyanyelvi Tudós', nextAt: 35, icon: '👑' };
    if (stars >= 18) return { level: 4, title: 'Helyesírási Bajnok', nextAt: 25, icon: '🏆' };
    if (stars >= 12) return { level: 3, title: 'Szótagmester', nextAt: 18, icon: '⚡' };
    if (stars >= 6) return { level: 2, title: 'Betűvadász', nextAt: 12, icon: '🔍' };
    return { level: 1, title: 'Kezdő Firkász', nextAt: 6, icon: '✏️' };
  };

  const levelInfo = currentProfile ? getLevelInfo(currentProfile.stars) : getLevelInfo(0);

  // Diagnostic summary for quick badge
  const diagSummary = currentProfile ? generateStudentDiagnostic(currentProfile) : null;

  return (
    <div className="min-h-screen bg-linear-to-b from-amber-50/50 via-white to-orange-50/30 flex flex-col">
      {/* Navbar */}
      <Navbar
        currentProfile={currentProfile}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onOpenClassReport={() => {
          setIsClassReportMode(true);
          setActiveTab('report');
        }}
        onOpenBadges={() => setIsBadgesModalOpen(true)}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setActiveTopicId(null);
          setCustomExerciseList(null);
          if (tab === 'report') setIsClassReportMode(false);
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        {/* Active Exercise Player View */}
        {activeTopicId || customExerciseList ? (
          <ExercisePlayer
            topicId={activeTopicId}
            customExerciseList={customExerciseList || undefined}
            profile={currentProfile}
            onProfileUpdated={handleProfileUpdated}
            onClose={() => {
              setActiveTopicId(null);
              setCustomExerciseList(null);
            }}
            onOpenReport={() => {
              setActiveTopicId(null);
              setCustomExerciseList(null);
              setActiveTab('report');
            }}
          />
        ) : activeTab === 'toto' ? (
          /* 13+1 Totó Minigame */
          <TotoGame
            profile={currentProfile}
            onProfileUpdated={handleProfileUpdated}
            onGoToReport={() => setActiveTab('report')}
          />
        ) : activeTab === 'report' ? (
          /* Diagnostic & Class Report */
          <DiagnosticReportView
            currentProfile={currentProfile}
            onLaunchTargetedPractice={(ids) => handleLaunchTargetedPractice(ids)}
            onSelectTopic={(tId) => handleStartTopic(tId)}
            initialClassMode={isClassReportMode}
          />
        ) : (
          /* Kalandtérkép (Map Overview) */
          <div className="space-y-6">
            {/* Student Welcome & Gamification Banner */}
            {currentProfile && (
              <div className="bg-linear-to-r from-orange-400 via-amber-400 to-orange-500 rounded-3xl p-6 sm:p-7 text-white shadow-md shadow-orange-100 relative overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-white/20 border-2 border-white/40 flex items-center justify-center text-4xl sm:text-5xl shadow-inner backdrop-blur-xs shrink-0">
                      {currentMascot.emoji}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setIsProfileModalOpen(true)}
                          title="Kattints ide az osztály vagy tanuló váltásához!"
                          className="text-xs uppercase tracking-wider font-black bg-white/25 hover:bg-white/35 px-2.5 py-0.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer border border-white/30"
                        >
                          <GraduationCap className="w-3.5 h-3.5" />
                          <span>{currentProfile.className} osztály</span>
                          <span className="text-[10px] opacity-80 underline ml-0.5">váltás</span>
                        </button>
                        <span className="text-xs font-bold text-amber-100">
                          Kabala: {currentMascot.name}
                        </span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-black mt-1">
                        Szervusz, {currentProfile.name}!
                      </h2>
                      <p className="text-xs sm:text-sm text-orange-100 font-medium max-w-xl mt-0.5">
                        {currentProfile.className.startsWith('3')
                          ? '3. osztályos év eleji felkészülés: ismételd át játékosan az alapokat, hogy magabiztosan indítsd az új tanévet!'
                          : 'Készen állsz a 2. osztályos nyelvtan és helyesírás játékos ismétlésére? Gyűjts csillagokat és fedezd fel az erősségeidet!'}
                      </p>
                    </div>
                  </div>

                  {/* Level & Reward Meter */}
                  <div className="bg-white/15 backdrop-blur-xs border border-white/25 rounded-2xl p-4 flex flex-col gap-2.5 min-w-[240px]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-lg">{levelInfo.icon}</span>
                        <span className="text-xs font-black">{levelInfo.title}</span>
                      </div>
                      <span className="text-[11px] font-black bg-white/20 px-2 py-0.5 rounded-full">
                        {levelInfo.level}. szint
                      </span>
                    </div>

                    <div className="w-full h-2 bg-black/15 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(100, (currentProfile.stars / levelInfo.nextAt) * 100)}%`,
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs font-extrabold text-amber-100">
                      <span>⭐ {currentProfile.stars} / {levelInfo.nextAt} csillag</span>
                      <span>🪙 {currentProfile.coins} tallér</span>
                    </div>
                  </div>
                </div>

                {/* Quick Shortcuts Bar */}
                <div className="mt-5 pt-4 border-t border-white/20 flex flex-wrap items-center justify-between gap-3 text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-100">Gyors lehetőségek:</span>
                    <button
                      onClick={() => setActiveTab('toto')}
                      className="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5"
                    >
                      <span>🎯 13+1 Totó kitöltése</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('report')}
                      className="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5"
                    >
                      <span>📊 Erősségeim és tanácsok</span>
                    </button>
                  </div>

                  {diagSummary && diagSummary.missedExerciseIds.length > 0 && (
                    <button
                      onClick={() => handleLaunchTargetedPractice(diagSummary.missedExerciseIds)}
                      className="bg-white text-orange-700 px-3.5 py-1.5 rounded-xl font-black shadow-xs hover:bg-orange-50 transition-all flex items-center gap-1.5 ml-auto"
                    >
                      <Target className="w-3.5 h-3.5 text-orange-600" />
                      <span>{diagSummary.missedExerciseIds.length} hibázott feladat ismétlése</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Motivational Textbook Character Tip Box */}
            <div className="bg-amber-100/60 border border-amber-300/80 rounded-3xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <span className="text-3xl">💡</span>
                <div>
                  <h3 className="text-sm font-black text-amber-950">
                    {currentProfile?.className.startsWith('3')
                      ? 'Süni Samu és Bagoly Berci tanácsa a harmadikosoknak év elejére:'
                      : 'Süni Samu és Róka Rudi tanácsa a másodikosoknak:'}
                  </h3>
                  <p className="text-xs text-amber-900 font-semibold leading-relaxed">
                    {currentProfile?.className.startsWith('3')
                      ? '„A 3. osztályban a szófajok és a mondatok világába lépünk. De a biztos alap a szóvégi ó/ő/ú/ű, a j és ly, valamint a kettőzött mássalhangzók ismerete! Gyakorolj velünk bátran!”'
                      : '„A szavak végén az -ó és az -ő mindig hosszú! Ha pedig nem vagy biztos egy szóban, próbáld meg szótagolni, vagy gondolj a szótőre!”'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('report')}
                className="px-4 py-2 bg-white hover:bg-amber-50 text-amber-900 border border-amber-300 font-extrabold text-xs rounded-xl transition-colors shrink-0 flex items-center gap-1"
              >
                <span>Hogyan állok most?</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Section Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-slate-800">
                  Tanulási Témakörök (NAT 2020)
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Válassz egy fejezetet és gyakorolj játékosan!
                </p>
              </div>
              <span className="text-xs font-black text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                7 témakör • 25+ interaktív feladat
              </span>
            </div>

            {/* Topic Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {TOPICS.map((topic) => (
                <TopicCard
                  key={topic.id}
                  topic={topic}
                  profile={currentProfile}
                  onSelectTopic={handleStartTopic}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 bg-white border-t border-slate-200 py-6 px-4 text-center text-xs text-slate-500 font-medium">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-700">Nyelvtan Kalandor</span>
            <span>•</span>
            <span>Oktatási Hivatal NAT 2020 Nyelvtan és helyesírás 2. tananyag alapján</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400 font-semibold">
            <span>Tanulói regisztráció</span>
            <span>•</span>
            <span>Erősségek & Fejlesztendő területek</span>
            <span>•</span>
            <span>Gamifikáció</span>
          </div>
        </div>
      </footer>

      {/* Registration & Profile Modal */}
      <RegistrationModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profiles={profiles}
        currentProfileId={activeProfileId}
        onSelectProfile={handleSelectProfile}
        onProfileCreated={handleProfileCreated}
      />

      {/* Badges Modal */}
      {currentProfile && (
        <BadgesModal
          isOpen={isBadgesModalOpen}
          onClose={() => setIsBadgesModalOpen(false)}
          profile={currentProfile}
        />
      )}
    </div>
  );
}
