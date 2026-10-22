'use client';

import React, { useEffect, useState } from 'react';

interface TrafficSignal3DProps {
  position: [number, number, number];
  rotationY?: number;
  initialState?: 'red' | 'amber' | 'green';
  cycle?: boolean;
}

export const TrafficSignal3D: React.FC<TrafficSignal3DProps> = ({
  position,
  rotationY = 0,
  initialState = 'red',
  cycle = true,
}) => {
  const [lightState, setLightState] = useState<'red' | 'amber' | 'green'>(initialState);

  useEffect(() => {
    if (!cycle) return;
    const interval = setInterval(() => {
      setLightState((curr) => {
        if (curr === 'red') return 'green';
        if (curr === 'green') return 'amber';
        return 'red';
      });
    }, 7000); // 7-second phase

    return () => clearInterval(interval);
  }, [cycle]);

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Heavy Steel Mast Pole */}
      <mesh position={[0, 2, 0]}>
        <cylinderGeometry args={[0.07, 0.08, 4, 16]} />
        <meshStandardMaterial color="#1E293B" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Overhanging arm or side bracket */}
      <mesh position={[0.4, 3.4, 0]}>
        <boxGeometry args={[0.8, 0.06, 0.06]} />
        <meshStandardMaterial color="#1E293B" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Signal Head Housing */}
      <mesh position={[0.8, 3.4, 0]}>
        <boxGeometry args={[0.3, 0.9, 0.25]} />
        <meshStandardMaterial color="#0F172A" roughness={0.8} />
      </mesh>

      {/* Visor caps & Lenses */}
      {/* RED LENS */}
      <mesh position={[0.8, 3.68, 0.13]}>
        <circleGeometry args={[0.1, 24]} />
        <meshBasicMaterial color={lightState === 'red' ? '#FF2222' : '#450A0A'} />
      </mesh>
      {lightState === 'red' && (
        <pointLight position={[0.8, 3.68, 0.3]} color="#FF2222" intensity={2} distance={8} />
      )}

      {/* AMBER LENS */}
      <mesh position={[0.8, 3.4, 0.13]}>
        <circleGeometry args={[0.1, 24]} />
        <meshBasicMaterial color={lightState === 'amber' ? '#FBBF24' : '#451A03'} />
      </mesh>
      {lightState === 'amber' && (
        <pointLight position={[0.8, 3.4, 0.3]} color="#FBBF24" intensity={2} distance={8} />
      )}

      {/* GREEN LENS */}
      <mesh position={[0.8, 3.12, 0.13]}>
        <circleGeometry args={[0.1, 24]} />
        <meshBasicMaterial color={lightState === 'green' ? '#10B981' : '#022C22'} />
      </mesh>
      {lightState === 'green' && (
        <pointLight position={[0.8, 3.12, 0.3]} color="#10B981" intensity={2} distance={8} />
      )}
    </group>
  );
};
