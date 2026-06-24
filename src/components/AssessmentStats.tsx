'use client';

import { useEffect, useState } from 'react';
import { supabase, type Submission } from '@/lib/supabase';

type Stats = {
  totalCount: number;
  pendingCount: number;
  avgTeacherScore: number | null;
  avgSelfScore: number;
};

export default function AssessmentStats() {
  const [stats, setStats] = useState<Stats>({
    totalCount: 0,
    pendingCount: 0,
    avgTeacherScore: null,
    avgSelfScore: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    setLoading(true);
    const { data, error } = await supabase
      .from('submissions')
      .select('self_score, teacher_score');

    if (error) {
      console.error('통계 데이터 조회 실패:', error);
      setLoading(false);
      return;
    }

    const submissions = data as Pick<Submission, 'self_score' | 'teacher_score'>[];
    const total = submissions.length;
    const pending = submissions.filter((s) => s.teacher_score === null).length;
    const graded = submissions.filter((s) => s.teacher_score !== null);
    const avgTeacher =
      graded.length > 0
        ? Math.round(graded.reduce((acc, s) => acc + (s.teacher_score ?? 0), 0) / graded.length * 10) / 10
        : null;
    const avgSelf =
      total > 0
        ? Math.round(submissions.reduce((acc, s) => acc + s.self_score, 0) / total * 10) / 10
        : 0;

    setStats({
      totalCount: total,
      pendingCount: pending,
      avgTeacherScore: avgTeacher,
      avgSelfScore: avgSelf,
    });
    setLoading(false);
  }

  const cards = [
    {
      icon: '📋',
      label: '총 제출 수',
      value: loading ? '—' : `${stats.totalCount}건`,
      sub: '전체 수행평가 제출',
      color: 'from-indigo-500 to-violet-500',
      bg: 'bg-indigo-50 dark:bg-indigo-950/40',
      border: 'border-indigo-100 dark:border-indigo-900/30',
      text: 'text-indigo-600 dark:text-indigo-400',
    },
    {
      icon: '⏳',
      label: '채점 대기',
      value: loading ? '—' : `${stats.pendingCount}건`,
      sub: '교사 채점 미완료',
      color: 'from-amber-500 to-orange-500',
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      border: 'border-amber-100 dark:border-amber-900/30',
      text: 'text-amber-600 dark:text-amber-400',
    },
    {
      icon: '🏆',
      label: '평균 채점 점수',
      value: loading ? '—' : stats.avgTeacherScore !== null ? `${stats.avgTeacherScore}점` : 'N/A',
      sub: '교사 채점 평균 (0~100)',
      color: 'from-emerald-500 to-teal-500',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      border: 'border-emerald-100 dark:border-emerald-900/30',
      text: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      icon: '⭐',
      label: '평균 자기평가',
      value: loading ? '—' : `${stats.avgSelfScore}점`,
      sub: '학생 자기평가 평균 (1~5)',
      color: 'from-sky-500 to-blue-500',
      bg: 'bg-sky-50 dark:bg-sky-950/40',
      border: 'border-sky-100 dark:border-sky-900/30',
      text: 'text-sky-600 dark:text-sky-400',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`relative p-5 rounded-2xl border ${card.border} ${card.bg} flex flex-col gap-3 overflow-hidden group hover:shadow-lg transition-all duration-300`}
        >
          {/* 배경 그라데이션 글로우 */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl`}
          />
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${card.text} bg-white dark:bg-zinc-900 shadow-sm`}>
            {card.icon}
          </div>
          <div>
            <div className={`text-2xl font-extrabold tracking-tight ${card.text}`}>{card.value}</div>
            <div className="text-sm font-semibold text-slate-700 dark:text-zinc-300 mt-0.5">{card.label}</div>
            <div className="text-xs text-slate-500 dark:text-zinc-500 mt-0.5">{card.sub}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
