'use client';

import React from 'react';

interface SignSvgProps {
  svgType: string;
  className?: string;
  width?: number | string;
  height?: number | string;
  params?: Record<string, string | number>;
}

export const SignSvg: React.FC<SignSvgProps> = ({
  svgType,
  className = 'w-full h-full drop-shadow-md',
  width = '100%',
  height = '100%',
  params = {},
}) => {
  const renderContent = () => {
    switch (svgType) {
      // ---------------- MANDATORY / REGULATORY SIGNS ----------------
      case 'stop':
        return (
          <svg viewBox="0 0 100 100" width={width} height={height} className={className}>
            {/* Red Octagon */}
            <polygon points="30,5 70,5 95,30 95,70 70,95 30,95 5,70 5,30" fill="#DC2626" stroke="#FFFFFF" strokeWidth="3" />
            <polygon points="31,8 69,8 92,31 92,69 69,92 31,92 8,69 8,31" fill="#DC2626" />
            <text x="50" y="60" textAnchor="middle" fill="#FFFFFF" fontSize="22" fontWeight="900" fontFamily="sans-serif" letterSpacing="1">
              STOP
            </text>
          </svg>
        );

      case 'give_way':
        return (
          <svg viewBox="0 0 100 100" width={width} height={height} className={className}>
            {/* Inverted Triangle */}
            <polygon points="50,92 8,18 92,18" fill="#DC2626" />
            <polygon points="50,78 18,24 82,24" fill="#FFFFFF" />
          </svg>
        );

      case 'no_entry':
        return (
          <svg viewBox="0 0 100 100" width={width} height={height} className={className}>
            {/* Red Circle with White Horizontal Bar */}
            <circle cx="50" cy="50" r="45" fill="#DC2626" stroke="#FFFFFF" strokeWidth="2" />
            <rect x="18" y="42" width="64" height="16" rx="3" fill="#FFFFFF" />
          </svg>
        );

      case 'one_way_straight':
        return (
          <svg viewBox="0 0 100 100" width={width} height={height} className={className}>
            <circle cx="50" cy="50" r="45" fill="#1D4ED8" stroke="#FFFFFF" strokeWidth="2" />
            <path d="M50 20 L65 42 H56 V78 H44 V42 H35 Z" fill="#FFFFFF" />
          </svg>
        );

      case 'one_way_right':
        return (
          <svg viewBox="0 0 100 100" width={width} height={height} className={className}>
            <circle cx="50" cy="50" r="45" fill="#1D4ED8" stroke="#FFFFFF" strokeWidth="2" />
            <path d="M80 50 L58 35 V44 H22 V56 H58 V65 Z" fill="#FFFFFF" />
          </svg>
        );

      case 'prohibited_both_directions':
        return (
          <svg viewBox="0 0 100 100" width={width} height={height} className={className}>
            <circle cx="50" cy="50" r="45" fill="#FFFFFF" stroke="#DC2626" strokeWidth="10" />
          </svg>
        );

      case 'right_turn_prohibited':
        return (
          <svg viewBox="0 0 100 100" width={width} height={height} className={className}>
            <circle cx="50" cy="50" r="45" fill="#FFFFFF" stroke="#DC2626" strokeWidth="9" />
            <path d="M35 72 V50 A 15 15 0 0 1 50 35 H65" fill="none" stroke="#1F2937" strokeWidth="7" strokeLinecap="round" />
            <polygon points="63,27 75,35 63,43" fill="#1F2937" />
            <line x1="20" y1="20" x2="80" y2="80" stroke="#DC2626" strokeWidth="8" strokeLinecap="round" />
          </svg>
        );

      case 'left_turn_prohibited':
        return (
          <svg viewBox="0 0 100 100" width={width} height={height} className={className}>
            <circle cx="50" cy="50" r="45" fill="#FFFFFF" stroke="#DC2626" strokeWidth="9" />
            <path d="M65 72 V50 A 15 15 0 0 0 50 35 H35" fill="none" stroke="#1F2937" strokeWidth="7" strokeLinecap="round" />
            <polygon points="37,27 25,35 37,43" fill="#1F2937" />
            <line x1="20" y1="20" x2="80" y2="80" stroke="#DC2626" strokeWidth="8" strokeLinecap="round" />
          </svg>
        );

      case 'u_turn_prohibited':
        return (
          <svg viewBox="0 0 100 100" width={width} height={height} className={className}>
            <circle cx="50" cy="50" r="45" fill="#FFFFFF" stroke="#DC2626" strokeWidth="9" />
            <path d="M62 70 V46 C62 30, 38 30, 38 46 V58" fill="none" stroke="#1F2937" strokeWidth="7" strokeLinecap="round" />
            <polygon points="30,56 38,68 46,56" fill="#1F2937" />
            <line x1="20" y1="20" x2="80" y2="80" stroke="#DC2626" strokeWidth="8" strokeLinecap="round" />
          </svg>
        );

      case 'overtaking_prohibited':
        return (
          <svg viewBox="0 0 100 100" width={width} height={height} className={className}>
            <circle cx="50" cy="50" r="45" fill="#FFFFFF" stroke="#DC2626" strokeWidth="9" />
            {/* Right car (black) */}
            <rect x="52" y="38" width="18" height="28" rx="4" fill="#1F2937" />
            <circle cx="55" cy="42" r="2" fill="#E5E7EB" />
            <circle cx="67" cy="42" r="2" fill="#E5E7EB" />
            {/* Left car (red - overtaking) */}
            <rect x="28" y="34" width="18" height="28" rx="4" fill="#DC2626" />
            <circle cx="31" cy="38" r="2" fill="#FFFFFF" />
            <circle cx="43" cy="38" r="2" fill="#FFFFFF" />
            <line x1="20" y1="20" x2="80" y2="80" stroke="#DC2626" strokeWidth="8" strokeLinecap="round" />
          </svg>
        );

      case 'horn_prohibited':
        return (
          <svg viewBox="0 0 100 100" width={width} height={height} className={className}>
            <circle cx="50" cy="50" r="45" fill="#FFFFFF" stroke="#DC2626" strokeWidth="9" />
            {/* Horn symbol */}
            <path d="M30 45 L42 45 L58 34 V66 L42 55 L30 55 Z" fill="#1F2937" />
            <ellipse cx="65" cy="50" rx="3" ry="14" fill="#1F2937" />
            <path d="M26 47 H30 V53 H26 Z" fill="#1F2937" />
            <line x1="20" y1="20" x2="80" y2="80" stroke="#DC2626" strokeWidth="8" strokeLinecap="round" />
          </svg>
        );

      case 'no_parking':
        return (
          <svg viewBox="0 0 100 100" width={width} height={height} className={className}>
            <circle cx="50" cy="50" r="45" fill="#1E40AF" stroke="#DC2626" strokeWidth="9" />
            <text x="50" y="65" textAnchor="middle" fill="#FFFFFF" fontSize="46" fontWeight="900" fontFamily="sans-serif">
              P
            </text>
            <line x1="20" y1="20" x2="80" y2="80" stroke="#DC2626" strokeWidth="8" strokeLinecap="round" />
          </svg>
        );

      case 'no_stopping':
        return (
          <svg viewBox="0 0 100 100" width={width} height={height} className={className}>
            <circle cx="50" cy="50" r="45" fill="#1E40AF" stroke="#DC2626" strokeWidth="9" />
            <line x1="20" y1="20" x2="80" y2="80" stroke="#DC2626" strokeWidth="9" strokeLinecap="round" />
            <line x1="80" y1="20" x2="20" y2="80" stroke="#DC2626" strokeWidth="9" strokeLinecap="round" />
          </svg>
        );

      case 'speed_limit': {
        const speed = params.speed || 50;
        return (
          <svg viewBox="0 0 100 100" width={width} height={height} className={className}>
            <circle cx="50" cy="50" r="45" fill="#FFFFFF" stroke="#DC2626" strokeWidth="9" />
            <text x="50" y="64" textAnchor="middle" fill="#111827" fontSize="42" fontWeight="900" fontFamily="sans-serif">
              {speed}
            </text>
          </svg>
        );
      }

      case 'height_limit': {
        const h = params.value || '3.5m';
        return (
          <svg viewBox="0 0 100 100" width={width} height={height} className={className}>
            <circle cx="50" cy="50" r="45" fill="#FFFFFF" stroke="#DC2626" strokeWidth="9" />
            <polygon points="50,22 42,32 58,32" fill="#111827" />
            <polygon points="50,78 42,68 58,68" fill="#111827" />
            <text x="50" y="58" textAnchor="middle" fill="#111827" fontSize="24" fontWeight="900" fontFamily="sans-serif">
              {h}
            </text>
          </svg>
        );
      }

      case 'width_limit': {
        const w = params.value || '2m';
        return (
          <svg viewBox="0 0 100 100" width={width} height={height} className={className}>
            <circle cx="50" cy="50" r="45" fill="#FFFFFF" stroke="#DC2626" strokeWidth="9" />
            <polygon points="22,50 32,42 32,58" fill="#111827" />
            <polygon points="78,50 68,42 68,58" fill="#111827" />
            <text x="50" y="58" textAnchor="middle" fill="#111827" fontSize="24" fontWeight="900" fontFamily="sans-serif">
              {w}
            </text>
          </svg>
        );
      }

      case 'load_limit': {
        const load = params.value || '5T';
        return (
          <svg viewBox="0 0 100 100" width={width} height={height} className={className}>
            <circle cx="50" cy="50" r="45" fill="#FFFFFF" stroke="#DC2626" strokeWidth="9" />
            <text x="50" y="60" textAnchor="middle" fill="#111827" fontSize="32" fontWeight="900" fontFamily="sans-serif">
              {load}
            </text>
          </svg>
        );
      }

      case 'compulsory_turn_left':
        return (
          <svg viewBox="0 0 100 100" width={width} height={height} className={className}>
            <circle cx="50" cy="50" r="45" fill="#1D4ED8" stroke="#FFFFFF" strokeWidth="2" />
            <path d="M62 70 V48 A 12 12 0 0 0 50 36 H34" fill="none" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" />
            <polygon points="36,26 22,36 36,46" fill="#FFFFFF" />
          </svg>
        );

      case 'compulsory_turn_right':
        return (
          <svg viewBox="0 0 100 100" width={width} height={height} className={className}>
            <circle cx="50" cy="50" r="45" fill="#1D4ED8" stroke="#FFFFFF" strokeWidth="2" />
            <path d="M38 70 V48 A 12 12 0 0 1 50 36 H66" fill="none" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" />
            <polygon points="64,26 78,36 64,46" fill="#FFFFFF" />
          </svg>
        );

      case 'compulsory_ahead_only':
        return (
          <svg viewBox="0 0 100 100" width={width} height={height} className={className}>
            <circle cx="50" cy="50" r="45" fill="#1D4ED8" stroke="#FFFFFF" strokeWidth="2" />
            <path d="M50 20 L66 40 H56 V78 H44 V40 H34 Z" fill="#FFFFFF" />
          </svg>
        );

      case 'compulsory_ahead_or_right':
        return (
          <svg viewBox="0 0 100 100" width={width} height={height} className={className}>
            <circle cx="50" cy="50" r="45" fill="#1D4ED8" stroke="#FFFFFF" strokeWidth="2" />
            {/* Straight Arrow */}
            <path d="M46 72 V38 H38 L50 22 L62 38 H54 V72 Z" fill="#FFFFFF" />
            {/* Right Branch */}
            <path d="M50 56 Q66 56 68 46" fill="none" stroke="#FFFFFF" strokeWidth="6" />
            <polygon points="64,38 78,44 70,54" fill="#FFFFFF" />
          </svg>
        );

      case 'compulsory_keep_left':
        return (
          <svg viewBox="0 0 100 100" width={width} height={height} className={className}>
            <circle cx="50" cy="50" r="45" fill="#1D4ED8" stroke="#FFFFFF" strokeWidth="2" />
            <g transform="rotate(-45 50 50)">
              <path d="M50 22 L64 42 H55 V76 H45 V42 H36 Z" fill="#FFFFFF" />
            </g>
          </svg>
        );

      case 'compulsory_sound_horn':
        return (
          <svg viewBox="0 0 100 100" width={width} height={height} className={className}>
            <circle cx="50" cy="50" r="45" fill="#1D4ED8" stroke="#FFFFFF" strokeWidth="2" />
            <path d="M30 44 L44 44 L60 32 V68 L44 56 L30 56 Z" fill="#FFFFFF" />
            <ellipse cx="68" cy="50" rx="3" ry="16" fill="#FFFFFF" />
            <path d="M74 40 A 14 14 0 0 1 74 60" fill="none" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
            <path d="M80 34 A 22 22 0 0 1 80 66" fill="none" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
          </svg>
        );

      case 'restriction_ends':
        return (
          <svg viewBox="0 0 100 100" width={width} height={height} className={className}>
            <circle cx="50" cy="50" r="45" fill="#FFFFFF" stroke="#9CA3AF" strokeWidth="3" />
            <line x1="28" y1="78" x2="72" y2="22" stroke="#1F2937" strokeWidth="4" />
            <line x1="33" y1="80" x2="77" y2="24" stroke="#1F2937" strokeWidth="4" />
            <line x1="23" y1="76" x2="67" y2="20" stroke="#1F2937" strokeWidth="4" />
          </svg>
        );

      // ---------------- CAUTIONARY / WARNING SIGNS (Triangles) ----------------
      case 'right_hand_curve':
        return (
          <svg viewBox="0 0 100 100" width={width} height={height} className={className}>
            <polygon points="50,8 94,88 6,88" fill="#FFFFFF" stroke="#DC2626" strokeWidth="10" strokeLinejoin="round" />
            <path d="M38 72 V54 A 16 16 0 0 1 54 38 H64" fill="none" stroke="#111827" strokeWidth="7" strokeLinecap="round" />
            <polygon points="62,30 76,38 62,46" fill="#111827" />
          </svg>
        );

      case 'left_hand_curve':
        return (
          <svg viewBox="0 0 100 100" width={width} height={height} className={className}>
            <polygon points="50,8 94,88 6,88" fill="#FFFFFF" stroke="#DC2626" strokeWidth="10" strokeLinejoin="round" />
            <path d="M62 72 V54 A 16 16 0 0 0 46 38 H36" fill="none" stroke="#111827" strokeWidth="7" strokeLinecap="round" />
            <polygon points="38,30 24,38 38,46" fill="#111827" />
          </svg>
        );

      case 'right_hairpin_bend':
        return (
          <svg viewBox="0 0 100 100" width={width} height={height} className={className}>
            <polygon points="50,8 94,88 6,88" fill="#FFFFFF" stroke="#DC2626" strokeWidth="10" strokeLinejoin="round" />
            <path d="M40 76 V44 C40 32, 60 32, 60 44 V68" fill="none" stroke="#111827" strokeWidth="7" strokeLinecap="round" />
            <polygon points="52,66 60,78 68,66" fill="#111827" />
          </svg>
        );

      case 'left_hairpin_bend':
        return (
          <svg viewBox="0 0 100 100" width={width} height={height} className={className}>
            <polygon points="50,8 94,88 6,88" fill="#FFFFFF" stroke="#DC2626" strokeWidth="10" strokeLinejoin="round" />
            <path d="M60 76 V44 C60 32, 40 32, 40 44 V68" fill="none" stroke="#111827" strokeWidth="7" strokeLinecap="round" />
            <polygon points="32,66 40,78 48,66" fill="#111827" />
          </svg>
        );

      case 'steep_ascent':
        return (
          <svg viewBox="0 0 100 100" width={width} height={height} className={className}>
            <polygon points="50,8 94,88 6,88" fill="#FFFFFF" stroke="#DC2626" strokeWidth="10" strokeLinejoin="round" />
            <polygon points="26,76 74,76 74,48" fill="#111827" />
            {/* Car silhouette climbing */}
            <g transform="translate(36, 52) rotate(-28)">
              <rect x="0" y="0" width="16" height="8" rx="2" fill="#111827" />
              <circle cx="3" cy="8" r="2.5" fill="#111827" />
              <circle cx="13" cy="8" r="2.5" fill="#111827" />
            </g>
          </svg>
        );

      case 'steep_descent':
        return (
          <svg viewBox="0 0 100 100" width={width} height={height} className={className}>
            <polygon points="50,8 94,88 6,88" fill="#FFFFFF" stroke="#DC2626" strokeWidth="10" strokeLinejoin="round" />
            <polygon points="26,76 74,76 26,48" fill="#111827" />
            {/* Car silhouette descending */}
            <g transform="translate(42, 46) rotate(28)">
              <rect x="0" y="0" width="16" height="8" rx="2" fill="#111827" />
              <circle cx="3" cy="8" r="2.5" fill="#111827" />
              <circle cx="13" cy="8" r="2.5" fill="#111827" />
            </g>
          </svg>
        );

      case 'narrow_road':
        return (
          <svg viewBox="0 0 100 100" width={width} height={height} className={className}>
            <polygon points="50,8 94,88 6,88" fill="#FFFFFF" stroke="#DC2626" strokeWidth="10" strokeLinejoin="round" />
            <path d="M30 76 L30 62 L42 42 L42 34" fill="none" stroke="#111827" strokeWidth="6" strokeLinecap="round" />
            <path d="M70 76 L70 62 L58 42 L58 34" fill="none" stroke="#111827" strokeWidth="6" strokeLinecap="round" />
          </svg>
        );

      case 'narrow_bridge':
        return (
          <svg viewBox="0 0 100 100" width={width} height={height} className={className}>
            <polygon points="50,8 94,88 6,88" fill="#FFFFFF" stroke="#DC2626" strokeWidth="10" strokeLinejoin="round" />
            <path d="M32 76 V64 H44 V46 H32 V34" fill="none" stroke="#111827" strokeWidth="6" />
            <path d="M68 76 V64 H56 V46 H68 V34" fill="none" stroke="#111827" strokeWidth="6" />
          </svg>
        );

      case 'slippery_road':
        return (
          <svg viewBox="0 0 100 100" width={width} height={height} className={className}>
            <polygon points="50,8 94,88 6,88" fill="#FFFFFF" stroke="#DC2626" strokeWidth="10" strokeLinejoin="round" />
            {/* Car with skid marks */}
            <rect x="42" y="38" width="16" height="22" rx="3" fill="#111827" />
            <path d="M36 76 C48 72, 34 62, 44 56" fill="none" stroke="#111827" strokeWidth="3" strokeLinecap="round" />
            <path d="M48 76 C60 72, 46 62, 56 56" fill="none" stroke="#111827" strokeWidth="3" strokeLinecap="round" />
          </svg>
        );

      case 'pedestrian_crossing':
        return (
          <svg viewBox="0 0 100 100" width={width} height={height} className={className}>
            <polygon points="50,8 94,88 6,88" fill="#FFFFFF" stroke="#DC2626" strokeWidth="10" strokeLinejoin="round" />
            {/* Zebra base */}
            <line x1="28" y1="76" x2="72" y2="76" stroke="#111827" strokeWidth="3" strokeDasharray="5 4" />
            {/* Human silhouette */}
            <circle cx="50" cy="38" r="4.5" fill="#111827" />
            <path d="M50 44 L48 58 L40 72 M48 58 L58 72 M44 50 L56 50" fill="none" stroke="#111827" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );

      case 'school_ahead':
        return (
          <svg viewBox="0 0 100 100" width={width} height={height} className={className}>
            <polygon points="50,8 94,88 6,88" fill="#FFFFFF" stroke="#DC2626" strokeWidth="10" strokeLinejoin="round" />
            {/* Tall child */}
            <circle cx="44" cy="38" r="4" fill="#111827" />
            <path d="M44 43 L42 56 L36 74 M42 56 L48 74" fill="none" stroke="#111827" strokeWidth="3.5" strokeLinecap="round" />
            <rect x="36" y="47" width="5" height="7" fill="#111827" /> {/* Bag */}
            {/* Short child */}
            <circle cx="58" cy="46" r="3.5" fill="#111827" />
            <path d="M58 50 L57 60 L52 74 M57 60 L62 74" fill="none" stroke="#111827" strokeWidth="3" strokeLinecap="round" />
          </svg>
        );

      case 'road_works':
        return (
          <svg viewBox="0 0 100 100" width={width} height={height} className={className}>
            <polygon points="50,8 94,88 6,88" fill="#FFFFFF" stroke="#DC2626" strokeWidth="10" strokeLinejoin="round" />
            {/* Worker silhouette with shovel */}
            <circle cx="45" cy="38" r="4" fill="#111827" />
            <path d="M45 44 L40 56 L34 74 M40 56 L47 74 M43 48 L56 58" fill="none" stroke="#111827" strokeWidth="3.5" strokeLinecap="round" />
            {/* Shovel and dirt */}
            <line x1="56" y1="58" x2="68" y2="72" stroke="#111827" strokeWidth="2.5" />
            <path d="M66 70 L72 74 L68 76 Z" fill="#111827" />
            <path d="M60 76 Q66 72 72 76" fill="#111827" />
          </svg>
        );

      case 'cattle_crossing':
        return (
          <svg viewBox="0 0 100 100" width={width} height={height} className={className}>
            <polygon points="50,8 94,88 6,88" fill="#FFFFFF" stroke="#DC2626" strokeWidth="10" strokeLinejoin="round" />
            {/* Cow / Cattle silhouette */}
            <path d="M34 52 Q38 46 44 48 L62 48 Q68 50 70 54 L68 62 H64 L62 74 H58 L59 62 H45 L43 74 H39 L41 60 L34 58 Z" fill="#111827" />
            <polygon points="34,50 30,46 32,54" fill="#111827" /> {/* Horns/Head */}
          </svg>
        );

      case 'speed_breaker':
        return (
          <svg viewBox="0 0 100 100" width={width} height={height} className={className}>
            <polygon points="50,8 94,88 6,88" fill="#FFFFFF" stroke="#DC2626" strokeWidth="10" strokeLinejoin="round" />
            {/* Single / Double road humps */}
            <path d="M26 68 H38 Q44 52 50 52 Q56 52 62 68 H74" fill="none" stroke="#111827" strokeWidth="6" strokeLinecap="round" />
          </svg>
        );

      case 'dangerous_dip':
        return (
          <svg viewBox="0 0 100 100" width={width} height={height} className={className}>
            <polygon points="50,8 94,88 6,88" fill="#FFFFFF" stroke="#DC2626" strokeWidth="10" strokeLinejoin="round" />
            <path d="M26 56 H38 Q44 72 50 72 Q56 72 62 56 H74" fill="none" stroke="#111827" strokeWidth="6" strokeLinecap="round" />
          </svg>
        );

      case 'cross_road':
        return (
          <svg viewBox="0 0 100 100" width={width} height={height} className={className}>
            <polygon points="50,8 94,88 6,88" fill="#FFFFFF" stroke="#DC2626" strokeWidth="10" strokeLinejoin="round" />
            <line x1="50" y1="36" x2="50" y2="76" stroke="#111827" strokeWidth="8" strokeLinecap="round" />
            <line x1="30" y1="56" x2="70" y2="56" stroke="#111827" strokeWidth="8" strokeLinecap="round" />
          </svg>
        );

      case 't_junction':
        return (
          <svg viewBox="0 0 100 100" width={width} height={height} className={className}>
            <polygon points="50,8 94,88 6,88" fill="#FFFFFF" stroke="#DC2626" strokeWidth="10" strokeLinejoin="round" />
            <line x1="50" y1="44" x2="50" y2="76" stroke="#111827" strokeWidth="8" strokeLinecap="round" />
            <line x1="30" y1="44" x2="70" y2="44" stroke="#111827" strokeWidth="8" strokeLinecap="round" />
          </svg>
        );

      case 'roundabout_warning':
        return (
          <svg viewBox="0 0 100 100" width={width} height={height} className={className}>
            <polygon points="50,8 94,88 6,88" fill="#FFFFFF" stroke="#DC2626" strokeWidth="10" strokeLinejoin="round" />
            <circle cx="50" cy="56" r="16" fill="none" stroke="#111827" strokeWidth="5" strokeDasharray="18 10" />
            <polygon points="54,37 62,42 58,49" fill="#111827" />
            <polygon points="63,68 62,60 70,64" fill="#111827" />
            <polygon points="36,60 38,68 30,64" fill="#111827" />
          </svg>
        );

      case 'traffic_signal_ahead':
        return (
          <svg viewBox="0 0 100 100" width={width} height={height} className={className}>
            <polygon points="50,8 94,88 6,88" fill="#FFFFFF" stroke="#DC2626" strokeWidth="10" strokeLinejoin="round" />
            {/* Traffic Light Housing */}
            <rect x="42" y="34" width="16" height="40" rx="3" fill="#1F2937" />
            <circle cx="50" cy="41" r="4.5" fill="#EF4444" />
            <circle cx="50" cy="54" r="4.5" fill="#F59E0B" />
            <circle cx="50" cy="67" r="4.5" fill="#10B981" />
          </svg>
        );

      case 'railway_guarded':
        return (
          <svg viewBox="0 0 100 100" width={width} height={height} className={className}>
            <polygon points="50,8 94,88 6,88" fill="#FFFFFF" stroke="#DC2626" strokeWidth="10" strokeLinejoin="round" />
            {/* Gate / Fence symbol */}
            <rect x="32" y="44" width="36" height="26" fill="none" stroke="#111827" strokeWidth="4" />
            <line x1="32" y1="44" x2="68" y2="70" stroke="#111827" strokeWidth="3" />
            <line x1="68" y1="44" x2="32" y2="70" stroke="#111827" strokeWidth="3" />
            <line x1="50" y1="40" x2="50" y2="74" stroke="#111827" strokeWidth="3" />
          </svg>
        );

      case 'railway_unguarded':
        return (
          <svg viewBox="0 0 100 100" width={width} height={height} className={className}>
            <polygon points="50,8 94,88 6,88" fill="#FFFFFF" stroke="#DC2626" strokeWidth="10" strokeLinejoin="round" />
            {/* Steam locomotive engine */}
            <path d="M30 68 H70 V58 H60 V46 H42 V58 H30 Z" fill="#111827" />
            <rect x="36" y="40" width="4" height="8" fill="#111827" /> {/* Smokestack */}
            <circle cx="38" cy="72" r="5" fill="#111827" />
            <circle cx="50" cy="72" r="5" fill="#111827" />
            <circle cx="62" cy="72" r="5" fill="#111827" />
          </svg>
        );

      case 'falling_rocks':
        return (
          <svg viewBox="0 0 100 100" width={width} height={height} className={className}>
            <polygon points="50,8 94,88 6,88" fill="#FFFFFF" stroke="#DC2626" strokeWidth="10" strokeLinejoin="round" />
            <polygon points="28,34 40,76 28,76" fill="#111827" />
            <circle cx="48" cy="50" r="3.5" fill="#111827" />
            <circle cx="58" cy="62" r="4" fill="#111827" />
            <circle cx="64" cy="74" r="3" fill="#111827" />
          </svg>
        );

      case 'gap_in_median':
        return (
          <svg viewBox="0 0 100 100" width={width} height={height} className={className}>
            <polygon points="50,8 94,88 6,88" fill="#FFFFFF" stroke="#DC2626" strokeWidth="10" strokeLinejoin="round" />
            <rect x="46" y="34" width="8" height="14" fill="#111827" />
            <rect x="46" y="62" width="8" height="14" fill="#111827" />
            <path d="M58 48 C66 48, 66 62, 40 62" fill="none" stroke="#111827" strokeWidth="4" />
            <polygon points="42,57 32,62 42,67" fill="#111827" />
          </svg>
        );

      // ---------------- INFORMATORY / GUIDE SIGNS (Rectangles) ----------------
      case 'hospital':
        return (
          <svg viewBox="0 0 100 100" width={width} height={height} className={className}>
            <rect x="10" y="10" width="80" height="80" rx="8" fill="#1D4ED8" stroke="#FFFFFF" strokeWidth="2" />
            <rect x="22" y="22" width="56" height="56" rx="4" fill="#FFFFFF" />
            {/* Red Cross */}
            <rect x="44" y="28" width="12" height="26" fill="#DC2626" />
            <rect x="37" y="35" width="26" height="12" fill="#DC2626" />
            {/* 'H' symbol */}
            <text x="50" y="74" textAnchor="middle" fill="#1D4ED8" fontSize="18" fontWeight="900" fontFamily="sans-serif">
              H
            </text>
          </svg>
        );

      case 'first_aid':
        return (
          <svg viewBox="0 0 100 100" width={width} height={height} className={className}>
            <rect x="10" y="10" width="80" height="80" rx="8" fill="#1D4ED8" stroke="#FFFFFF" strokeWidth="2" />
            <rect x="22" y="22" width="56" height="56" rx="4" fill="#FFFFFF" />
            <rect x="44" y="30" width="12" height="40" fill="#DC2626" />
            <rect x="30" y="44" width="40" height="12" fill="#DC2626" />
          </svg>
        );

      case 'petrol_pump':
        return (
          <svg viewBox="0 0 100 100" width={width} height={height} className={className}>
            <rect x="10" y="10" width="80" height="80" rx="8" fill="#1D4ED8" stroke="#FFFFFF" strokeWidth="2" />
            <rect x="22" y="22" width="56" height="56" rx="4" fill="#FFFFFF" />
            {/* Fuel Pump silhouette */}
            <rect x="34" y="32" width="22" height="38" rx="2" fill="#111827" />
            <rect x="38" y="38" width="14" height="12" rx="1" fill="#FFFFFF" />
            <path d="M56 42 H62 V58 L66 54" fill="none" stroke="#111827" strokeWidth="3" strokeLinecap="round" />
            <rect x="32" y="70" width="26" height="4" fill="#111827" />
          </svg>
        );

      case 'ev_charging':
        return (
          <svg viewBox="0 0 100 100" width={width} height={height} className={className}>
            <rect x="10" y="10" width="80" height="80" rx="8" fill="#059669" stroke="#FFFFFF" strokeWidth="2" />
            <rect x="22" y="22" width="56" height="56" rx="4" fill="#FFFFFF" />
            {/* EV Pump */}
            <rect x="32" y="32" width="20" height="36" rx="2" fill="#059669" />
            <text x="42" y="46" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="900">EV</text>
            <path d="M52 40 H58 V56 L62 52" fill="none" stroke="#059669" strokeWidth="3" />
            {/* Lightning bolt */}
            <polygon points="43,50 39,56 42,56 40,62 45,55 42,55" fill="#FBBF24" />
          </svg>
        );

      case 'eating_place':
        return (
          <svg viewBox="0 0 100 100" width={width} height={height} className={className}>
            <rect x="10" y="10" width="80" height="80" rx="8" fill="#1D4ED8" stroke="#FFFFFF" strokeWidth="2" />
            <rect x="22" y="22" width="56" height="56" rx="4" fill="#FFFFFF" />
            {/* Fork & Spoon */}
            <path d="M40 32 V44 C40 48 44 48 44 54 V70 M36 32 V40 M44 32 V40" fill="none" stroke="#111827" strokeWidth="3" strokeLinecap="round" />
            <ellipse cx="58" cy="38" rx="5" ry="8" fill="#111827" />
            <line x1="58" y1="46" x2="58" y2="70" stroke="#111827" strokeWidth="3" strokeLinecap="round" />
          </svg>
        );

      case 'resting_place':
        return (
          <svg viewBox="0 0 100 100" width={width} height={height} className={className}>
            <rect x="10" y="10" width="80" height="80" rx="8" fill="#1D4ED8" stroke="#FFFFFF" strokeWidth="2" />
            <rect x="22" y="22" width="56" height="56" rx="4" fill="#FFFFFF" />
            {/* Bed silhouette */}
            <circle cx="36" cy="46" r="4" fill="#111827" />
            <rect x="44" y="48" width="26" height="6" rx="2" fill="#111827" />
            <rect x="30" y="42" width="4" height="24" fill="#111827" />
            <rect x="70" y="52" width="4" height="14" fill="#111827" />
            <rect x="30" y="54" width="44" height="4" fill="#111827" />
          </svg>
        );

      case 'toll_plaza':
        return (
          <svg viewBox="0 0 100 100" width={width} height={height} className={className}>
            <rect x="10" y="10" width="80" height="80" rx="8" fill="#047857" stroke="#FFFFFF" strokeWidth="2" />
            <rect x="18" y="22" width="64" height="24" rx="3" fill="#FFFFFF" />
            <text x="50" y="38" textAnchor="middle" fill="#047857" fontSize="12" fontWeight="900" fontFamily="sans-serif">
              TOLL
            </text>
            <rect x="26" y="52" width="18" height="26" fill="#FFFFFF" />
            <rect x="56" y="52" width="18" height="26" fill="#FFFFFF" />
            {/* Barrier bar */}
            <line x1="44" y1="62" x2="56" y2="56" stroke="#EF4444" strokeWidth="3" />
          </svg>
        );

      case 'parking_facility': {
        const text = params.text || 'P';
        return (
          <svg viewBox="0 0 100 100" width={width} height={height} className={className}>
            <rect x="10" y="10" width="80" height="80" rx="8" fill="#1D4ED8" stroke="#FFFFFF" strokeWidth="2" />
            <text x="50" y="65" textAnchor="middle" fill="#FFFFFF" fontSize="52" fontWeight="900" fontFamily="sans-serif">
              {text}
            </text>
          </svg>
        );
      }

      case 'nh_route_marker': {
        const nhNum = params.nh || '44';
        return (
          <svg viewBox="0 0 100 100" width={width} height={height} className={className}>
            {/* NH Shield yellow top, white bottom */}
            <path d="M15 15 H85 V65 Q85 85 50 92 Q15 85 15 65 Z" fill="#FBBF24" stroke="#111827" strokeWidth="4" />
            <path d="M18 45 H82 V65 Q82 82 50 88 Q18 82 18 65 Z" fill="#FFFFFF" />
            <text x="50" y="36" textAnchor="middle" fill="#111827" fontSize="16" fontWeight="900">
              NH
            </text>
            <text x="50" y="74" textAnchor="middle" fill="#111827" fontSize="30" fontWeight="900">
              {nhNum}
            </text>
          </svg>
        );
      }

      case 'expressway_marker': {
        const expNum = params.exp || 'NE-1';
        return (
          <svg viewBox="0 0 100 100" width={width} height={height} className={className}>
            <polygon points="50,10 88,38 74,88 26,88 12,38" fill="#047857" stroke="#FFFFFF" strokeWidth="3" />
            <text x="50" y="44" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="900">
              EXPRESSWAY
            </text>
            <text x="50" y="72" textAnchor="middle" fill="#FBBF24" fontSize="22" fontWeight="900">
              {expNum}
            </text>
          </svg>
        );
      }

      case 'advance_direction_sign':
        return (
          <svg viewBox="0 0 120 80" width={width} height={height} className={className}>
            <rect x="4" y="4" width="112" height="72" rx="6" fill="#047857" stroke="#FFFFFF" strokeWidth="3" />
            <text x="20" y="30" fill="#FFFFFF" fontSize="12" fontWeight="700">DELHI</text>
            <text x="80" y="30" fill="#FBBF24" fontSize="11" fontWeight="700">240 km</text>
            <line x1="16" y1="42" x2="104" y2="42" stroke="#FFFFFF" strokeWidth="1.5" />
            <text x="20" y="60" fill="#FFFFFF" fontSize="12" fontWeight="700">JAIPUR</text>
            <text x="80" y="60" fill="#FBBF24" fontSize="11" fontWeight="700">45 km</text>
          </svg>
        );

      case 'no_through_road':
        return (
          <svg viewBox="0 0 100 100" width={width} height={height} className={className}>
            <rect x="10" y="10" width="80" height="80" rx="6" fill="#1D4ED8" stroke="#FFFFFF" strokeWidth="2" />
            <line x1="50" y1="80" x2="50" y2="35" stroke="#FFFFFF" strokeWidth="12" />
            <rect x="32" y="25" width="36" height="12" fill="#DC2626" />
          </svg>
        );

      // ---------------- ROAD MARKINGS & TRAFFIC SIGNALS ----------------
      case 'marking_broken_white':
        return (
          <svg viewBox="0 0 100 100" width={width} height={height} className={className}>
            <rect x="5" y="5" width="90" height="90" rx="8" fill="#1E293B" stroke="#475569" strokeWidth="2" />
            <line x1="50" y1="12" x2="50" y2="32" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" />
            <line x1="50" y1="42" x2="50" y2="62" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" />
            <line x1="50" y1="72" x2="50" y2="92" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" />
          </svg>
        );

      case 'marking_solid_white':
        return (
          <svg viewBox="0 0 100 100" width={width} height={height} className={className}>
            <rect x="5" y="5" width="90" height="90" rx="8" fill="#1E293B" stroke="#475569" strokeWidth="2" />
            <line x1="50" y1="10" x2="50" y2="90" stroke="#FFFFFF" strokeWidth="8" />
          </svg>
        );

      case 'marking_double_yellow':
        return (
          <svg viewBox="0 0 100 100" width={width} height={height} className={className}>
            <rect x="5" y="5" width="90" height="90" rx="8" fill="#1E293B" stroke="#475569" strokeWidth="2" />
            <line x1="42" y1="10" x2="42" y2="90" stroke="#F59E0B" strokeWidth="6" />
            <line x1="58" y1="10" x2="58" y2="90" stroke="#F59E0B" strokeWidth="6" />
          </svg>
        );

      case 'marking_stop_line':
        return (
          <svg viewBox="0 0 100 100" width={width} height={height} className={className}>
            <rect x="5" y="5" width="90" height="90" rx="8" fill="#1E293B" stroke="#475569" strokeWidth="2" />
            <line x1="12" y1="60" x2="88" y2="60" stroke="#FFFFFF" strokeWidth="12" />
            <text x="50" y="44" textAnchor="middle" fill="#FFFFFF" fontSize="14" fontWeight="800" letterSpacing="2">
              STOP
            </text>
          </svg>
        );

      case 'marking_zebra_crossing':
        return (
          <svg viewBox="0 0 100 100" width={width} height={height} className={className}>
            <rect x="5" y="5" width="90" height="90" rx="8" fill="#1E293B" stroke="#475569" strokeWidth="2" />
            <rect x="12" y="20" width="12" height="60" fill="#FFFFFF" />
            <rect x="32" y="20" width="12" height="60" fill="#FFFFFF" />
            <rect x="52" y="20" width="12" height="60" fill="#FFFFFF" />
            <rect x="72" y="20" width="12" height="60" fill="#FFFFFF" />
          </svg>
        );

      case 'marking_yellow_box':
        return (
          <svg viewBox="0 0 100 100" width={width} height={height} className={className}>
            <rect x="5" y="5" width="90" height="90" rx="8" fill="#1E293B" stroke="#475569" strokeWidth="2" />
            <rect x="18" y="18" width="64" height="64" fill="none" stroke="#F59E0B" strokeWidth="4" />
            <line x1="18" y1="18" x2="82" y2="82" stroke="#F59E0B" strokeWidth="4" />
            <line x1="82" y1="18" x2="18" y2="82" stroke="#F59E0B" strokeWidth="4" />
            <line x1="18" y1="50" x2="50" y2="82" stroke="#F59E0B" strokeWidth="3" />
            <line x1="50" y1="18" x2="82" y2="50" stroke="#F59E0B" strokeWidth="3" />
            <line x1="50" y1="18" x2="18" y2="50" stroke="#F59E0B" strokeWidth="3" />
            <line x1="82" y1="50" x2="50" y2="82" stroke="#F59E0B" strokeWidth="3" />
          </svg>
        );

      case 'traffic_light_3aspect': {
        const state = params.state || 'red';
        return (
          <svg viewBox="0 0 60 120" width={width} height={height} className={className}>
            <rect x="5" y="5" width="50" height="110" rx="10" fill="#111827" stroke="#374151" strokeWidth="3" />
            {/* Red Light */}
            <circle cx="30" cy="26" r="12" fill={state === 'red' ? '#EF4444' : '#450A0A'} />
            {state === 'red' && <circle cx="30" cy="26" r="14" fill="none" stroke="#EF4444" strokeWidth="2" opacity="0.6" />}
            {/* Amber Light */}
            <circle cx="30" cy="60" r="12" fill={state === 'amber' ? '#F59E0B' : '#451A03'} />
            {state === 'amber' && <circle cx="30" cy="60" r="14" fill="none" stroke="#F59E0B" strokeWidth="2" opacity="0.6" />}
            {/* Green Light */}
            <circle cx="30" cy="94" r="12" fill={state === 'green' ? '#10B981' : '#022C22'} />
            {state === 'green' && <circle cx="30" cy="94" r="14" fill="none" stroke="#10B981" strokeWidth="2" opacity="0.6" />}
          </svg>
        );
      }

      case 'pedestrian_signal':
        return (
          <svg viewBox="0 0 60 100" width={width} height={height} className={className}>
            <rect x="5" y="5" width="50" height="90" rx="8" fill="#111827" stroke="#374151" strokeWidth="2" />
            {/* Don't Walk (Red Man) */}
            <circle cx="30" cy="24" r="4.5" fill="#EF4444" />
            <path d="M30 29 V41 M25 46 L30 41 L35 46 M24 33 H36" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" />
            {/* Walk (Green Man) */}
            <circle cx="30" cy="62" r="4.5" fill="#10B981" />
            <path d="M30 67 L28 76 L22 86 M28 76 L36 86 M26 71 L34 71" stroke="#10B981" strokeWidth="3" strokeLinecap="round" />
          </svg>
        );

      case 'road_stud_cat_eye': {
        const color = params.color || 'white';
        const hex = color === 'red' ? '#EF4444' : color === 'amber' ? '#F59E0B' : color === 'green' ? '#10B981' : '#E2E8F0';
        return (
          <svg viewBox="0 0 100 100" width={width} height={height} className={className}>
            <rect x="5" y="5" width="90" height="90" rx="8" fill="#1E293B" stroke="#475569" strokeWidth="2" />
            {/* Road Stud Trapezoid */}
            <polygon points="20,70 80,70 70,30 30,30" fill="#64748B" stroke="#94A3B8" strokeWidth="2" />
            {/* Reflector lens */}
            <rect x="36" y="44" width="28" height="14" rx="2" fill={hex} />
            <circle cx="43" cy="51" r="3" fill="#FFFFFF" opacity="0.8" />
            <circle cx="57" cy="51" r="3" fill="#FFFFFF" opacity="0.8" />
          </svg>
        );
      }

      default:
        return (
          <svg viewBox="0 0 100 100" width={width} height={height} className={className}>
            <circle cx="50" cy="50" r="45" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="3" />
            <text x="50" y="58" textAnchor="middle" fill="#FFFFFF" fontSize="24" fontWeight="bold">
              ?
            </text>
          </svg>
        );
    }
  };

  return <div className="inline-flex items-center justify-center select-none">{renderContent()}</div>;
};
