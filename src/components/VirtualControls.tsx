import React, { useRef } from 'react';
import { PlayerPosition } from '../types/game';
import { sounds } from '../audio/soundManager';

interface VirtualControlsProps {
  setPlayer: React.Dispatch<React.SetStateAction<PlayerPosition>>;
  onAction: () => void;
  onOpenJournal: () => void;
}

export const VirtualControls: React.FC<VirtualControlsProps> = ({
  setPlayer,
  onAction,
  onOpenJournal,
}) => {
  const moveIntervalRef = useRef<number | null>(null);

  const startMoving = (dx: number, dy: number, dir: 'up' | 'down' | 'left' | 'right') => {
    stopMoving();
    const step = () => {
      setPlayer(prev => ({
        ...prev,
        x: Math.max(30, Math.min(1090, prev.x + dx * 12)),
        y: Math.max(60, Math.min(670, prev.y + dy * 12)),
        direction: dir,
        isMoving: true,
      }));
    };
    step();
    moveIntervalRef.current = window.setInterval(step, 40);
  };

  const stopMoving = () => {
    if (moveIntervalRef.current) {
      clearInterval(moveIntervalRef.current);
      moveIntervalRef.current = null;
    }
    setPlayer(prev => ({ ...prev, isMoving: false }));
  };

  return (
    <div className="absolute inset-x-4 bottom-4 pointer-events-none z-30 flex sm:hidden items-end justify-between select-none">
      
      {/* Mobile D-Pad */}
      <div className="pointer-events-auto grid grid-cols-3 gap-1 bg-slate-900/80 p-2 rounded-2xl border border-slate-700/60 shadow-xl backdrop-blur-sm">
        <div />
        <button
          onTouchStart={() => startMoving(0, -1, 'up')}
          onTouchEnd={stopMoving}
          onMouseDown={() => startMoving(0, -1, 'up')}
          onMouseUp={stopMoving}
          onMouseLeave={stopMoving}
          className="w-11 h-11 bg-slate-800 active:bg-cyan-600 rounded-lg flex items-center justify-center text-slate-100 font-bold text-lg"
        >
          ▲
        </button>
        <div />

        <button
          onTouchStart={() => startMoving(-1, 0, 'left')}
          onTouchEnd={stopMoving}
          onMouseDown={() => startMoving(-1, 0, 'left')}
          onMouseUp={stopMoving}
          onMouseLeave={stopMoving}
          className="w-11 h-11 bg-slate-800 active:bg-cyan-600 rounded-lg flex items-center justify-center text-slate-100 font-bold text-lg"
        >
          ◀
        </button>
        <button
          onTouchStart={() => startMoving(0, 1, 'down')}
          onTouchEnd={stopMoving}
          onMouseDown={() => startMoving(0, 1, 'down')}
          onMouseUp={stopMoving}
          onMouseLeave={stopMoving}
          className="w-11 h-11 bg-slate-800 active:bg-cyan-600 rounded-lg flex items-center justify-center text-slate-100 font-bold text-lg"
        >
          ▼
        </button>
        <button
          onTouchStart={() => startMoving(1, 0, 'right')}
          onTouchEnd={stopMoving}
          onMouseDown={() => startMoving(1, 0, 'right')}
          onMouseUp={stopMoving}
          onMouseLeave={stopMoving}
          className="w-11 h-11 bg-slate-800 active:bg-cyan-600 rounded-lg flex items-center justify-center text-slate-100 font-bold text-lg"
        >
          ▶
        </button>
      </div>

      {/* Action Buttons */}
      <div className="pointer-events-auto flex flex-col gap-2.5">
        <button
          onClick={() => {
            sounds.playClick();
            onOpenJournal();
          }}
          className="w-13 h-13 rounded-full bg-slate-800/90 active:bg-slate-700 border border-slate-600 text-slate-200 text-xs font-semibold flex flex-col items-center justify-center shadow-lg"
        >
          <span>📖</span>
          <span className="text-[9px]">JURNAL</span>
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            onAction();
          }}
          className="w-16 h-16 rounded-full bg-cyan-500 active:bg-cyan-400 text-slate-950 font-bold text-xs flex flex-col items-center justify-center shadow-xl shadow-cyan-900/40 border border-cyan-300"
        >
          <span className="text-base">⚡</span>
          <span>AKSI</span>
        </button>
      </div>

    </div>
  );
};
