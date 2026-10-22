'use client';

import React from 'react';
import { Star, CheckCircle, Info } from 'lucide-react';
import { RoadSign, AppLanguage } from '@/types/sign';
import { SignSvg } from '@/components/SignSvg';
import { sounds } from '@/utils/audio';

interface SignCardProps {
  sign: RoadSign;
  isFavorite: boolean;
  isLearned: boolean;
  onToggleFavorite: (id: string) => void;
  onToggleLearned: (id: string) => void;
  onSelect: (sign: RoadSign) => void;
  viewMode: 'grid' | 'list';
  language?: AppLanguage;
}

export const SignCard: React.FC<SignCardProps> = ({
  sign,
  isFavorite,
  isLearned,
  onToggleFavorite,
  onToggleLearned,
  onSelect,
  viewMode,
  language = 'en',
}) => {
  const getCategoryBadge = () => {
    switch (sign.category) {
      case 'mandatory':
        return <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">Mandatory</span>;
      case 'cautionary':
        return <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">Cautionary</span>;
      case 'informatory':
        return <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">Informatory</span>;
      case 'markings_signals':
        return <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Road Marking</span>;
    }
  };

  if (viewMode === 'list') {
    return (
      <div className="glass-panel hover:bg-slate-800/60 transition-all rounded-2xl p-4 flex items-center justify-between gap-4 border border-slate-800 hover:border-slate-700">
        <div className="flex items-center gap-4 flex-1 cursor-pointer" onClick={() => { sounds.playClick(); onSelect(sign); }}>
          <div className="w-16 h-16 shrink-0 bg-slate-900/80 rounded-xl p-2 flex items-center justify-center border border-slate-700/60 shadow-inner">
            <SignSvg svgType={sign.svgType} params={sign.svgParams} className="w-12 h-12" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-slate-400 font-bold">{sign.code}</span>
              {getCategoryBadge()}
              <span className="text-xs text-amber-400 font-medium">
                {language === 'mizo' ? sign.mizoName : language === 'hi' ? sign.hindiName : `${sign.hindiName} • ${sign.mizoName}`}
              </span>
            </div>
            <h3 className="text-base font-bold text-white mt-1">{sign.name}</h3>
            <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">{sign.meaning}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleLearned(sign.id)}
            className={`p-2 rounded-xl transition-all ${
              isLearned ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' : 'text-slate-500 hover:text-slate-300'
            }`}
            title={isLearned ? 'Mark as Unlearned' : 'Mark as Learned'}
          >
            <CheckCircle className="w-5 h-5" />
          </button>
          <button
            onClick={() => onToggleFavorite(sign.id)}
            className={`p-2 rounded-xl transition-all ${
              isFavorite ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50' : 'text-slate-500 hover:text-slate-300'
            }`}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Star className={`w-5 h-5 ${isFavorite ? 'fill-amber-400' : ''}`} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel hover:bg-slate-800/60 transition-all rounded-2xl sm:rounded-3xl p-3 sm:p-5 flex flex-col justify-between border border-slate-800 hover:border-slate-700 group hover:-translate-y-1 shadow-xl">
      <div>
        {/* Top bar with Code & Favorite */}
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <div className="flex items-center gap-1 sm:gap-1.5">
            <span className="text-[10px] sm:text-[11px] font-mono font-bold text-slate-400 bg-slate-900/80 px-1.5 py-0.5 sm:px-2 rounded-md border border-slate-800">
              {sign.code}
            </span>
            {getCategoryBadge()}
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onToggleFavorite(sign.id); }}
            className={`p-1 sm:p-1.5 rounded-lg transition-colors ${
              isFavorite ? 'text-amber-400 fill-amber-400' : 'text-slate-600 hover:text-slate-300'
            }`}
            aria-label="Toggle Favorite"
          >
            <Star className={`w-4 h-4 sm:w-5 sm:h-5 ${isFavorite ? 'fill-amber-400' : ''}`} />
          </button>
        </div>

        {/* Centered SVG Preview */}
        <div
          onClick={() => { sounds.playClick(); onSelect(sign); }}
          className="w-full aspect-square bg-slate-900/60 rounded-xl sm:rounded-2xl p-2 sm:p-4 flex items-center justify-center cursor-pointer border border-slate-800/80 group-hover:border-slate-700 shadow-inner transition-colors"
        >
          <SignSvg svgType={sign.svgType} params={sign.svgParams} className="w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 group-hover:scale-105 transition-transform" />
        </div>

        {/* Names */}
        <div className="mt-2.5 sm:mt-4 cursor-pointer" onClick={() => { sounds.playClick(); onSelect(sign); }}>
          <h3 className="text-xs sm:text-base font-bold text-white group-hover:text-sky-300 transition-colors line-clamp-1">
            {sign.name}
          </h3>
          <p className="text-[10px] sm:text-xs text-amber-300/90 font-medium mt-0.5 line-clamp-1">
            {language === 'mizo' ? sign.mizoName : sign.hindiName}
          </p>
          {language !== 'mizo' && (
            <p className="text-[9px] sm:text-[11px] text-emerald-400/90 font-medium line-clamp-1 mt-0.5">
              Mizo: {sign.mizoName}
            </p>
          )}
          <p className="text-[10px] sm:text-xs text-slate-400 line-clamp-2 mt-1 sm:mt-2 leading-relaxed hidden xs:block">
            {sign.meaning}
          </p>
        </div>
      </div>

      {/* Bottom actions: Learned Toggle & Detail button */}
      <div className="flex items-center justify-between gap-1.5 sm:gap-2 mt-2.5 sm:mt-4 pt-2 sm:pt-3 border-t border-slate-800/80">
        <button
          onClick={() => onToggleLearned(sign.id)}
          className={`flex items-center gap-1 text-[10px] sm:text-xs font-semibold px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg sm:rounded-xl transition-all ${
            isLearned
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'bg-slate-800/50 text-slate-400 hover:text-slate-200'
          }`}
        >
          <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
          <span className="hidden sm:inline">{isLearned ? 'Learned' : 'Mark Learned'}</span>
          <span className="sm:hidden">{isLearned ? 'Done' : 'Learn'}</span>
        </button>

        <button
          onClick={() => { sounds.playClick(); onSelect(sign); }}
          className="text-[10px] sm:text-xs text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-0.5 sm:gap-1"
        >
          <Info className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          <span>Details</span>
        </button>
      </div>
    </div>
  );
};
