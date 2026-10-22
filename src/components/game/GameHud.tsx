'use client';

import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  Sparkles,
  Volume2,
  VolumeX,
  Sun,
  Sunset,
  Moon,
  Car,
  ChevronLeft,
  ChevronRight,
  TriangleAlert,
  Gauge,
  Lightbulb,
} from 'lucide-react';
import { RoadSign, DrivingViolation } from '@/types/sign';
import { VehicleType, VEHICLE_CONFIGS } from '@/types/vehicle';
import { FingerSignInspector } from './FingerSignInspector';

interface GameHudProps {
  speedKmH: number;
  currentSpeedLimit: number;
  approachingSign: RoadSign | null;
  distanceToSignMeters?: number;
  activeViolation: DrivingViolation | null;
  isTestMode: boolean;
  score: number;
  totalViolations: number;
  isMuted: boolean;
  currentVehicle: VehicleType;
  steeringAngleDeg: number;
  indicatorState: 'off' | 'left' | 'right' | 'hazard';
  lightingMode: 'day' | 'dusk' | 'night';
  headlightsOn: boolean;
  onToggleTestMode: () => void;
  onToggleMute: () => void;
  onInspectSign: (sign: RoadSign) => void;
  onSpeakSign?: (sign: RoadSign) => void;
  onOpenGarage: () => void;
  onToggleIndicator: (side: 'left' | 'right' | 'hazard') => void;
  onToggleLightingMode: () => void;
  onPlayHorn: () => void;
}

export const GameHud: React.FC<GameHudProps> = ({
  speedKmH,
  currentSpeedLimit,
  approachingSign,
  distanceToSignMeters = 30,
  activeViolation,
  isTestMode,
  score,
  totalViolations,
  isMuted,
  currentVehicle,
  steeringAngleDeg,
  indicatorState,
  lightingMode,
  headlightsOn,
  onToggleTestMode,
  onToggleMute,
  onInspectSign,
  onSpeakSign,
  onOpenGarage,
  onToggleIndicator,
  onToggleLightingMode,
  onPlayHorn,
}) => {
  const isOverSpeed = speedKmH > currentSpeedLimit;
  const vehConfig = VEHICLE_CONFIGS[currentVehicle] || VEHICLE_CONFIGS.hatchback;

  // Analog Needle rotation calculation (-135deg to +135deg for 0 to 120 km/h)
  const maxDialKmH = 120;
  const clampedSpeed = Math.min(Math.max(speedKmH, 0), maxDialKmH);
  const needleRotation = -135 + (clampedSpeed / maxDialKmH) * 270;

  // Gear detection
  const gear = speedKmH > 1 ? 'D' : speedKmH < -0.5 ? 'R' : 'P';

  // Turn signal flashing state for HUD
  const [blinkActive, setBlinkActive] = useState(false);
  useEffect(() => {
    if (indicatorState === 'off') {
      setBlinkActive(false);
      return;
    }
    const interval = setInterval(() => {
      setBlinkActive((prev) => !prev);
    }, 420);
    return () => clearInterval(interval);
  }, [indicatorState]);

  const isLeftBlinking = (indicatorState === 'left' || indicatorState === 'hazard') && blinkActive;
  const isRightBlinking = (indicatorState === 'right' || indicatorState === 'hazard') && blinkActive;

  return (
    <div className="absolute inset-0 pointer-events-none select-none z-10 p-2.5 sm:p-4 flex flex-col justify-between">
      {/* ============================================================== */}
      {/* TOP BAR: Speedometer Dial + Cockpit Controls + Modes           */}
      {/* ============================================================== */}
      <div className="flex justify-between items-start gap-2 sm:gap-3">
        {/* Left: Speedometer Gauge + Speed Limit Disc + Gear */}
        <div className="flex items-center gap-2 sm:gap-3 pointer-events-auto">
          {/* Circular Analog & Digital Speedometer */}
          <div className="glass-panel p-2 sm:p-2.5 rounded-2xl flex items-center gap-2.5 sm:gap-3 border border-slate-700/80 shadow-2xl">
            {/* Analog Mini Dial */}
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-slate-900 border-2 border-slate-700 flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
              {/* Dial Tick Marks */}
              <div className="absolute inset-1 rounded-full border border-dashed border-slate-600/50" />
              {/* Speed Needle */}
              <div
                className="absolute w-1 h-5 sm:h-6 bg-gradient-to-t from-transparent via-rose-500 to-rose-400 origin-bottom rounded-full transition-transform duration-75"
                style={{
                  transform: `rotate(${needleRotation}deg)`,
                  bottom: '50%',
                }}
              />
              {/* Center Needle Pin */}
              <div className="w-2.5 h-2.5 rounded-full bg-slate-200 border border-slate-800 shadow" />
            </div>

            {/* Digital Speedometer + Units */}
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1">
                <span
                  className={`text-2xl sm:text-3xl md:text-4xl font-black tracking-tight font-mono leading-none ${
                    isOverSpeed ? 'text-rose-400 animate-pulse' : 'text-white'
                  }`}
                >
                  {speedKmH}
                </span>
                <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400">
                  KM/H
                </span>
              </div>

              {/* Gear Indicator Pill: [P] [R] [N] [D] */}
              <div className="flex items-center gap-1 mt-1 text-[9px] font-mono font-black">
                {['P', 'R', 'N', 'D'].map((g) => (
                  <span
                    key={g}
                    className={`px-1 rounded ${
                      gear === g
                        ? 'bg-sky-500 text-slate-950 shadow-sm'
                        : 'text-slate-500 bg-slate-900/60'
                    }`}
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* IRC Speed Limit Sign Disc */}
          <div
            className={`w-9 h-9 sm:w-12 sm:h-12 rounded-full border-2 sm:border-4 border-rose-600 bg-white flex flex-col items-center justify-center shadow-xl shrink-0 ${
              isOverSpeed ? 'scale-110 border-rose-500 animate-pulse ring-4 ring-rose-500/40' : ''
            }`}
            title={`Speed Limit: ${currentSpeedLimit} km/h`}
          >
            <span className="text-[6px] sm:text-[7px] font-black text-rose-700 leading-none">LIMIT</span>
            <span className="text-gray-900 font-black text-xs sm:text-base leading-none">
              {currentSpeedLimit}
            </span>
          </div>

          {/* Turn Signal Arrows (Cockpit Blinkers) - Shown on Desktop, Mobile has them right by thumb */}
          <div className="hidden md:flex items-center gap-1 glass-panel px-1.5 py-1 rounded-xl border border-slate-700/80">
            <button
              onClick={() => onToggleIndicator('left')}
              className={`p-1 sm:p-1.5 rounded-lg transition-all active:scale-95 ${
                isLeftBlinking
                  ? 'bg-emerald-500 text-white shadow-[0_0_12px_#10b981]'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Left Turn Signal (Press Q)"
            >
              <ChevronLeft className="w-4 h-4 stroke-[3]" />
            </button>
            <button
              onClick={() => onToggleIndicator('hazard')}
              className={`p-1 rounded-lg transition-all active:scale-95 ${
                indicatorState === 'hazard' && blinkActive
                  ? 'bg-rose-500 text-white shadow-[0_0_12px_#ef4444]'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Hazard Lights"
            >
              <TriangleAlert className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onToggleIndicator('right')}
              className={`p-1 sm:p-1.5 rounded-lg transition-all active:scale-95 ${
                isRightBlinking
                  ? 'bg-emerald-500 text-white shadow-[0_0_12px_#10b981]'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Right Turn Signal (Press E)"
            >
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        </div>

        {/* Right: Garage Selector (Desktop) + Day/Night Light + Practice/Test Mode + Mute */}
        <div className="flex items-center gap-1 sm:gap-2 pointer-events-auto">
          {/* Vehicle Garage Switcher Button - Shown on Desktop, Mobile has floating chip */}
          <button
            onClick={onOpenGarage}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl glass-panel border border-sky-500/40 text-sky-200 hover:text-white hover:border-sky-400 transition-all active:scale-95 shadow-lg group"
            title="Open Vehicle Garage (Press V)"
          >
            <span className="text-sm">
              {currentVehicle === 'r15_bike'
                ? '🏍️'
                : currentVehicle === 'auto_rickshaw'
                ? '🛺'
                : currentVehicle === 'truck'
                ? '🚛'
                : '🚗'}
            </span>
            <span className="text-[11px] sm:text-xs font-bold hidden xs:inline">
              {vehConfig.name.split(' ')[0]}
            </span>
          </button>

          {/* Day / Dusk / Night Environment Switcher */}
          <button
            onClick={onToggleLightingMode}
            className="p-1.5 sm:p-2 rounded-xl glass-panel border border-slate-700/80 text-amber-300 hover:text-white transition-all active:scale-95 shadow-lg flex items-center gap-1"
            title="Toggle Day / Dusk / Night Mode (Press L)"
          >
            {lightingMode === 'night' ? (
              <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-300" />
            ) : lightingMode === 'dusk' ? (
              <Sunset className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
            ) : (
              <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-300" />
            )}
          </button>

          {/* Practice vs Test Mode */}
          <button
            onClick={onToggleTestMode}
            className={`flex items-center gap-1 px-2 py-1.5 sm:px-3 sm:py-2 rounded-xl border text-[10px] sm:text-xs font-bold transition-all active:scale-95 shadow-lg ${
              isTestMode
                ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                : 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
            }`}
          >
            {isTestMode ? <ShieldAlert className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span className="hidden xs:inline">{isTestMode ? 'Test' : 'Practice'}</span>
          </button>

          {/* Sound Mute */}
          <button
            onClick={onToggleMute}
            className="p-1.5 sm:p-2 rounded-xl glass-panel border border-slate-700/80 text-slate-300 hover:text-white transition-colors active:scale-95 shadow-lg"
            title="Toggle Sound"
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-400" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
            )}
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* MIDDLE: Violation Alerts & Interactive Finger Sign Inspector    */}
      {/* ============================================================== */}
      <div className="flex flex-col items-center gap-3 my-auto max-w-xl mx-auto w-full px-2">
        {/* ACTIVE VIOLATION BANNER */}
        {activeViolation && (
          <div className="w-full bg-rose-950/90 backdrop-blur-xl border-2 border-rose-500/90 p-4 rounded-2xl shadow-2xl animate-bounce flex items-start gap-3 text-slate-100 pointer-events-auto">
            <AlertTriangle className="w-7 h-7 text-rose-400 shrink-0 mt-0.5 animate-pulse" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-black text-rose-300 text-sm tracking-wide uppercase">
                  TRAFFIC VIOLATION DETECTED
                </span>
                <span className="text-xs font-mono font-bold bg-rose-900/60 text-rose-200 px-2 py-0.5 rounded-md border border-rose-500/40">
                  {activeViolation.penaltyFine}
                </span>
              </div>
              <p className="text-xs text-slate-200 font-semibold mt-1">
                {activeViolation.ruleViolated}
              </p>
              <p className="text-[11px] text-rose-200/90 mt-1">
                <strong className="text-white">Correct Action:</strong> {activeViolation.correctAction}
              </p>
            </div>
          </div>
        )}

        {/* INTERACTIVE FINGER SIGN INSPECTOR HUD */}
        {approachingSign && (
          <FingerSignInspector
            approachingSign={approachingSign}
            distanceToSignMeters={distanceToSignMeters}
            onInspectSign={onInspectSign}
            onSpeakSign={onSpeakSign}
          />
        )}
      </div>

      {/* ============================================================== */}
      {/* BOTTOM: Reality Dashboard Controls & Rotating Steering Wheel   */}
      {/* ============================================================== */}
      <div className="w-full max-w-3xl mx-auto flex items-center justify-between gap-3">
        {/* Visual Cockpit Rotating Steering Wheel */}
        <div className="hidden sm:flex items-center gap-2 glass-panel p-2 rounded-2xl border border-slate-700/80 shadow-2xl pointer-events-auto">
          <div
            className="w-12 h-12 rounded-full border-4 border-slate-700 bg-slate-900 flex items-center justify-center relative shadow-lg transition-transform duration-75"
            style={{ transform: `rotate(${steeringAngleDeg}deg)` }}
            title="Steering Wheel Angle"
          >
            {/* Steering Wheel Spokes */}
            <div className="absolute w-full h-1 bg-slate-600" />
            <div className="absolute h-full w-1 bg-slate-600" />
            {/* Center Hub */}
            <div className="w-4 h-4 rounded-full bg-slate-950 border border-slate-500 flex items-center justify-center shadow">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            </div>
          </div>

          <div className="flex flex-col text-[10px]">
            <span className="font-bold text-slate-300">Steering</span>
            <span className="font-mono text-sky-400">{Math.round(steeringAngleDeg)}°</span>
          </div>
        </div>

        {/* Desktop Keyboard Hints Helper Bar */}
        <div className="hidden md:flex justify-center items-center gap-3 py-1.5 px-4 rounded-full glass-panel mx-auto border border-slate-800 text-[11px] text-slate-400 pointer-events-auto">
          <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-200 font-mono">W</kbd>/<kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-200 font-mono">↑</kbd> Drive</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-200 font-mono">S</kbd>/<kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-200 font-mono">↓</kbd> Brake</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-200 font-mono">A</kbd>/<kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-200 font-mono">D</kbd> Steer</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-200 font-mono">Q</kbd>/<kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-200 font-mono">E</kbd> Blinker</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-200 font-mono">V</kbd> Garage</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-200 font-mono">L</kbd> Lights</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-200 font-mono">H</kbd> Horn</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-200 font-mono">C</kbd> Camera</span>
        </div>

        {/* Horn Quick Button - Desktop only; Mobile has large dedicated horn button in MobileTouchControls */}
        <button
          onClick={onPlayHorn}
          className="hidden md:flex pointer-events-auto px-3 py-1.5 rounded-xl glass-panel border border-amber-500/40 text-amber-300 font-black text-xs hover:text-amber-200 transition-all active:scale-95 shadow-lg items-center gap-1.5"
          title="Sound Horn (Press H)"
        >
          <span>🎺</span>
          <span className="hidden xs:inline">Horn</span>
        </button>
      </div>
    </div>
  );
};
