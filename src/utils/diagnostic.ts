import { StudentProfile, DiagnosticCategoryReport, TopicId } from '../types';
import { TOPICS, EXERCISES } from '../data/curriculumData';

export interface ComprehensiveReport {
  overallScore: number;
  totalAnswered: number;
  correctTotal: number;
  accuracyRate: number;
  categoryReports: DiagnosticCategoryReport[];
  topStrengths: string[];
  priorityImprovements: { topicTitle: string; advice: string; rule: string }[];
  missedExerciseIds: string[];
}

export function generateStudentDiagnostic(profile: StudentProfile): ComprehensiveReport {
  const logs = profile.answerLogs;
  const totalAnswered = logs.length;
  const correctTotal = logs.filter((l) => l.isCorrect).length;
  const accuracyRate = totalAnswered > 0 ? Math.round((correctTotal / totalAnswered) * 100) : 0;

  const missedSet = new Set<string>();
  logs.forEach((l) => {
    if (!l.isCorrect) {
      missedSet.add(l.exerciseId);
    }
  });

  const categoryReports: DiagnosticCategoryReport[] = TOPICS.map((topic) => {
    const topicLogs = logs.filter((l) => l.topicId === topic.id);
    const count = topicLogs.length;
    const correct = topicLogs.filter((l) => l.isCorrect).length;
    const pct = count > 0 ? Math.round((correct / count) * 100) : 0;

    let status: DiagnosticCategoryReport['status'] = 'not-started';
    if (count > 0) {
      if (pct >= 85) status = 'mastered';
      else if (pct >= 60) status = 'developing';
      else status = 'needs-practice';
    }

    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const tips: string[] = [];

    // Specific pedagogical diagnostics by topic
    switch (topic.id) {
      case 'vowels':
        if (pct >= 80) {
          strengths.push('Biztosan felismered a rövid és hosszú magánhangzópárokat.');
          strengths.push('Tudod, hogy a szavak végén az -ó és az -ő mindig hosszú.');
        } else if (count > 0) {
          weaknesses.push('A szóvégi -u és -ú kivételek még bizonytalanok.');
          tips.push('Jegyezd meg a rövid -u végű szavakat: falu, kapu, bábu, anyu, apu, daru, hamu, lapu!');
          tips.push('A szavak végén az -ó és az -ő mindig hosszú: olló, erdő, szőlő!');
        }
        break;

      case 'consonants':
        if (pct >= 80) {
          strengths.push('Kiválóan megkülönbözteted az egy-, két- és háromjegyű (dzs) mássalhangzókat.');
          strengths.push('Hibátlan a kétjegyű mássalhangzók kettőzése (öccs, meggy, gally).');
        } else if (count > 0) {
          weaknesses.push('A kétjegyű mássalhangzók kettőzésének szabályát érdemes átismételni.');
          tips.push('Hosszú kétjegyűnél csak az első betűt duplázzuk meg: öccs (nem öcscs), fütty (nem fütyty)!');
        }
        break;

      case 'j-ly':
        if (pct >= 80) {
          strengths.push('Remekül tájékozódsz a j és ly betűs szavak birodalmában.');
          strengths.push('Ismered a ritka madárneveket és a „lyuk” alapszabályát.');
        } else if (count > 0) {
          weaknesses.push('Gyakorold a j és ly betűk helyes használatát!');
          tips.push('A szavak elején MINDIG j-t írunk, kivéve a „lyuk” és családját (lyukas, lyukasztó).');
          tips.push('Madarak: gólya, bagoly, sólyom, sirály (ly), de a papagáj, héja és fürj j-vel írandó!');
        }
        break;

      case 'alphabet':
        if (pct >= 80) {
          strengths.push('Biztosan ismered az ábécé betűrendi sorrendjét és a betűk szomszédait.');
          strengths.push('Könnyedén állítasz össze névsorokat a kezdőbetűk alapján.');
        } else if (count > 0) {
          weaknesses.push('A betűrendi sorba állításnál még előfordul tévesztés.');
          tips.push('Mondogasd a magyar ábécét ritmusosan, figyelve az összetett betűkre (c, cs, d, dz, dzs)!');
        }
        break;

      case 'syllables':
        if (pct >= 80) {
          strengths.push('Tudod, hogy minden szó annyi szótagú, ahány magánhangzó van benne.');
          strengths.push('Ismered a szomszédos magánhangzók (di-ó, te-a) és a hosszú mássalhangzók elválasztását.');
        } else if (count > 0) {
          weaknesses.push('A hosszú kétjegyű mássalhangzós szavak elválasztása még gyakorlást igényel.');
          tips.push('Egy szótagú szót (nyár, fúj, fűt) sosem választunk el!');
          tips.push('Kétjegyűnél mindkét szótagba kiírjuk a teljes betűt: haty-tyú, galy-lyak, köny-nyű!');
        }
        break;

      case 'sound-diff':
        if (pct >= 80) {
          strengths.push('Kiválóan felismered a kiejtéstől eltérő szavakat (-lj, -nj, -dj, -tj, -ts, -dt).');
          strengths.push('A szótagolás segítségével le tudod vezetni a helyes írásmódot.');
        } else if (count > 0) {
          weaknesses.push('A kiejtés becsapós lehet: amit hallasz (ty, gy, cs, tt), azt nem mindig úgy írod!');
          tips.push('Gondolj a szótőre: lát + juk -> látjuk; alud + tam -> aludtam; barát + ság -> barátság!');
        }
        break;

      case 'sentences':
        if (pct >= 80) {
          strengths.push('Magabiztosan megkülönbözteted a kijelentő és a kérdő mondatokat.');
          strengths.push('Tudod, hogy az -e kérdőszócskát kötőjellel kötjük a szóhoz.');
        } else if (count > 0) {
          weaknesses.push('Figyelj jobban a mondatvégi írásjelekre és az -e kérdőszóra.');
          tips.push('Kijelentő mondat végére pont (.), kérdő mondat végére kérdőjel (?) jár.');
          tips.push('Az -e kérdőszót mindig kötőjellel kapcsold: „Tudod-e a verset?”');
        }
        break;
    }

    return {
      topicId: topic.id,
      topicTitle: topic.title,
      totalAnswered: count,
      correctCount: correct,
      percentage: pct,
      status,
      strengths,
      weaknesses,
      tips,
    };
  });

  // Compile top strengths & priority improvements
  const topStrengths: string[] = [];
  const priorityImprovements: { topicTitle: string; advice: string; rule: string }[] = [];

  categoryReports.forEach((rep) => {
    if (rep.status === 'mastered') {
      topStrengths.push(...rep.strengths);
    } else if (rep.status === 'needs-practice' || rep.status === 'developing') {
      if (rep.weaknesses.length > 0 && rep.tips.length > 0) {
        const topic = TOPICS.find((t) => t.id === rep.topicId);
        priorityImprovements.push({
          topicTitle: rep.topicTitle,
          advice: rep.weaknesses[0],
          rule: rep.tips[0] || (topic?.ruleSummary ?? ''),
        });
      }
    }
  });

  if (topStrengths.length === 0 && totalAnswered > 0) {
    topStrengths.push('Nagyszerű szorgalommal láttál neki a feladatok gyakorlásának!');
  }

  return {
    overallScore: profile.stars * 10 + profile.coins * 5,
    totalAnswered,
    correctTotal,
    accuracyRate,
    categoryReports,
    topStrengths,
    priorityImprovements,
    missedExerciseIds: Array.from(missedSet),
  };
}

export interface ClassSummary {
  className: string;
  studentCount: number;
  classAverageAccuracy: number;
  totalExercisesDone: number;
  strongestTopic: string;
  mostChallengingTopic: string;
  topicAverages: { topicId: TopicId; title: string; averagePct: number }[];
}

export function generateClassDiagnostic(profiles: StudentProfile[], className: string): ClassSummary {
  const classStudents = profiles.filter((p) => p.className === className);
  const studentCount = classStudents.length;

  if (studentCount === 0) {
    return {
      className,
      studentCount: 0,
      classAverageAccuracy: 0,
      totalExercisesDone: 0,
      strongestTopic: 'Nincs elég adat',
      mostChallengingTopic: 'Nincs elég adat',
      topicAverages: TOPICS.map((t) => ({ topicId: t.id, title: t.title, averagePct: 0 })),
    };
  }

  let totalLogs = 0;
  let correctLogs = 0;

  const topicTotals: Record<string, { total: number; correct: number }> = {};
  TOPICS.forEach((t) => {
    topicTotals[t.id] = { total: 0, correct: 0 };
  });

  classStudents.forEach((st) => {
    totalLogs += st.answerLogs.length;
    st.answerLogs.forEach((log) => {
      if (log.isCorrect) correctLogs++;
      if (topicTotals[log.topicId]) {
        topicTotals[log.topicId].total++;
        if (log.isCorrect) topicTotals[log.topicId].correct++;
      }
    });
  });

  const classAverageAccuracy = totalLogs > 0 ? Math.round((correctLogs / totalLogs) * 100) : 0;

  const topicAverages = TOPICS.map((t) => {
    const data = topicTotals[t.id];
    const pct = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
    return {
      topicId: t.id,
      title: t.title,
      averagePct: pct,
    };
  });

  const sorted = [...topicAverages].filter((t) => topicTotals[t.topicId].total > 0).sort((a, b) => b.averagePct - a.averagePct);

  const strongestTopic = sorted.length > 0 ? sorted[0].title : 'Még nincs elég adat';
  const mostChallengingTopic = sorted.length > 0 ? sorted[sorted.length - 1].title : 'Még nincs elég adat';

  return {
    className,
    studentCount,
    classAverageAccuracy,
    totalExercisesDone: totalLogs,
    strongestTopic,
    mostChallengingTopic,
    topicAverages,
  };
}
