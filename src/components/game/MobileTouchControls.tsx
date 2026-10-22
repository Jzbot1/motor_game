'use client';

import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Camera,
  RotateCcw,
  AlertOctagon,
  Maximize2,
  Minimize2,
  Volume2,
} from 'lucide-react';
import { VehicleControlState } from './Vehicle';
import { VehicleType, VEHICLE_CONFIGS } from '@/types/vehicle';

interface MobileTouchControlsProps {
  controls: VehicleControlState;
  setControls: React.Dispatch<React.SetStateAction<VehicleControlState>>;
  onCameraToggle: () => void;
  onResetCar: () => void;
  cameraMode: string;
  currentVehicle?: VehicleType;
  indicatorState?: 'off' | 'left' | 'right' | 'hazard';
  onToggleIndicator?: (side: 'left' | 'right' | 'hazard') => void;
  onOpenGarage?: () => void;
  onPlayHorn?: () => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

export const MobileTouchControls: React.FC<MobileTouchControlsProps> = ({
  controls,
  setControls,
  onCameraToggle,
  onResetCar,
  cameraMode,
  currentVehicle = 'hatchback',
  indicatorState = 'off',
  onToggleIndicator,
  onOpenGarage,
  onPlayHorn,
  isFullscreen = false,
  onToggleFullscreen,
}) => {
  const isBike = currentVehicle === 'r15_bike';
  const vehConfig = VEHICLE_CONFIGS[currentVehicle] || VEHICLE_CONFIGS.hatchback;
  const [selectedGear, setSelectedGear] = useState<'D' | 'R'>('D');

  const triggerHaptic = (ms = 18) => {
    try {
      if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
        navigator.vibrate(ms);
      }
    } catch {}
  };

  const handleTouch = (key: keyof VehicleControlState, value: boolean) => {
    if (value) triggerHaptic(18);
    setControls((prev) => ({ ...prev, [key]: value }));
  };

  const handleHorn = () => {
    triggerHaptic(35);
    if (onPlayHorn) onPlayHorn();
  };

  // Throttle forward vs reverse depending on selected gear
  const handleThrottleTouch = (isPressed: boolean) => {
    if (isPressed) triggerHaptic(20);
    if (selectedGear === 'D') {
      setControls((prev) => ({ ...prev, forward: isPressed, backward: false }));
    } else {
      setControls((prev) => ({ ...prev, backward: isPressed, forward: false }));
    }
  };

  const handleBrakeTouch = (isPressed: boolean) => {
    if (isPressed) triggerHaptic(25);
    // When braking, apply reverse/backward pressure to stop, plus handbrake for quick stopping
    if (selectedGear === 'D') {
      setControls((prev) => ({ ...prev, backward: isPressed }));
    } else {
      setControls((prev) => ({ ...prev, forward: isPressed }));
    }
  };

  return (
    <div className="md:hidden absolute inset-0 pointer-events-none select-none flex flex-col justify-between p-2.5 pb-3 z-20 touch-none">
      {/* ============================================================== */}
      {/* TOP FLOATING UTILITY BAR (Clean, non-clashing, floating pills) */}
      {/* ============================================================== */}
      <div className="flex justify-between items-center pointer-events-auto mt-14 px-1 gap-2">
        {/* Left: Quick Garage Switcher Pill */}
        {onOpenGarage && (
          <button
            onClick={() => {
              triggerHaptic(15);
              onOpenGarage();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/90 backdrop-blur-xl border border-sky-500/50 text-white text-xs font-black shadow-[0_4px_16px_rgba(2,132,199,0.35)] active:scale-90 transition-all"
            title="Switch Vehicle"
            aria-label="Garage"
          >
            <span className="text-base leading-none">
              {currentVehicle === 'r15_bike'
                ? '🏍️'
                : currentVehicle === 'auto_rickshaw'
                ? '🛺'
                : currentVehicle === 'truck'
                ? '🚛'
                : '🚗'}
            </span>
            <span className="text-[11px] font-extrabold tracking-wide text-sky-300">
              {isBike ? 'R15 V4' : vehConfig.name.split(' ')[0]}
            </span>
            <span className="text-[9px] text-sky-400 font-mono">▼</span>
          </button>
        )}

        {/* Right Floating Quick Tools: Camera, Fullscreen, Reset */}
        <div className="flex items-center gap-1.5">
          {/* Fullscreen Expand / Immersive Mode Toggle */}
          {onToggleFullscreen && (
            <button
              onClick={() => {
                triggerHaptic(15);
                onToggleFullscreen();
              }}
              className={`w-8 h-8 rounded-full backdrop-blur-xl border flex items-center justify-center shadow-lg active:scale-90 transition-transform ${
                isFullscreen
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                  : 'bg-slate-950/85 border-slate-700/80 text-slate-300'
              }`}
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Game View'}
              aria-label="Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          )}

          {/* Camera View Switcher */}
          <button
            onClick={() => {
              triggerHaptic(15);
              onCameraToggle();
            }}
            className="w-8 h-8 rounded-full bg-slate-950/85 backdrop-blur-xl border border-slate-700/80 text-sky-400 flex items-center justify-center shadow-lg active:scale-90 transition-transform"
            title={`Camera: ${cameraMode}`}
            aria-label="Camera"
          >
            <Camera className="w-3.5 h-3.5" />
          </button>

          {/* Reset Vehicle */}
          <button
            onClick={() => {
              triggerHaptic(25);
              onResetCar();
            }}
            className="w-8 h-8 rounded-full bg-slate-950/85 backdrop-blur-xl border border-slate-700/80 text-rose-400 flex items-center justify-center shadow-lg active:scale-90 transition-transform"
            title="Reset Vehicle Position"
            aria-label="Reset Vehicle"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* BOTTOM COCKPIT DRIVING CONTROLS (Ergonomic Thumb Layout)        */}
      {/* ============================================================== */}
      <div className="flex justify-between items-end pointer-events-auto gap-2">
        {/* ================= LEFT CONTROLS: STEERING & BLINKERS ================= */}
        <div className="flex flex-col items-start gap-1.5">
          {/* Turn Signal Indicators Pill */}
          {onToggleIndicator && (
            <div className="flex items-center gap-1 bg-slate-950/90 backdrop-blur-xl p-1 rounded-2xl border border-slate-800 shadow-xl">
              <button
                onClick={() => {
                  triggerHaptic(12);
                  onToggleIndicator('left');
                }}
                className={`flex items-center gap-0.5 px-2.5 py-1 rounded-xl text-[9px] font-black transition-all active:scale-90 ${
                  indicatorState === 'left' || indicatorState === 'hazard'
                    ? 'bg-emerald-500 text-white shadow-[0_0_12px_#10b981]'
                    : 'text-slate-400 hover:text-white'
                }`}
                aria-label="Blinker Left"
              >
                <ChevronLeft className="w-3 h-3 stroke-[3]" />
                <span>L</span>
              </button>

              <button
                onClick={() => {
                  triggerHaptic(12);
                  onToggleIndicator('hazard');
                }}
                className={`px-1.5 py-1 rounded-xl text-[9px] font-black transition-all active:scale-90 ${
                  indicatorState === 'hazard'
                    ? 'bg-rose-500 text-white shadow-[0_0_12px_#f43f5e]'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
                title="Hazard Lights"
                aria-label="Hazard Lights"
              >
                ⚠
              </button>

              <button
                onClick={() => {
                  triggerHaptic(12);
                  onToggleIndicator('right');
                }}
                className={`flex items-center gap-0.5 px-2.5 py-1 rounded-xl text-[9px] font-black transition-all active:scale-90 ${
                  indicatorState === 'right' || indicatorState === 'hazard'
                    ? 'bg-emerald-500 text-white shadow-[0_0_12px_#10b981]'
                    : 'text-slate-400 hover:text-white'
                }`}
                aria-label="Blinker Right"
              >
                <span>R</span>
                <ChevronRight className="w-3 h-3 stroke-[3]" />
              </button>
            </div>
          )}

          {/* Steer Left & Right Thumb Touch Buttons */}
          <div className="flex items-center gap-2">
            {/* Steer Left Button */}
            <button
              onTouchStart={(e) => {
                e.preventDefault();
                handleTouch('left', true);
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                handleTouch('left', false);
              }}
              onTouchCancel={(e) => {
                e.preventDefault();
                handleTouch('left', false);
              }}
              onMouseDown={() => handleTouch('left', true)}
              onMouseUp={() => handleTouch('left', false)}
              onMouseLeave={() => handleTouch('left', false)}
              className={`w-15 h-15 rounded-3xl backdrop-blur-2xl border-2 flex flex-col items-center justify-center shadow-[0_8px_25px_rgba(0,0,0,0.6)] active:scale-90 transition-all ${
                controls.left
                  ? 'bg-sky-500 border-sky-300 text-white shadow-[0_0_22px_#38bdf8] scale-95 translate-x-[-2px]'
                  : 'bg-slate-950/90 border-slate-700/80 text-slate-100 hover:border-slate-500'
              }`}
              style={{ width: '3.85rem', height: '3.85rem' }}
              aria-label="Steer Left"
            >
              <ChevronLeft className="w-7 h-7 stroke-[3]" />
              <span className="text-[8px] font-black tracking-wider text-slate-300 uppercase -mt-1">
                {isBike ? 'LEAN L' : 'LEFT'}
              </span>
            </button>

            {/* Steer Right Button */}
            <button
              onTouchStart={(e) => {
                e.preventDefault();
                handleTouch('right', true);
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                handleTouch('right', false);
              }}
              onTouchCancel={(e) => {
                e.preventDefault();
                handleTouch('right', false);
              }}
              onMouseDown={() => handleTouch('right', true)}
              onMouseUp={() => handleTouch('right', false)}
              onMouseLeave={() => handleTouch('right', false)}
              className={`w-15 h-15 rounded-3xl backdrop-blur-2xl border-2 flex flex-col items-center justify-center shadow-[0_8px_25px_rgba(0,0,0,0.6)] active:scale-90 transition-all ${
                controls.right
                  ? 'bg-sky-500 border-sky-300 text-white shadow-[0_0_22px_#38bdf8] scale-95 translate-x-[2px]'
                  : 'bg-slate-950/90 border-slate-700/80 text-slate-100 hover:border-slate-500'
              }`}
              style={{ width: '3.85rem', height: '3.85rem' }}
              aria-label="Steer Right"
            >
              <ChevronRight className="w-7 h-7 stroke-[3]" />
              <span className="text-[8px] font-black tracking-wider text-slate-300 uppercase -mt-1">
                {isBike ? 'LEAN R' : 'RIGHT'}
              </span>
            </button>
          </div>

          {/* Emergency Handbrake Bar */}
          <button
            onTouchStart={(e) => {
              e.preventDefault();
              handleTouch('handbrake', true);
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              handleTouch('handbrake', false);
            }}
            onTouchCancel={(e) => {
              e.preventDefault();
              handleTouch('handbrake', false);
            }}
            onMouseDown={() => handleTouch('handbrake', true)}
            onMouseUp={() => handleTouch('handbrake', false)}
            onMouseLeave={() => handleTouch('handbrake', false)}
            className={`w-full py-1.5 rounded-xl border backdrop-blur-xl text-[9px] uppercase font-black tracking-wider flex items-center justify-center gap-1 shadow-lg active:scale-95 transition-all ${
              controls.handbrake
                ? 'bg-rose-600 text-white border-rose-400 shadow-[0_0_15px_#f43f5e]'
                : 'bg-slate-950/90 border-slate-800 text-rose-300/90'
            }`}
            aria-label="Emergency Brake"
          >
            <AlertOctagon className="w-3 h-3 text-rose-400" />
            <span>{isBike ? 'REAR BRAKE' : 'HANDBRAKE'}</span>
          </button>
        </div>

        {/* ================= CENTER: QUICK HORN & D/R GEAR SHIFTER ================= */}
        <div className="flex flex-col items-center gap-2 pb-1">
          {/* Drive (D) vs Reverse (R) Gear Selector Switch */}
          <div className="flex items-center bg-slate-950/95 backdrop-blur-xl p-1 rounded-xl border border-slate-700/80 shadow-xl">
            <button
              onClick={() => {
                triggerHaptic(15);
                setSelectedGear('D');
              }}
              className={`px-3 py-1 rounded-lg text-xs font-black font-mono transition-all ${
                selectedGear === 'D'
                  ? 'bg-emerald-500 text-slate-950 shadow-[0_0_12px_#10b981]'
                  : 'text-slate-400 hover:text-white'
              }`}
              aria-label="Drive Forward Gear"
            >
              D
            </button>
            <button
              onClick={() => {
                triggerHaptic(15);
                setSelectedGear('R');
              }}
              className={`px-3 py-1 rounded-lg text-xs font-black font-mono transition-all ${
                selectedGear === 'R'
                  ? 'bg-rose-500 text-white shadow-[0_0_12px_#f43f5e]'
                  : 'text-slate-400 hover:text-white'
              }`}
              aria-label="Reverse Gear"
            >
              R
            </button>
          </div>

          {/* Glowing Center Horn Button */}
          <button
            onClick={handleHorn}
            className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 text-slate-950 flex flex-col items-center justify-center shadow-[0_6px_20px_rgba(245,158,11,0.5)] active:scale-90 transition-transform border-2 border-amber-200"
            title="Honk Horn"
            aria-label="Horn"
          >
            <span className="text-xl leading-none">🎺</span>
            <span className="text-[7px] font-black tracking-tight leading-none text-slate-950 uppercase">
              HORN
            </span>
          </button>
        </div>

        {/* ================= RIGHT CONTROLS: ERGONOMIC SPORT PEDALS ================= */}
        <div className="flex items-end gap-2">
          {/* Brake Pedal */}
          <button
            onTouchStart={(e) => {
              e.preventDefault();
              handleBrakeTouch(true);
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              handleBrakeTouch(false);
            }}
            onTouchCancel={(e) => {
              e.preventDefault();
              handleBrakeTouch(false);
            }}
            onMouseDown={() => handleBrakeTouch(true)}
            onMouseUp={() => handleBrakeTouch(false)}
            onMouseLeave={() => handleBrakeTouch(false)}
            className={`rounded-3xl backdrop-blur-2xl border-2 flex flex-col items-center justify-between py-2 px-1 shadow-[0_10px_30px_rgba(0,0,0,0.7)] transition-all ${
              (selectedGear === 'D' ? controls.backward : controls.forward)
                ? 'bg-rose-600 border-rose-300 text-white shadow-[0_0_25px_#f43f5e] translate-y-1.5 scale-95'
                : 'bg-gradient-to-b from-rose-950/90 to-slate-950/95 border-rose-500/60 text-slate-100 hover:border-rose-400'
            }`}
            style={{ width: '3.4rem', height: '4.8rem' }}
            aria-label="Brake"
          >
            <span className="text-[8px] uppercase font-black text-rose-300 tracking-wider">
              {isBike ? 'FRONT' : 'BRAKE'}
            </span>
            {/* Rubber tread grooves */}
            <div className="w-8 h-3.5 flex flex-col justify-between my-0.5 opacity-80">
              <div className="w-full h-0.5 bg-rose-400 rounded-full" />
              <div className="w-full h-0.5 bg-rose-400 rounded-full" />
              <div className="w-full h-0.5 bg-rose-400 rounded-full" />
            </div>
            <span className="text-[10px] font-black tracking-tight">STOP</span>
          </button>

          {/* Gas Accelerator / Motorcycle Throttle Pedal */}
          <button
            onTouchStart={(e) => {
              e.preventDefault();
              handleThrottleTouch(true);
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              handleThrottleTouch(false);
            }}
            onTouchCancel={(e) => {
              e.preventDefault();
              handleThrottleTouch(false);
            }}
            onMouseDown={() => handleThrottleTouch(true)}
            onMouseUp={() => handleThrottleTouch(false)}
            onMouseLeave={() => handleThrottleTouch(false)}
            className={`rounded-3xl backdrop-blur-2xl border-2 flex flex-col items-center justify-between py-2.5 px-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.7)] transition-all ${
              (selectedGear === 'D' ? controls.forward : controls.backward)
                ? 'bg-emerald-600 border-emerald-300 text-white shadow-[0_0_25px_#10b981] translate-y-2 scale-95'
                : 'bg-gradient-to-b from-emerald-950/90 to-slate-950/95 border-emerald-500/60 text-slate-100 hover:border-emerald-400'
            }`}
            style={{ width: '4rem', height: '6rem' }}
            aria-label={selectedGear === 'D' ? 'Accelerate' : 'Reverse'}
          >
            <span className="text-[9px] uppercase font-black text-emerald-300 tracking-wider">
              {selectedGear === 'R' ? 'REVERSE' : isBike ? 'THROTTLE' : 'GAS'}
            </span>
            {/* Metal grip ridges */}
            <div className="w-9 h-6 flex flex-col justify-between my-1 opacity-80">
              <div className="w-full h-0.5 bg-emerald-400 rounded-full" />
              <div className="w-full h-0.5 bg-emerald-400 rounded-full" />
              <div className="w-full h-0.5 bg-emerald-400 rounded-full" />
              <div className="w-full h-0.5 bg-emerald-400 rounded-full" />
            </div>
            <span className="text-xs font-black tracking-wider text-emerald-200">
              {selectedGear === 'R' ? 'REV' : isBike ? 'RACE' : 'DRIVE'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

