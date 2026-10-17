import React from 'react';
import { GameStats, Achievement } from '../types/game';
import { sounds } from '../audio/soundManager';

interface VictoryScreenProps {
  stats: GameStats;
  achievements: Achievement[];
  onRestart: () => void;
  onOpenJournal: () => void;
}

export const VictoryScreen: React.FC<VictoryScreenProps> = ({
  stats,
  achievements,
  onRestart,
  onOpenJournal,
}) => {
  const totalSeconds = stats.endTime ? Math.floor((stats.endTime - stats.startTime) / 1000) : 0;
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  const timeFormatted = `${mins} minit ${secs} saat`;

  const accuracy = Math.round((stats.correctCount / Math.max(1, stats.attemptsCount)) * 100);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 flex flex-col items-center justify-center p-4 md:p-8 select-none">
      
      {/* Background Graphic */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/lab_mystery_backdrop_1792246023506.jpg"
          alt="Makmal Alpha Selesai"
          className="w-full h-full object-cover filter brightness-30 contrast-125"
        />
        <div className="absolute inset-0 bg-slate-950/85" />
      </div>

      {/* Main Victory Card */}
      <div className="relative z-10 w-full max-w-xl bg-slate-900/90 border border-cyan-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-cyan-950/50 backdrop-blur-md text-center space-y-6 animate-in zoom-in-95 duration-300">
        
        {/* Achievement Badge Crest */}
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 mx-auto">
          <img
            src="/src/assets/images/lab_badge_master_scientist_1792246022936.jpg"
            alt="Lencana Saintis Kanan"
            className="w-full h-full object-contain rounded-2xl drop-shadow-[0_0_25px_rgba(56,189,248,0.5)] border-2 border-cyan-400/60"
          />
        </div>

        {/* Victory Headline */}
        <div className="space-y-1.5">
          <div className="text-xs font-mono tracking-widest text-cyan-400 uppercase">
            Misi Selesai · Teras Makmal Alpha Aktif
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            TAHNIAH, SAINTIS MUDA!
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm max-w-md mx-auto">
            Anda telah berjaya menyelesaikan kesemua 8 langkah kaedah saintifik Sains Tingkatan 1 KSSM dan menyelamatkan makmal penyelidikan!
          </p>
        </div>

        {/* Performance Statistics Grid */}
        <div className="grid grid-cols-3 gap-3 p-4 bg-slate-950/70 border border-slate-800 rounded-2xl">
          <div className="space-y-0.5">
            <div className="text-[11px] text-slate-400">Jumlah Skor</div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-cyan-300 tabular-nums">
              {stats.score}
            </div>
          </div>

          <div className="space-y-0.5 border-x border-slate-800">
            <div className="text-[11px] text-slate-400">Masa Operasi</div>
            <div className="text-base sm:text-lg font-bold font-mono text-amber-300 tabular-nums">
              {timeFormatted}
            </div>
          </div>

          <div className="space-y-0.5">
            <div className="text-[11px] text-slate-400">Ketepatan</div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-300 tabular-nums">
              {accuracy}%
            </div>
          </div>
        </div>

        {/* 8 Steps Completed Checklist Strip */}
        <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800/80 text-left space-y-2">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Penguasaan 8 Langkah Kaedah Saintifik:
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-300">
            <span>✓ 1. Mengenal Pasti Masalah</span>
            <span>✓ 5. Menjalankan Eksperimen</span>
            <span>✓ 2. Membina Hipotesis</span>
            <span>✓ 6. Mengumpul Data</span>
            <span>✓ 3. Mengawal Pemboleh Ubah</span>
            <span>✓ 7. Menganalisis Data</span>
            <span>✓ 4. Merancang Eksperimen</span>
            <span>✓ 8. Membuat Kesimpulan</span>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={() => {
              sounds.playClick();
              onRestart();
            }}
            className="w-full sm:flex-1 py-3 px-5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl text-sm transition-all hover:scale-[1.02] shadow-lg shadow-cyan-950/40"
          >
            Main Semula
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              onOpenJournal();
            }}
            className="w-full sm:flex-1 py-3 px-5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold rounded-xl text-sm transition-colors"
          >
            Ulang Kaji Jurnal Sains
          </button>
        </div>

      </div>

    </div>
  );
};
