'use client';

import React from 'react';
import { X, Check, Gauge, Zap, Compass, Shield, Sparkles } from 'lucide-react';
import { VehicleType, VEHICLE_CONFIGS } from '@/types/vehicle';
import { sounds } from '@/utils/audio';

interface VehicleGarageModalProps {
  currentVehicle: VehicleType;
  isOpen: boolean;
  onSelectVehicle: (type: VehicleType) => void;
  onClose: () => void;
}

export const VehicleGarageModal: React.FC<VehicleGarageModalProps> = ({
  currentVehicle,
  isOpen,
  onSelectVehicle,
  onClose,
}) => {
  if (!isOpen) return null;

  const vehicleList = Object.values(VEHICLE_CONFIGS);

  const handleSelect = (id: VehicleType) => {
    sounds.playClick();
    sounds.playVehicleHorn(id);
    onSelectVehicle(id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto glass-panel-elevated bg-slate-950/95 rounded-3xl border border-slate-700/80 p-5 sm:p-7 shadow-2xl flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
                Indian Vehicle Garage
              </h3>
              <p className="text-xs text-slate-400">
                Choose your authentic vehicle to practice Indian road signs & driving rules
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Vehicle Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {vehicleList.map((veh) => {
            const isSelected = veh.id === currentVehicle;

            return (
              <div
                key={veh.id}
                onClick={() => handleSelect(veh.id)}
                className={`relative flex flex-col justify-between p-3.5 sm:p-4 rounded-2xl border-2 transition-all cursor-pointer group ${
                  isSelected
                    ? 'bg-sky-950/40 border-sky-500 shadow-xl shadow-sky-500/20'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90'
                }`}
              >
                {/* Active Selection Badge */}
                {isSelected && (
                  <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-sky-500 text-slate-950 text-[9px] font-black flex items-center gap-1 shadow-md">
                    <Check className="w-3 h-3 stroke-[3]" />
                    <span>ACTIVE</span>
                  </div>
                )}

                <div>
                  {/* Vehicle Visual Badge */}
                  <div className="w-full h-24 sm:h-26 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col items-center justify-center p-2 mb-2.5 relative overflow-hidden group-hover:scale-[1.02] transition-transform">
                    {/* Visual Color Bar */}
                    <div
                      className="absolute top-0 inset-x-0 h-1.5"
                      style={{ backgroundColor: veh.primaryColor }}
                    />

                    {/* Stylized Vehicle Icon/Illustration */}
                    {veh.id === 'r15_bike' ? (
                      <div className="flex flex-col items-center">
                        <span className="text-3xl sm:text-4xl">🏍️</span>
                        <span className="text-[9px] font-bold text-blue-400 mt-0.5 uppercase tracking-wider">
                          SuperSport 155cc
                        </span>
                      </div>
                    ) : veh.id === 'auto_rickshaw' ? (
                      <div className="flex flex-col items-center">
                        <span className="text-3xl sm:text-4xl">🛺</span>
                        <span className="text-[9px] font-bold text-amber-400 mt-0.5 uppercase tracking-wider">
                          3-Wheeler Tuk-Tuk
                        </span>
                      </div>
                    ) : veh.id === 'truck' ? (
                      <div className="flex flex-col items-center">
                        <span className="text-3xl sm:text-4xl">🚛</span>
                        <span className="text-[9px] font-bold text-orange-400 mt-0.5 uppercase tracking-wider">
                          Heavy 6-Wheeler
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <span className="text-3xl sm:text-4xl">🚗</span>
                        <span className="text-[9px] font-bold text-sky-400 mt-0.5 uppercase tracking-wider">
                          Standard 4-Door
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Title & Tagline */}
                  <h4 className="text-base font-black text-white group-hover:text-sky-300 transition-colors">
                    {veh.name}
                  </h4>
                  <div className="flex items-center gap-1.5 text-[11px] text-amber-300 font-medium">
                    <span>{veh.hindiName}</span>
                    <span>•</span>
                    <span className="text-emerald-400">{veh.mizoName}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                    {veh.tagline}
                  </p>
                </div>

                {/* Specs Ratings */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-col gap-2 text-xs">
                  {/* Top Speed */}
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Gauge className="w-3 h-3 text-sky-400" />
                      <span>Top Speed</span>
                    </span>
                    <strong className="text-white font-mono">{veh.maxSpeedKmH} km/h</strong>
                  </div>

                  {/* Acceleration */}
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Zap className="w-3 h-3 text-amber-400" />
                      <span>Acceleration</span>
                    </span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className={`w-2.5 h-1.5 rounded-sm ${
                            i <= veh.specs.accelStars ? 'bg-amber-400' : 'bg-slate-800'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Handling */}
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Compass className="w-3 h-3 text-emerald-400" />
                      <span>Handling</span>
                    </span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className={`w-2.5 h-1.5 rounded-sm ${
                            i <= veh.specs.handlingStars ? 'bg-emerald-400' : 'bg-slate-800'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Select Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelect(veh.id);
                    }}
                    className={`mt-2 w-full py-2 rounded-xl text-xs font-black transition-all shadow-md active:scale-95 ${
                      isSelected
                        ? 'bg-sky-600 hover:bg-sky-500 text-white shadow-sky-600/30'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                    }`}
                  >
                    {isSelected ? 'Driving Now ✓' : 'Select Vehicle'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
