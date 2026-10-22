'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { sounds } from '@/utils/audio';
import { VehicleType, VEHICLE_CONFIGS } from '@/types/vehicle';

export interface VehicleControlState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  handbrake: boolean;
  horn: boolean;
}

interface VehicleProps {
  controls: VehicleControlState;
  cameraMode: 'third_person' | 'hood' | 'top_down';
  vehicleType?: VehicleType;
  headlightsOn?: boolean;
  indicatorState?: 'off' | 'left' | 'right' | 'hazard';
  onSpeedChange: (speedKmH: number) => void;
  onPositionUpdate: (pos: [number, number, number]) => void;
  onSteeringAngleChange?: (angleDeg: number) => void;
  onSpeedBreakerCross?: (speedKmH: number) => void;
}

export const Vehicle: React.FC<VehicleProps> = ({
  controls,
  cameraMode,
  vehicleType = 'hatchback',
  headlightsOn = true,
  indicatorState = 'off',
  onSpeedChange,
  onPositionUpdate,
  onSteeringAngleChange,
  onSpeedBreakerCross,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const frontLeftWheelRef = useRef<THREE.Group>(null);
  const frontRightWheelRef = useRef<THREE.Group>(null);
  const frontRickshawForkRef = useRef<THREE.Group>(null);
  const frontBikeForkRef = useRef<THREE.Group>(null);
  const rearLeftWheelRef = useRef<THREE.Mesh>(null);
  const rearRightWheelRef = useRef<THREE.Mesh>(null);
  const rearBikeWheelRef = useRef<THREE.Mesh>(null);

  const { camera } = useThree();
  const config = VEHICLE_CONFIGS[vehicleType] || VEHICLE_CONFIGS.hatchback;

  // Physics state
  const speedRef = useRef(0); // in m/s
  const steeringAngleRef = useRef(0); // in radians
  const headingRef = useRef(0); // in radians
  const positionRef = useRef<[number, number, number]>([-2.2, 0, 0]); // start in left lane (India LHT)
  const verticalBounceRef = useRef(0);
  const lastSpeedBreakerHitRef = useRef<number>(0);

  // Turn signal blink timer state
  const [blinkOn, setBlinkOn] = useState(false);
  useEffect(() => {
    if (indicatorState === 'off') {
      setBlinkOn(false);
      return;
    }
    const interval = setInterval(() => {
      setBlinkOn((prev) => {
        const next = !prev;
        if (next) sounds.playTurnBlinker('tick');
        else sounds.playTurnBlinker('tock');
        return next;
      });
    }, 420);
    return () => clearInterval(interval);
  }, [indicatorState]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    const dt = Math.min(delta, 0.1);
    const maxSpeedForward = config.maxSpeedKmH / 3.6; // convert km/h to m/s
    const maxSpeedReverse = -7;
    const accelRate = config.accelRate;
    const brakeRate = config.brakeRate;
    const friction = 4.2;

    // Acceleration & Braking
    if (controls.forward) {
      speedRef.current = Math.min(speedRef.current + accelRate * dt, maxSpeedForward);
    } else if (controls.backward) {
      if (speedRef.current > 0.5) {
        speedRef.current = Math.max(speedRef.current - brakeRate * dt, 0);
      } else {
        speedRef.current = Math.max(speedRef.current - accelRate * 0.6 * dt, maxSpeedReverse);
      }
    } else {
      // Natural friction
      if (speedRef.current > 0) {
        speedRef.current = Math.max(speedRef.current - friction * dt, 0);
      } else if (speedRef.current < 0) {
        speedRef.current = Math.min(speedRef.current + friction * dt, 0);
      }
    }

    if (controls.handbrake) {
      speedRef.current = Math.max(speedRef.current - brakeRate * 1.5 * dt, 0);
    }

    // Steering logic
    const maxSteer = config.maxSteerAngle;
    const steerSpeed = config.steerSpeed;

    if (controls.left) {
      steeringAngleRef.current = Math.min(steeringAngleRef.current + steerSpeed * dt, maxSteer);
    } else if (controls.right) {
      steeringAngleRef.current = Math.max(steeringAngleRef.current - steerSpeed * dt, -maxSteer);
    } else {
      // Return to center
      if (steeringAngleRef.current > 0) {
        steeringAngleRef.current = Math.max(steeringAngleRef.current - steerSpeed * 1.6 * dt, 0);
      } else if (steeringAngleRef.current < 0) {
        steeringAngleRef.current = Math.min(steeringAngleRef.current + steerSpeed * 1.6 * dt, 0);
      }
    }

    // Notify HUD of steering wheel rotation in degrees
    if (onSteeringAngleChange) {
      const deg = (steeringAngleRef.current / maxSteer) * 75; // -75 to +75 deg
      onSteeringAngleChange(deg);
    }

    // Heading update using bicycle kinematics
    const angularVelocity = (speedRef.current / config.wheelBase) * Math.sin(steeringAngleRef.current);
    headingRef.current += angularVelocity * dt;

    // Position integration
    const dx = Math.sin(headingRef.current) * speedRef.current * dt;
    const dz = Math.cos(headingRef.current) * speedRef.current * dt;

    let newX = positionRef.current[0] + dx;
    newX = Math.max(-5.5, Math.min(newX, 5.5)); // stay on asphalt width
    const newZ = positionRef.current[1] + dz;

    // Detect speed breaker bumps at z=45m and z=125m
    const isAtSpeedBreaker1 = Math.abs(newZ - 45) < 1.2;
    const isAtSpeedBreaker2 = Math.abs(newZ - 125) < 1.2;

    if ((isAtSpeedBreaker1 || isAtSpeedBreaker2) && Date.now() - lastSpeedBreakerHitRef.current > 1500) {
      lastSpeedBreakerHitRef.current = Date.now();
      const currentKmH = Math.round(speedRef.current * 3.6);
      if (currentKmH > 18) {
        verticalBounceRef.current = 0.28;
        if (onSpeedBreakerCross) onSpeedBreakerCross(currentKmH);
      }
    }

    verticalBounceRef.current = Math.max(0, verticalBounceRef.current - dt * 2.2);
    const speedKmH = Math.round(speedRef.current * 3.6);
    positionRef.current = [newX, newZ, 0];

    // Apply to vehicle group with realistic motorcycle banking / lean physics
    groupRef.current.position.set(newX, verticalBounceRef.current, newZ);
    groupRef.current.rotation.y = headingRef.current;

    if (vehicleType === 'r15_bike') {
      const speedFactor = Math.min(Math.abs(speedKmH) / 45, 1.3);
      const leanTarget = -(steeringAngleRef.current / config.maxSteerAngle) * (0.38 * speedFactor);
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, leanTarget, 0.2);
    } else {
      groupRef.current.rotation.z = 0;
    }

    // Rotate Wheels
    const wheelRadius = vehicleType === 'truck' ? 0.45 : vehicleType === 'auto_rickshaw' ? 0.25 : 0.3;
    const wheelCircumference = 2 * Math.PI * wheelRadius;
    const wheelRotationStep = (speedRef.current * dt) / wheelCircumference;

    if (vehicleType === 'auto_rickshaw') {
      if (frontRickshawForkRef.current) {
        frontRickshawForkRef.current.rotation.y = steeringAngleRef.current;
        const forkWheel = frontRickshawForkRef.current.children[0] as THREE.Mesh;
        if (forkWheel) forkWheel.rotation.x += wheelRotationStep;
      }
      if (rearLeftWheelRef.current) rearLeftWheelRef.current.rotation.x += wheelRotationStep;
      if (rearRightWheelRef.current) rearRightWheelRef.current.rotation.x += wheelRotationStep;
    } else if (vehicleType === 'r15_bike') {
      if (frontBikeForkRef.current) {
        frontBikeForkRef.current.rotation.y = steeringAngleRef.current;
        const bikeFrontWheel = frontBikeForkRef.current.children[0] as THREE.Mesh;
        if (bikeFrontWheel) bikeFrontWheel.rotation.x += wheelRotationStep;
      }
      if (rearBikeWheelRef.current) rearBikeWheelRef.current.rotation.x += wheelRotationStep;
    } else {
      if (frontLeftWheelRef.current) {
        frontLeftWheelRef.current.rotation.y = steeringAngleRef.current;
        const mesh = frontLeftWheelRef.current.children[0] as THREE.Mesh;
        if (mesh) mesh.rotation.x += wheelRotationStep;
      }
      if (frontRightWheelRef.current) {
        frontRightWheelRef.current.rotation.y = steeringAngleRef.current;
        const mesh = frontRightWheelRef.current.children[0] as THREE.Mesh;
        if (mesh) mesh.rotation.x += wheelRotationStep;
      }
      if (rearLeftWheelRef.current) rearLeftWheelRef.current.rotation.x += wheelRotationStep;
      if (rearRightWheelRef.current) rearRightWheelRef.current.rotation.x += wheelRotationStep;
    }

    // Audio & callbacks
    sounds.updateEngine(speedKmH);
    onSpeedChange(speedKmH);
    onPositionUpdate([newX, 0, newZ]);

    // Camera follow modes adjusted for vehicle height
    const cam = config.cameraSettings;
    if (cameraMode === 'third_person') {
      const targetCamX = newX - Math.sin(headingRef.current) * cam.thirdPersonDist;
      const targetCamZ = newZ - Math.cos(headingRef.current) * cam.thirdPersonDist;
      camera.position.lerp(new THREE.Vector3(targetCamX, cam.thirdPersonHeight, targetCamZ), 0.12);
      camera.lookAt(newX, cam.thirdPersonHeight * 0.45, newZ + Math.cos(headingRef.current) * 4);
    } else if (cameraMode === 'hood') {
      const hoodX = newX + Math.sin(headingRef.current) * cam.hoodZ;
      const hoodZ = newZ + Math.cos(headingRef.current) * cam.hoodZ;
      camera.position.set(hoodX, cam.hoodHeight, hoodZ);
      camera.lookAt(newX + Math.sin(headingRef.current) * 20, cam.hoodHeight * 0.9, newZ + Math.cos(headingRef.current) * 20);
    } else if (cameraMode === 'top_down') {
      camera.position.lerp(new THREE.Vector3(newX, 18, newZ - 2), 0.15);
      camera.lookAt(newX, 0, newZ + 6);
    }
  });

  // Indicator blink booleans
  const isBlinkingLeft = (indicatorState === 'left' || indicatorState === 'hazard') && blinkOn;
  const isBlinkingRight = (indicatorState === 'right' || indicatorState === 'hazard') && blinkOn;

  return (
    <group ref={groupRef} position={[-2.2, 0, 0]}>
      {/* ============================================================== */}
      {/* VEHICLE 1: DESI AUTO-RICKSHAW (BAJAJ RE TUK-TUK 3-WHEELER)    */}
      {/* ============================================================== */}
      {vehicleType === 'auto_rickshaw' && (
        <group>
          {/* Lower Emerald Green Metal Tub Chassis */}
          <mesh position={[0, 0.42, 0]}>
            <boxGeometry args={[1.35, 0.45, 2.5]} />
            <meshStandardMaterial color="#047857" roughness={0.25} metalness={0.65} />
          </mesh>

          {/* Front Sloped Nose Cowl (Green with Bajaj Chrome Trim) */}
          <mesh position={[0, 0.54, 1.2]}>
            <boxGeometry args={[1.15, 0.44, 0.8]} />
            <meshStandardMaterial color="#047857" roughness={0.25} metalness={0.65} />
          </mesh>
          <mesh position={[0, 0.38, 1.62]}>
            <boxGeometry args={[0.9, 0.08, 0.04]} />
            <meshStandardMaterial color="#E2E8F0" metalness={0.95} roughness={0.1} />
          </mesh>
          {/* Bajaj RE Chrome Emblem */}
          <mesh position={[0, 0.62, 1.61]}>
            <circleGeometry args={[0.06, 16]} />
            <meshStandardMaterial color="#F1F5F9" metalness={0.95} roughness={0.1} />
          </mesh>

          {/* Curved Yellow Canvas Canopy / Roof with Seam Ribs */}
          <mesh position={[0, 1.28, -0.2]}>
            <boxGeometry args={[1.38, 0.1, 2.15]} />
            <meshStandardMaterial color="#F59E0B" roughness={0.65} />
          </mesh>
          {/* Canopy Roof Peak Dome */}
          <mesh position={[0, 1.34, -0.2]}>
            <boxGeometry args={[1.2, 0.05, 1.9]} />
            <meshStandardMaterial color="#EAB308" roughness={0.65} />
          </mesh>
          {/* Canopy Weather Stitches / Ribs */}
          {[-0.8, -0.3, 0.2, 0.7].map((zPos, idx) => (
            <mesh key={`canopy-rib-${idx}`} position={[0, 1.35, zPos]}>
              <boxGeometry args={[1.32, 0.015, 0.04]} />
              <meshStandardMaterial color="#D97706" />
            </mesh>
          ))}

          {/* Yellow Canopy Sloped Rear Cover */}
          <mesh position={[0, 0.92, -1.24]} rotation={[0.22, 0, 0]}>
            <boxGeometry args={[1.36, 0.68, 0.05]} />
            <meshStandardMaterial color="#F59E0B" roughness={0.65} />
          </mesh>
          {/* Rear Canvas Window Cutout */}
          <mesh position={[0, 0.98, -1.27]} rotation={[0.22, 0, 0]}>
            <planeGeometry args={[0.7, 0.28]} />
            <meshStandardMaterial color="#0F172A" transparent opacity={0.75} />
          </mesh>

          {/* Black Tubular Roll-Cage Support Pillars & Crossbars */}
          <mesh position={[-0.64, 0.86, 0.8]}>
            <cylinderGeometry args={[0.022, 0.022, 0.88, 8]} />
            <meshStandardMaterial color="#0F172A" metalness={0.8} />
          </mesh>
          <mesh position={[0.64, 0.86, 0.8]}>
            <cylinderGeometry args={[0.022, 0.022, 0.88, 8]} />
            <meshStandardMaterial color="#0F172A" metalness={0.8} />
          </mesh>
          <mesh position={[-0.64, 0.86, -1.16]}>
            <cylinderGeometry args={[0.022, 0.022, 0.88, 8]} />
            <meshStandardMaterial color="#0F172A" metalness={0.8} />
          </mesh>
          <mesh position={[0.64, 0.86, -1.16]}>
            <cylinderGeometry args={[0.022, 0.022, 0.88, 8]} />
            <meshStandardMaterial color="#0F172A" metalness={0.8} />
          </mesh>
          {/* Roll-Cage Diagonal Braces */}
          <mesh position={[-0.64, 0.86, -0.15]} rotation={[0, 0, 0]}>
            <cylinderGeometry args={[0.018, 0.018, 0.88, 8]} />
            <meshStandardMaterial color="#0F172A" metalness={0.8} />
          </mesh>
          <mesh position={[0.64, 0.86, -0.15]} rotation={[0, 0, 0]}>
            <cylinderGeometry args={[0.018, 0.018, 0.88, 8]} />
            <meshStandardMaterial color="#0F172A" metalness={0.8} />
          </mesh>

          {/* Front Windshield Glass with Wiper */}
          <mesh position={[0, 0.94, 0.86]} rotation={[-0.15, 0, 0]}>
            <planeGeometry args={[1.18, 0.58]} />
            <meshStandardMaterial color="#38BDF8" transparent opacity={0.55} roughness={0.05} />
          </mesh>
          <mesh position={[-0.1, 0.94, 0.88]} rotation={[-0.15, 0, 0.3]}>
            <boxGeometry args={[0.02, 0.4, 0.01]} />
            <meshStandardMaterial color="#0F172A" />
          </mesh>

          {/* Driver Cockpit: Handlebars & Side Mirrors */}
          <mesh position={[0, 0.75, 0.72]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.02, 0.02, 0.65, 8]} />
            <meshStandardMaterial color="#CBD5E1" metalness={0.9} />
          </mesh>
          {/* Black Rubber Handlebar Grips */}
          <mesh position={[-0.3, 0.75, 0.72]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.026, 0.026, 0.12, 8]} />
            <meshStandardMaterial color="#18181B" roughness={0.9} />
          </mesh>
          <mesh position={[0.3, 0.75, 0.72]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.026, 0.026, 0.12, 8]} />
            <meshStandardMaterial color="#18181B" roughness={0.9} />
          </mesh>
          {/* Left & Right Round Chrome Mirrors */}
          <mesh position={[-0.38, 0.86, 0.72]}>
            <circleGeometry args={[0.045, 16]} />
            <meshStandardMaterial color="#E2E8F0" metalness={0.95} />
          </mesh>
          <mesh position={[0.38, 0.86, 0.72]}>
            <circleGeometry args={[0.045, 16]} />
            <meshStandardMaterial color="#E2E8F0" metalness={0.95} />
          </mesh>

          {/* Authentic Indian Electronic Fare Meter ("₹ HIRE") */}
          <mesh position={[0.34, 0.78, 0.75]}>
            <boxGeometry args={[0.13, 0.09, 0.06]} />
            <meshStandardMaterial color="#B91C1C" roughness={0.3} metalness={0.4} />
          </mesh>
          <mesh position={[0.34, 0.78, 0.785]}>
            <planeGeometry args={[0.1, 0.05]} />
            <meshBasicMaterial color="#10B981" />
          </mesh>

          {/* Driver Pleated Rexine Saddle */}
          <mesh position={[0, 0.6, 0.25]}>
            <boxGeometry args={[0.42, 0.14, 0.38]} />
            <meshStandardMaterial color="#18181B" roughness={0.9} />
          </mesh>

          {/* Passenger Cabin: Black & Tan Pleated Rexine Bench Seat */}
          <mesh position={[0, 0.58, -0.6]}>
            <boxGeometry args={[1.22, 0.16, 0.7]} />
            <meshStandardMaterial color="#78350F" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.85, -0.92]}>
            <boxGeometry args={[1.22, 0.45, 0.08]} />
            <meshStandardMaterial color="#78350F" roughness={0.8} />
          </mesh>

          {/* Side Safety Passenger Grab Rails */}
          <mesh position={[-0.64, 0.65, -0.5]}>
            <boxGeometry args={[0.02, 0.03, 0.8]} />
            <meshStandardMaterial color="#CBD5E1" metalness={0.9} />
          </mesh>
          <mesh position={[0.64, 0.65, -0.5]}>
            <boxGeometry args={[0.02, 0.03, 0.8]} />
            <meshStandardMaterial color="#CBD5E1" metalness={0.9} />
          </mesh>

          {/* Single Center Vintage Chrome Headlight with Visor Hood */}
          <mesh position={[0, 0.56, 1.63]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.14, 0.14, 0.08, 20]} />
            <meshStandardMaterial color="#E2E8F0" metalness={0.95} roughness={0.1} />
          </mesh>
          <mesh position={[0, 0.56, 1.67]}>
            <circleGeometry args={[0.12, 20]} />
            <meshBasicMaterial color={headlightsOn ? '#FEF08A' : '#CBD5E1'} />
          </mesh>
          {headlightsOn && (
            <spotLight position={[0, 0.6, 1.7]} angle={0.45} intensity={5.5} distance={44} color="#FEF08A" />
          )}

          {/* Front Round Amber Bullet Blinkers on Stalks */}
          <mesh position={[-0.45, 0.56, 1.56]}>
            <sphereGeometry args={[0.05, 12, 12]} />
            <meshBasicMaterial color={isBlinkingLeft ? '#F59E0B' : '#78350F'} />
          </mesh>
          <mesh position={[0.45, 0.56, 1.56]}>
            <sphereGeometry args={[0.05, 12, 12]} />
            <meshBasicMaterial color={isBlinkingRight ? '#F59E0B' : '#78350F'} />
          </mesh>

          {/* Rear Mounted Stepney Spare Tire & 3-Arm Steel Bracket */}
          <mesh position={[0, 0.64, -1.32]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.24, 0.24, 0.14, 20]} />
            <meshStandardMaterial color="#0F172A" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.64, -1.39]} rotation={[Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.12, 16]} />
            <meshStandardMaterial color="#94A3B8" metalness={0.8} />
          </mesh>
          {/* Spare Wheel Chrome Clamp Bar */}
          <mesh position={[0, 0.64, -1.4]}>
            <boxGeometry args={[0.26, 0.03, 0.02]} />
            <meshStandardMaterial color="#E2E8F0" metalness={0.9} />
          </mesh>

          {/* Number Plate: Yellow Commercial Board */}
          <mesh position={[0, 0.32, -1.28]}>
            <boxGeometry args={[0.4, 0.12, 0.02]} />
            <meshStandardMaterial color="#FBBF24" />
          </mesh>

          {/* Rear Bumper with Yellow & Black Diagonal Hazard Tape */}
          <mesh position={[0, 0.18, -1.26]}>
            <boxGeometry args={[1.32, 0.08, 0.06]} />
            <meshStandardMaterial color="#0F172A" metalness={0.8} />
          </mesh>
          {[-0.5, -0.25, 0, 0.25, 0.5].map((xOff, i) => (
            <mesh key={`hazard-strip-${i}`} position={[xOff, 0.18, -1.295]}>
              <boxGeometry args={[0.08, 0.075, 0.01]} />
              <meshStandardMaterial color="#FACC15" />
            </mesh>
          ))}

          {/* Rear Taillights */}
          <mesh position={[-0.48, 0.45, -1.26]}>
            <boxGeometry args={[0.18, 0.1, 0.02]} />
            <meshBasicMaterial color={controls.backward || controls.handbrake ? '#FF0000' : '#991B1B'} />
          </mesh>
          <mesh position={[0.48, 0.45, -1.26]}>
            <boxGeometry args={[0.18, 0.1, 0.02]} />
            <meshBasicMaterial color={controls.backward || controls.handbrake ? '#FF0000' : '#991B1B'} />
          </mesh>

          {/* Rear Mudflaps */}
          <mesh position={[-0.7, 0.14, -0.85]}>
            <boxGeometry args={[0.22, 0.18, 0.01]} />
            <meshStandardMaterial color="#1E293B" />
          </mesh>
          <mesh position={[0.7, 0.14, -0.85]}>
            <boxGeometry args={[0.22, 0.18, 0.01]} />
            <meshStandardMaterial color="#1E293B" />
          </mesh>

          {/* 3 WHEELS SETUP: 1 Front Center Wheel on Fork with Coil Spring & Mudguard */}
          <group ref={frontRickshawForkRef} position={[0, 0.28, 1.3]}>
            {/* Front Wheel */}
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.26, 0.26, 0.14, 20]} />
              <meshStandardMaterial color="#0F172A" roughness={0.9} />
            </mesh>
            {/* Front Wheel Hub */}
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.12, 0.12, 0.15, 12]} />
              <meshStandardMaterial color="#94A3B8" metalness={0.8} />
            </mesh>
            {/* Curved Emerald Front Mudguard */}
            <mesh position={[0, 0.22, 0.04]}>
              <boxGeometry args={[0.18, 0.08, 0.38]} />
              <meshStandardMaterial color="#047857" roughness={0.3} metalness={0.5} />
            </mesh>
            {/* Chrome Fork Arms */}
            <mesh position={[-0.1, 0.22, 0]}>
              <cylinderGeometry args={[0.025, 0.025, 0.44, 8]} />
              <meshStandardMaterial color="#CBD5E1" metalness={0.95} />
            </mesh>
            <mesh position={[0.1, 0.22, 0]}>
              <cylinderGeometry args={[0.025, 0.025, 0.44, 8]} />
              <meshStandardMaterial color="#CBD5E1" metalness={0.95} />
            </mesh>
          </group>

          {/* 2 Rear Wheels */}
          <mesh ref={rearLeftWheelRef} position={[-0.7, 0.28, -0.65]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.26, 0.26, 0.15, 20]} />
            <meshStandardMaterial color="#0F172A" roughness={0.9} />
          </mesh>
          <mesh ref={rearRightWheelRef} position={[0.7, 0.28, -0.65]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.26, 0.26, 0.15, 20]} />
            <meshStandardMaterial color="#0F172A" roughness={0.9} />
          </mesh>
        </group>
      )}

      {/* ============================================================== */}
      {/* VEHICLE 2: INDIAN TATA HIGHWAY TRUCK ("HORN OK PLEASE")        */}
      {/* ============================================================== */}
      {vehicleType === 'truck' && (
        <group>
          {/* Main Heavy Steel I-Beam Chassis Beam */}
          <mesh position={[0, 0.55, 0]}>
            <boxGeometry args={[2.1, 0.35, 6.2]} />
            <meshStandardMaterial color="#1E293B" metalness={0.85} roughness={0.3} />
          </mesh>

          {/* Front Tall Driver Cabin (Vibrant Truck Orange with Gloss) */}
          <mesh position={[0, 1.6, 1.8]}>
            <boxGeometry args={[2.3, 1.7, 2.0]} />
            <meshStandardMaterial color="#EA580C" roughness={0.25} metalness={0.4} />
          </mesh>

          {/* Tata Front Grille with Triple Horizontal Chrome Slats & Emblem */}
          <mesh position={[0, 1.05, 2.82]}>
            <boxGeometry args={[1.8, 0.5, 0.04]} />
            <meshStandardMaterial color="#1E293B" metalness={0.9} roughness={0.2} />
          </mesh>
          {[-0.12, 0, 0.12].map((yOff, i) => (
            <mesh key={`tata-grille-slat-${i}`} position={[0, 1.05 + yOff, 2.845]}>
              <boxGeometry args={[1.65, 0.03, 0.02]} />
              <meshStandardMaterial color="#E2E8F0" metalness={0.95} />
            </mesh>
          ))}
          {/* Large Circular Tata Chrome Emblem */}
          <mesh position={[0, 1.05, 2.86]}>
            <circleGeometry args={[0.13, 20]} />
            <meshStandardMaterial color="#F8FAFC" metalness={0.95} roughness={0.1} />
          </mesh>

          {/* Front Windshield with Center Divider & Wipers */}
          <mesh position={[0, 1.8, 2.82]}>
            <planeGeometry args={[2.0, 0.75]} />
            <meshStandardMaterial color="#38BDF8" transparent opacity={0.65} roughness={0.05} />
          </mesh>
          <mesh position={[0, 1.8, 2.83]}>
            <boxGeometry args={[0.06, 0.75, 0.02]} />
            <meshStandardMaterial color="#EA580C" />
          </mesh>

          {/* Traditional Hand-Painted Decorative Brow Pattern */}
          <mesh position={[0, 2.2, 2.81]}>
            <boxGeometry args={[2.1, 0.08, 0.02]} />
            <meshStandardMaterial color="#16A34A" />
          </mesh>

          {/* Sun Visor / Top Signboard: "ALL INDIA PERMIT" */}
          <mesh position={[0, 2.36, 2.8]}>
            <boxGeometry args={[2.22, 0.32, 0.08]} />
            <meshStandardMaterial color="#FBBF24" roughness={0.3} />
          </mesh>

          {/* Amber Clearance Cab Lights on Roof Corners */}
          <mesh position={[-1.0, 2.48, 2.8]}>
            <sphereGeometry args={[0.045, 12, 12]} />
            <meshBasicMaterial color="#F59E0B" />
          </mesh>
          <mesh position={[1.0, 2.48, 2.8]}>
            <sphereGeometry args={[0.045, 12, 12]} />
            <meshBasicMaterial color="#F59E0B" />
          </mesh>
          <mesh position={[0, 2.52, 2.8]}>
            <sphereGeometry args={[0.04, 12, 12]} />
            <meshBasicMaterial color="#F59E0B" />
          </mesh>

          {/* Roof Luggage Carrier Rack with Spare Tire & Tarpaulin Freight Bundle */}
          <mesh position={[0, 2.55, 1.8]}>
            <boxGeometry args={[2.0, 0.15, 1.6]} />
            <meshStandardMaterial color="#FACC15" wireframe />
          </mesh>
          {/* Spare Truck Wheel Stored on Roof */}
          <mesh position={[-0.45, 2.68, 1.8]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.4, 0.4, 0.24, 16]} />
            <meshStandardMaterial color="#0F172A" roughness={0.9} />
          </mesh>
          {/* Blue Cargo Tarpaulin Canvas Bundle on Roof */}
          <mesh position={[0.42, 2.72, 1.8]}>
            <boxGeometry args={[0.85, 0.32, 1.15]} />
            <meshStandardMaterial color="#0284C7" roughness={0.7} />
          </mesh>

          {/* Dual Chrome Long Highway Air Horn Trumpets */}
          <mesh position={[-0.38, 2.7, 2.22]} rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.09, 0.52, 16]} />
            <meshStandardMaterial color="#F1F5F9" metalness={0.95} roughness={0.1} />
          </mesh>
          <mesh position={[0.38, 2.7, 2.22]} rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.09, 0.52, 16]} />
            <meshStandardMaterial color="#F1F5F9" metalness={0.95} roughness={0.1} />
          </mesh>

          {/* Heavy Front Bumper & Tubular Chrome Bull-Bar (Crash Guard) */}
          <mesh position={[0, 0.45, 2.88]}>
            <boxGeometry args={[2.35, 0.4, 0.2]} />
            <meshStandardMaterial color="#CBD5E1" metalness={0.95} roughness={0.15} />
          </mesh>
          {/* Bullbar Upper & Lower Tubular Rails */}
          <mesh position={[0, 0.72, 3.02]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.035, 0.035, 2.2, 12]} />
            <meshStandardMaterial color="#E2E8F0" metalness={0.95} />
          </mesh>
          <mesh position={[0, 0.35, 3.02]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.035, 0.035, 2.2, 12]} />
            <meshStandardMaterial color="#E2E8F0" metalness={0.95} />
          </mesh>
          {/* Bullbar Vertical Upright Posts */}
          <mesh position={[-0.6, 0.53, 3.02]}>
            <cylinderGeometry args={[0.038, 0.038, 0.48, 12]} />
            <meshStandardMaterial color="#E2E8F0" metalness={0.95} />
          </mesh>
          <mesh position={[0.6, 0.53, 3.02]}>
            <cylinderGeometry args={[0.038, 0.038, 0.48, 12]} />
            <meshStandardMaterial color="#E2E8F0" metalness={0.95} />
          </mesh>
          {/* Evil Eye Pom-Pom Tassels (Nazar Battu) Hanging on Bullbar */}
          <mesh position={[-0.6, 0.22, 3.02]}>
            <sphereGeometry args={[0.05, 10, 10]} />
            <meshStandardMaterial color="#0F172A" roughness={0.9} />
          </mesh>
          <mesh position={[0.6, 0.22, 3.02]}>
            <sphereGeometry args={[0.05, 10, 10]} />
            <meshStandardMaterial color="#0F172A" roughness={0.9} />
          </mesh>

          {/* Yellow Fog Lamps on Bullbar */}
          <mesh position={[-0.9, 0.35, 2.99]}>
            <circleGeometry args={[0.09, 16]} />
            <meshBasicMaterial color="#FBBF24" />
          </mesh>
          <mesh position={[0.9, 0.35, 2.99]}>
            <circleGeometry args={[0.09, 16]} />
            <meshBasicMaterial color="#FBBF24" />
          </mesh>

          {/* Large Freight Cargo Bed (Green Wooden Sides with Indian Art) */}
          <mesh position={[0, 1.45, -0.9]}>
            <boxGeometry args={[2.3, 1.4, 3.8]} />
            <meshStandardMaterial color="#16A34A" roughness={0.65} />
          </mesh>
          {/* Wooden Planks Horizontal Slat Accents */}
          {[-0.3, 0, 0.3].map((yOffset, i) => (
            <mesh key={`plank-${i}`} position={[1.16, 1.45 + yOffset, -0.9]}>
              <boxGeometry args={[0.02, 0.04, 3.75]} />
              <meshStandardMaterial color="#FBBF24" />
            </mesh>
          ))}
          {[-0.3, 0, 0.3].map((yOffset, i) => (
            <mesh key={`plank-left-${i}`} position={[-1.16, 1.45 + yOffset, -0.9]}>
              <boxGeometry args={[0.02, 0.04, 3.75]} />
              <meshStandardMaterial color="#FBBF24" />
            </mesh>
          ))}

          {/* Cylindrical Steel Diesel Fuel Tank on Left Undercarriage */}
          <mesh position={[-1.08, 0.52, -0.4]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.26, 0.26, 1.35, 20]} />
            <meshStandardMaterial color="#94A3B8" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Fuel Tank Chrome Clamping Straps */}
          <mesh position={[-1.08, 0.52, -0.8]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.268, 0.268, 0.04, 20]} />
            <meshStandardMaterial color="#CBD5E1" metalness={0.95} />
          </mesh>
          <mesh position={[-1.08, 0.52, 0.0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.268, 0.268, 0.04, 20]} />
            <meshStandardMaterial color="#CBD5E1" metalness={0.95} />
          </mesh>

          {/* Heavy Battery Box on Right Undercarriage */}
          <mesh position={[1.08, 0.5, -0.4]}>
            <boxGeometry args={[0.34, 0.28, 0.55]} />
            <meshStandardMaterial color="#0F172A" metalness={0.8} />
          </mesh>

          {/* Rear Tailgate: "HORN OK PLEASE" Banner Board */}
          <mesh position={[0, 1.15, -2.82]} rotation={[0, Math.PI, 0]}>
            <boxGeometry args={[2.28, 0.48, 0.04]} />
            <meshStandardMaterial color="#FBBF24" />
          </mesh>
          <mesh position={[0, 0.6, -2.85]}>
            <boxGeometry args={[2.3, 0.25, 0.1]} />
            <meshStandardMaterial color="#DC2626" />
          </mesh>

          {/* Tall Vertical Diesel Exhaust Stack with Heat Guard */}
          <mesh position={[1.18, 1.9, 0.9]}>
            <cylinderGeometry args={[0.065, 0.065, 2.1, 16]} />
            <meshStandardMaterial color="#CBD5E1" metalness={0.9} roughness={0.2} />
          </mesh>

          {/* Halogen Dual Headlights with Chrome Bezels */}
          <mesh position={[-0.8, 0.5, 2.99]}>
            <circleGeometry args={[0.15, 16]} />
            <meshBasicMaterial color={headlightsOn ? '#FEF08A' : '#E2E8F0'} />
          </mesh>
          <mesh position={[0.8, 0.5, 2.99]}>
            <circleGeometry args={[0.15, 16]} />
            <meshBasicMaterial color={headlightsOn ? '#FEF08A' : '#E2E8F0'} />
          </mesh>
          {headlightsOn && (
            <>
              <spotLight position={[-0.8, 0.55, 3.1]} angle={0.42} intensity={6} distance={52} color="#FEF08A" />
              <spotLight position={[0.8, 0.55, 3.1]} angle={0.42} intensity={6} distance={52} color="#FEF08A" />
            </>
          )}

          {/* Amber Corner Blinkers */}
          <mesh position={[-1.08, 0.7, 2.8]}>
            <boxGeometry args={[0.12, 0.15, 0.04]} />
            <meshBasicMaterial color={isBlinkingLeft ? '#F59E0B' : '#78350F'} />
          </mesh>
          <mesh position={[1.08, 0.7, 2.8]}>
            <boxGeometry args={[0.12, 0.15, 0.04]} />
            <meshBasicMaterial color={isBlinkingRight ? '#F59E0B' : '#78350F'} />
          </mesh>

          {/* Taillights */}
          <mesh position={[-0.85, 0.6, -2.92]} rotation={[0, Math.PI, 0]}>
            <boxGeometry args={[0.28, 0.16, 0.02]} />
            <meshBasicMaterial color={controls.backward || controls.handbrake ? '#FF0000' : '#881337'} />
          </mesh>
          <mesh position={[0.85, 0.6, -2.92]} rotation={[0, Math.PI, 0]}>
            <boxGeometry args={[0.28, 0.16, 0.02]} />
            <meshBasicMaterial color={controls.backward || controls.handbrake ? '#FF0000' : '#881337'} />
          </mesh>

          {/* Heavy Rear Rubber Mudflaps */}
          <mesh position={[-1.0, 0.25, -2.88]}>
            <boxGeometry args={[0.42, 0.35, 0.02]} />
            <meshStandardMaterial color="#0F172A" />
          </mesh>
          <mesh position={[1.0, 0.25, -2.88]}>
            <boxGeometry args={[0.42, 0.35, 0.02]} />
            <meshStandardMaterial color="#0F172A" />
          </mesh>

          {/* 6 HEAVY TRUCK WHEELS */}
          {/* Front Left Wheel */}
          <group ref={frontLeftWheelRef} position={[-1.15, 0.45, 1.8]}>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.45, 0.45, 0.3, 24]} />
              <meshStandardMaterial color="#0F172A" roughness={0.9} />
            </mesh>
            <mesh position={[-0.16, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.24, 0.24, 0.03, 16]} />
              <meshStandardMaterial color="#CBD5E1" metalness={0.9} />
            </mesh>
          </group>

          {/* Front Right Wheel */}
          <group ref={frontRightWheelRef} position={[1.15, 0.45, 1.8]}>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.45, 0.45, 0.3, 24]} />
              <meshStandardMaterial color="#0F172A" roughness={0.9} />
            </mesh>
            <mesh position={[0.16, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.24, 0.24, 0.03, 16]} />
              <meshStandardMaterial color="#CBD5E1" metalness={0.9} />
            </mesh>
          </group>

          {/* Rear Dual Axle Wheels (Left & Right) */}
          <mesh ref={rearLeftWheelRef} position={[-1.18, 0.45, -1.8]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.45, 0.45, 0.52, 24]} />
            <meshStandardMaterial color="#0F172A" roughness={0.9} />
          </mesh>
          <mesh ref={rearRightWheelRef} position={[1.18, 0.45, -1.8]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.45, 0.45, 0.52, 24]} />
            <meshStandardMaterial color="#0F172A" roughness={0.9} />
          </mesh>
        </group>
      )}

      {/* ============================================================== */}
      {/* VEHICLE 3: CLASSIC INDIAN HATCHBACK / SEDAN                    */}
      {/* ============================================================== */}
      {vehicleType === 'hatchback' && (
        <group>
          {/* Lower Aerodynamic Chassis Base */}
          <mesh position={[0, 0.38, 0]}>
            <boxGeometry args={[1.82, 0.45, 4.0]} />
            <meshStandardMaterial color="#0284C7" metalness={0.85} roughness={0.15} />
          </mesh>

          {/* Front Sculpted Hood Slope with Character Lines */}
          <mesh position={[0, 0.54, 1.2]}>
            <boxGeometry args={[1.76, 0.28, 1.4]} />
            <meshStandardMaterial color="#0369A1" metalness={0.85} roughness={0.15} />
          </mesh>
          {/* Hood Dual Crease Lines */}
          <mesh position={[-0.45, 0.69, 1.2]}>
            <boxGeometry args={[0.02, 0.02, 1.3]} />
            <meshStandardMaterial color="#0284C7" metalness={0.9} />
          </mesh>
          <mesh position={[0.45, 0.69, 1.2]}>
            <boxGeometry args={[0.02, 0.02, 1.3]} />
            <meshStandardMaterial color="#0284C7" metalness={0.9} />
          </mesh>

          {/* Front Sport Bumper Splitter Lip with Accent */}
          <mesh position={[0, 0.16, 2.05]}>
            <boxGeometry args={[1.86, 0.06, 0.18]} />
            <meshStandardMaterial color="#0F172A" roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.16, 2.145]}>
            <boxGeometry args={[1.4, 0.015, 0.01]} />
            <meshStandardMaterial color="#DC2626" />
          </mesh>

          {/* Side Ground-Effect Rocker Skirts */}
          <mesh position={[-0.93, 0.2, 0]}>
            <boxGeometry args={[0.04, 0.08, 2.8]} />
            <meshStandardMaterial color="#0F172A" />
          </mesh>
          <mesh position={[0.93, 0.2, 0]}>
            <boxGeometry args={[0.04, 0.08, 2.8]} />
            <meshStandardMaterial color="#0F172A" />
          </mesh>

          {/* Cabin / Roof with Floating Black Pillar Effect */}
          <mesh position={[0, 0.96, -0.3]}>
            <boxGeometry args={[1.52, 0.65, 2.15]} />
            <meshStandardMaterial color="#0F172A" roughness={0.2} metalness={0.5} />
          </mesh>

          {/* Windshield & Windows with Tinted Gloss Glass */}
          <mesh position={[0, 0.96, 0.78]} rotation={[-0.45, 0, 0]}>
            <planeGeometry args={[1.4, 0.66]} />
            <meshStandardMaterial color="#38BDF8" transparent opacity={0.65} roughness={0.05} />
          </mesh>
          <mesh position={[0, 0.96, -1.38]} rotation={[0.45, Math.PI, 0]}>
            <planeGeometry args={[1.4, 0.66]} />
            <meshStandardMaterial color="#38BDF8" transparent opacity={0.65} roughness={0.05} />
          </mesh>

          {/* Aerodynamic Shark-Fin Roof Antenna */}
          <mesh position={[0, 1.34, -1.1]}>
            <coneGeometry args={[0.035, 0.1, 4]} />
            <meshStandardMaterial color="#0F172A" />
          </mesh>

          {/* Sport Rear Roof Spoiler with High-Mount 3rd Brake Light */}
          <mesh position={[0, 1.28, -1.36]}>
            <boxGeometry args={[1.44, 0.05, 0.22]} />
            <meshStandardMaterial color="#0F172A" roughness={0.3} />
          </mesh>
          <mesh position={[0, 1.28, -1.475]}>
            <boxGeometry args={[0.38, 0.02, 0.01]} />
            <meshBasicMaterial color={controls.backward || controls.handbrake ? '#FF0000' : '#881337'} />
          </mesh>

          {/* Roof Saffron Sport Racing Stripe */}
          <mesh position={[0, 1.29, -0.3]}>
            <boxGeometry args={[0.3, 0.02, 2.05]} />
            <meshStandardMaterial color="#FF9933" roughness={0.3} />
          </mesh>

          {/* Front Chrome Honeycomb Grille & Center Logo */}
          <mesh position={[0, 0.38, 2.01]}>
            <planeGeometry args={[1.25, 0.26]} />
            <meshStandardMaterial color="#E2E8F0" metalness={0.95} roughness={0.1} />
          </mesh>
          <mesh position={[0, 0.38, 2.02]}>
            <circleGeometry args={[0.065, 16]} />
            <meshStandardMaterial color="#F8FAFC" metalness={0.95} />
          </mesh>

          {/* Xenon Swept-Back Headlights with L-Shaped LED DRL Eyebrows */}
          <mesh position={[-0.65, 0.42, 2.01]}>
            <circleGeometry args={[0.13, 20]} />
            <meshBasicMaterial color={headlightsOn ? '#E0F2FE' : '#94A3B8'} />
          </mesh>
          <mesh position={[0.65, 0.42, 2.01]}>
            <circleGeometry args={[0.13, 20]} />
            <meshBasicMaterial color={headlightsOn ? '#E0F2FE' : '#94A3B8'} />
          </mesh>
          {/* LED DRL Eyebrows */}
          <mesh position={[-0.65, 0.52, 2.015]}>
            <boxGeometry args={[0.22, 0.025, 0.01]} />
            <meshBasicMaterial color="#FFFFFF" />
          </mesh>
          <mesh position={[0.65, 0.52, 2.015]}>
            <boxGeometry args={[0.22, 0.025, 0.01]} />
            <meshBasicMaterial color="#FFFFFF" />
          </mesh>
          {headlightsOn && (
            <>
              <spotLight position={[-0.65, 0.5, 2.1]} angle={0.4} intensity={5} distance={42} color="#F8FAFC" />
              <spotLight position={[0.65, 0.5, 2.1]} angle={0.4} intensity={5} distance={42} color="#F8FAFC" />
            </>
          )}

          {/* Amber Corner Turn Indicators */}
          <mesh position={[-0.82, 0.42, 1.95]}>
            <boxGeometry args={[0.08, 0.1, 0.06]} />
            <meshBasicMaterial color={isBlinkingLeft ? '#F59E0B' : '#78350F'} />
          </mesh>
          <mesh position={[0.82, 0.42, 1.95]}>
            <boxGeometry args={[0.08, 0.1, 0.06]} />
            <meshBasicMaterial color={isBlinkingRight ? '#F59E0B' : '#78350F'} />
          </mesh>

          {/* Rear Taillights */}
          <mesh position={[-0.68, 0.45, -2.01]} rotation={[0, Math.PI, 0]}>
            <boxGeometry args={[0.26, 0.14, 0.02]} />
            <meshBasicMaterial color={controls.backward || controls.handbrake ? '#FF0000' : '#881337'} />
          </mesh>
          <mesh position={[0.68, 0.45, -2.01]} rotation={[0, Math.PI, 0]}>
            <boxGeometry args={[0.26, 0.14, 0.02]} />
            <meshBasicMaterial color={controls.backward || controls.handbrake ? '#FF0000' : '#881337'} />
          </mesh>
          {(controls.backward || controls.handbrake) && (
            <pointLight position={[0, 0.45, -2.3]} color="#FF0000" intensity={3.5} distance={6} />
          )}

          {/* Rear Aerodynamic Diffuser with Dual Twin Chrome Exhaust Tips */}
          <mesh position={[0, 0.22, -1.98]}>
            <boxGeometry args={[1.4, 0.14, 0.1]} />
            <meshStandardMaterial color="#0F172A" />
          </mesh>
          {/* Dual Chrome Exhaust Pipes */}
          <mesh position={[-0.45, 0.22, -2.04]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.045, 0.045, 0.12, 16]} />
            <meshStandardMaterial color="#E2E8F0" metalness={0.95} />
          </mesh>
          <mesh position={[0.45, 0.22, -2.04]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.045, 0.045, 0.12, 16]} />
            <meshStandardMaterial color="#E2E8F0" metalness={0.95} />
          </mesh>

          {/* Side Mirrors with Indicator Repeater Strip */}
          <mesh position={[-0.88, 0.78, 0.6]}>
            <boxGeometry args={[0.18, 0.1, 0.08]} />
            <meshStandardMaterial color="#0369A1" />
          </mesh>
          <mesh position={[0.88, 0.78, 0.6]}>
            <boxGeometry args={[0.18, 0.1, 0.08]} />
            <meshStandardMaterial color="#0369A1" />
          </mesh>

          {/* 4 ALLOY WHEELS WITH RED BRAKE CALIPERS */}
          {/* Front Left */}
          <group ref={frontLeftWheelRef} position={[-0.92, 0.32, 1.25]}>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.32, 0.32, 0.22, 24]} />
              <meshStandardMaterial color="#0F172A" roughness={0.9} />
            </mesh>
            <mesh position={[-0.12, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.16, 0.16, 0.02, 16]} />
              <meshStandardMaterial color="#E2E8F0" metalness={0.95} />
            </mesh>
            {/* Red Caliper */}
            <mesh position={[-0.08, 0.12, 0]}>
              <boxGeometry args={[0.04, 0.08, 0.08]} />
              <meshStandardMaterial color="#DC2626" />
            </mesh>
          </group>

          {/* Front Right */}
          <group ref={frontRightWheelRef} position={[0.92, 0.32, 1.25]}>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.32, 0.32, 0.22, 24]} />
              <meshStandardMaterial color="#0F172A" roughness={0.9} />
            </mesh>
            <mesh position={[0.12, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.16, 0.16, 0.02, 16]} />
              <meshStandardMaterial color="#E2E8F0" metalness={0.95} />
            </mesh>
            <mesh position={[0.08, 0.12, 0]}>
              <boxGeometry args={[0.04, 0.08, 0.08]} />
              <meshStandardMaterial color="#DC2626" />
            </mesh>
          </group>

          {/* Rear Wheels */}
          <mesh ref={rearLeftWheelRef} position={[-0.92, 0.32, -1.25]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.32, 0.32, 0.22, 24]} />
            <meshStandardMaterial color="#0F172A" roughness={0.9} />
          </mesh>
          <mesh ref={rearRightWheelRef} position={[0.92, 0.32, -1.25]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.32, 0.32, 0.22, 24]} />
            <meshStandardMaterial color="#0F172A" roughness={0.9} />
          </mesh>
        </group>
      )}

      {/* ============================================================== */}
      {/* VEHICLE 4: YAMAHA YZF-R15 V4 SUPERSPORT (MUCH MORE REAL)       */}
      {/* ============================================================== */}
      {vehicleType === 'r15_bike' && (
        <group>
          {/* Main Deltabox Aluminum Twin-Spar Frame */}
          <mesh position={[0, 0.58, 0]}>
            <boxGeometry args={[0.32, 0.45, 1.2]} />
            <meshStandardMaterial color="#94A3B8" metalness={0.9} roughness={0.2} />
          </mesh>

          {/* 155cc 4-Valve VVA Engine Block (Matte Black with Polished Fins) */}
          <mesh position={[0, 0.38, 0.1]}>
            <boxGeometry args={[0.28, 0.35, 0.55]} />
            <meshStandardMaterial color="#0F172A" metalness={0.8} roughness={0.3} />
          </mesh>
          {/* Engine Radiator behind Front Wheel */}
          <mesh position={[0, 0.48, 0.45]}>
            <boxGeometry args={[0.26, 0.25, 0.04]} />
            <meshStandardMaterial color="#334155" metalness={0.9} />
          </mesh>
          {/* Gold Drive Chain Accent */}
          <mesh position={[-0.14, 0.28, -0.3]}>
            <boxGeometry args={[0.02, 0.03, 0.55]} />
            <meshStandardMaterial color="#EAB308" metalness={0.95} />
          </mesh>

          {/* Yamaha Racing Blue Sculpted Muscular Fuel Tank */}
          <mesh position={[0, 0.88, 0.25]}>
            <boxGeometry args={[0.42, 0.32, 0.7]} />
            <meshStandardMaterial color="#002bb8" metalness={0.88} roughness={0.12} />
          </mesh>
          {/* Aircraft-Style Silver Fuel Filler Cap with Screws */}
          <mesh position={[0, 1.05, 0.32]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.055, 16]} />
            <meshStandardMaterial color="#E2E8F0" metalness={0.95} roughness={0.1} />
          </mesh>
          {/* Center Carbon Tank Pad Protector */}
          <mesh position={[0, 0.96, 0.1]}>
            <boxGeometry args={[0.08, 0.18, 0.3]} />
            <meshStandardMaterial color="#0F172A" roughness={0.9} />
          </mesh>
          {/* Matte Black Knee Tank Grips */}
          <mesh position={[-0.22, 0.85, 0.2]}>
            <boxGeometry args={[0.02, 0.2, 0.35]} />
            <meshStandardMaterial color="#020617" roughness={0.9} />
          </mesh>
          <mesh position={[0.22, 0.85, 0.2]}>
            <boxGeometry args={[0.02, 0.2, 0.35]} />
            <meshStandardMaterial color="#020617" roughness={0.9} />
          </mesh>
          {/* Silver Yamaha 3D Roundel Emblem Badge */}
          <mesh position={[-0.22, 0.95, 0.32]} rotation={[0, -Math.PI / 2, 0]}>
            <circleGeometry args={[0.04, 16]} />
            <meshStandardMaterial color="#E2E8F0" metalness={0.95} />
          </mesh>
          <mesh position={[0.22, 0.95, 0.32]} rotation={[0, Math.PI / 2, 0]}>
            <circleGeometry args={[0.04, 16]} />
            <meshStandardMaterial color="#E2E8F0" metalness={0.95} />
          </mesh>

          {/* Aggressive R15 V4 Aerodynamic Front Fairing with Side Vents */}
          <mesh position={[0, 0.95, 0.82]} rotation={[-0.35, 0, 0]}>
            <boxGeometry args={[0.48, 0.42, 0.55]} />
            <meshStandardMaterial color="#002bb8" metalness={0.88} roughness={0.12} />
          </mesh>
          {/* Central MotoGP M-Air Intake Scoop */}
          <mesh position={[0, 0.77, 1.05]}>
            <boxGeometry args={[0.16, 0.1, 0.06]} />
            <meshStandardMaterial color="#020617" />
          </mesh>
          {/* Aerodynamic Winglet Gills */}
          <mesh position={[-0.26, 0.82, 0.75]}>
            <boxGeometry args={[0.06, 0.12, 0.3]} />
            <meshStandardMaterial color="#0F172A" />
          </mesh>
          <mesh position={[0.26, 0.82, 0.75]}>
            <boxGeometry args={[0.06, 0.12, 0.3]} />
            <meshStandardMaterial color="#0F172A" />
          </mesh>

          {/* Aerodynamic Bubble Windscreen Visor */}
          <mesh position={[0, 1.15, 0.72]} rotation={[-0.55, 0, 0]}>
            <planeGeometry args={[0.34, 0.38]} />
            <meshStandardMaterial color="#0284C7" transparent opacity={0.65} roughness={0.05} />
          </mesh>

          {/* Dual Squinting LED DRL Eyes (Signature R-Series Face) */}
          <mesh position={[-0.14, 0.85, 1.05]}>
            <boxGeometry args={[0.1, 0.03, 0.04]} />
            <meshBasicMaterial color="#E0F2FE" />
          </mesh>
          <mesh position={[0.14, 0.85, 1.05]}>
            <boxGeometry args={[0.1, 0.03, 0.04]} />
            <meshBasicMaterial color="#E0F2FE" />
          </mesh>

          {/* Center Class-D Bi-Functional LED Projector Headlamp with Blue Halo */}
          <mesh position={[0, 0.75, 1.06]}>
            <circleGeometry args={[0.075, 20]} />
            <meshBasicMaterial color={headlightsOn ? '#FFFFFF' : '#94A3B8'} />
          </mesh>
          {/* Blue Halo Ring */}
          <mesh position={[0, 0.75, 1.058]}>
            <ringGeometry args={[0.076, 0.088, 20]} />
            <meshBasicMaterial color="#38BDF8" />
          </mesh>
          {headlightsOn && (
            <spotLight position={[0, 0.78, 1.15]} angle={0.38} intensity={6} distance={48} color="#F8FAFC" />
          )}

          {/* Front Amber Corner Blinkers */}
          <mesh position={[-0.28, 0.9, 0.75]}>
            <sphereGeometry args={[0.03, 12, 12]} />
            <meshBasicMaterial color={isBlinkingLeft ? '#F59E0B' : '#78350F'} />
          </mesh>
          <mesh position={[0.28, 0.9, 0.75]}>
            <sphereGeometry args={[0.03, 12, 12]} />
            <meshBasicMaterial color={isBlinkingRight ? '#F59E0B' : '#78350F'} />
          </mesh>

          {/* Dual Aerodynamic Fairing Wing Mirrors */}
          <mesh position={[-0.26, 1.12, 0.75]}>
            <boxGeometry args={[0.1, 0.05, 0.04]} />
            <meshStandardMaterial color="#0F172A" />
          </mesh>
          <mesh position={[0.26, 1.12, 0.75]}>
            <boxGeometry args={[0.1, 0.05, 0.04]} />
            <meshStandardMaterial color="#0F172A" />
          </mesh>

          {/* Low Clip-on Sport Handlebars & Bar-End Weights */}
          <mesh position={[0, 0.98, 0.55]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.018, 0.018, 0.58, 8]} />
            <meshStandardMaterial color="#0F172A" metalness={0.9} />
          </mesh>
          <mesh position={[-0.29, 0.98, 0.55]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.024, 0.024, 0.04, 8]} />
            <meshStandardMaterial color="#CBD5E1" metalness={0.95} />
          </mesh>
          <mesh position={[0.29, 0.98, 0.55]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.024, 0.024, 0.04, 8]} />
            <meshStandardMaterial color="#CBD5E1" metalness={0.95} />
          </mesh>
          {/* Front Brake Fluid Reservoir Cup on Right Handlebar */}
          <mesh position={[0.22, 1.04, 0.56]}>
            <cylinderGeometry args={[0.02, 0.02, 0.035, 12]} />
            <meshStandardMaterial color="#F1F5F9" transparent opacity={0.8} />
          </mesh>

          {/* Digital LCD Instrument Meter */}
          <mesh position={[0, 1.02, 0.6]} rotation={[-0.6, 0, 0]}>
            <boxGeometry args={[0.16, 0.08, 0.02]} />
            <meshStandardMaterial color="#0284C7" />
          </mesh>

          {/* REALISTIC RIDER SILHOUETTE (Rider in Racing Leathers & Helmet) */}
          {/* Rider Aerodynamic Helmet with Rear Teardrop Fin */}
          <mesh position={[0, 1.28, 0.05]}>
            <sphereGeometry args={[0.16, 16, 16]} />
            <meshStandardMaterial color="#002bb8" roughness={0.2} metalness={0.7} />
          </mesh>
          {/* Rear Helmet Aerodynamic Spoiler Fin */}
          <mesh position={[0, 1.28, -0.09]}>
            <boxGeometry args={[0.08, 0.05, 0.08]} />
            <meshStandardMaterial color="#0F172A" />
          </mesh>
          {/* Helmet Tinted Dark Smoke Visor */}
          <mesh position={[0, 1.28, 0.16]} rotation={[0.2, 0, 0]}>
            <boxGeometry args={[0.22, 0.1, 0.06]} />
            <meshStandardMaterial color="#020617" roughness={0.05} metalness={0.9} />
          </mesh>
          {/* Rider Torso in Black/Blue Racing Leathers with Shoulder Armor */}
          <mesh position={[0, 0.98, -0.05]} rotation={[-0.5, 0, 0]}>
            <boxGeometry args={[0.34, 0.42, 0.22]} />
            <meshStandardMaterial color="#0F172A" roughness={0.8} />
          </mesh>
          {/* Shoulder Armor Titanium Sliders */}
          <mesh position={[-0.18, 1.1, -0.02]}>
            <boxGeometry args={[0.06, 0.04, 0.08]} />
            <meshStandardMaterial color="#CBD5E1" metalness={0.95} />
          </mesh>
          <mesh position={[0.18, 1.1, -0.02]}>
            <boxGeometry args={[0.06, 0.04, 0.08]} />
            <meshStandardMaterial color="#CBD5E1" metalness={0.95} />
          </mesh>

          {/* Split Stepped Racing Seats */}
          {/* Rider Saddle */}
          <mesh position={[0, 0.78, -0.22]}>
            <boxGeometry args={[0.3, 0.08, 0.38]} />
            <meshStandardMaterial color="#18181B" roughness={0.9} />
          </mesh>
          {/* Elevated Pillion Seat & Aerodynamic Tail Cowl with Air Tunnels */}
          <mesh position={[0, 0.9, -0.6]}>
            <boxGeometry args={[0.22, 0.14, 0.45]} />
            <meshStandardMaterial color="#002bb8" metalness={0.85} roughness={0.15} />
          </mesh>
          <mesh position={[0, 0.95, -0.52]}>
            <boxGeometry args={[0.2, 0.05, 0.22]} />
            <meshStandardMaterial color="#18181B" roughness={0.9} />
          </mesh>

          {/* Visible Yellow Mono-Cross Rear Shock Spring */}
          <mesh position={[0, 0.48, -0.35]}>
            <cylinderGeometry args={[0.035, 0.035, 0.22, 12]} />
            <meshStandardMaterial color="#FACC15" roughness={0.3} />
          </mesh>

          {/* Slim Vertical LED Tail Lamp */}
          <mesh position={[0, 0.88, -0.84]} rotation={[0, Math.PI, 0]}>
            <boxGeometry args={[0.06, 0.14, 0.02]} />
            <meshBasicMaterial color={controls.backward || controls.handbrake ? '#FF0000' : '#881337'} />
          </mesh>

          {/* Upswept Sport Exhaust Canister */}
          <mesh position={[0.22, 0.36, -0.45]} rotation={[-0.3, 0, 0]}>
            <cylinderGeometry args={[0.065, 0.08, 0.65, 16]} />
            <meshStandardMaterial color="#334155" metalness={0.85} roughness={0.2} />
          </mesh>
          <mesh position={[0.22, 0.46, -0.75]} rotation={[-0.3, 0, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.08, 16]} />
            <meshStandardMaterial color="#0F172A" metalness={0.95} />
          </mesh>

          {/* TWO 17-INCH MOTORCYCLE WHEELS */}
          {/* Front Wheel on Gold Upside-Down (USD) Forks */}
          <group ref={frontBikeForkRef} position={[0, 0.3, 0.95]}>
            {/* Front 17" Wheel */}
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.3, 0.3, 0.11, 24]} />
              <meshStandardMaterial color="#0F172A" roughness={0.9} />
            </mesh>
            {/* Blue Rim Tape Accent */}
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.302, 0.302, 0.02, 24]} />
              <meshBasicMaterial color="#002bb8" />
            </mesh>
            {/* Front Drilled Disc Brake Rotor */}
            <mesh position={[-0.07, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.18, 0.18, 0.01, 16]} />
              <meshStandardMaterial color="#CBD5E1" metalness={0.95} />
            </mesh>
            {/* Gold Front Brake Caliper */}
            <mesh position={[-0.07, 0.1, 0]}>
              <boxGeometry args={[0.03, 0.06, 0.06]} />
              <meshStandardMaterial color="#EAB308" metalness={0.95} />
            </mesh>

            {/* GOLDEN UPSIDE-DOWN (USD) TELESCOPIC FORKS */}
            <mesh position={[-0.09, 0.35, 0]}>
              <cylinderGeometry args={[0.025, 0.025, 0.65, 12]} />
              <meshStandardMaterial color="#EAB308" metalness={0.95} roughness={0.1} />
            </mesh>
            <mesh position={[0.09, 0.35, 0]}>
              <cylinderGeometry args={[0.025, 0.025, 0.65, 12]} />
              <meshStandardMaterial color="#EAB308" metalness={0.95} roughness={0.1} />
            </mesh>
            {/* Black Triple Clamp */}
            <mesh position={[0, 0.66, 0]}>
              <boxGeometry args={[0.22, 0.04, 0.08]} />
              <meshStandardMaterial color="#0F172A" metalness={0.9} />
            </mesh>
          </group>

          {/* Rear Wheel on Aluminum Swingarm */}
          <mesh ref={rearBikeWheelRef} position={[0, 0.3, -0.75]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.3, 0.3, 0.16, 24]} />
            <meshStandardMaterial color="#0F172A" roughness={0.9} />
          </mesh>
          {/* Rear Petal Brake Disc */}
          <mesh position={[0.09, 0.3, -0.75]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.15, 0.15, 0.01, 16]} />
            <meshStandardMaterial color="#CBD5E1" metalness={0.95} />
          </mesh>
        </group>
      )}
    </group>
  );
};
