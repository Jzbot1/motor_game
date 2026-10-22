'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { Vehicle, VehicleControlState } from './Vehicle';
import { IndianRoadScene } from './IndianRoadScene';
import { GameHud } from './GameHud';
import { MobileTouchControls } from './MobileTouchControls';
import { VehicleGarageModal } from './VehicleGarageModal';
import { RoadSign, DrivingViolation } from '@/types/sign';
import { VehicleType } from '@/types/vehicle';
import { sounds } from '@/utils/audio';

interface PlacedSignItem {
  sign: RoadSign;
  position: [number, number, number];
  rotationY: number;
  triggerZ: number;
  triggerDistance: number;
}

interface RoadGameCanvasProps {
  onInspectSign: (sign: RoadSign) => void;
}

export const RoadGameCanvas: React.FC<RoadGameCanvasProps> = ({ onInspectSign }) => {
  // Vehicle selection & reality driving controls
  const [currentVehicle, setCurrentVehicle] = useState<VehicleType>('hatchback');
  const [isGarageOpen, setIsGarageOpen] = useState<boolean>(false);
  const [steeringAngleDeg, setSteeringAngleDeg] = useState<number>(0);
  const [indicatorState, setIndicatorState] = useState<'off' | 'left' | 'right' | 'hazard'>('off');
  const [lightingMode, setLightingMode] = useState<'day' | 'dusk' | 'night'>('day');
  const [headlightsOn, setHeadlightsOn] = useState<boolean>(true);

  // Vehicle movement controls state
  const [controls, setControls] = useState<VehicleControlState>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    handbrake: false,
    horn: false,
  });

  const [cameraMode, setCameraMode] = useState<'third_person' | 'hood' | 'top_down'>('third_person');
  const [speedKmH, setSpeedKmH] = useState<number>(0);
  const [currentSpeedLimit, setCurrentSpeedLimit] = useState<number>(40);
  const [approachingSign, setApproachingSign] = useState<RoadSign | null>(null);
  const [distanceToSign, setDistanceToSign] = useState<number>(30);
  const [activeViolation, setActiveViolation] = useState<DrivingViolation | null>(null);

  // Test mode vs Practice mode
  const [isTestMode, setIsTestMode] = useState<boolean>(false);
  const [score, setScore] = useState<number>(100);
  const [violations, setViolations] = useState<DrivingViolation[]>([]);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Sign placement reference
  const signsRef = useRef<PlacedSignItem[]>([]);
  const lastViolationTimeRef = useRef<number>(0);
  const vehiclePosRef = useRef<[number, number, number]>([-2.2, 0, 0]);

  // Load saved vehicle from localStorage
  useEffect(() => {
    try {
      const savedVeh = localStorage.getItem('rr_vehicle') as VehicleType;
      if (savedVeh && ['hatchback', 'auto_rickshaw', 'truck', 'r15_bike'].includes(savedVeh)) {
        setCurrentVehicle(savedVeh);
      }
    } catch {}
  }, []);

  const changeVehicle = (veh: VehicleType) => {
    setCurrentVehicle(veh);
    try {
      localStorage.setItem('rr_vehicle', veh);
    } catch {}
  };

  const playHorn = useCallback(() => {
    sounds.playVehicleHorn(currentVehicle);
  }, [currentVehicle]);

  const toggleLightingMode = useCallback(() => {
    sounds.playHeadlightSwitch();
    setLightingMode((prev) => (prev === 'day' ? 'dusk' : prev === 'dusk' ? 'night' : 'day'));
  }, []);

  const toggleIndicator = useCallback((side: 'left' | 'right' | 'hazard') => {
    setIndicatorState((curr) => (curr === side ? 'off' : side));
  }, []);

  // Text to Speech for sign reading
  const speakSign = useCallback((sign: RoadSign) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      sounds.playSuccess();
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(`${sign.name}. Rule: ${sign.driverAction}`);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  }, []);

  // Setup keyboard listeners
  useEffect(() => {
    sounds.startEngine();

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent scrolling when using arrow keys or space
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      switch (e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          setControls((prev) => ({ ...prev, forward: true }));
          break;
        case 's':
        case 'arrowdown':
          setControls((prev) => ({ ...prev, backward: true }));
          break;
        case 'a':
        case 'arrowleft':
          setControls((prev) => ({ ...prev, left: true }));
          break;
        case 'd':
        case 'arrowright':
          setControls((prev) => ({ ...prev, right: true }));
          break;
        case ' ':
          setControls((prev) => ({ ...prev, handbrake: true }));
          break;
        case 'q':
          toggleIndicator('left');
          break;
        case 'e':
          toggleIndicator('right');
          break;
        case 'v':
          setIsGarageOpen((p) => !p);
          break;
        case 'l':
          toggleLightingMode();
          break;
        case 'h':
          playHorn();
          break;
        case 'c':
          setCameraMode((prev) =>
            prev === 'third_person' ? 'hood' : prev === 'hood' ? 'top_down' : 'third_person'
          );
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          setControls((prev) => ({ ...prev, forward: false }));
          break;
        case 's':
        case 'arrowdown':
          setControls((prev) => ({ ...prev, backward: false }));
          break;
        case 'a':
        case 'arrowleft':
          setControls((prev) => ({ ...prev, left: false }));
          break;
        case 'd':
        case 'arrowright':
          setControls((prev) => ({ ...prev, right: false }));
          break;
        case ' ':
          setControls((prev) => ({ ...prev, handbrake: false }));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      sounds.stopEngine();
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [playHorn, toggleIndicator, toggleLightingMode]);

  const triggerViolation = useCallback(
    (violation: Omit<DrivingViolation, 'id' | 'timestamp'>) => {
      const now = Date.now();
      if (now - lastViolationTimeRef.current < 4000) return;
      lastViolationTimeRef.current = now;

      const newViolation: DrivingViolation = {
        ...violation,
        id: `v-${now}`,
        timestamp: now,
      };

      sounds.playViolation();
      setActiveViolation(newViolation);

      if (isTestMode) {
        setScore((prev) => Math.max(0, prev - 15));
        setViolations((prev) => [newViolation, ...prev]);
      }

      // Auto dismiss violation alert after 4.5 seconds
      setTimeout(() => {
        setActiveViolation((curr) => (curr?.id === newViolation.id ? null : curr));
      }, 4500);
    },
    [isTestMode]
  );

  // Position update & evaluation engine
  const handlePositionUpdate = useCallback(
    (pos: [number, number, number]) => {
      vehiclePosRef.current = pos;
      const z = pos[2];

      // Update speed limits based on road zones
      if (z >= 70 && z < 110) {
        setCurrentSpeedLimit(30); // School Zone
      } else {
        setCurrentSpeedLimit(40);
      }

      // Proximity detection for signs + exact distance calculation
      let foundSign: RoadSign | null = null;
      let minDistance = 999;
      for (const item of signsRef.current) {
        const dist = item.triggerZ - z;
        if (dist >= -2 && dist <= item.triggerDistance) {
          foundSign = item.sign;
          minDistance = Math.max(0, dist);
          break;
        }
      }
      setApproachingSign(foundSign);
      setDistanceToSign(minDistance);

      // Speeding violation check
      if (speedKmH > currentSpeedLimit + 6) {
        triggerViolation({
          signId: foundSign?.id || 'speeding',
          signName: `Speed Limit ${currentSpeedLimit} km/h`,
          ruleViolated: `Exceeded speed limit! Your speed: ${speedKmH} km/h in a ${currentSpeedLimit} km/h zone.`,
          penaltyFine: '₹1,000 - ₹2,000 under MVA Sec 183',
          explanation: 'Driving above posted speed limits severely compromises stopping distance and pedestrian safety.',
          correctAction: `Release accelerator and maintain speed at or below ${currentSpeedLimit} km/h.`,
          severity: 'major',
        });
      }

      // Stop sign check at intersection (z between 185 and 192)
      if (z >= 185 && z <= 192 && speedKmH > 15) {
        triggerViolation({
          signId: 'm-stop',
          signName: 'Stop Sign (IRC-M01)',
          ruleViolated: `Failed to halt before the solid stop line at the intersection!`,
          penaltyFine: '₹1,000 - ₹2,000 fine under MVA Sec 177 / 184',
          explanation: 'The mandatory STOP sign requires a complete halt (0 km/h) before the stop line to check cross traffic.',
          correctAction: 'Bring vehicle to a complete halt before the white stop line before proceeding.',
          severity: 'critical',
        });
      }
    },
    [speedKmH, currentSpeedLimit, triggerViolation]
  );

  const handleSpeedBreakerCross = useCallback(
    (speed: number) => {
      if (speed > 20) {
        triggerViolation({
          signId: 'c-speed-breaker',
          signName: 'Speed Breaker / Road Hump (IRC-C14)',
          ruleViolated: `Crossed speed breaker at dangerous speed (${speed} km/h)!`,
          penaltyFine: 'Vehicle damage hazard & MVA Sec 184 (Dangerous Driving)',
          explanation: 'Crossing road humps at excessive speeds causes suspension damage and sudden loss of vehicle control.',
          correctAction: 'Slow down to below 15 km/h before mounting the speed breaker.',
          severity: 'minor',
        });
      }
    },
    [triggerViolation]
  );

  const handleSignsLoaded = useCallback((loaded: PlacedSignItem[]) => {
    signsRef.current = loaded;
  }, []);

  const handleResetCar = () => {
    window.location.reload();
  };

  const toggleCamera = () => {
    setCameraMode((prev) =>
      prev === 'third_person' ? 'hood' : prev === 'hood' ? 'top_down' : 'third_person'
    );
  };

  const toggleMute = () => {
    setIsMuted((prev) => {
      const next = !prev;
      sounds.setMuted(next);
      return next;
    });
  };

  return (
    <div
      className={`relative w-full bg-slate-950 overflow-hidden border border-slate-800 shadow-2xl transition-all duration-300 ${
        isFullscreen
          ? 'fixed inset-0 z-50 rounded-none h-[100dvh] w-[100dvw]'
          : 'h-[70vh] sm:h-[72vh] md:h-[75vh] rounded-3xl'
      }`}
    >
      {/* 3D WebGL Canvas */}
      <Canvas
        shadows
        camera={{ position: [-2.2, 3.2, -6.5], fov: 60 }}
        className="w-full h-full"
      >
        <IndianRoadScene
          lightingMode={lightingMode}
          onSignsLoaded={handleSignsLoaded}
        />
        <Vehicle
          controls={controls}
          cameraMode={cameraMode}
          vehicleType={currentVehicle}
          headlightsOn={headlightsOn}
          indicatorState={indicatorState}
          onSpeedChange={setSpeedKmH}
          onPositionUpdate={handlePositionUpdate}
          onSteeringAngleChange={setSteeringAngleDeg}
          onSpeedBreakerCross={handleSpeedBreakerCross}
        />
      </Canvas>

      {/* Game HUD Overlay */}
      <GameHud
        speedKmH={speedKmH}
        currentSpeedLimit={currentSpeedLimit}
        approachingSign={approachingSign}
        distanceToSignMeters={distanceToSign}
        activeViolation={activeViolation}
        isTestMode={isTestMode}
        score={score}
        totalViolations={violations.length}
        isMuted={isMuted}
        currentVehicle={currentVehicle}
        steeringAngleDeg={steeringAngleDeg}
        indicatorState={indicatorState}
        lightingMode={lightingMode}
        headlightsOn={headlightsOn}
        onToggleTestMode={() => setIsTestMode((p) => !p)}
        onToggleMute={toggleMute}
        onInspectSign={onInspectSign}
        onSpeakSign={speakSign}
        onOpenGarage={() => setIsGarageOpen(true)}
        onToggleIndicator={toggleIndicator}
        onToggleLightingMode={toggleLightingMode}
        onPlayHorn={playHorn}
      />

      {/* Mobile Touch Controls */}
      <MobileTouchControls
        controls={controls}
        setControls={setControls}
        onCameraToggle={toggleCamera}
        onResetCar={handleResetCar}
        cameraMode={cameraMode}
        currentVehicle={currentVehicle}
        indicatorState={indicatorState}
        onToggleIndicator={toggleIndicator}
        onOpenGarage={() => setIsGarageOpen(true)}
        onPlayHorn={playHorn}
        isFullscreen={isFullscreen}
        onToggleFullscreen={() => setIsFullscreen((prev) => !prev)}
      />

      {/* Vehicle Garage Selector Modal */}
      <VehicleGarageModal
        isOpen={isGarageOpen}
        currentVehicle={currentVehicle}
        onSelectVehicle={changeVehicle}
        onClose={() => setIsGarageOpen(false)}
      />
    </div>
  );
};
