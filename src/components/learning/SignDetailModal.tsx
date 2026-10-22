'use client';

import React, { useState } from 'react';
import { X, Volume2, ShieldCheck, AlertCircle, Compass, Truck, Scale, Bookmark, CheckCircle2 } from 'lucide-react';
import { RoadSign } from '@/types/sign';
import { SignSvg } from '@/components/SignSvg';

interface SignDetailModalProps {
  sign: RoadSign | null;
  onClose: () => void;
  isFavorite: boolean;
  isLearned: boolean;
  onToggleFavorite: (id: string) => void;
  onToggleLearned: (id: string) => void;
}

export const SignDetailModal: React.FC<SignDetailModalProps> = ({
  sign,
  onClose,
  isFavorite,
  isLearned,
  onToggleFavorite,
  onToggleLearned,
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  if (!sign) return null;

  const speakExplanation = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const textToSpeak = `${sign.name}. In Mizo: ${sign.mizoName}. In Hindi: ${sign.hindiName}. Meaning: ${sign.meaning}. Driver action: ${sign.driverAction}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.95;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[92vh] sm:max-h-[90vh] overflow-y-auto glass-panel-elevated rounded-t-3xl sm:rounded-3xl border-t sm:border border-slate-700/80 shadow-2xl p-5 sm:p-8 flex flex-col gap-5 sm:gap-6 text-slate-100">
        {/* Mobile Pull-Down Indicator Handle */}
        <div className="w-12 h-1.5 bg-slate-700/80 rounded-full mx-auto sm:hidden -mt-1 mb-1 shrink-0" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header: Sign Code, Badges, Action buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pr-10">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-black px-2.5 py-1 rounded-lg bg-sky-500/20 text-sky-300 border border-sky-500/40">
              {sign.code}
            </span>
            <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{sign.verificationStatus}</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleLearned(sign.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                isLearned
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isLearned ? 'Learned' : 'Mark Learned'}</span>
            </button>
            <button
              onClick={() => onToggleFavorite(sign.id)}
              className={`p-2 rounded-xl border transition-all ${
                isFavorite
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/50'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
              title="Bookmark"
            >
              <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-amber-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Central Sign Showcase */}
        <div className="flex flex-col md:flex-row items-center gap-6 p-6 rounded-2xl bg-slate-900/70 border border-slate-800">
          <div className="w-36 h-36 md:w-44 md:h-44 shrink-0 bg-slate-950/80 rounded-2xl p-4 flex items-center justify-center border border-slate-800 shadow-2xl">
            <SignSvg svgType={sign.svgType} params={sign.svgParams} className="w-28 h-28 md:w-36 md:h-36 drop-shadow-xl" />
          </div>
          <div className="flex-1 flex flex-col">
            <h2 className="text-2xl font-black text-white">{sign.name}</h2>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="text-sm font-semibold text-amber-400">Hindi: {sign.hindiName}</span>
              <span className="text-slate-600">•</span>
              <span className="text-sm font-bold text-emerald-400">Mizo: {sign.mizoName}</span>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <span className="text-xs uppercase font-bold text-slate-400">Category:</span>
              <span className="text-xs font-bold text-sky-300 capitalize">{sign.category.replace('_', ' & ')}</span>
              <span className="text-slate-600">•</span>
              <span className="text-xs uppercase font-bold text-slate-400">Shape:</span>
              <span className="text-xs font-bold text-slate-200 capitalize">{sign.shape.replace('_', ' ')}</span>
            </div>

            {/* Read Aloud Button */}
            <button
              onClick={speakExplanation}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold mt-4 w-fit transition-all ${
                isSpeaking ? 'bg-amber-500 text-slate-950 animate-pulse' : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>{isSpeaking ? 'Reading Audio...' : 'Listen to Sign Explanation'}</span>
            </button>
          </div>
        </div>

        {/* Detailed Explanations Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Meaning */}
          <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
            <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-wider mb-1.5">
              <AlertCircle className="w-4 h-4" />
              <span>Official IRC Meaning</span>
            </div>
            <p className="text-xs md:text-sm text-slate-200 leading-relaxed">{sign.meaning}</p>
          </div>

          {/* Mandatory Driver Action */}
          <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1.5">
              <Compass className="w-4 h-4" />
              <span>Required Driver Action</span>
            </div>
            <p className="text-xs md:text-sm text-emerald-200/90 leading-relaxed font-medium">{sign.driverAction}</p>
          </div>

          {/* Real-World Indian Road Context */}
          <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1.5">
              <Truck className="w-4 h-4" />
              <span>Indian Road Placement & Application</span>
            </div>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">{sign.example}</p>
            <p className="text-[11px] text-slate-400 mt-2">
              <strong className="text-slate-300">Applicability:</strong> {sign.vehicleApplicability}
            </p>
          </div>

          {/* Legal Fine & Source Reference */}
          <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30">
            <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-1.5">
              <Scale className="w-4 h-4" />
              <span>Penalty under Motor Vehicles Act</span>
            </div>
            <p className="text-xs md:text-sm text-rose-200 font-semibold">{sign.fineMva || 'Standard compliance guidance'}</p>
            <p className="text-[11px] text-slate-400 mt-2">
              <strong className="text-slate-300">IRC Standard:</strong> {sign.sourceUrl}
            </p>
          </div>
        </div>

        {/* Support & Developer Attribution Footer */}
        <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
          <a
            href={`https://wa.me/918730063275?text=${encodeURIComponent('Hello Zomuana Sailo, I am viewing the road sign: ' + sign.name)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 hover:text-emerald-300 font-bold hover:underline"
            title="Design and Developed By Zomuana Sailo - Tap to redirect to WhatsApp"
          >
            Design and Developed By Zomuana Sailo
          </a>
          <a
            href={`https://wa.me/918730063275?text=${encodeURIComponent('Hello Zomuana Sailo, I need support regarding the sign: ' + sign.name)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold transition-all"
            title="WhatsApp Support: 918730063275 - Tap to redirect to WhatsApp"
          >
            Support: 918730063275
          </a>
        </div>
      </div>
    </div>
  );
};
