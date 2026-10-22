'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';

export interface FingerpostDestination {
  town: string;
  distanceKm: number;
  routeCode?: string;
  direction: 'left' | 'right' | 'straight';
  type?: 'highway' | 'service'; // green for highway, blue for service/hospital
}

interface HighwayFingerpost3DProps {
  position: [number, number, number];
  rotationY?: number;
  destinations: FingerpostDestination[];
}

const textureCache = new Map<string, THREE.CanvasTexture>();

function createFingerpostTexture(dest: FingerpostDestination): THREE.CanvasTexture {
  const key = `${dest.town}_${dest.distanceKm}_${dest.direction}_${dest.type || 'highway'}`;
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  const isService = dest.type === 'service';
  const bgColor = isService ? '#0369A1' : '#15803D'; // Blue or IRC Green

  // Clear canvas
  ctx.clearRect(0, 0, 1024, 256);

  // Draw chevron / fingerpost outline
  ctx.beginPath();
  const pad = 12;
  const w = 1024 - pad * 2;
  const h = 256 - pad * 2;
  const chevronDepth = 60;

  if (dest.direction === 'right') {
    ctx.moveTo(pad, pad);
    ctx.lineTo(pad + w - chevronDepth, pad);
    ctx.lineTo(pad + w, pad + h / 2);
    ctx.lineTo(pad + w - chevronDepth, pad + h);
    ctx.lineTo(pad, pad + h);
    ctx.closePath();
  } else if (dest.direction === 'left') {
    ctx.moveTo(pad + chevronDepth, pad);
    ctx.lineTo(pad + w, pad);
    ctx.lineTo(pad + w, pad + h);
    ctx.lineTo(pad + chevronDepth, pad + h);
    ctx.lineTo(pad, pad + h / 2);
    ctx.closePath();
  } else {
    // Rectangular for straight
    ctx.roundRect(pad, pad, w, h, 16);
  }

  // Fill board
  ctx.fillStyle = bgColor;
  ctx.fill();

  // White reflective border
  ctx.lineWidth = 10;
  ctx.strokeStyle = '#FFFFFF';
  ctx.stroke();

  // Text content
  ctx.fillStyle = '#FFFFFF';
  ctx.textBaseline = 'middle';

  // Route Code Pill if present
  let textStartX = pad + (dest.direction === 'left' ? chevronDepth + 30 : 40);
  if (dest.routeCode) {
    ctx.fillStyle = '#FEF08A'; // Yellow route badge
    ctx.font = '900 48px sans-serif';
    ctx.fillText(dest.routeCode, textStartX, 128);
    textStartX += ctx.measureText(dest.routeCode).width + 35;
  }

  // Town / Landmark Name
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 68px sans-serif';
  ctx.fillText(dest.town.toUpperCase(), textStartX, 128);

  // Distance in KM on the right
  const distText = `${dest.distanceKm} km`;
  ctx.font = '700 56px monospace';
  const distWidth = ctx.measureText(distText).width;
  const distStartX = 1024 - pad - (dest.direction === 'right' ? chevronDepth + 30 : 40) - distWidth;
  ctx.fillText(distText, distStartX, 128);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  textureCache.set(key, texture);
  return texture;
}

export const HighwayFingerpost3D: React.FC<HighwayFingerpost3DProps> = ({
  position,
  rotationY = 0,
  destinations,
}) => {
  const textures = useMemo(() => {
    return destinations.map((d) => createFingerpostTexture(d));
  }, [destinations]);

  const poleHeight = 1.4 + destinations.length * 0.55;

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Concrete Foundation Footing */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.25, 0.32, 0.3, 12]} />
        <meshStandardMaterial color="#64748B" roughness={0.9} />
      </mesh>

      {/* Galvanized Steel Roadside Post */}
      <mesh position={[0, poleHeight / 2, 0]}>
        <cylinderGeometry args={[0.06, 0.06, poleHeight, 16]} />
        <meshStandardMaterial color="#94A3B8" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Stack of Fingerpost Boards */}
      {destinations.map((dest, i) => {
        const boardY = poleHeight - 0.35 - i * 0.55;
        const texture = textures[i];

        return (
          <group key={`${dest.town}-${i}`} position={[0, boardY, 0]}>
            {/* Metal Backplate */}
            <mesh position={[0, 0, -0.015]}>
              <boxGeometry args={[1.9, 0.48, 0.02]} />
              <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.3} />
            </mesh>

            {/* Front Graphic Texture */}
            <mesh position={[0, 0, 0.005]}>
              <planeGeometry args={[1.88, 0.46]} />
              <meshBasicMaterial map={texture} transparent side={THREE.DoubleSide} />
            </mesh>

            {/* Dual Mounting Brackets */}
            <mesh position={[-0.4, 0, -0.03]}>
              <boxGeometry args={[0.08, 0.08, 0.04]} />
              <meshStandardMaterial color="#1E293B" />
            </mesh>
            <mesh position={[0.4, 0, -0.03]}>
              <boxGeometry args={[0.08, 0.08, 0.04]} />
              <meshStandardMaterial color="#1E293B" />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};
