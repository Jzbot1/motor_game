'use client';

import React, { useState, useMemo } from 'react';
import { Search, Filter, Grid, List, Star, CheckCircle, BookOpen, Sparkles, X } from 'lucide-react';
import { RoadSign, RoadSignCategory, AppLanguage } from '@/types/sign';
import { SignCard } from './SignCard';

interface SignDirectoryProps {
  signs: RoadSign[];
  favoriteSignIds: Set<string>;
  learnedSignIds: Set<string>;
  onToggleFavorite: (id: string) => void;
  onToggleLearned: (id: string) => void;
  onSelectSign: (sign: RoadSign) => void;
  language?: AppLanguage;
}

export const SignDirectory: React.FC<SignDirectoryProps> = ({
  signs,
  favoriteSignIds,
  learnedSignIds,
  onToggleFavorite,
  onToggleLearned,
  onSelectSign,
  language = 'en',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<RoadSignCategory | 'all'>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');
  const [quickFilter, setQuickFilter] = useState<'all' | 'favorites' | 'unlearned' | 'learned'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filtered signs computation
  const filteredSigns = useMemo(() => {
    return signs.filter((sign) => {
      // Category filter
      if (selectedCategory !== 'all' && sign.category !== selectedCategory) return false;

      // Difficulty filter
      if (difficultyFilter !== 'all' && sign.difficulty !== difficultyFilter) return false;

      // Quick filter
      if (quickFilter === 'favorites' && !favoriteSignIds.has(sign.id)) return false;
      if (quickFilter === 'learned' && !learnedSignIds.has(sign.id)) return false;
      if (quickFilter === 'unlearned' && learnedSignIds.has(sign.id)) return false;

      // Search query (name, code, hindiName, mizoName, meaning, driverAction)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = sign.name.toLowerCase().includes(query);
        const matchesHindi = sign.hindiName.toLowerCase().includes(query);
        const matchesMizo = sign.mizoName.toLowerCase().includes(query);
        const matchesCode = sign.code.toLowerCase().includes(query);
        const matchesMeaning = sign.meaning.toLowerCase().includes(query);
        const matchesAction = sign.driverAction.toLowerCase().includes(query);
        const matchesTags = sign.quizTags.some((t) => t.toLowerCase().includes(query));
        if (!matchesName && !matchesHindi && !matchesMizo && !matchesCode && !matchesMeaning && !matchesAction && !matchesTags) {
          return false;
        }
      }

      return true;
    });
  }, [signs, selectedCategory, difficultyFilter, quickFilter, searchQuery, favoriteSignIds, learnedSignIds]);

  const progressPercent = Math.round((learnedSignIds.size / (signs.length || 1)) * 100);

  const categoryCounts = useMemo(() => {
    return {
      all: signs.length,
      mandatory: signs.filter((s) => s.category === 'mandatory').length,
      cautionary: signs.filter((s) => s.category === 'cautionary').length,
      informatory: signs.filter((s) => s.category === 'informatory').length,
      markings_signals: signs.filter((s) => s.category === 'markings_signals').length,
    };
  }, [signs]);

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 py-3 sm:py-6 flex flex-col gap-4 sm:gap-6">
      {/* Learning Progress & Stats Hero */}
      <div className="glass-panel-elevated p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-700/80 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
        <div className="flex items-center gap-3 sm:gap-4 w-full md:w-auto">
          <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/20 shrink-0">
            <BookOpen className="w-5 h-5 sm:w-7 sm:h-7" />
          </div>
          <div>
            <h2 className="text-base sm:text-xl md:text-2xl font-black text-white leading-tight">Indian Road Signs Learning Centre</h2>
            <p className="text-[11px] sm:text-xs md:text-sm text-slate-300 line-clamp-1 sm:line-clamp-none">
              IRC:67-2022, IRC:35-2015 & MoRTH verified catalogue
            </p>
          </div>
        </div>

        {/* Progress Bar & Badges */}
        <div className="w-full md:w-auto flex flex-col md:items-end gap-1.5 sm:gap-2">
          <div className="flex items-center justify-between md:justify-end gap-3 text-xs font-bold w-full">
            <span className="text-slate-400 text-[11px] sm:text-xs">
              Learned: <strong className="text-emerald-400">{learnedSignIds.size}</strong>/{signs.length}
            </span>
            <span className="text-slate-400 text-[11px] sm:text-xs">
              Favs: <strong className="text-amber-400">{favoriteSignIds.size}</strong>
            </span>
            <span className="text-sky-400 font-mono text-xs sm:text-sm font-black">{progressPercent}%</span>
          </div>
          <div className="w-full md:w-64 h-2.5 sm:h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-700/80 p-0.5">
            <div
              className="h-full bg-gradient-to-r from-sky-500 to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Search, Filter Tabs & Layout Controls */}
      <div className="flex flex-col gap-4">
        {/* Search Input Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by sign name, symbol, meaning, IRC code or Hindi..."
              className="w-full pl-11 pr-10 py-3 bg-slate-900/80 border border-slate-700/80 rounded-2xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setQuickFilter('all')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                quickFilter === 'all'
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              All ({signs.length})
            </button>
            <button
              onClick={() => setQuickFilter('favorites')}
              className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                quickFilter === 'favorites'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                  : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Star className="w-3.5 h-3.5" />
              <span>Favorites ({favoriteSignIds.size})</span>
            </button>
            <button
              onClick={() => setQuickFilter('unlearned')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                quickFilter === 'unlearned'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Unlearned ({signs.length - learnedSignIds.size})
            </button>

            {/* View Mode Switcher */}
            <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 ml-auto">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'all', label: 'All Signs', count: categoryCounts.all },
            { id: 'mandatory', label: 'Mandatory / Regulatory', count: categoryCounts.mandatory },
            { id: 'cautionary', label: 'Cautionary / Warning', count: categoryCounts.cautionary },
            { id: 'informatory', label: 'Informatory / Guide', count: categoryCounts.informatory },
            { id: 'markings_signals', label: 'Road Markings & Signals', count: categoryCounts.markings_signals },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as RoadSignCategory | 'all')}
              className={`px-3.5 py-2 rounded-xl font-bold transition-all whitespace-nowrap border ${
                selectedCategory === cat.id
                  ? 'bg-slate-100 text-slate-900 border-white shadow-lg'
                  : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span>{cat.label}</span>
              <span className={`ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] ${
                selectedCategory === cat.id ? 'bg-slate-900 text-white' : 'bg-slate-800 text-slate-400'
              }`}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Signs Cards Grid / List */}
      {filteredSigns.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center flex flex-col items-center justify-center gap-3 border border-slate-800">
          <Sparkles className="w-10 h-10 text-slate-500" />
          <h3 className="text-lg font-bold text-white">No signs found matching criteria</h3>
          <p className="text-xs text-slate-400">Try adjusting your search query or removing active filters.</p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('all'); setQuickFilter('all'); }}
            className="mt-2 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-all shadow-lg"
          >
            Reset All Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
          {filteredSigns.map((sign) => (
            <SignCard
              key={sign.id}
              sign={sign}
              isFavorite={favoriteSignIds.has(sign.id)}
              isLearned={learnedSignIds.has(sign.id)}
              onToggleFavorite={onToggleFavorite}
              onToggleLearned={onToggleLearned}
              onSelect={onSelectSign}
              viewMode="grid"
              language={language}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredSigns.map((sign) => (
            <SignCard
              key={sign.id}
              sign={sign}
              isFavorite={favoriteSignIds.has(sign.id)}
              isLearned={learnedSignIds.has(sign.id)}
              onToggleFavorite={onToggleFavorite}
              onToggleLearned={onToggleLearned}
              onSelect={onSelectSign}
              viewMode="list"
              language={language}
            />
          ))}
        </div>
      )}
    </div>
  );
};
