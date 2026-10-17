import React, { useEffect } from 'react';
import { sounds } from '../audio/soundManager';

interface TitleScreenProps {
  onStartGame: () => void;
  onOpenJournal: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onStartGame,
  onOpenJournal,
  isMuted,
  onToggleMute,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Enter' || e.code === 'Space') {
        e.preventDefault();
        sounds.playClick();
        onStartGame();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onStartGame]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 flex flex-col justify-between p-6 md:p-12 select-none">
      
      {/* Background Graphic with Vignette Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/lab_mystery_backdrop_1792246023506.jpg"
          alt="Makmal Misteri Alpha"
          className="w-full h-full object-cover object-center filter brightness-50 contrast-110 scale-105 transition-transform duration-10000 ease-out animate-pulse"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40" />
      </div>

      {/* Top Bar on Title Screen */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-xs md:text-sm font-mono tracking-widest text-cyan-300 uppercase">
            KSSM Sains Tingkatan 1 · Bab 1
          </span>
        </div>

        <button
          onClick={onToggleMute}
          className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-850 border border-slate-700/80 text-slate-300 text-sm transition-colors"
        >
          {isMuted ? '🔇 Audio: Senyap' : '🔊 Audio: Aktif'}
        </button>
      </div>

      {/* Hero Centerpiece: Bespoke SVG Title Lockup */}
      <div className="relative z-10 max-w-2xl mx-auto text-center flex flex-col items-center my-auto space-y-6">
        
        {/* Bespoke Science Atom/Beaker SVG Icon Badge */}
        <div className="w-20 h-20 relative flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_20px_rgba(56,189,248,0.5)]">
            <circle cx="50" cy="50" r="42" stroke="#38bdf8" strokeWidth="2" fill="none" strokeDasharray="6,4" />
            <ellipse cx="50" cy="50" rx="36" ry="14" stroke="#818cf8" strokeWidth="1.5" fill="none" transform="rotate(30 50 50)" />
            <ellipse cx="50" cy="50" rx="36" ry="14" stroke="#818cf8" strokeWidth="1.5" fill="none" transform="rotate(-30 50 50)" />
            {/* Center Flask */}
            <path d="M 44 32 L 56 32 M 46 32 L 46 44 L 38 62 C 37 65 39 68 43 68 L 57 68 C 61 68 63 65 62 62 L 54 44 L 54 32" stroke="#38bdf8" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <circle cx="50" cy="58" r="4" fill="#38bdf8" className="animate-pulse" />
          </svg>
        </div>

        {/* Title Lockup */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white drop-shadow-md">
            MISTERI MAKMAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">ALPHA</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base font-normal max-w-lg mx-auto leading-relaxed">
            Eksplorasi Kaedah Saintifik & Langkah Penyiasatan Sains
          </p>
        </div>

        {/* Narrative Teaser */}
        <div className="bg-slate-900/80 border border-slate-700/60 rounded-2xl p-4 max-w-xl text-xs sm:text-sm text-slate-300 leading-relaxed shadow-xl backdrop-blur-sm">
          Sistem keselamatan Makmal Alpha telah mengunci semua sektor akibat ralat protokol kecemasan. Terokai 4 sektor makmal, selesaikan 8 teka-teki kaedah saintifik KSSM, dan aktifkan semula Teras Makmal Alpha!
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3.5 pt-2 w-full sm:w-auto">
          <button
            onClick={() => {
              sounds.playClick();
              onStartGame();
            }}
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl text-sm sm:text-base shadow-xl shadow-cyan-950/50 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
          >
            <span>⚡ Mulakan Penyiasatan</span>
            <span className="text-xs opacity-75 font-mono">(Enter / Ruang)</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              onOpenJournal();
            }}
            className="w-full sm:w-auto px-6 py-3.5 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
          >
            <span>📖 Panduan & Nota Sains</span>
          </button>
        </div>

      </div>

      {/* Flat Control-Hint Line at Bottom */}
      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400/80 border-t border-slate-800/80 pt-4 gap-2">
        <div>
          Kawal: <span className="text-slate-200 font-mono">WASD / Anak Panah</span> Gerak · <span className="text-slate-200 font-mono">Ruang / [E]</span> Aksi · <span className="text-slate-200 font-mono">[J]</span> Jurnal · <span className="text-slate-200 font-mono">[Esc]</span> Jeda
        </div>
        <div className="font-mono text-[11px] text-cyan-400/80">
          Kurikulum Standard Sekolah Menengah (KSSM) Tingkatan 1
        </div>
      </div>

    </div>
  );
};
