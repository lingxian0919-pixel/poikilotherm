'use client';

import Link from "next/link";
import { useState } from "react";
import AssessmentForm from "@/components/AssessmentForm";
import AssessmentList from "@/components/AssessmentList";
import AssessmentStats from "@/components/AssessmentStats";

type Tab = 'student' | 'teacher';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('student');
  const [refreshKey, setRefreshKey] = useState(0);

  function handleSubmitted() {
    setRefreshKey((k) => k + 1);
  }

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      {/* 백그라운드 프리미엄 그라데이션 광원 효과 */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-slate-50 dark:bg-zinc-950 [background:radial-gradient(125%_125%_at_50%_10%,#f8fafc_45%,#e0e7ff_75%,#dbeafe_100%)] dark:[background:radial-gradient(125%_125%_at_50%_10%,#09090b_45%,#1e1b4b_80%,#1e293b_100%)]" />

      {/* 상단 헤더: Glassmorphism 적용 */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/60 dark:border-zinc-800/50 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* 로고 영역 */}
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 via-violet-600 to-sky-500 bg-clip-text text-transparent dark:from-indigo-400 dark:to-cyan-400">
              EduBuilder
            </span>
            <span className="hidden sm:inline-block text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50">
              v1.0
            </span>
          </div>

          {/* 네비게이션 바 공간 */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#assessment" className="text-sm font-medium text-slate-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              수행평가
            </Link>
            <Link href="#" className="text-sm font-medium text-slate-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              학습 도구
            </Link>
            <Link href="#" className="text-sm font-medium text-slate-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              성적 분석
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <button className="text-sm font-medium text-slate-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              로그인
            </button>
            <button className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-md shadow-indigo-200 dark:shadow-none hover:shadow-lg transition-all duration-200">
              무료 시작하기
            </button>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 영역 */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 flex flex-col items-center justify-center gap-16">
        
        {/* 메인 화면 (Hero Section) */}
        <section className="text-center max-w-4xl mx-auto flex flex-col items-center gap-6 md:gap-8">
          {/* 배지 디자인 */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100/80 dark:border-indigo-900/30">
            🚀 Supabase 연동 수행평가 시스템
          </span>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            스마트{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-sky-500 bg-clip-text text-transparent dark:from-indigo-400 dark:to-cyan-400">
              수행평가
            </span>{" "}
            시스템
          </h1>

          <p className="max-w-2xl text-base sm:text-lg md:text-xl text-slate-600 dark:text-zinc-400 leading-relaxed">
            학생은 수행평가를 제출하고, 교사는 실시간으로 채점·피드백을 제공합니다.
            모든 데이터는 Supabase 데이터베이스에 안전하게 저장됩니다.
          </p>

          {/* CTA 버튼 */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 w-full sm:w-auto">
            <a
              href="#assessment"
              className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 rounded-2xl shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 text-center"
            >
              수행평가 시작하기 ↓
            </a>
            <button className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 hover:bg-slate-50 dark:hover:bg-zinc-900 hover:text-slate-900 dark:hover:text-white rounded-2xl transition-all duration-200">
              템플릿 둘러보기
            </button>
          </div>
        </section>

        {/* ===== 수행평가 프로그램 섹션 ===== */}
        <section id="assessment" className="w-full max-w-5xl flex flex-col gap-8">
          {/* 섹션 헤더 */}
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              📝 수행평가 프로그램
            </h2>
            <p className="text-slate-500 dark:text-zinc-500 mt-2 text-sm">
              학생 제출부터 교사 채점까지, 모든 과정을 한 곳에서 관리하세요.
            </p>
          </div>

          {/* 통계 카드 */}
          <AssessmentStats key={refreshKey} />

          {/* 탭 네비게이션 */}
          <div className="flex p-1 rounded-2xl bg-slate-100 dark:bg-zinc-800/60 border border-slate-200/60 dark:border-zinc-700/50">
            <button
              id="tab-student"
              onClick={() => setActiveTab('student')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === 'student'
                  ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-md'
                  : 'text-slate-500 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-zinc-300'
              }`}
            >
              <span>📤</span> 학생용 제출
            </button>
            <button
              id="tab-teacher"
              onClick={() => setActiveTab('teacher')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === 'teacher'
                  ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-md'
                  : 'text-slate-500 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-zinc-300'
              }`}
            >
              <span>📊</span> 교사용 채점
            </button>
          </div>

          {/* 탭 콘텐츠 */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200/80 dark:border-zinc-800/80 shadow-lg overflow-hidden">
            {activeTab === 'student' ? (
              <div className="p-6 sm:p-8">
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-200">수행평가 제출</h3>
                  <p className="text-sm text-slate-500 dark:text-zinc-500 mt-1">
                    아래 양식을 작성하고 제출 버튼을 눌러 수행평가를 제출하세요.
                  </p>
                </div>
                <AssessmentForm onSubmitted={handleSubmitted} />
              </div>
            ) : (
              <div className="p-6 sm:p-8">
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-200">제출 현황 및 채점</h3>
                  <p className="text-sm text-slate-500 dark:text-zinc-500 mt-1">
                    제출된 수행평가를 확인하고 점수와 피드백을 입력하세요.
                  </p>
                </div>
                <AssessmentList refreshKey={refreshKey} />
              </div>
            )}
          </div>
        </section>

        {/* 학습 컴포넌트 예시 카드 영역 */}
        <section className="w-full max-w-5xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">추가할 수 있는 학습 컴포넌트 예시</h2>
            <p className="text-slate-500 dark:text-zinc-500 mt-2 text-sm">원하는 기능을 아래 카드 위치에 직접 컴포넌트로 구현하여 붙여넣으세요.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 카드 1: 플래시 카드 도구 */}
            <div className="group relative p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/80 dark:border-zinc-800/80 hover:border-indigo-500 dark:hover:border-indigo-400 hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-lg mb-4">
                  🎴
                </div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-200 mb-2">단어 암기장 (Flashcard)</h3>
                <p className="text-slate-600 dark:text-zinc-400 text-sm leading-relaxed mb-4">
                  앞뒷면을 터치해서 뒤집으며 단어와 정의를 암기할 수 있는 고전적인 학습용 플래시 카드 컴포넌트 영역입니다.
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-zinc-800">
                {/* // 여기에 새로운 플래시카드 컴포넌트를 추가하세요 (예: <FlashCardList />) */}
                <div className="text-xs text-indigo-600 dark:text-indigo-400 font-mono bg-indigo-50/50 dark:bg-indigo-950/30 p-2 rounded-md border border-indigo-100/50 dark:border-indigo-900/30">
                  📁 src/components/FlashCard.tsx
                </div>
              </div>
            </div>

            {/* 카드 2: 퀴즈 제너레이터 */}
            <div className="group relative p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/80 dark:border-zinc-800/80 hover:border-indigo-500 dark:hover:border-indigo-400 hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-lg mb-4">
                  📝
                </div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-200 mb-2">실시간 퀴즈 (Quiz)</h3>
                <p className="text-slate-600 dark:text-zinc-400 text-sm leading-relaxed mb-4">
                  객관식/주관식 문제를 출제하고, 학생들이 정답을 고르면 실시간으로 정 오답 여부를 시각화하는 인터랙티브 퀴즈 컴포넌트 영역입니다.
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-zinc-800">
                {/* // 여기에 새로운 퀴즈 컴포넌트를 추가하세요 (예: <QuizContainer />) */}
                <div className="text-xs text-indigo-600 dark:text-indigo-400 font-mono bg-indigo-50/50 dark:bg-indigo-950/30 p-2 rounded-md border border-indigo-100/50 dark:border-indigo-900/30">
                  📁 src/components/Quiz.tsx
                </div>
              </div>
            </div>

            {/* 카드 3: 대시보드 & 통계 */}
            <div className="group relative p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/80 dark:border-zinc-800/80 hover:border-indigo-500 dark:hover:border-indigo-400 hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-lg mb-4">
                  📊
                </div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-200 mb-2">학습 통계 (Stats)</h3>
                <p className="text-slate-600 dark:text-zinc-400 text-sm leading-relaxed mb-4">
                  Supabase에 누적된 수행평가 데이터를 차트 또는 그래프 형식으로 시각화해 주는 리포트 컴포넌트 영역입니다.
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-zinc-800">
                {/* // 여기에 새로운 리포트/차트 컴포넌트를 추가하세요 (예: <LearningChart />) */}
                <div className="text-xs text-indigo-600 dark:text-indigo-400 font-mono bg-indigo-50/50 dark:bg-indigo-950/30 p-2 rounded-md border border-indigo-100/50 dark:border-indigo-900/30">
                  📁 src/components/Stats.tsx
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 하단 푸터: Copyright 공간 */}
      <footer className="w-full border-t border-slate-200/60 dark:border-zinc-800/50 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-zinc-500">
            <span>&copy; {new Date().getFullYear()} EduBuilder. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-xs text-slate-400 dark:text-zinc-500 hover:text-slate-600 dark:hover:text-zinc-300 transition-colors">
              개인정보처리방침
            </Link>
            <Link href="#" className="text-xs text-slate-400 dark:text-zinc-500 hover:text-slate-600 dark:hover:text-zinc-300 transition-colors">
              이용약관
            </Link>
            <Link href="#" className="text-xs text-slate-400 dark:text-zinc-500 hover:text-slate-600 dark:hover:text-zinc-300 transition-colors">
              문의하기
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
