'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';
import { getSignTexture } from '@/utils/signTextureGenerator';
import { RoadSign } from '@/types/sign';

interface RoadSign3DProps {
  sign: RoadSign;
  position: [number, number, number];
  rotationY?: number;
}

export const RoadSign3D: React.FC<RoadSign3DProps> = ({ sign, position, rotationY = 0 }) => {
  const texture = useMemo(() => {
    return getSignTexture(sign.id, sign.svgType, sign.svgParams);
  }, [sign.id, sign.svgType, sign.svgParams]);

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Concrete foundation base */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.2, 0.25, 0.2, 12]} />
        <meshStandardMaterial color="#64748B" roughness={0.9} />
      </mesh>

      {/* Galvanized Steel Pole */}
      <mesh position={[0, 1.4, 0]}>
        <cylinderGeometry args={[0.045, 0.045, 2.6, 16]} />
        <meshStandardMaterial color="#94A3B8" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Sign Backplate (galvanized sheet metal) */}
      <mesh
        position={[0, 2.3, -0.015]}
        rotation={sign.shape === 'circle' ? [Math.PI / 2, 0, 0] : [0, 0, 0]}
      >
        {sign.shape === 'circle' ? (
          <cylinderGeometry args={[0.42, 0.42, 0.02, 32]} />
        ) : sign.shape === 'triangle_up' || sign.shape === 'triangle_inverted' ? (
          <boxGeometry args={[0.85, 0.75, 0.02]} />
        ) : (
          <boxGeometry args={[0.85, 0.85, 0.02]} />
        )}
        <meshStandardMaterial color="#475569" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Sign Face Front Plane with Texture */}
      <mesh position={[0, 2.3, 0.005]}>
        <planeGeometry args={[0.8, 0.8]} />
        <meshBasicMaterial map={texture} transparent side={THREE.DoubleSide} />
      </mesh>

      {/* Two mounting brackets */}
      <mesh position={[0, 2.1, -0.03]}>
        <boxGeometry args={[0.1, 0.04, 0.04]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
      <mesh position={[0, 2.5, -0.03]}>
        <boxGeometry args={[0.1, 0.04, 0.04]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
    </group>
  );
};
