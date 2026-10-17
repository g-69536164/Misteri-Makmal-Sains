import React from 'react';
import { sounds } from '../audio/soundManager';

interface PauseModalProps {
  onResume: () => void;
  onOpenJournal: () => void;
  onRestart: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  onResume,
  onOpenJournal,
  onRestart,
  isMuted,
  onToggleMute,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 text-center space-y-5">
        
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-100">Permainan Dijeda</h2>
          <p className="text-xs text-slate-400">Makmal Alpha Dalam Mod Tunggu Sedia</p>
        </div>

        <div className="space-y-2.5">
          <button
            onClick={() => {
              sounds.playClick();
              onResume();
            }}
            className="w-full py-2.5 px-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-sm transition-colors"
          >
            Sambung Meneroka
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              onOpenJournal();
            }}
            className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-sm transition-colors"
          >
            Buka Jurnal Sains & Nota
          </button>

          <button
            onClick={() => {
              onToggleMute();
            }}
            className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
          >
            <span>{isMuted ? '🔇 Audio: Dimatikan' : '🔊 Audio: Aktif'}</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              if (window.confirm('Adakah anda pasti ingin memulakan semula penyiasatan makmal?')) {
                onRestart();
              }
            }}
            className="w-full py-2.5 px-4 bg-red-950/40 hover:bg-red-900/40 border border-red-800/40 text-red-300 font-semibold rounded-xl text-sm transition-colors"
          >
            Mula Semula Dari Awal
          </button>
        </div>

        <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-800">
          Tekan [Esc] untuk kembali bermain
        </div>

      </div>
    </div>
  );
};
