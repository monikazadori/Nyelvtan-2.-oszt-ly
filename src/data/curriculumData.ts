import { TopicId, TopicMeta, ExerciseItem, Badge } from '../types';
import { VOWELS_EXERCISES } from './vowelsExercises';
import { CONSONANTS_EXERCISES } from './consonantsExercises';
import { JLY_EXERCISES } from './jlyExercises';
import { ALPHABET_EXERCISES } from './alphabetExercises';
import { SYLLABLES_EXERCISES } from './syllablesExercises';
import { SOUND_DIFF_EXERCISES } from './soundDiffExercises';
import { SENTENCES_EXERCISES } from './sentencesExercises';

export const GRADE_LEVELS = [
  { id: '2', label: '2. osztály (Év végi ismétlés)', badge: '2. osztály' },
  { id: '3', label: '3. osztály (Év eleji diagnosztika & ismétlés)', badge: '3. osztály' },
] as const;

export const DEFAULT_CLASSES = [
  '2.a', '2.b', '2.c', '2.d',
  '3.a', '3.b', '3.c', '3.d'
];

export const AVATARS = [
  { id: 'suni', name: 'Süni Samu', emoji: '🦔', desc: 'A megfontolt erdőjáró' },
  { id: 'bagoly', name: 'Bagoly Berci', emoji: '🦉', desc: 'A bölcs betűmester' },
  { id: 'roka', name: 'Róka Rudi', emoji: '🦊', desc: 'A furfangos rejtvényfejtő' },
  { id: 'beka', name: 'Ugribugri Béka', emoji: '🐸', desc: 'A vidám szótagugró' },
  { id: 'fecske', name: 'Fecske Fanni', emoji: '🐦', desc: 'A szárnyaló olvasó' },
  { id: 'mokus', name: 'Mókus Miki', emoji: '🐿️', desc: 'A szorgalmas pontgyűjtő' },
];

export const TOPICS: TopicMeta[] = [
  {
    id: 'vowels',
    title: 'Magánhangzók világa',
    shortDesc: 'Rövid és hosszú párok, a szóvégi ó, ő, ú, ű szabályai',
    color: 'from-amber-500 to-orange-500',
    badgeBg: 'bg-amber-100 text-amber-800 border-amber-300',
    iconName: 'Sparkles',
    textbookRef: 'Tankönyv 14–27. oldal',
    ruleSummary: 'A szó végén az ó hosszú. Kivétel: no, nono.\nA szóvégi ő, ú, ű írására külön figyelünk. Megjegyezzük a rövid u és ü végű szavakat, például: kapu, falu, daru, hamu, apu, anyu, eskü, menü.',
  },
  {
    id: 'consonants',
    title: 'Mássalhangzók és kettőzések',
    shortDesc: 'Egy-, két- és háromjegyű betűk, hosszú mássalhangzók',
    color: 'from-blue-500 to-cyan-500',
    badgeBg: 'bg-blue-100 text-blue-800 border-blue-300',
    iconName: 'Layers',
    textbookRef: 'Tankönyv 28–39. oldal',
    ruleSummary: 'Kétjegyű mássalhangzók: cs, dz, gy, ly, ny, sz, ty, zs. Háromjegyű: dzs. Kétjegyűek kettőzésekor az első betűt duplázzuk: öccs, fütty, meggy, gally!',
  },
  {
    id: 'j-ly',
    title: 'A titokzatos j és ly',
    shortDesc: 'Melyik szóba illik a j és a ly? Madárnevek, totó',
    color: 'from-emerald-500 to-teal-500',
    badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    iconName: 'HelpCircle',
    textbookRef: 'Tankönyv 40–44. oldal',
    ruleSummary: 'A szavak elején MINDIG j-t írunk, egyetlen kivétel a "lyuk" és családja! A legtöbb madárnév ly: gólya, bagoly, sólyom, sirály, pulyka (de: fürj, héja, papagáj j!).',
  },
  {
    id: 'alphabet',
    title: 'Ábécé és betűrend',
    shortDesc: 'Betűk sorrendje, szomszédok, névsorok készítése',
    color: 'from-purple-500 to-indigo-500',
    badgeBg: 'bg-purple-100 text-purple-800 border-purple-300',
    iconName: 'ListOrdered',
    textbookRef: 'Tankönyv 45–46. oldal',
    ruleSummary: 'A szavakat a kezdőbetűjük ábécébeli helye szerint állítjuk betűrendbe. Így könnyű eligazodni a szótárakban és a névsorban.',
  },
  {
    id: 'syllables',
    title: 'Szótagolás és elválasztás',
    shortDesc: 'Szótagszám, magánhangzók találkozása, összetett szavak',
    color: 'from-pink-500 to-rose-500',
    badgeBg: 'bg-pink-100 text-pink-800 border-pink-300',
    iconName: 'Scissors',
    textbookRef: 'Tankönyv 51–67. oldal',
    ruleSummary: 'Minden szó annyi szótagú, ahány magánhangzó van benne! Egy szótagú szót nem választunk el. Hosszú kétjegyűnél: galy-lyak, haty-tyú, köny-nyű.',
  },
  {
    id: 'sound-diff',
    title: 'Kiejtéstől eltérő helyesírás',
    shortDesc: '-lj, -nj, -dj, -tj, -ts, -dt hangkapcsolatok',
    color: 'from-red-500 to-amber-600',
    badgeBg: 'bg-red-100 text-red-800 border-red-300',
    iconName: 'Ear',
    textbookRef: 'Tankönyv 75–94. oldal',
    ruleSummary: 'Másképp ejtjük, másképp írjuk! Segít a szótagolás és a szótő: lát-juk (ty hang), mond-ja (gy hang), ba-rát-ság (cs hang), tu-dok -> tud-tam (tt hang).',
  },
  {
    id: 'sentences',
    title: 'A mondat és mondatfajták',
    shortDesc: 'Kijelentő és kérdő mondatok, írásjelek, az -e kérdőszó',
    color: 'from-violet-500 to-fuchsia-500',
    badgeBg: 'bg-violet-100 text-violet-800 border-violet-300',
    iconName: 'MessageSquare',
    textbookRef: 'Tankönyv 95–109. oldal',
    ruleSummary: 'A mondat eleje mindig nagybetű! Kijelentő mondat végére pontot (.) teszünk. Kérdő mondat végére kérdőjelet (?). Az -e kérdőszót kötőjellel írjuk: Tudod-e?',
  },
];

export const EXERCISES: ExerciseItem[] = [
  ...VOWELS_EXERCISES,
  ...CONSONANTS_EXERCISES,
  ...JLY_EXERCISES,
  ...ALPHABET_EXERCISES,
  ...SYLLABLES_EXERCISES,
  ...SOUND_DIFF_EXERCISES,
  ...SENTENCES_EXERCISES,
];

export const BADGES: Badge[] = [
  {
    id: 'first-step',
    title: 'Süni Barátja',
    description: 'Megoldottad az első feladatodat!',
    icon: '🦔',
    unlockedIf: (p) => p.completedExerciseIds.length >= 1,
  },
  {
    id: 'five-done',
    title: 'Szorgalmas Mókus',
    description: 'Legalább 5 feladatot sikeresen teljesítettél!',
    icon: '🐿️',
    unlockedIf: (p) => p.completedExerciseIds.length >= 5,
  },
  {
    id: 'ten-done',
    title: 'Nyelvtan Bajnok',
    description: '10 feladatot sikeresen megoldottál!',
    icon: '🏆',
    unlockedIf: (p) => p.completedExerciseIds.length >= 10,
  },
  {
    id: 'perfect-topic',
    title: 'Bagoly Bölcsessége',
    description: 'Egy témakörben elérted a 100%-os pontosságot!',
    icon: '🦉',
    unlockedIf: (p) => {
      // Check if any topic has at least 3 correct and 100%
      const topicCounts: Record<string, { total: number; correct: number }> = {};
      p.answerLogs.forEach(l => {
        if (!topicCounts[l.topicId]) topicCounts[l.topicId] = { total: 0, correct: 0 };
        topicCounts[l.topicId].total++;
        if (l.isCorrect) topicCounts[l.topicId].correct++;
      });
      return Object.values(topicCounts).some(c => c.total >= 3 && c.correct === c.total);
    },
  },
  {
    id: 'master-speller',
    title: 'Aranytollas Kalandor',
    description: 'Több mint 20 helyes választ adtál és elérted a 4. szintet!',
    icon: '⭐',
    unlockedIf: (p) => p.stars >= 20,
  },
  {
    id: 'all-topics',
    title: 'Minden Tudás Őrzője',
    description: 'Kipróbáltad mind a 7 tananyagrészt!',
    icon: '👑',
    unlockedIf: (p) => {
      const topicsVisited = new Set(p.answerLogs.map(l => l.topicId));
      return topicsVisited.size >= 7;
    },
  },
];
