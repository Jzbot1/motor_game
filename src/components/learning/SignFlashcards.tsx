'use client';

import React, { useState } from 'react';
import { RotateCw, CheckCircle2, RefreshCw, ChevronLeft, ChevronRight, Volume2, Sparkles } from 'lucide-react';
import { RoadSign } from '@/types/sign';
import { SignSvg } from '@/components/SignSvg';
import { sounds } from '@/utils/audio';

interface SignFlashcardsProps {
  signs: RoadSign[];
  learnedSignIds: Set<string>;
  onToggleLearned: (id: string) => void;
}

export const SignFlashcards: React.FC<SignFlashcardsProps> = ({
  signs,
  learnedSignIds,
  onToggleLearned,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const activeSign = signs[currentIndex] || signs[0];
  const isLearned = learnedSignIds.has(activeSign?.id);

  const handleFlip = () => {
    sounds.playClick();
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    sounds.playClick();
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % signs.length);
  };

  const handlePrev = () => {
    sounds.playClick();
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + signs.length) % signs.length);
  };

  const handleShuffle = () => {
    sounds.playClick();
    setIsFlipped(false);
    const randomIndex = Math.floor(Math.random() * signs.length);
    setCurrentIndex(randomIndex);
  };

  const markAndNext = (learned: boolean) => {
    if (learned !== isLearned) {
      onToggleLearned(activeSign.id);
    }
    if (learned) {
      sounds.playSuccess();
    } else {
      sounds.playClick();
    }
    handleNext();
  };

  return (
    <div className="flex flex-col items-center max-w-xl mx-auto w-full p-4 select-none">
      {/* Progress & Controls Bar */}
      <div className="w-full flex items-center justify-between mb-4 text-xs text-slate-400 font-semibold">
        <span className="font-mono bg-slate-900/80 px-3 py-1 rounded-xl border border-slate-800 text-slate-200">
          Card {currentIndex + 1} of {signs.length}
        </span>
        <button
          onClick={handleShuffle}
          className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Shuffle</span>
        </button>
      </div>

      {/* 3D Flip Card Container */}
      <div
        onClick={handleFlip}
        className="w-full aspect-[4/3] md:aspect-[16/10] max-h-[380px] cursor-pointer perspective-1000 group"
      >
        <div
          className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* FRONT OF CARD */}
          <div className="absolute inset-0 backface-hidden glass-panel-elevated rounded-3xl p-6 flex flex-col items-center justify-between border border-slate-700/80 shadow-2xl">
            <div className="w-full flex justify-between items-center text-xs">
              <span className="font-mono font-bold text-sky-400 bg-sky-950/50 px-2.5 py-0.5 rounded-lg border border-sky-500/30">
                {activeSign.code}
              </span>
              <span className="text-slate-400 font-medium">Click anywhere to flip</span>
            </div>

            <div className="w-32 h-32 md:w-40 md:h-40 flex items-center justify-center p-2">
              <SignSvg svgType={activeSign.svgType} params={activeSign.svgParams} className="w-full h-full drop-shadow-xl" />
            </div>

            <div className="text-center">
              <p className="text-sm md:text-base font-bold text-white">
                What does this road sign require the driver to do?
              </p>
              <div className="flex items-center justify-center gap-1.5 text-xs text-amber-400 mt-1">
                <RotateCw className="w-3.5 h-3.5" />
                <span>Tap card to reveal answer</span>
              </div>
            </div>
          </div>

          {/* BACK OF CARD */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 glass-panel-elevated rounded-3xl p-6 flex flex-col justify-between border border-sky-500/50 shadow-2xl text-slate-100 bg-slate-900/95">
            <div>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="font-mono text-xs font-bold text-sky-400">{activeSign.code}</span>
                  <h3 className="text-xl font-black text-white">{activeSign.name}</h3>
                  <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                    <span className="text-xs text-amber-300 font-semibold">{activeSign.hindiName}</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-xs text-emerald-400 font-bold">Mizo: {activeSign.mizoName}</span>
                  </div>
                </div>
                <div className="w-12 h-12 p-1 bg-slate-950 rounded-xl border border-slate-800">
                  <SignSvg svgType={activeSign.svgType} params={activeSign.svgParams} className="w-full h-full" />
                </div>
              </div>

              <div className="space-y-2 mt-3 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-sky-400 block mb-0.5">Meaning:</span>
                  <p className="text-slate-200">{activeSign.meaning}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30">
                  <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-0.5">Driver Action:</span>
                  <p className="text-emerald-100 font-medium">{activeSign.driverAction}</p>
                </div>
              </div>
            </div>

            <p className="text-[10px] text-center text-slate-500 mt-2">Tap again to flip back</p>
          </div>
        </div>
      </div>

      {/* Navigation & Learning Assessment Buttons */}
      <div className="w-full flex items-center justify-between gap-3 mt-6">
        <button
          onClick={handlePrev}
          className="p-3 rounded-2xl glass-panel border border-slate-700 hover:border-slate-600 text-slate-300 active:scale-95 transition-all"
          title="Previous Card"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-3 flex-1 justify-center max-w-xs">
          <button
            onClick={() => markAndNext(false)}
            className="flex-1 py-2.5 px-3 rounded-2xl bg-rose-950/40 border border-rose-500/50 hover:bg-rose-900/40 text-rose-300 text-xs font-bold transition-all active:scale-95 text-center"
          >
            Need Review
          </button>
          <button
            onClick={() => markAndNext(true)}
            className="flex-1 py-2.5 px-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all active:scale-95 shadow-lg shadow-emerald-600/20 text-center"
          >
            I Know This!
          </button>
        </div>

        <button
          onClick={handleNext}
          className="p-3 rounded-2xl glass-panel border border-slate-700 hover:border-slate-600 text-slate-300 active:scale-95 transition-all"
          title="Next Card"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
