import React from 'react';
import { ClueTerminal } from '../types/game';
import { sounds } from '../audio/soundManager';

interface ClueModalProps {
  clue: ClueTerminal;
  onClose: () => void;
}

export const ClueModal: React.FC<ClueModalProps> = ({ clue, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-slate-900 border border-cyan-800/60 rounded-2xl shadow-2xl p-6 space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">📋</span>
            <div>
              <h3 className="text-sm font-bold text-slate-100">{clue.title}</h3>
              <p className="text-xs text-cyan-400 font-mono">{clue.author}</p>
            </div>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="text-slate-400 hover:text-white p-1 rounded-lg text-sm"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-300 text-xs sm:text-sm leading-relaxed">
          {clue.content}
        </div>

        {/* Scientific Tip */}
        <div className="p-3 rounded-lg bg-cyan-950/30 border border-cyan-800/40 text-xs text-cyan-200">
          <span className="font-semibold text-cyan-400 block mb-0.5">Petua Kaedah Saintifik KSSM:</span>
          {clue.tip}
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2">
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors"
          >
            Faham & Tutup Nota
          </button>
        </div>

      </div>
    </div>
  );
};
