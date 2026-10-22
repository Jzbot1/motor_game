'use client';

import React from 'react';
import { Eye, Volume2, ShieldCheck, AlertCircle, Compass } from 'lucide-react';
import { RoadSign } from '@/types/sign';
import { SignSvg } from '@/components/SignSvg';

interface FingerSignInspectorProps {
  approachingSign: RoadSign | null;
  distanceToSignMeters: number;
  onInspectSign: (sign: RoadSign) => void;
  onSpeakSign?: (sign: RoadSign) => void;
}

export const FingerSignInspector: React.FC<FingerSignInspectorProps> = ({
  approachingSign,
  distanceToSignMeters,
  onInspectSign,
  onSpeakSign,
}) => {
  if (!approachingSign || distanceToSignMeters > 30) return null;

  const isVeryClose = distanceToSignMeters < 12;

  // Sign Category styling
  const categoryConfig = {
    mandatory: { bg: 'bg-rose-500/20', border: 'border-rose-500/40', text: 'text-rose-300', label: 'Mandatory / Order' },
    cautionary: { bg: 'bg-amber-500/20', border: 'border-amber-500/40', text: 'text-amber-300', label: 'Caution / Warning' },
    informatory: { bg: 'bg-sky-500/20', border: 'border-sky-500/40', text: 'text-sky-300', label: 'Information / Guide' },
    markings_signals: { bg: 'bg-emerald-500/20', border: 'border-emerald-500/40', text: 'text-emerald-300', label: 'Marking / Signal' },
  }[approachingSign.category] || { bg: 'bg-sky-500/20', border: 'border-sky-500/40', text: 'text-sky-300', label: 'Road Sign' };

  return (
    <div className="w-full max-w-lg mx-auto pointer-events-auto animate-fade-in">
      <div className="relative glass-panel-elevated p-3 sm:p-4 rounded-3xl border-2 border-amber-500/50 shadow-[0_12px_40px_rgba(0,0,0,0.65)] overflow-hidden">
        {/* Glow radar top strip */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-500 via-sky-400 to-emerald-400 animate-pulse" />

        <div className="flex items-center justify-between gap-3">
          {/* Left: Pointing Finger Indicator with Radar Pulse */}
          <div className="flex items-center gap-2.5">
            <div className="relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 shrink-0">
              {/* Radial ping wave */}
              <span className="absolute inset-0 rounded-2xl bg-amber-400/20 animate-ping" />
              {/* Animated Finger Icon */}
              <span className="text-2xl sm:text-3xl filter drop-shadow select-none animate-bounce">
                👉
              </span>
            </div>

            {/* Sign SVG Mini Preview */}
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-slate-900/80 p-1 flex items-center justify-center border border-slate-700/70 shrink-0 shadow-inner">
              <SignSvg svgType={approachingSign.svgType} params={approachingSign.svgParams} className="w-9 h-9 sm:w-10 sm:h-10" />
            </div>

            {/* Sign Info */}
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className={`text-[9px] uppercase font-black px-1.5 py-0.2 rounded border ${categoryConfig.bg} ${categoryConfig.border} ${categoryConfig.text}`}>
                  {approachingSign.code}
                </span>
                <span className="text-[10px] text-amber-300 font-bold">
                  {approachingSign.hindiName}
                </span>
                <span className="text-slate-600 hidden xs:inline">•</span>
                <span className="text-[10px] text-emerald-400 font-bold hidden xs:inline">
                  {approachingSign.mizoName}
                </span>
              </div>

              <h4 className="text-xs sm:text-sm font-black text-white truncate mt-0.5">
                {approachingSign.name}
              </h4>

              <div className="flex items-center gap-2 text-[10px] text-slate-300 mt-0.5">
                <span className="text-slate-400">{categoryConfig.label}</span>
                <span>•</span>
                <span className="text-sky-300 font-bold font-mono">
                  {Math.round(distanceToSignMeters)}m Ahead
                </span>
              </div>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-1.5 shrink-0">
            {onSpeakSign && (
              <button
                onClick={() => onSpeakSign(approachingSign)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 transition-all active:scale-95"
                title="Speak Road Sign Audio"
                aria-label="Listen to sign audio"
              >
                <Volume2 className="w-4 h-4 text-sky-400" />
              </button>
            )}

            <button
              onClick={() => onInspectSign(approachingSign)}
              className="px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/30 flex items-center gap-1.5 active:scale-95 transition-all whitespace-nowrap"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Inspect</span>
            </button>
          </div>
        </div>

        {/* Action Prompt Pill */}
        <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-300">
          <div className="flex items-center gap-1.5 truncate">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="truncate">
              <strong>Rule:</strong> {approachingSign.driverAction}
            </span>
          </div>

          <span className="text-[10px] font-mono text-amber-300/90 shrink-0 font-bold bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
            Fine: {approachingSign.fineMva || 'MVA Sec 177'}
          </span>
        </div>
      </div>
    </div>
  );
};
