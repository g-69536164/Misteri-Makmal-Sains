import React, { useState } from 'react';
import { SCIENTIFIC_STEPS_INFO } from '../data/scientificMethodData';
import { Station, Achievement } from '../types/game';
import { sounds } from '../audio/soundManager';

interface JournalModalProps {
  stations: Station[];
  achievements: Achievement[];
  onClose: () => void;
}

export const JournalModal: React.FC<JournalModalProps> = ({
  stations,
  achievements,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'steps' | 'safety' | 'units' | 'achievements'>('steps');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔬</span>
            <div>
              <h2 className="text-base font-bold text-slate-100">Jurnal Saintifik Makmal Alpha</h2>
              <p className="text-xs text-slate-400">Panduan Lengkap Kaedah Saintifik Sains Tingkatan 1 KSSM</p>
            </div>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 pt-3 border-b border-slate-800 bg-slate-950/40 text-xs">
          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('steps');
            }}
            className={`pb-2.5 px-3 font-medium transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'steps'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            8 Langkah Penyiasatan
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('safety');
            }}
            className={`pb-2.5 px-3 font-medium transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'safety'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Simbol & Radas Makmal
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('units');
            }}
            className={`pb-2.5 px-3 font-medium transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'units'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Unit Asas SI & Kuantiti
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('achievements');
            }}
            className={`pb-2.5 px-3 font-medium transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'achievements'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Lencana ({achievements.filter(a => a.unlocked).length}/{achievements.length})
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
          
          {/* TAB 1: 8 Steps */}
          {activeTab === 'steps' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400 mb-2">
                Penyiasatan saintifik mengikut KSSM melibatkan 8 langkah tersusun berikut. Setiap stesen di makmal menguji penguasaan anda:
              </p>
              {SCIENTIFIC_STEPS_INFO.map(step => {
                const matchedStation = stations.find(s => s.stepNumber === step.step);
                const isCompleted = matchedStation?.isCompleted;

                return (
                  <div
                    key={step.step}
                    className={`p-4 rounded-xl border transition-all ${
                      isCompleted
                        ? 'bg-emerald-950/20 border-emerald-500/40'
                        : 'bg-slate-950/60 border-slate-800'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center font-mono font-bold text-xs ${
                          isCompleted ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                        }`}>
                          {step.step}
                        </span>
                        <h4 className="font-semibold text-slate-200 text-sm">{step.name}</h4>
                      </div>
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                        isCompleted ? 'text-emerald-400 bg-emerald-950/40' : 'text-slate-500 bg-slate-900'
                      }`}>
                        {isCompleted ? '✓ Telah Dikuasai' : 'Belum Selesai'}
                      </span>
                    </div>

                    <p className="text-slate-400 text-xs mb-2.5">{step.shortDesc}</p>

                    <ul className="space-y-1 text-slate-300 text-xs pl-4 list-disc marker:text-cyan-500">
                      {step.kssmKeyPoints.map((point, idx) => (
                        <li key={idx}>{point}</li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 2: Safety & Apparatus */}
          {activeTab === 'safety' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-cyan-300 mb-2">6 Simbol Amaran Keselamatan Makmal KSSM</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
                    <div className="font-semibold text-amber-400 flex items-center gap-2">
                      <span>💥</span> Mudah Meletup (Explosive)
                    </div>
                    <p className="text-xs text-slate-300">Bahan yang meletup apabila dipanaskan, dihentak, atau bercampur. Contoh: Gas hidrogen dan campuran udara, kalium.</p>
                  </div>

                  <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
                    <div className="font-semibold text-red-400 flex items-center gap-2">
                      <span>🔥</span> Mudah Terbakar (Flammable)
                    </div>
                    <p className="text-xs text-slate-300">Bahan yang mudah meruap dan terbakar jika berhampiran api. Jauhkan daripada penunu Bunsen! Contoh: Alkohol, aseton, petrol.</p>
                  </div>

                  <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
                    <div className="font-semibold text-yellow-400 flex items-center gap-2">
                      <span>🧪</span> Mengakis (Corrosive)
                    </div>
                    <p className="text-xs text-slate-300">Boleh melecurkan kulit dan merosakkan tisu serta permukaan. Bilas segera dengan air. Contoh: Asid hidroklorik pekat, asid sulfurik pekat, natrium hidroksida.</p>
                  </div>

                  <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
                    <div className="font-semibold text-purple-400 flex items-center gap-2">
                      <span>☠️</span> Beracun / Toksik (Toxic)
                    </div>
                    <p className="text-xs text-slate-300">Menyebabkan keracunan serius atau kematian jika dihidu, ditelan, atau diserap. Contoh: Merkuri, plumbum, sianida.</p>
                  </div>

                  <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
                    <div className="font-semibold text-blue-400 flex items-center gap-2">
                      <span>⚠️</span> Merengsa (Irritant)
                    </div>
                    <p className="text-xs text-slate-300">Menyebabkan kerengsaan pada mata, hidung, tekak, atau kulit. Gunakan dalam kebuk wasap. Contoh: Gas ammonia, kloroform.</p>
                  </div>

                  <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
                    <div className="font-semibold text-emerald-400 flex items-center gap-2">
                      <span>☢️</span> Radioaktif (Radioactive)
                    </div>
                    <p className="text-xs text-slate-300">Mengeluarkan sinaran radioaktif berbahaya (alfa, beta, gama). Disimpan dalam bekas plumbum tebal. Contoh: Uranium, radium.</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-cyan-300 mb-2">Radas Makmal Penting</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                    <span className="font-semibold text-slate-200">Buret:</span> Menyukat isipadu cecair dengan sangat jitu (kejituan 0.1 cm³).
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                    <span className="font-semibold text-slate-200">Pipet:</span> Menyukat isipadu cecair tetap yang tepat (cth. tepat 25 ml).
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                    <span className="font-semibold text-slate-200">Silinder Penyukat:</span> Menyukat isipadu cecair biasa dengan senggatan skala.
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                    <span className="font-semibold text-slate-200">Neraca Tiga Palang:</span> Mengukur jisim bahan secara tepat dengan unit gram.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SI Units */}
          {activeTab === 'units' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">
                Sains KSSM Tingkatan 1 menggunakan Sistem Unit Antarabangsa (SI) bagi memastikan ukuran seragam di seluruh dunia:
              </p>
              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 font-mono border-b border-slate-800">
                    <tr>
                      <th className="py-2.5 px-4 font-semibold">Kuantiti Asas</th>
                      <th className="py-2.5 px-4 font-semibold">Unit SI</th>
                      <th className="py-2.5 px-4 font-semibold">Simbol Unit</th>
                      <th className="py-2.5 px-4 font-semibold">Alat Pengukuran Makmal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    <tr className="hover:bg-slate-800/30">
                      <td className="py-2.5 px-4 font-medium text-slate-100">Panjang</td>
                      <td className="py-2.5 px-4">meter</td>
                      <td className="py-2.5 px-4 font-mono text-cyan-400">m</td>
                      <td className="py-2.5 px-4">Pembaris meter, pita pengukur, angkup vernier</td>
                    </tr>
                    <tr className="hover:bg-slate-800/30">
                      <td className="py-2.5 px-4 font-medium text-slate-100">Jisim</td>
                      <td className="py-2.5 px-4">kilogram</td>
                      <td className="py-2.5 px-4 font-mono text-cyan-400">kg</td>
                      <td className="py-2.5 px-4">Neraca tiga palang, neraca tuas, neraca digital</td>
                    </tr>
                    <tr className="hover:bg-slate-800/30">
                      <td className="py-2.5 px-4 font-medium text-slate-100">Masa</td>
                      <td className="py-2.5 px-4">saat</td>
                      <td className="py-2.5 px-4 font-mono text-cyan-400">s</td>
                      <td className="py-2.5 px-4">Jam randik mekanikal / digital</td>
                    </tr>
                    <tr className="hover:bg-slate-800/30">
                      <td className="py-2.5 px-4 font-medium text-slate-100">Suhu</td>
                      <td className="py-2.5 px-4">kelvin</td>
                      <td className="py-2.5 px-4 font-mono text-cyan-400">K</td>
                      <td className="py-2.5 px-4">Termometer makmal (°C ditukar ke Kelvin)</td>
                    </tr>
                    <tr className="hover:bg-slate-800/30">
                      <td className="py-2.5 px-4 font-medium text-slate-100">Arus Elektrik</td>
                      <td className="py-2.5 px-4">ampere</td>
                      <td className="py-2.5 px-4 font-mono text-cyan-400">A</td>
                      <td className="py-2.5 px-4">Ammeter</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: Achievements */}
          {activeTab === 'achievements' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {achievements.map(ach => (
                  <div
                    key={ach.id}
                    className={`p-3.5 rounded-xl border flex items-center gap-3 transition-colors ${
                      ach.unlocked
                        ? 'bg-amber-950/20 border-amber-500/40'
                        : 'bg-slate-950/50 border-slate-800 opacity-60'
                    }`}
                  >
                    <span className="text-2xl">{ach.icon}</span>
                    <div className="flex-1">
                      <div className="font-semibold text-slate-200 text-xs sm:text-sm">
                        {ach.name}
                      </div>
                      <div className="text-xs text-slate-400">{ach.description}</div>
                    </div>
                    {ach.unlocked && (
                      <span className="text-amber-400 text-xs font-bold">✓</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex justify-end shrink-0">
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="px-5 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors"
          >
            Tutup Jurnal & Teruskan Meneroka
          </button>
        </div>

      </div>
    </div>
  );
};
