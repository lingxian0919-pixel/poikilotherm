'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

const SUBJECTS = [
  '과학 탐구 보고서',
  '수학 문제 해결 과정',
  '국어 독서 감상문',
  '영어 에세이',
  '사회 조사 보고서',
  '역사 연구 발표',
  '미술 작품 분석',
  '체육 실기 평가',
  '기술 프로젝트',
  '직접 입력',
];

export default function AssessmentForm({ onSubmitted }: { onSubmitted?: () => void }) {
  const [form, setForm] = useState({
    student_id: '',
    student_name: '',
    subject: '',
    subject_custom: '',
    content: '',
    self_score: 3,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  }

  function handleScoreClick(score: number) {
    setForm((prev) => ({ ...prev, self_score: score }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const subject = form.subject === '직접 입력' ? form.subject_custom.trim() : form.subject;

    if (!form.student_id.trim()) return setError('학번을 입력해 주세요.');
    if (!form.student_name.trim()) return setError('이름을 입력해 주세요.');
    if (!subject) return setError('평가 주제를 선택하거나 입력해 주세요.');
    if (form.content.trim().length < 20)
      return setError('수행평가 내용을 20자 이상 작성해 주세요.');

    setLoading(true);
    setError('');

    const { error: dbError } = await supabase.from('submissions').insert([
      {
        student_id: form.student_id.trim(),
        student_name: form.student_name.trim(),
        subject,
        content: form.content.trim(),
        self_score: form.self_score,
      },
    ]);

    setLoading(false);

    if (dbError) {
      setError(`제출에 실패했습니다: ${dbError.message}`);
    } else {
      setSuccess(true);
      setForm({
        student_id: '',
        student_name: '',
        subject: '',
        subject_custom: '',
        content: '',
        self_score: 3,
      });
      onSubmitted?.();
      setTimeout(() => setSuccess(false), 4000);
    }
  }

  return (
    <div className="relative">
      {/* 성공 배너 */}
      {success && (
        <div className="mb-6 flex items-center gap-3 px-5 py-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400 animate-pulse">
          <span className="text-2xl">🎉</span>
          <div>
            <p className="font-semibold text-sm">수행평가가 성공적으로 제출되었습니다!</p>
            <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-0.5">
              교사가 확인 후 채점 및 피드백을 제공합니다.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* 학번 + 이름 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="student_id" className="text-sm font-semibold text-slate-700 dark:text-zinc-300">
              학번 <span className="text-rose-500">*</span>
            </label>
            <input
              id="student_id"
              name="student_id"
              type="text"
              value={form.student_id}
              onChange={handleChange}
              placeholder="예: 30101"
              maxLength={10}
              className="px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all text-sm"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="student_name" className="text-sm font-semibold text-slate-700 dark:text-zinc-300">
              이름 <span className="text-rose-500">*</span>
            </label>
            <input
              id="student_name"
              name="student_name"
              type="text"
              value={form.student_name}
              onChange={handleChange}
              placeholder="예: 홍길동"
              maxLength={20}
              className="px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all text-sm"
            />
          </div>
        </div>

        {/* 평가 주제 */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="subject" className="text-sm font-semibold text-slate-700 dark:text-zinc-300">
            평가 주제 / 과목 <span className="text-rose-500">*</span>
          </label>
          <select
            id="subject"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            className="px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all text-sm appearance-none"
          >
            <option value="">주제를 선택하세요</option>
            {SUBJECTS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          {form.subject === '직접 입력' && (
            <input
              name="subject_custom"
              type="text"
              value={form.subject_custom}
              onChange={handleChange}
              placeholder="평가 주제를 직접 입력해 주세요"
              maxLength={50}
              className="mt-2 px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all text-sm"
            />
          )}
        </div>

        {/* 수행평가 내용 */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="content" className="text-sm font-semibold text-slate-700 dark:text-zinc-300">
            수행평가 내용 <span className="text-rose-500">*</span>
            <span className="ml-2 font-normal text-slate-400 dark:text-zinc-500 text-xs">
              ({form.content.length}자)
            </span>
          </label>
          <textarea
            id="content"
            name="content"
            value={form.content}
            onChange={handleChange}
            rows={7}
            placeholder="수행평가 내용을 상세히 작성해 주세요 (최소 20자 이상)..."
            className="px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all text-sm resize-none leading-relaxed"
          />
        </div>

        {/* 자기평가 점수 */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-zinc-300">
            자기평가 점수 <span className="text-rose-500">*</span>
          </label>
          <div className="flex gap-2 flex-wrap">
            {[1, 2, 3, 4, 5].map((score) => (
              <button
                key={score}
                type="button"
                onClick={() => handleScoreClick(score)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200 ${
                  form.self_score === score
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200 dark:shadow-none scale-105'
                    : 'bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-700 hover:border-indigo-400 dark:hover:border-indigo-500'
                }`}
              >
                {'⭐'.repeat(score)} <span>{score}점</span>
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-400 dark:text-zinc-600 mt-0.5">
            1점(매우 부족) ~ 5점(매우 우수) 중 본인의 수행 수준을 선택하세요
          </p>
        </div>

        {/* 오류 메시지 */}
        {error && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/50 text-rose-600 dark:text-rose-400 text-sm">
            <span>⚠️</span> {error}
          </div>
        )}

        {/* 제출 버튼 */}
        <button
          id="submit-assessment-btn"
          type="submit"
          disabled={loading}
          className="w-full py-4 text-base font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 disabled:from-slate-400 disabled:to-slate-400 rounded-2xl shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/30 hover:scale-[1.01] active:scale-[0.99] disabled:scale-100 disabled:shadow-none transition-all duration-200"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              제출 중...
            </span>
          ) : (
            '📤 수행평가 제출하기'
          )}
        </button>
      </form>
    </div>
  );
}
