export type TopicId = 
  | 'vowels'        // Magánhangzók (rövid-hosszú, szóvégi ó/ő/ú/ű)
  | 'consonants'    // Mássalhangzók (egy-, két-, háromjegyű, kettőzött)
  | 'j-ly'          // A j hang jelölése (j és ly szavak, madarak, szabályok)
  | 'alphabet'      // Ábécé és betűrend
  | 'syllables'     // Szótagolás és elválasztás
  | 'sound-diff'    // Kiejtéstől eltérő helyesírás (-lj, -nj, -dj, -tj, -ts, -dt)
  | 'sentences';    // A mondat és mondatfajták (kijelentő, kérdő, -e kérdőszó)

export type ExerciseType = 
  | 'single-choice'
  | 'fill-gap'
  | 'classification'
  | 'letter-order'
  | 'toto'
  | 'sentence-punct';

export interface ExerciseOption {
  id: string;
  label: string;
  isCorrect?: boolean;
}

export interface ExerciseItem {
  id: string;
  topicId: TopicId;
  subtopic: string;
  title: string;
  instruction: string;
  type: ExerciseType;
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  ruleQuote: string;
  hint?: string;
  words?: string[]; // for classification or sorting
  categories?: { id: string; name: string; targetWords: string[] }[];
}

export interface AnswerLog {
  exerciseId: string;
  topicId: TopicId;
  subtopic: string;
  isCorrect: boolean;
  userAnswer: string | string[];
  timestamp: number;
}

export interface StudentProfile {
  id: string;
  name: string;
  className: string; // e.g. "2.a", "2.b"
  avatar: string; // "suni" | "roka" | "bagoly" | "beka" | "fecske" | "mokus"
  stars: number;
  coins: number;
  completedExerciseIds: string[];
  answerLogs: AnswerLog[];
  unlockedBadgeIds: string[];
  createdAt: number;
  lastActive: number;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedIf: (profile: StudentProfile) => boolean;
}

export interface TopicMeta {
  id: TopicId;
  title: string;
  shortDesc: string;
  color: string;
  badgeBg: string;
  iconName: string;
  textbookRef: string; // e.g. "Tankönyv 14-27. oldal"
  ruleSummary: string;
}

export interface DiagnosticCategoryReport {
  topicId: TopicId;
  topicTitle: string;
  totalAnswered: number;
  correctCount: number;
  percentage: number;
  status: 'mastered' | 'developing' | 'needs-practice' | 'not-started';
  strengths: string[];
  weaknesses: string[];
  tips: string[];
}
