import { StudentProfile, AnswerLog } from '../types';
import { BADGES } from '../data/curriculumData';

const PROFILES_STORAGE_KEY = 'nyelvtan_2_student_profiles_v1';
const ACTIVE_PROFILE_KEY = 'nyelvtan_2_active_student_id_v1';

export function getProfiles(): StudentProfile[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(PROFILES_STORAGE_KEY);
    if (!raw) {
      return seedDefaultProfiles();
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : seedDefaultProfiles();
  } catch {
    return seedDefaultProfiles();
  }
}

export function saveProfiles(profiles: StudentProfile[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(profiles));
  } catch (err) {
    console.error('Failed to save profiles to localStorage', err);
  }
}

export function getActiveProfileId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACTIVE_PROFILE_KEY);
}

export function setActiveProfileId(id: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ACTIVE_PROFILE_KEY, id);
}

export function createProfile(name: string, className: string, avatar: string): StudentProfile {
  const newProfile: StudentProfile = {
    id: 'student_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    name: name.trim(),
    className: className.trim() || '2.a',
    avatar,
    stars: 0,
    coins: 0,
    completedExerciseIds: [],
    answerLogs: [],
    unlockedBadgeIds: [],
    createdAt: Date.now(),
    lastActive: Date.now(),
  };

  const current = getProfiles();
  current.push(newProfile);
  saveProfiles(current);
  setActiveProfileId(newProfile.id);
  return newProfile;
}

export function updateProfileAnswer(
  profileId: string,
  log: AnswerLog,
  starsDelta: number,
  coinsDelta: number
): { profile: StudentProfile; newBadges: string[] } {
  const profiles = getProfiles();
  const profile = profiles.find((p) => p.id === profileId);
  if (!profile) {
    throw new Error('Profile not found: ' + profileId);
  }

  profile.answerLogs.push(log);
  if (log.isCorrect && !profile.completedExerciseIds.includes(log.exerciseId)) {
    profile.completedExerciseIds.push(log.exerciseId);
  }
  profile.stars += starsDelta;
  profile.coins += coinsDelta;
  profile.lastActive = Date.now();

  // Check badges
  const newlyUnlocked: string[] = [];
  BADGES.forEach((badge) => {
    if (!profile.unlockedBadgeIds.includes(badge.id)) {
      if (badge.unlockedIf(profile)) {
        profile.unlockedBadgeIds.push(badge.id);
        newlyUnlocked.push(badge.title);
      }
    }
  });

  saveProfiles(profiles);
  return { profile, newBadges: newlyUnlocked };
}

export function resetStudentProgress(profileId: string): StudentProfile | null {
  const profiles = getProfiles();
  const target = profiles.find((p) => p.id === profileId);
  if (!target) return null;
  target.stars = 0;
  target.coins = 0;
  target.completedExerciseIds = [];
  target.answerLogs = [];
  target.unlockedBadgeIds = [];
  target.lastActive = Date.now();
  saveProfiles(profiles);
  return target;
}

function seedDefaultProfiles(): StudentProfile[] {
  const defaultStudents: StudentProfile[] = [
    {
      id: 'demo_lili',
      name: 'Lili',
      className: '2.a',
      avatar: 'suni',
      stars: 14,
      coins: 45,
      completedExerciseIds: ['vow-1', 'vow-2', 'vow-3', 'cons-1', 'cons-2', 'jly-1', 'jly-2', 'abc-1', 'syl-1', 'sd-1'],
      answerLogs: [
        { exerciseId: 'vow-1', topicId: 'vowels', subtopic: 'Jelentésmegkülönböztető', isCorrect: true, userAnswer: 'húrok', timestamp: Date.now() - 3600000 },
        { exerciseId: 'vow-2', topicId: 'vowels', subtopic: 'Jelentésmegkülönböztető', isCorrect: true, userAnswer: 'tör', timestamp: Date.now() - 3500000 },
        { exerciseId: 'vow-3', topicId: 'vowels', subtopic: 'Szóvégi -ó, -ő', isCorrect: true, userAnswer: 'olló, erdő, szőlő, repülő', timestamp: Date.now() - 3400000 },
        { exerciseId: 'vow-4', topicId: 'vowels', subtopic: 'Szóvégi -ú, -u kivételek', isCorrect: false, userAnswer: 'fiú', timestamp: Date.now() - 3300000 },
        { exerciseId: 'cons-1', topicId: 'consonants', subtopic: 'Egy-, két- és háromjegyű', isCorrect: true, userAnswer: 'cs, gy, ny, sz, ty, zs', timestamp: Date.now() - 3000000 },
        { exerciseId: 'cons-2', topicId: 'consonants', subtopic: 'Kétjegyű kettőzése', isCorrect: true, userAnswer: 'öccsével', timestamp: Date.now() - 2800000 },
        { exerciseId: 'jly-1', topicId: 'j-ly', subtopic: 'Madarak nevei', isCorrect: true, userAnswer: 'papagáj', timestamp: Date.now() - 2500000 },
        { exerciseId: 'jly-2', topicId: 'j-ly', subtopic: 'Szó eleji j és ly', isCorrect: true, userAnswer: 'lyuk', timestamp: Date.now() - 2300000 },
        { exerciseId: 'sd-6', topicId: 'sound-diff', subtopic: '-dt szavak', isCorrect: false, userAnswer: 'aluttam', timestamp: Date.now() - 1000000 },
      ],
      unlockedBadgeIds: ['first-step', 'five-done'],
      createdAt: Date.now() - 86400000,
      lastActive: Date.now() - 1000000,
    },
    {
      id: 'demo_bence',
      name: 'Bence',
      className: '2.a',
      avatar: 'roka',
      stars: 8,
      coins: 25,
      completedExerciseIds: ['vow-1', 'cons-1', 'abc-1', 'syl-1'],
      answerLogs: [
        { exerciseId: 'vow-1', topicId: 'vowels', subtopic: 'Jelentésmegkülönböztető', isCorrect: true, userAnswer: 'húrok', timestamp: Date.now() - 5000000 },
        { exerciseId: 'cons-1', topicId: 'consonants', subtopic: 'Egy-, két- és háromjegyű', isCorrect: true, userAnswer: 'cs, gy, ny, sz, ty, zs', timestamp: Date.now() - 4800000 },
        { exerciseId: 'abc-1', topicId: 'alphabet', subtopic: 'Ábécé szomszédok', isCorrect: true, userAnswer: 'dz és dzs', timestamp: Date.now() - 4500000 },
        { exerciseId: 'jly-1', topicId: 'j-ly', subtopic: 'Madarak nevei', isCorrect: false, userAnswer: 'gólya', timestamp: Date.now() - 4000000 },
      ],
      unlockedBadgeIds: ['first-step'],
      createdAt: Date.now() - 86400000,
      lastActive: Date.now() - 4000000,
    },
    {
      id: 'demo_mate',
      name: 'Máté',
      className: '2.b',
      avatar: 'bagoly',
      stars: 18,
      coins: 60,
      completedExerciseIds: ['vow-1', 'vow-2', 'vow-3', 'cons-1', 'cons-2', 'jly-1', 'jly-2', 'abc-1', 'syl-1', 'syl-2', 'sd-1', 'sd-2'],
      answerLogs: [
        { exerciseId: 'vow-1', topicId: 'vowels', subtopic: 'Jelentésmegkülönböztető', isCorrect: true, userAnswer: 'húrok', timestamp: Date.now() - 6000000 },
        { exerciseId: 'jly-1', topicId: 'j-ly', subtopic: 'Madarak nevei', isCorrect: true, userAnswer: 'papagáj', timestamp: Date.now() - 5500000 },
        { exerciseId: 'sd-1', topicId: 'sound-diff', subtopic: '-lj szavak', isCorrect: true, userAnswer: 'éljen', timestamp: Date.now() - 5000000 },
      ],
      unlockedBadgeIds: ['first-step', 'five-done', 'ten-done'],
      createdAt: Date.now() - 86400000,
      lastActive: Date.now() - 2000000,
    },
    {
      id: 'demo_eszter',
      name: 'Eszter',
      className: '2.b',
      avatar: 'fecske',
      stars: 11,
      coins: 35,
      completedExerciseIds: ['vow-1', 'vow-3', 'cons-1', 'jly-1'],
      answerLogs: [
        { exerciseId: 'vow-1', topicId: 'vowels', subtopic: 'Jelentésmegkülönböztető', isCorrect: true, userAnswer: 'húrok', timestamp: Date.now() - 7000000 },
        { exerciseId: 'vow-4', topicId: 'vowels', subtopic: 'Szóvégi -ú, -u kivételek', isCorrect: false, userAnswer: 'koszorú', timestamp: Date.now() - 6500000 },
      ],
      unlockedBadgeIds: ['first-step'],
      createdAt: Date.now() - 86400000,
      lastActive: Date.now() - 3000000,
    },
    {
      id: 'demo_dani',
      name: 'Dani',
      className: '2.c',
      avatar: 'mokus',
      stars: 6,
      coins: 20,
      completedExerciseIds: ['vow-1', 'cons-1'],
      answerLogs: [
        { exerciseId: 'vow-1', topicId: 'vowels', subtopic: 'Jelentésmegkülönböztető', isCorrect: true, userAnswer: 'húrok', timestamp: Date.now() - 8000000 },
      ],
      unlockedBadgeIds: ['first-step'],
      createdAt: Date.now() - 86400000,
      lastActive: Date.now() - 4000000,
    },
  ];

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(defaultStudents));
      localStorage.setItem(ACTIVE_PROFILE_KEY, defaultStudents[0].id);
    } catch {
      // Ignored
    }
  }
  return defaultStudents;
}
