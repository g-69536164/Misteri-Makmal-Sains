import React from 'react';
import { Station, GameStats } from '../types/game';
import { sounds } from '../audio/soundManager';

interface HUDProps {
  stations: Station[];
  stats: GameStats;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenJournal: () => void;
  onPause: () => void;
  elapsedSeconds: number;
}

export const HUD: React.FC<HUDProps> = ({
  stations,
  stats,
  isMuted,
  onToggleMute,
  onOpenJournal,
  onPause,
  elapsedSeconds,
}) => {
  const completedCount = stations.filter(s => s.isCompleted).length;
  const currentStation = stations.find(s => s.isUnlocked && !s.isCompleted) || stations[stations.length - 1];

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-30 flex flex-col justify-between p-3 sm:p-5 select-none">
      
      {/* Top Header Perimeter Bar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        
        {/* Top Left: Mission Cluster */}
        <div className="pointer-events-auto bg-slate-950/85 border border-slate-800 rounded-xl px-3.5 py-2 flex items-center gap-3 shadow-md">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <div>
            <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">
              {currentStation?.zone || 'Pusat Makmal Alpha'}
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-100 flex items-center gap-1.5">
              <span>{completedCount === 8 ? 'Teras Alpha Sedia Dinyahkunci!' : currentStation?.name || 'Meneroka Makmal'}</span>
            </div>
          </div>
        </div>

        {/* Top Center: Progress & Score Cluster */}
        <div className="pointer-events-auto bg-slate-950/85 border border-slate-800 rounded-xl px-4 py-2 flex items-center gap-4 text-xs shadow-md">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Langkah Kaedah:</span>
            <span className="font-mono font-bold text-cyan-300 tabular-nums">
              {completedCount} / 8
            </span>
          </div>

          <div className="h-4 w-px bg-slate-800" />

          <div className="flex items-center gap-2">
            <span className="text-slate-400">Masa:</span>
            <span className="font-mono font-semibold text-amber-300 tabular-nums">
              {formatTime(elapsedSeconds)}
            </span>
          </div>

          <div className="h-4 w-px bg-slate-800" />

          <div className="flex items-center gap-2">
            <span className="text-slate-400">Mata:</span>
            <span className="font-mono font-bold text-emerald-400 tabular-nums">
              {stats.score}
            </span>
          </div>
        </div>

        {/* Top Right: Actions & Tools Cluster */}
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            onClick={() => {
              sounds.playClick();
              onOpenJournal();
            }}
            className="px-3 py-1.5 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 rounded-xl text-xs font-medium text-slate-200 transition-colors flex items-center gap-1.5 shadow-sm"
            title="Buka Jurnal Saintifik (Kekunci J)"
          >
            <span>📖</span>
            <span className="hidden sm:inline">Jurnal Sains</span>
          </button>

          <button
            onClick={onToggleMute}
            className="p-2 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-300 transition-colors shadow-sm"
            title={isMuted ? 'Buka Bunyi' : 'Senyapkan Bunyi'}
          >
            {isMuted ? '🔇' : '🔊'}
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              onPause();
            }}
            className="px-2.5 py-1.5 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 rounded-xl text-xs font-mono font-semibold text-slate-300 transition-colors shadow-sm"
            title="Jeda Permainan (Esc)"
          >
            ESC
          </button>
        </div>

      </div>

      {/* Bottom Hint Flat Bar (Only on desktop) */}
      <div className="hidden sm:flex justify-between items-center text-[11px] text-slate-400/80 px-2">
        <div className="pointer-events-none bg-slate-950/70 border border-slate-800/80 px-3 py-1 rounded-lg">
          Kekunci: <span className="text-slate-200 font-mono">WASD / Anak Panah</span> Gerak · <span className="text-slate-200 font-mono">[E] / Ruang</span> Interaksi · <span className="text-slate-200 font-mono">[J]</span> Jurnal · <span className="text-slate-200 font-mono">[Esc]</span> Jeda
        </div>
        <div className="pointer-events-none bg-slate-950/70 border border-slate-800/80 px-3 py-1 rounded-lg">
          Sains Tingkatan 1 KSSM · Bab 1: Kaedah Saintifik
        </div>
      </div>

    </div>
  );
};
