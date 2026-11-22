'use client';

import React from 'react';
import type { KundliCalculationResult } from '@/lib/astrology/engine';

interface KundliChartProps {
  kundli: KundliCalculationResult;
  size?: number;
}

export function KundliChart({ kundli, size = 420 }: KundliChartProps) {
  const { ascendant, houses } = kundli;

  // House coordinates for North Indian Diamond Chart
  // House 1 (Top Center Diamond)
  // House 2 (Top Left Triangle)
  // House 3 (Left Top Triangle)
  // House 4 (Left Center Diamond)
  // House 5 (Left Bottom Triangle)
  // House 6 (Bottom Left Triangle)
  // House 7 (Bottom Center Diamond)
  // House 8 (Bottom Right Triangle)
  // House 9 (Right Bottom Triangle)
  // House 10 (Right Center Diamond)
  // House 11 (Right Top Triangle)
  // House 12 (Top Right Triangle)

  const getHouseData = (num: number) => {
    return houses.find(h => h.houseNumber === num) || { signNumber: num, planets: [] };
  };

  return (
    <div className="relative w-full aspect-square max-w-[440px] mx-auto border-2 border-amber-800/80 bg-amber-50/30 rounded-2xl p-4 shadow-inner text-xs font-serif select-none">
      {/* Geometric SVG Frame */}
      <svg viewBox="0 0 400 400" className="w-full h-full stroke-amber-800 stroke-[1.5] fill-none">
        {/* Outer Square */}
        <rect x="8" y="8" width="384" height="384" rx="4" />
        {/* Diagonal Cross */}
        <line x1="8" y1="8" x2="392" y2="392" />
        <line x1="392" y1="8" x2="8" y2="392" />
        {/* Inner Diamond */}
        <polygon points="200,8 392,200 200,392 8,200" />
      </svg>

      {/* House 1 (Lagna / 1st House - Top Diamond) */}
      <div className="absolute top-[34%] left-[50%] -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
        <span className="text-[10px] font-bold text-amber-900 block">{getHouseData(1).signNumber}</span>
        <div className="flex flex-wrap items-center justify-center gap-1 max-w-[90px]">
          {getHouseData(1).planets.map(p => (
            <span key={p} className="text-xs font-bold text-amber-800 bg-amber-100/70 px-1 rounded font-mono">{p}</span>
          ))}
          {getHouseData(1).planets.length === 0 && <span className="text-[10px] text-amber-800/50">Lagna</span>}
        </div>
      </div>

      {/* House 2 (Top Left Triangle) */}
      <div className="absolute top-[20%] left-[26%] -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
        <span className="text-[9px] font-bold text-stone-600 block">{getHouseData(2).signNumber}</span>
        <div className="flex flex-wrap items-center justify-center gap-1">
          {getHouseData(2).planets.map(p => (
            <span key={p} className="text-[11px] font-bold text-stone-800 font-mono">{p}</span>
          ))}
        </div>
      </div>

      {/* House 3 (Left Top Triangle) */}
      <div className="absolute top-[26%] left-[16%] -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
        <span className="text-[9px] font-bold text-stone-600 block">{getHouseData(3).signNumber}</span>
        <div className="flex flex-wrap items-center justify-center gap-1">
          {getHouseData(3).planets.map(p => (
            <span key={p} className="text-[11px] font-bold text-stone-800 font-mono">{p}</span>
          ))}
        </div>
      </div>

      {/* House 4 (Sukha / Left Diamond) */}
      <div className="absolute top-[50%] left-[34%] -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
        <span className="text-[10px] font-bold text-amber-900 block">{getHouseData(4).signNumber}</span>
        <div className="flex flex-wrap items-center justify-center gap-1 max-w-[80px]">
          {getHouseData(4).planets.map(p => (
            <span key={p} className="text-xs font-bold text-amber-800 bg-amber-100/70 px-1 rounded font-mono">{p}</span>
          ))}
        </div>
      </div>

      {/* House 5 (Left Bottom Triangle) */}
      <div className="absolute bottom-[24%] left-[16%] -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
        <span className="text-[9px] font-bold text-stone-600 block">{getHouseData(5).signNumber}</span>
        <div className="flex flex-wrap items-center justify-center gap-1">
          {getHouseData(5).planets.map(p => (
            <span key={p} className="text-[11px] font-bold text-stone-800 font-mono">{p}</span>
          ))}
        </div>
      </div>

      {/* House 6 (Bottom Left Triangle) */}
      <div className="absolute bottom-[16%] left-[26%] -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
        <span className="text-[9px] font-bold text-stone-600 block">{getHouseData(6).signNumber}</span>
        <div className="flex flex-wrap items-center justify-center gap-1">
          {getHouseData(6).planets.map(p => (
            <span key={p} className="text-[11px] font-bold text-stone-800 font-mono">{p}</span>
          ))}
        </div>
      </div>

      {/* House 7 (Kalatra / Bottom Diamond) */}
      <div className="absolute bottom-[30%] left-[50%] -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
        <span className="text-[10px] font-bold text-amber-900 block">{getHouseData(7).signNumber}</span>
        <div className="flex flex-wrap items-center justify-center gap-1 max-w-[90px]">
          {getHouseData(7).planets.map(p => (
            <span key={p} className="text-xs font-bold text-amber-800 bg-amber-100/70 px-1 rounded font-mono">{p}</span>
          ))}
        </div>
      </div>

      {/* House 8 (Bottom Right Triangle) */}
      <div className="absolute bottom-[16%] right-[26%] translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
        <span className="text-[9px] font-bold text-stone-600 block">{getHouseData(8).signNumber}</span>
        <div className="flex flex-wrap items-center justify-center gap-1">
          {getHouseData(8).planets.map(p => (
            <span key={p} className="text-[11px] font-bold text-stone-800 font-mono">{p}</span>
          ))}
        </div>
      </div>

      {/* House 9 (Right Bottom Triangle) */}
      <div className="absolute bottom-[24%] right-[16%] translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
        <span className="text-[9px] font-bold text-stone-600 block">{getHouseData(9).signNumber}</span>
        <div className="flex flex-wrap items-center justify-center gap-1">
          {getHouseData(9).planets.map(p => (
            <span key={p} className="text-[11px] font-bold text-stone-800 font-mono">{p}</span>
          ))}
        </div>
      </div>

      {/* House 10 (Karma / Right Diamond) */}
      <div className="absolute top-[50%] right-[34%] translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
        <span className="text-[10px] font-bold text-amber-900 block">{getHouseData(10).signNumber}</span>
        <div className="flex flex-wrap items-center justify-center gap-1 max-w-[80px]">
          {getHouseData(10).planets.map(p => (
            <span key={p} className="text-xs font-bold text-amber-800 bg-amber-100/70 px-1 rounded font-mono">{p}</span>
          ))}
        </div>
      </div>

      {/* House 11 (Right Top Triangle) */}
      <div className="absolute top-[26%] right-[16%] translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
        <span className="text-[9px] font-bold text-stone-600 block">{getHouseData(11).signNumber}</span>
        <div className="flex flex-wrap items-center justify-center gap-1">
          {getHouseData(11).planets.map(p => (
            <span key={p} className="text-[11px] font-bold text-stone-800 font-mono">{p}</span>
          ))}
        </div>
      </div>

      {/* House 12 (Top Right Triangle) */}
      <div className="absolute top-[20%] right-[26%] translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
        <span className="text-[9px] font-bold text-stone-600 block">{getHouseData(12).signNumber}</span>
        <div className="flex flex-wrap items-center justify-center gap-1">
          {getHouseData(12).planets.map(p => (
            <span key={p} className="text-[11px] font-bold text-stone-800 font-mono">{p}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
