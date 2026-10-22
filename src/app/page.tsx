'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import {
  Compass,
  BookOpen,
  Layers,
  Award,
  Gamepad2,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Star,
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';
import { INDIAN_ROAD_SIGNS } from '@/data/signs';
import { RoadSign, AppLanguage } from '@/types/sign';
import { SignDirectory } from '@/components/learning/SignDirectory';
import { SignFlashcards } from '@/components/learning/SignFlashcards';
import { SignDetailModal } from '@/components/learning/SignDetailModal';
import { QuizRunner } from '@/components/quiz/QuizRunner';
import { CertificateModal } from '@/components/quiz/CertificateModal';

// Dynamically import 3D Canvas with ssr: false so Three.js loads client-side only
const RoadGameCanvas = dynamic(
  () => import('@/components/game/RoadGameCanvas').then((mod) => mod.RoadGameCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[65vh] md:h-[75vh] bg-slate-950 rounded-3xl border border-slate-800 flex flex-col items-center justify-center gap-3 text-slate-400">
        <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-semibold tracking-wide">Loading 3D Indian Driving Simulator...</span>
      </div>
    ),
  }
);

type ActiveTab = 'game' | 'learn' | 'flashcards' | 'quiz' | 'certificate';

export default function Home() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('game');
  const [selectedSign, setSelectedSign] = useState<RoadSign | null>(null);
  const [language, setLanguage] = useState<AppLanguage>('en');

  // Local storage persisted state
  const [favoriteSignIds, setFavoriteSignIds] = useState<Set<string>>(new Set());
  const [learnedSignIds, setLearnedSignIds] = useState<Set<string>>(new Set());
  const [studentName, setStudentName] = useState<string>('Learner Driver');
  const [showCertificateModal, setShowCertificateModal] = useState<boolean>(false);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem('rr_lang') as AppLanguage;
      if (savedLang && ['en', 'hi', 'mizo'].includes(savedLang)) setLanguage(savedLang);

      const savedFavs = localStorage.getItem('rr_favorites');
      if (savedFavs) setFavoriteSignIds(new Set(JSON.parse(savedFavs)));

      const savedLearned = localStorage.getItem('rr_learned');
      if (savedLearned) setLearnedSignIds(new Set(JSON.parse(savedLearned)));

      const savedName = localStorage.getItem('rr_name');
      if (savedName) setStudentName(savedName);
    } catch {}
  }, []);

  const changeLanguage = (newLang: AppLanguage) => {
    setLanguage(newLang);
    try {
      localStorage.setItem('rr_lang', newLang);
    } catch {}
  };

  const toggleFavorite = (id: string) => {
    setFavoriteSignIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try {
        localStorage.setItem('rr_favorites', JSON.stringify(Array.from(next)));
      } catch {}
      return next;
    });
  };

  const toggleLearned = (id: string) => {
    setLearnedSignIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try {
        localStorage.setItem('rr_learned', JSON.stringify(Array.from(next)));
      } catch {}
      return next;
    });
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Top Navigation Header */}
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 px-3 md:px-4 py-2.5 md:py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Indian Flag Badge */}
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl overflow-hidden flex flex-col shadow-md border border-slate-700 shrink-0">
              <div className="flex-1 bg-[#FF9933]" />
              <div className="flex-1 bg-[#FFFFFF] flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-[#000080]" />
              </div>
              <div className="flex-1 bg-[#138808]" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm sm:text-base md:text-lg font-black text-white tracking-tight">
                  RoadReady India
                </h1>
                <span className="text-[9px] sm:text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  IRC:67
                </span>
              </div>
              <p className="text-[10px] md:text-xs text-slate-400 font-medium hidden sm:block">
                3D Driving Simulator & Indian Road Signs Learning System
              </p>
            </div>
          </div>

          {/* Navigation Tabs (Desktop view kept intact) */}
          <nav className="hidden md:flex items-center gap-1 p-1 rounded-2xl bg-slate-900/90 border border-slate-800 overflow-x-auto max-w-full">
            <button
              onClick={() => setActiveTab('game')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'game'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Gamepad2 className="w-4 h-4 text-amber-400" />
              <span>3D Simulator</span>
            </button>

            <button
              onClick={() => setActiveTab('learn')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'learn'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>Sign Catalogue</span>
            </button>

            <button
              onClick={() => setActiveTab('flashcards')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'flashcards'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4 text-sky-400" />
              <span>Flashcards</span>
            </button>

            <button
              onClick={() => setActiveTab('quiz')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'quiz'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Compass className="w-4 h-4 text-rose-400" />
              <span>RTO Quiz</span>
            </button>

            <button
              onClick={() => setShowCertificateModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-amber-300 hover:text-amber-200 transition-colors whitespace-nowrap"
              title="View RTO Certificate"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>Licence Certificate</span>
            </button>
          </nav>

          {/* Right Header: Mobile Quick Support & Language Selector */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Quick WhatsApp Support Icon for Mobile */}
            <a
              href="https://wa.me/918730063275?text=Hello%20Zomuana%20Sailo,%20I%20need%20support%20for%20RoadReady%20India"
              target="_blank"
              rel="noopener noreferrer"
              className="md:hidden p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center active:scale-95 transition-transform"
              title="Support: 918730063275 - WhatsApp"
              aria-label="WhatsApp Support"
            >
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-emerald-400">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
            </a>

            {/* Language Selector: EN | हिन्दी | Mizo */}
            <div className="flex items-center p-1 rounded-2xl bg-slate-900 border border-slate-800 text-xs shrink-0">
              <button
                onClick={() => changeLanguage('en')}
                className={`px-2 sm:px-2.5 py-1 rounded-xl font-bold transition-all ${
                  language === 'en' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
                title="English"
              >
                EN
              </button>
              <button
                onClick={() => changeLanguage('hi')}
                className={`px-2 sm:px-2.5 py-1 rounded-xl font-bold transition-all ${
                  language === 'hi' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
                title="हिन्दी"
              >
                हिन्दी
              </button>
              <button
                onClick={() => changeLanguage('mizo')}
                className={`px-2 sm:px-2.5 py-1 rounded-xl font-bold transition-all ${
                  language === 'mizo' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
                title="Mizo ṭawng"
              >
                Mizo
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col py-4 px-2 md:px-6 pb-20 md:pb-6">
        {activeTab === 'game' && (
          <div className="w-full max-w-7xl mx-auto flex flex-col gap-4">
            {/* Simulator Intro / Briefing Pill */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-2xl bg-slate-900/70 border border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-bold text-slate-200">
                  {language === 'mizo' ? 'Mizoram & India Dan:' : language === 'hi' ? 'भारतीय ड्राइविंग नियम:' : 'Indian Driving Rules:'}
                </span>
                <span className="text-slate-400">
                  {language === 'mizo' 
                    ? 'Veilamah tlan rawh. Chak lutuk khap, Stop line leh Speed breaker ngaihsak rawh.'
                    : language === 'hi'
                    ? 'सड़क के बाईं ओर चलें। गति सीमा, स्टॉप लाइन और स्पीड ब्रेकर का पालन करें।'
                    : 'Drive on the Left side of the road. Obey speed limits, stop lines, and speed breaker warnings.'}
                </span>
              </div>
              <div className="flex items-center gap-3 text-slate-400">
                <span>Total Verified Signs: <strong className="text-sky-400">{INDIAN_ROAD_SIGNS.length}</strong></span>
                <button
                  onClick={() => setActiveTab('learn')}
                  className="text-sky-400 hover:underline flex items-center gap-0.5 font-bold"
                >
                  <span>Browse All</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 3D Game Canvas */}
            <RoadGameCanvas onInspectSign={(sign) => setSelectedSign(sign)} />
          </div>
        )}

        {activeTab === 'learn' && (
          <SignDirectory
            signs={INDIAN_ROAD_SIGNS}
            favoriteSignIds={favoriteSignIds}
            learnedSignIds={learnedSignIds}
            onToggleFavorite={toggleFavorite}
            onToggleLearned={toggleLearned}
            onSelectSign={(sign) => setSelectedSign(sign)}
            language={language}
          />
        )}

        {activeTab === 'flashcards' && (
          <div className="w-full py-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-black text-white">Interactive Sign Flashcards</h2>
              <p className="text-xs text-slate-400 mt-1">
                Flip through official Indian signs, test your recall, and track your mastery.
              </p>
            </div>
            <SignFlashcards
              signs={INDIAN_ROAD_SIGNS}
              learnedSignIds={learnedSignIds}
              onToggleLearned={toggleLearned}
            />
          </div>
        )}

        {activeTab === 'quiz' && (
          <div className="w-full py-6">
            <QuizRunner signs={INDIAN_ROAD_SIGNS} />
          </div>
        )}
      </main>

      {/* Global Sign Detail Modal */}
      {selectedSign && (
        <SignDetailModal
          sign={selectedSign}
          onClose={() => setSelectedSign(null)}
          isFavorite={favoriteSignIds.has(selectedSign.id)}
          isLearned={learnedSignIds.has(selectedSign.id)}
          onToggleFavorite={toggleFavorite}
          onToggleLearned={toggleLearned}
        />
      )}

      {/* Certificate Modal */}
      {showCertificateModal && (
        <CertificateModal
          studentName={studentName}
          score={Math.max(learnedSignIds.size, 16)}
          totalQuestions={20}
          passingScore={12}
          dateStr={new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          onClose={() => setShowCertificateModal(false)}
        />
      )}

      {/* Footer with Standards, Developer Credit & WhatsApp Support (Small & Clean) */}
      <footer className="w-full border-t border-slate-800/80 bg-slate-950/95 px-4 py-4 mt-auto mb-16 md:mb-0 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
          {/* Developer & WhatsApp Support in small */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 text-[11px]">
            <a
              href="https://wa.me/918730063275?text=Hello%20Zomuana%20Sailo,%20I%20am%20contacting%20you%20regarding%20RoadReady%20India"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-slate-300 hover:text-emerald-400 font-semibold transition-colors hover:underline"
              title="Design and Developed By Zomuana Sailo - Tap to redirect to WhatsApp (918730063275)"
            >
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-emerald-400 shrink-0">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              <span>Design and Developed By <strong className="text-white hover:text-emerald-400 font-bold">Zomuana Sailo</strong></span>
            </a>

            <span className="text-slate-700 hidden sm:inline">•</span>

            <a
              href="https://wa.me/918730063275?text=Hello%20Zomuana%20Sailo,%20I%20need%20support%20for%20RoadReady%20India"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold transition-all hover:scale-105 active:scale-95"
              title="Support: 918730063275 - Tap to redirect to WhatsApp"
            >
              <span>Support: 918730063275</span>
            </a>
          </div>

          {/* Compliance & Standards in small */}
          <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500/80 shrink-0" />
            <span>Official Standards: IRC:67-2022 & IRC:35-2015 • MoRTH</span>
          </div>
        </div>
      </footer>

      {/* Mobile App Bottom Navigation Bar (Fixed Native App Bar) */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-slate-950/95 backdrop-blur-2xl border-t border-slate-800/90 px-2 py-1.5 shadow-[0_-8px_25px_rgba(0,0,0,0.6)]"
      >
        <div className="flex items-center justify-around max-w-md mx-auto">
          {/* Drive */}
          <button
            onClick={() => {
              if (typeof window !== 'undefined' && 'vibrate' in navigator) navigator.vibrate?.(10);
              setActiveTab('game');
            }}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all relative ${
              activeTab === 'game'
                ? 'text-sky-400 font-bold'
                : 'text-slate-400 hover:text-slate-200 font-medium'
            }`}
          >
            {activeTab === 'game' && (
              <span className="absolute -top-1 w-6 h-1 rounded-full bg-sky-400 shadow-[0_0_8px_#38bdf8]" />
            )}
            <div className={`p-1 rounded-xl transition-all ${activeTab === 'game' ? 'bg-sky-500/20 scale-110' : ''}`}>
              <Gamepad2 className="w-5 h-5 text-amber-400" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">Drive</span>
          </button>

          {/* Signs */}
          <button
            onClick={() => {
              if (typeof window !== 'undefined' && 'vibrate' in navigator) navigator.vibrate?.(10);
              setActiveTab('learn');
            }}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all relative ${
              activeTab === 'learn'
                ? 'text-emerald-400 font-bold'
                : 'text-slate-400 hover:text-slate-200 font-medium'
            }`}
          >
            {activeTab === 'learn' && (
              <span className="absolute -top-1 w-6 h-1 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
            )}
            <div className={`p-1 rounded-xl transition-all ${activeTab === 'learn' ? 'bg-emerald-500/20 scale-110' : ''}`}>
              <BookOpen className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">Signs</span>
          </button>

          {/* Cards */}
          <button
            onClick={() => {
              if (typeof window !== 'undefined' && 'vibrate' in navigator) navigator.vibrate?.(10);
              setActiveTab('flashcards');
            }}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all relative ${
              activeTab === 'flashcards'
                ? 'text-sky-400 font-bold'
                : 'text-slate-400 hover:text-slate-200 font-medium'
            }`}
          >
            {activeTab === 'flashcards' && (
              <span className="absolute -top-1 w-6 h-1 rounded-full bg-sky-400 shadow-[0_0_8px_#38bdf8]" />
            )}
            <div className={`p-1 rounded-xl transition-all ${activeTab === 'flashcards' ? 'bg-sky-500/20 scale-110' : ''}`}>
              <Layers className="w-5 h-5 text-sky-400" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">Cards</span>
          </button>

          {/* Exam */}
          <button
            onClick={() => {
              if (typeof window !== 'undefined' && 'vibrate' in navigator) navigator.vibrate?.(10);
              setActiveTab('quiz');
            }}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all relative ${
              activeTab === 'quiz'
                ? 'text-rose-400 font-bold'
                : 'text-slate-400 hover:text-slate-200 font-medium'
            }`}
          >
            {activeTab === 'quiz' && (
              <span className="absolute -top-1 w-6 h-1 rounded-full bg-rose-400 shadow-[0_0_8px_#fb7185]" />
            )}
            <div className={`p-1 rounded-xl transition-all ${activeTab === 'quiz' ? 'bg-rose-500/20 scale-110' : ''}`}>
              <Compass className="w-5 h-5 text-rose-400" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">Exam</span>
          </button>

          {/* Certificate */}
          <button
            onClick={() => {
              if (typeof window !== 'undefined' && 'vibrate' in navigator) navigator.vibrate?.(10);
              setShowCertificateModal(true);
            }}
            className="flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all text-amber-300 hover:text-amber-200 active:scale-95"
          >
            <div className="p-1 rounded-xl">
              <Award className="w-5 h-5 text-amber-400" />
            </div>
            <span className="text-[10px] mt-0.5 font-bold tracking-tight">Cert</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
