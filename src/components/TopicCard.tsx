import React from 'react';
import { Sparkles, CheckCircle2, AlertCircle, ArrowRight, BookOpen } from 'lucide-react';
import { TopicMeta, StudentProfile } from '../types';
import { EXERCISES } from '../data/curriculumData';

interface TopicCardProps {
  topic: TopicMeta;
  profile: StudentProfile | null;
  onSelectTopic: (topicId: string) => void;
}

export const TopicCard: React.FC<TopicCardProps> = ({ topic, profile, onSelectTopic }) => {
  const topicExercises = EXERCISES.filter((e) => e.topicId === topic.id);
  const totalInTopic = topicExercises.length;

  const completedCount = profile?.completedExerciseIds.filter((id) =>
    topicExercises.some((e) => e.id === id)
  ).length || 0;

  const topicLogs = profile?.answerLogs.filter((l) => l.topicId === topic.id) || [];
  const correctCount = topicLogs.filter((l) => l.isCorrect).length;
  const accuracy = topicLogs.length > 0 ? Math.round((correctCount / topicLogs.length) * 100) : 0;

  const isMastered = accuracy >= 80 && completedCount >= Math.min(2, totalInTopic);
  const isStarted = topicLogs.length > 0;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 hover:border-orange-300 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between group">
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <span className={`text-[11px] font-black px-2.5 py-1 rounded-full border ${topic.badgeBg}`}>
            {topic.textbookRef}
          </span>

          {isMastered ? (
            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Erősség (Mesteri)</span>
            </span>
          ) : isStarted ? (
            <span className="flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
              <span>Gyakorlás alatt ({accuracy}%)</span>
            </span>
          ) : (
            <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
              Új tananyag
            </span>
          )}
        </div>

        {/* Title & Desc */}
        <h3 className="text-lg font-black text-slate-800 group-hover:text-orange-600 transition-colors mb-1">
          {topic.title}
        </h3>
        <p className="text-xs text-slate-500 font-medium leading-relaxed mb-4">
          {topic.shortDesc}
        </p>

        {/* Rule Highlight Pill */}
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3 mb-4 flex items-start gap-2">
          <BookOpen className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-[11px] text-amber-900 font-semibold leading-normal">
            <span className="font-extrabold text-amber-950">Aranyszabály: </span>
            {topic.ruleSummary}
          </p>
        </div>
      </div>

      {/* Footer / Progress & Action */}
      <div>
        <div className="space-y-1.5 mb-4">
          <div className="flex justify-between text-[11px] font-bold text-slate-600">
            <span>Teljesítés:</span>
            <span>
              {completedCount} / {totalInTopic} feladat
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full bg-linear-to-r ${topic.color} transition-all duration-500 rounded-full`}
              style={{
                width: `${totalInTopic > 0 ? (completedCount / totalInTopic) * 100 : 0}%`,
              }}
            />
          </div>
        </div>

        <button
          onClick={() => onSelectTopic(topic.id)}
          className="w-full py-2.5 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs hover:shadow-md shadow-orange-200 transition-all group-hover:scale-101"
        >
          <span>Gyakorlás indítása</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};
