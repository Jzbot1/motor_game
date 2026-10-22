'use client';

import React, { useMemo } from 'react';
import { RoadSign3D } from './RoadSign3D';
import { TrafficSignal3D } from './TrafficSignal3D';
import { HighwayFingerpost3D } from './HighwayFingerpost3D';
import { INDIAN_ROAD_SIGNS } from '@/data/signs';
import { RoadSign } from '@/types/sign';

interface PlacedSign {
  sign: RoadSign;
  position: [number, number, number];
  rotationY: number;
  triggerZ: number;
  triggerDistance: number;
}

interface IndianRoadSceneProps {
  lightingMode?: 'day' | 'dusk' | 'night';
  onSignsLoaded?: (signs: PlacedSign[]) => void;
}

export const IndianRoadScene: React.FC<IndianRoadSceneProps> = ({
  lightingMode = 'day',
  onSignsLoaded,
}) => {
  // Map signs by ID for fast lookup
  const signMap = useMemo(() => {
    const map = new Map<string, RoadSign>();
    INDIAN_ROAD_SIGNS.forEach((s) => map.set(s.id, s));
    return map;
  }, []);

  // Defined layout of road signposts along the course
  const placedSigns: PlacedSign[] = useMemo(() => {
    const getSign = (id: string) => signMap.get(id) || INDIAN_ROAD_SIGNS[0];

    return [
      {
        sign: getSign('m-compulsory-keep-left'),
        position: [-0.0, 0, 15],
        rotationY: Math.PI,
        triggerZ: 15,
        triggerDistance: 14,
      },
      {
        sign: getSign('m-speed-limit-40'),
        position: [-5.0, 0, 30],
        rotationY: Math.PI,
        triggerZ: 30,
        triggerDistance: 16,
      },
      {
        sign: getSign('c-speed-breaker'),
        position: [-5.0, 0, 40],
        rotationY: Math.PI,
        triggerZ: 40,
        triggerDistance: 16,
      },
      {
        sign: getSign('c-school-ahead'),
        position: [-5.0, 0, 70],
        rotationY: Math.PI,
        triggerZ: 70,
        triggerDistance: 16,
      },
      {
        sign: getSign('m-speed-limit-30'),
        position: [-5.0, 0, 80],
        rotationY: Math.PI,
        triggerZ: 80,
        triggerDistance: 16,
      },
      {
        sign: getSign('c-pedestrian-crossing'),
        position: [-5.0, 0, 110],
        rotationY: Math.PI,
        triggerZ: 110,
        triggerDistance: 16,
      },
      {
        sign: getSign('m-horn-prohibited'),
        position: [-5.0, 0, 140],
        rotationY: Math.PI,
        triggerZ: 140,
        triggerDistance: 16,
      },
      {
        sign: getSign('c-traffic-signals'),
        position: [-5.0, 0, 165],
        rotationY: Math.PI,
        triggerZ: 165,
        triggerDistance: 16,
      },
      {
        sign: getSign('m-stop'),
        position: [-5.0, 0, 188],
        rotationY: Math.PI,
        triggerZ: 188,
        triggerDistance: 16,
      },
      {
        sign: getSign('i-nh-44-marker'),
        position: [-5.0, 0, 215],
        rotationY: Math.PI,
        triggerZ: 215,
        triggerDistance: 16,
      },
      {
        sign: getSign('i-advance-direction'),
        position: [-5.2, 0, 235],
        rotationY: Math.PI,
        triggerZ: 235,
        triggerDistance: 18,
      },
      {
        sign: getSign('i-ev-charging'),
        position: [-5.0, 0, 260],
        rotationY: Math.PI,
        triggerZ: 260,
        triggerDistance: 16,
      },
      {
        sign: getSign('i-petrol-pump'),
        position: [-5.0, 0, 275],
        rotationY: Math.PI,
        triggerZ: 275,
        triggerDistance: 16,
      },
    ];
  }, [signMap]);

  React.useEffect(() => {
    if (onSignsLoaded) {
      onSignsLoaded(placedSigns);
    }
  }, [placedSigns, onSignsLoaded]);

  // Road geometry parameters
  const roadLength = 320;
  const roadWidth = 9.5;

  // Environment Lighting Config based on lightingMode
  const isNight = lightingMode === 'night';
  const isDusk = lightingMode === 'dusk';

  const ambientIntensity = isNight ? 0.12 : isDusk ? 0.38 : 0.75;
  const sunIntensity = isNight ? 0.08 : isDusk ? 0.7 : 1.25;
  const sunColor = isNight ? '#38BDF8' : isDusk ? '#F97316' : '#FFFFFF';
  const sunPosition: [number, number, number] = isDusk ? [20, 25, -20] : [40, 60, 40];
  const skyColor = isNight ? '#0F172A' : isDusk ? '#FB923C' : '#38BDF8';
  const groundColor = isNight ? '#020617' : isDusk ? '#7C2D12' : '#166534';

  return (
    <group>
      {/* ================= LIGHTING ================= */}
      <ambientLight intensity={ambientIntensity} />
      <directionalLight
        position={sunPosition}
        intensity={sunIntensity}
        color={sunColor}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <hemisphereLight args={[skyColor, groundColor, 0.4]} />

      {/* ================= TERRAIN & ENVIRONMENT ================= */}
      {/* Vast landscape ground plane */}
      <mesh position={[0, -0.05, roadLength / 2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[300, roadLength + 80]} />
        <meshStandardMaterial
          color={isNight ? '#0B0F19' : isDusk ? '#1E1B18' : '#1E293B'}
          roughness={0.9}
        />
      </mesh>

      {/* Roadside Green Verge / Indian Grassland */}
      <mesh position={[-16, -0.04, roadLength / 2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, roadLength + 80]} />
        <meshStandardMaterial
          color={isNight ? '#062817' : isDusk ? '#144626' : '#166534'}
          roughness={0.8}
        />
      </mesh>
      <mesh position={[16, -0.04, roadLength / 2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, roadLength + 80]} />
        <meshStandardMaterial
          color={isNight ? '#062817' : isDusk ? '#144626' : '#166534'}
          roughness={0.8}
        />
      </mesh>

      {/* ================= ASPHALT ROADWAY ================= */}
      <mesh position={[0, 0.01, roadLength / 2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[roadWidth, roadLength]} />
        <meshStandardMaterial color={isNight ? '#11141C' : '#1F2430'} roughness={0.85} />
      </mesh>

      {/* Left Shoulder Strip */}
      <mesh position={[-roadWidth / 2 - 0.4, 0.015, roadLength / 2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.8, roadLength]} />
        <meshStandardMaterial color="#334155" roughness={0.9} />
      </mesh>
      {/* Right Shoulder Strip */}
      <mesh position={[roadWidth / 2 + 0.4, 0.015, roadLength / 2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.8, roadLength]} />
        <meshStandardMaterial color="#334155" roughness={0.9} />
      </mesh>

      {/* ================= ROAD KERBS (INDIAN YELLOW & BLACK) ================= */}
      {Array.from({ length: Math.floor(roadLength / 2) }).map((_, i) => {
        const isYellow = i % 2 === 0;
        const color = isYellow ? '#FBBF24' : '#111827';
        const z = i * 2 + 1;
        return (
          <React.Fragment key={`kerb-${i}`}>
            <mesh position={[-roadWidth / 2 - 0.08, 0.06, z]}>
              <boxGeometry args={[0.16, 0.12, 1.95]} />
              <meshStandardMaterial color={color} roughness={0.7} />
            </mesh>
            <mesh position={[roadWidth / 2 + 0.08, 0.06, z]}>
              <boxGeometry args={[0.16, 0.12, 1.95]} />
              <meshStandardMaterial color={color} roughness={0.7} />
            </mesh>
          </React.Fragment>
        );
      })}

      {/* ================= ROAD MARKINGS (IRC:35-2015) ================= */}
      {/* Left White Edge Line */}
      <mesh position={[-roadWidth / 2 + 0.2, 0.02, roadLength / 2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.15, roadLength]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>
      {/* Right Yellow Median Edge Line */}
      <mesh position={[roadWidth / 2 - 0.2, 0.02, roadLength / 2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.15, roadLength]} />
        <meshBasicMaterial color="#FBBF24" />
      </mesh>

      {/* Center Line Broken Dashes */}
      {Array.from({ length: Math.floor(roadLength / 8) }).map((_, idx) => {
        const z = idx * 8 + 4;
        return (
          <mesh key={`dash-${idx}`} position={[0, 0.022, z]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.15, 4.5]} />
            <meshBasicMaterial color="#FFFFFF" />
          </mesh>
        );
      })}

      {/* ================= SPEED BREAKERS (IRC:99 RAISED HUMPS) ================= */}
      {/* Speed Breaker 1 at z=45 */}
      <group position={[0, 0.04, 45]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.1, 0.1, roadWidth - 0.5, 16]} />
          <meshStandardMaterial color="#1F2937" roughness={0.8} />
        </mesh>
        {[-3, -1.5, 0, 1.5, 3].map((x, i) => (
          <mesh key={`hump1-${i}`} position={[x, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.6, 0.8]} />
            <meshBasicMaterial color="#F59E0B" />
          </mesh>
        ))}
      </group>

      {/* Speed Breaker 2 at z=125 */}
      <group position={[0, 0.04, 125]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.1, 0.1, roadWidth - 0.5, 16]} />
          <meshStandardMaterial color="#1F2937" roughness={0.8} />
        </mesh>
        {[-3, -1.5, 0, 1.5, 3].map((x, i) => (
          <mesh key={`hump2-${i}`} position={[x, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.6, 0.8]} />
            <meshBasicMaterial color="#F59E0B" />
          </mesh>
        ))}
      </group>

      {/* ================= INTERSECTION & ZEBRA CROSSING (z=190) ================= */}
      {/* Solid Stop Line before zebra */}
      <mesh position={[-2.4, 0.025, 189]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4.2, 0.45]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>

      {/* Zebra Stripes */}
      {[-4, -3.2, -2.4, -1.6, -0.8, 0, 0.8, 1.6, 2.4, 3.2, 4].map((x, idx) => (
        <mesh key={`zebra-${idx}`} position={[x, 0.025, 193]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.5, 3.5]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
      ))}

      {/* 3D Indian Traffic Signal Post at Intersection */}
      <TrafficSignal3D position={[-5.0, 0, 195]} rotationY={Math.PI} cycle={true} />

      {/* ================= 3D IRC:67 HIGHWAY FINGERPOST BOARDS ================= */}
      {/* Fingerpost 1 at z=58 (Before School Zone Junction) */}
      <HighwayFingerpost3D
        position={[-5.4, 0, 58]}
        rotationY={Math.PI}
        destinations={[
          { town: 'Aizawl', distanceKm: 15, routeCode: 'SH-6', direction: 'left', type: 'highway' },
          { town: 'Hospital', distanceKm: 2, direction: 'right', type: 'service' },
        ]}
      />

      {/* Fingerpost 2 at z=155 (Before Traffic Signals) */}
      <HighwayFingerpost3D
        position={[-5.4, 0, 155]}
        rotationY={Math.PI}
        destinations={[
          { town: 'Delhi', distanceKm: 45, routeCode: 'NH-44', direction: 'left', type: 'highway' },
          { town: 'Fuel / EV', distanceKm: 1, direction: 'right', type: 'service' },
        ]}
      />

      {/* Fingerpost 3 at z=245 (Expressway Junction) */}
      <HighwayFingerpost3D
        position={[-5.4, 0, 245]}
        rotationY={Math.PI}
        destinations={[
          { town: 'Mumbai', distanceKm: 120, routeCode: 'NH-48', direction: 'straight', type: 'highway' },
          { town: 'Silchar', distanceKm: 140, routeCode: 'SH-6', direction: 'left', type: 'highway' },
        ]}
      />

      {/* ================= INDIAN HIGHWAY MILESTONES (IRC:26) ================= */}
      {/* Milestone 1: National Highway Yellow Top at z=22 */}
      <group position={[-5.3, 0, 22]}>
        {/* White Base Cylinder */}
        <mesh position={[0, 0.35, 0]}>
          <cylinderGeometry args={[0.18, 0.18, 0.7, 16]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.8} />
        </mesh>
        {/* Yellow Dome Top (National Highway NH-44) */}
        <mesh position={[0, 0.7, 0]}>
          <sphereGeometry args={[0.18, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#EAB308" roughness={0.6} />
        </mesh>
      </group>

      {/* Milestone 2: State Highway Green Top at z=100 */}
      <group position={[-5.3, 0, 100]}>
        <mesh position={[0, 0.35, 0]}>
          <cylinderGeometry args={[0.18, 0.18, 0.7, 16]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.8} />
        </mesh>
        {/* Green Dome Top (State Highway SH-6) */}
        <mesh position={[0, 0.7, 0]}>
          <sphereGeometry args={[0.18, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#15803D" roughness={0.6} />
        </mesh>
      </group>

      {/* ================= ROADSIDE STREETLIGHTS (LUMINA LAPS) ================= */}
      {Array.from({ length: 8 }).map((_, i) => {
        const z = i * 40 + 12;
        return (
          <group key={`streetlight-${i}`} position={[-5.6, 0, z]}>
            {/* Pole Base */}
            <mesh position={[0, 0.25, 0]}>
              <cylinderGeometry args={[0.14, 0.18, 0.5, 12]} />
              <meshStandardMaterial color="#475569" metalness={0.8} />
            </mesh>
            {/* Main Tall Pole */}
            <mesh position={[0, 3.2, 0]}>
              <cylinderGeometry args={[0.07, 0.09, 6.0, 16]} />
              <meshStandardMaterial color="#64748B" metalness={0.7} />
            </mesh>
            {/* Curved Arm Overhanging Road */}
            <mesh position={[0.7, 6.1, 0]} rotation={[0, 0, -0.3]}>
              <cylinderGeometry args={[0.05, 0.05, 1.8, 12]} />
              <meshStandardMaterial color="#64748B" metalness={0.7} />
            </mesh>
            {/* Luminaire Head */}
            <mesh position={[1.4, 6.3, 0]}>
              <boxGeometry args={[0.5, 0.15, 0.25]} />
              <meshStandardMaterial color="#1E293B" metalness={0.9} />
            </mesh>
            {/* Glowing Lamp Bulb */}
            <mesh position={[1.4, 6.22, 0]}>
              <planeGeometry args={[0.4, 0.2]} />
              <meshBasicMaterial color={isNight || isDusk ? '#FEF08A' : '#94A3B8'} />
            </mesh>
            {/* PointLight when Dusk or Night */}
            {(isNight || isDusk) && (
              <pointLight
                position={[1.4, 5.8, 0]}
                intensity={isNight ? 2.5 : 1.2}
                distance={18}
                color="#FEF08A"
              />
            )}
          </group>
        );
      })}

      {/* ================= PLACED ROAD SIGNS ================= */}
      {placedSigns.map((item, idx) => (
        <RoadSign3D
          key={`sign-${idx}`}
          sign={item.sign}
          position={item.position}
          rotationY={item.rotationY}
        />
      ))}

      {/* ================= ROADSIDE TREES & GREENERY ================= */}
      {Array.from({ length: 18 }).map((_, i) => {
        const z = i * 18 + 8;
        const leftSide = i % 2 === 0;
        const x = leftSide ? -8.5 - (i % 3) * 1.5 : 8.5 + (i % 3) * 1.5;
        return (
          <group key={`tree-${i}`} position={[x, 0, z]}>
            {/* Trunk */}
            <mesh position={[0, 1.5, 0]}>
              <cylinderGeometry args={[0.2, 0.35, 3, 10]} />
              <meshStandardMaterial color="#5C3A21" roughness={0.9} />
            </mesh>
            {/* Foliage */}
            <mesh position={[0, 3.8, 0]}>
              <dodecahedronGeometry args={[1.8, 1]} />
              <meshStandardMaterial
                color={i % 3 === 0 ? '#15803D' : i % 3 === 1 ? '#166534' : '#14532D'}
                roughness={0.8}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};
