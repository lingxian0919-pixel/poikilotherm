'use client';

import { useCallback, useEffect, useState } from 'react';
import { supabase, type Submission } from '@/lib/supabase';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString('ko-KR', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function AssessmentList({ refreshKey }: { refreshKey?: number }) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Submission | null>(null);
  const [grading, setGrading] = useState({ teacher_score: '', feedback: '' });
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error) setSubmissions((data as Submission[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions, refreshKey]);

  const filtered = submissions.filter((s) => {
    const q = search.toLowerCase();
    return (
      s.student_id.toLowerCase().includes(q) ||
      s.student_name.toLowerCase().includes(q) ||
      s.subject.toLowerCase().includes(q)
    );
  });

  function openModal(sub: Submission) {
    setSelected(sub);
    setGrading({
      teacher_score: sub.teacher_score !== null ? String(sub.teacher_score) : '',
      feedback: sub.feedback ?? '',
    });
    setSaveMsg('');
  }

  function closeModal() {
    setSelected(null);
    setSaveMsg('');
  }

  async function handleSaveGrading() {
    if (!selected) return;
    const score = parseInt(grading.teacher_score);
    if (isNaN(score) || score < 0 || score > 100) {
      setSaveMsg('❌ 점수는 0~100 사이의 숫자여야 합니다.');
      return;
    }
    setSaving(true);
    const { error } = await supabase
      .from('submissions')
      .update({
        teacher_score: score,
        feedback: grading.feedback.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', selected.id);
    setSaving(false);
    if (error) {
      setSaveMsg(`❌ 저장 실패: ${error.message}`);
    } else {
      setSaveMsg('✅ 채점이 저장되었습니다!');
      fetchSubmissions();
      setTimeout(() => {
        setSelected(null);
        setSaveMsg('');
      }, 1500);
    }
  }

  const selfScoreLabel = (score: number) =>
    ['', '매우 부족', '부족', '보통', '우수', '매우 우수'][score] ?? '';

  return (
    <div className="flex flex-col gap-4">
      {/* 검색창 + 새로고침 */}
      <div className="flex gap-3 items-center">
        <div className="flex-1 relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500 text-sm">🔍</span>
          <input
            id="search-submissions"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="학번, 이름, 주제로 검색..."
            className="w-full pl-9 pr-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all text-sm"
          />
        </div>
        <button
          id="refresh-submissions-btn"
          onClick={fetchSubmissions}
          disabled={loading}
          className="px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all text-sm font-medium disabled:opacity-50"
        >
          {loading ? '⏳' : '🔄'} 새로고침
        </button>
      </div>

      {/* 목록 */}
      {loading ? (
        <div className="flex flex-col gap-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 rounded-2xl bg-slate-100 dark:bg-zinc-800 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400 dark:text-zinc-600">
          <span className="text-5xl">📭</span>
          <p className="text-sm font-medium">
            {search ? '검색 결과가 없습니다.' : '아직 제출된 수행평가가 없습니다.'}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((sub) => (
            <button
              key={sub.id}
              onClick={() => openModal(sub)}
              className="group text-left w-full p-5 rounded-2xl border border-slate-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 hover:border-indigo-500 dark:hover:border-indigo-400 hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-800 dark:text-zinc-200 text-sm">
                      {sub.student_name}
                    </span>
                    <span className="text-xs font-mono text-slate-500 dark:text-zinc-500 bg-slate-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
                      {sub.student_id}
                    </span>
                    <span className="text-xs text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded-full border border-indigo-100 dark:border-indigo-900/30">
                      {sub.subject}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-zinc-500 truncate">
                    {sub.content.slice(0, 80)}...
                  </p>
                  <p className="text-xs text-slate-400 dark:text-zinc-600">{formatDate(sub.created_at)}</p>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  {sub.teacher_score !== null ? (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50">
                      ✅ {sub.teacher_score}점
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50">
                      ⏳ 채점 대기
                    </span>
                  )}
                  <span className="text-xs text-slate-400 dark:text-zinc-600">
                    자기평가 {'⭐'.repeat(sub.self_score)}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* 채점 모달 */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-zinc-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-zinc-700 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
            {/* 모달 헤더 */}
            <div className="px-6 pt-6 pb-4 border-b border-slate-100 dark:border-zinc-800">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-zinc-100">{selected.student_name}</h2>
                    <span className="text-xs font-mono text-slate-500 dark:text-zinc-500 bg-slate-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">{selected.student_id}</span>
                  </div>
                  <p className="text-sm text-indigo-600 dark:text-indigo-400">{selected.subject}</p>
                </div>
                <button
                  id="close-grading-modal"
                  onClick={closeModal}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:text-zinc-600 dark:hover:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all text-lg"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* 모달 내용 */}
            <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
              {/* 제출 내용 */}
              <div className="flex flex-col gap-2">
                <h3 className="text-xs font-semibold text-slate-500 dark:text-zinc-500 uppercase tracking-wider">수행평가 내용</h3>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-100 dark:border-zinc-700/50 text-sm text-slate-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
                  {selected.content}
                </div>
              </div>

              {/* 자기평가 정보 */}
              <div className="flex items-center gap-3 p-4 rounded-xl bg-sky-50 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900/30">
                <span className="text-2xl">{'⭐'.repeat(selected.self_score)}</span>
                <div>
                  <p className="text-sm font-semibold text-sky-700 dark:text-sky-400">자기평가 {selected.self_score}점</p>
                  <p className="text-xs text-sky-600 dark:text-sky-500">{selfScoreLabel(selected.self_score)}</p>
                </div>
              </div>

              {/* 교사 채점 */}
              <div className="flex flex-col gap-3">
                <h3 className="text-xs font-semibold text-slate-500 dark:text-zinc-500 uppercase tracking-wider">교사 채점</h3>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="teacher_score" className="text-sm font-medium text-slate-700 dark:text-zinc-300">
                    점수 <span className="text-slate-400 text-xs">(0 ~ 100)</span>
                  </label>
                  <input
                    id="teacher_score"
                    type="number"
                    min={0}
                    max={100}
                    value={grading.teacher_score}
                    onChange={(e) => setGrading((prev) => ({ ...prev, teacher_score: e.target.value }))}
                    placeholder="점수를 입력하세요"
                    className="px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all text-sm"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="teacher_feedback" className="text-sm font-medium text-slate-700 dark:text-zinc-300">
                    피드백 <span className="text-slate-400 text-xs">(선택사항)</span>
                  </label>
                  <textarea
                    id="teacher_feedback"
                    rows={4}
                    value={grading.feedback}
                    onChange={(e) => setGrading((prev) => ({ ...prev, feedback: e.target.value }))}
                    placeholder="학생에게 전달할 피드백을 작성해 주세요..."
                    className="px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all text-sm resize-none leading-relaxed"
                  />
                </div>
              </div>

              {/* 저장 메시지 */}
              {saveMsg && (
                <div className={`text-sm px-4 py-3 rounded-xl border ${saveMsg.includes('✅') ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/50 text-emerald-600 dark:text-emerald-400' : 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/50 text-rose-600 dark:text-rose-400'}`}>
                  {saveMsg}
                </div>
              )}
            </div>

            {/* 모달 푸터 */}
            <div className="px-6 py-4 border-t border-slate-100 dark:border-zinc-800 flex gap-3">
              <button
                onClick={closeModal}
                className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400 text-sm font-medium hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all"
              >
                닫기
              </button>
              <button
                id="save-grading-btn"
                onClick={handleSaveGrading}
                disabled={saving}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 disabled:from-slate-400 disabled:to-slate-400 text-white text-sm font-semibold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all"
              >
                {saving ? '저장 중...' : '💾 채점 저장'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
