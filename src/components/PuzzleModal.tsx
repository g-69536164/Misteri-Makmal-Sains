import React, { useState } from 'react';
import { QuizPuzzle, Station } from '../types/game';
import { sounds } from '../audio/soundManager';

interface PuzzleModalProps {
  station: Station;
  puzzle: QuizPuzzle;
  onSolve: (stationId: string, attempts: number) => void;
  onClose: () => void;
}

export const PuzzleModal: React.FC<PuzzleModalProps> = ({
  station,
  puzzle,
  onSolve,
  onClose,
}) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [hypoPart1, setHypoPart1] = useState<string>('');
  const [hypoPart2, setHypoPart2] = useState<string>('');
  const [variableMap, setVariableMap] = useState<Record<string, 'manipulasi' | 'bergerakbalas' | 'dimalarkan' | ''>>({});
  const [meniscusGuess, setMeniscusGuess] = useState<number>(40);
  const [attempts, setAttempts] = useState<number>(1);
  const [feedback, setFeedback] = useState<{ isSuccess: boolean; message: string } | null>(null);

  const handleOptionSelect = (id: string) => {
    setSelectedOptionId(id);
    sounds.playClick();
  };

  const handleVariableChange = (varId: string, category: 'manipulasi' | 'bergerakbalas' | 'dimalarkan') => {
    setVariableMap(prev => ({ ...prev, [varId]: category }));
    sounds.playClick();
  };

  const handleVerify = () => {
    // 1. Single Choice
    if (puzzle.puzzleType === 'single_choice') {
      if (!selectedOptionId) {
        setFeedback({ isSuccess: false, message: 'Sila pilih satu jawapan dahulu.' });
        sounds.playError();
        return;
      }

      const chosen = puzzle.options?.find(o => o.id === selectedOptionId);
      if (chosen?.isCorrect) {
        sounds.playSuccess();
        sounds.playUnlockStation();
        setFeedback({ isSuccess: true, message: chosen.feedback || puzzle.explanationOnCorrect });
        setTimeout(() => {
          onSolve(station.id, attempts);
        }, 1200);
      } else {
        sounds.playError();
        setAttempts(a => a + 1);
        setFeedback({ isSuccess: false, message: chosen?.feedback || 'Jawapan kurang tepat. Cuba teliti semula konsep sains KSSM!' });
      }
      return;
    }

    // 2. Hypothesis Builder
    if (puzzle.puzzleType === 'hypothesis_builder' && puzzle.hypothesisData) {
      if (!hypoPart1 || !hypoPart2) {
        setFeedback({ isSuccess: false, message: 'Sila lengkapkan kedua-dua bahagian hipotesis.' });
        sounds.playError();
        return;
      }

      const isPart1Correct = hypoPart1 === puzzle.hypothesisData.correctPart1;
      const isPart2Correct = hypoPart2 === puzzle.hypothesisData.correctPart2;

      if (isPart1Correct && isPart2Correct) {
        sounds.playSuccess();
        sounds.playUnlockStation();
        setFeedback({ isSuccess: true, message: puzzle.explanationOnCorrect });
        setTimeout(() => {
          onSolve(station.id, attempts);
        }, 1200);
      } else {
        sounds.playError();
        setAttempts(a => a + 1);
        setFeedback({
          isSuccess: false,
          message: 'Hipotesis ini belum tepat. Ingat: Hubungkan pemboleh ubah dimanipulasikan (panjang tali) dengan pemboleh ubah bergerak balas (tempoh ayunan).',
        });
      }
      return;
    }

    // 3. Variable Sorter
    if (puzzle.puzzleType === 'variable_sorter' && puzzle.variables) {
      const allSelected = puzzle.variables.every(v => !!variableMap[v.id]);
      if (!allSelected) {
        setFeedback({ isSuccess: false, message: 'Sila kelaskan ketiga-tiga pemboleh ubah di atas.' });
        sounds.playError();
        return;
      }

      const allCorrect = puzzle.variables.every(v => variableMap[v.id] === v.category);

      if (allCorrect) {
        sounds.playSuccess();
        sounds.playUnlockStation();
        setFeedback({ isSuccess: true, message: puzzle.explanationOnCorrect });
        setTimeout(() => {
          onSolve(station.id, attempts);
        }, 1200);
      } else {
        sounds.playError();
        setAttempts(a => a + 1);
        setFeedback({
          isSuccess: false,
          message: 'Pengelasan belum tepat. Ingat: Dimanipulasi = apa yang sengaja diubah, Bergerak balas = apa yang diukur hasilnya, Dimalarkan = apa yang dikekalkan tetap.',
        });
      }
      return;
    }

    // 4. Meniscus Reading
    if (puzzle.puzzleType === 'meniscus_reading' && puzzle.meniscusData) {
      const correctVal = puzzle.meniscusData.correctVolume;
      const tolerance = puzzle.meniscusData.tolerance;
      const diff = Math.abs(meniscusGuess - correctVal);

      if (diff <= tolerance) {
        sounds.playSuccess();
        sounds.playUnlockStation();
        setFeedback({ isSuccess: true, message: puzzle.explanationOnCorrect });
        setTimeout(() => {
          onSolve(station.id, attempts);
        }, 1200);
      } else {
        sounds.playError();
        setAttempts(a => a + 1);
        const hint = meniscusGuess < correctVal ? 'terlalu rendah' : 'terlalu tinggi';
        setFeedback({
          isSuccess: false,
          message: `Bacaan anda (${meniscusGuess} ml) ${hint}. Baca pada titik paling bawah keluk meniskus air, tepat selari dengan aras mata.`,
        });
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse" />
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <span>{puzzle.title}</span>
                {station.isCompleted && (
                  <span className="text-emerald-400 text-xs font-semibold">✓ Diselesaikan</span>
                )}
              </h2>
              <p className="text-xs text-slate-400">{puzzle.subTitle}</p>
            </div>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors text-sm"
            aria-label="Tutup"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-sm">
          
          {/* Scenario Box */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-300 leading-relaxed">
            <div className="text-xs font-semibold text-cyan-400 mb-1 tracking-wider uppercase">
              Situasi Eksperimen Makmal Alpha
            </div>
            {puzzle.scenario}
          </div>

          {/* Interactive Component based on type */}

          {/* 1. Single Choice Puzzle */}
          {puzzle.puzzleType === 'single_choice' && puzzle.options && (
            <div className="space-y-2.5">
              <label className="text-xs font-semibold text-slate-400">Pilih penyelesaian yang paling tepat:</label>
              {puzzle.options.map(option => {
                const isSelected = selectedOptionId === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => handleOptionSelect(option.id)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all text-xs sm:text-sm flex items-start gap-3 ${
                      isSelected
                        ? 'border-cyan-400 bg-cyan-950/30 text-cyan-100 ring-1 ring-cyan-400/50'
                        : 'border-slate-800 bg-slate-950/40 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full border mt-0.5 shrink-0 flex items-center justify-center text-[10px] ${
                      isSelected ? 'border-cyan-400 bg-cyan-500 text-slate-950 font-bold' : 'border-slate-600'
                    }`}>
                      {isSelected ? '✓' : ''}
                    </span>
                    <span className="flex-1 leading-snug">{option.text}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* 2. Hypothesis Builder */}
          {puzzle.puzzleType === 'hypothesis_builder' && puzzle.hypothesisData && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400">Bahagian 1: Hubungan Pemboleh Ubah Dimanipulasikan (PM)</label>
                <div className="grid grid-cols-1 gap-2">
                  {puzzle.hypothesisData.part1Options.map(opt => (
                    <button
                      key={opt}
                      onClick={() => {
                        setHypoPart1(opt);
                        sounds.playClick();
                      }}
                      className={`text-left p-3 rounded-xl border text-xs transition-colors ${
                        hypoPart1 === opt
                          ? 'border-indigo-400 bg-indigo-950/40 text-indigo-200'
                          : 'border-slate-800 bg-slate-950/40 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400">Bahagian 2: Hubungan Pemboleh Ubah Bergerak Balas (PB)</label>
                <div className="grid grid-cols-1 gap-2">
                  {puzzle.hypothesisData.part2Options.map(opt => (
                    <button
                      key={opt}
                      onClick={() => {
                        setHypoPart2(opt);
                        sounds.playClick();
                      }}
                      className={`text-left p-3 rounded-xl border text-xs transition-colors ${
                        hypoPart2 === opt
                          ? 'border-indigo-400 bg-indigo-950/40 text-indigo-200'
                          : 'border-slate-800 bg-slate-950/40 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview sentence */}
              <div className="p-3 rounded-xl bg-slate-950 border border-indigo-900/40 text-xs">
                <span className="text-indigo-400 font-semibold block mb-1">Pratonton Hipotesis Lengkap:</span>
                <span className="text-slate-200 font-medium italic">
                  "{hypoPart1 || '[Pilih Bahagian 1]'} {hypoPart2 || '[Pilih Bahagian 2]'}"
                </span>
              </div>
            </div>
          )}

          {/* 3. Variable Sorter */}
          {puzzle.puzzleType === 'variable_sorter' && puzzle.variables && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">Tentukan jenis pemboleh ubah bagi setiap parameter penyiasatan:</p>
              {puzzle.variables.map(item => (
                <div key={item.id} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <div className="text-xs font-medium text-slate-200">{item.label}</div>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleVariableChange(item.id, 'manipulasi')}
                      className={`py-1.5 px-2 rounded-lg text-xs font-medium border text-center transition-colors ${
                        variableMap[item.id] === 'manipulasi'
                          ? 'bg-purple-900/50 border-purple-400 text-purple-200'
                          : 'border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                      }`}
                    >
                      Dimanipulasikan
                    </button>
                    <button
                      onClick={() => handleVariableChange(item.id, 'bergerakbalas')}
                      className={`py-1.5 px-2 rounded-lg text-xs font-medium border text-center transition-colors ${
                        variableMap[item.id] === 'bergerakbalas'
                          ? 'bg-purple-900/50 border-purple-400 text-purple-200'
                          : 'border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                      }`}
                    >
                      Bergerak Balas
                    </button>
                    <button
                      onClick={() => handleVariableChange(item.id, 'dimalarkan')}
                      className={`py-1.5 px-2 rounded-lg text-xs font-medium border text-center transition-colors ${
                        variableMap[item.id] === 'dimalarkan'
                          ? 'bg-purple-900/50 border-purple-400 text-purple-200'
                          : 'border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                      }`}
                    >
                      Dimalarkan
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 4. Meniscus Reading Interactive Simulator */}
          {puzzle.puzzleType === 'meniscus_reading' && puzzle.meniscusData && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col md:flex-row items-center gap-6 justify-center">
                
                {/* SVG Measuring Cylinder Graphic */}
                <div className="relative w-36 h-60 bg-slate-900/80 rounded-b-xl border-x-2 border-b-2 border-slate-600 flex items-center justify-center p-2">
                  <svg viewBox="0 0 100 200" className="w-full h-full">
                    {/* Scale markings */}
                    {[50, 45, 40, 35, 30].map(val => {
                      const yPos = 200 - (val - 25) * 6.5;
                      return (
                        <g key={val}>
                          <line x1="20" y1={yPos} x2="35" y2={yPos} stroke="#94a3b8" strokeWidth="1.5" />
                          <text x="8" y={yPos + 4} fill="#94a3b8" fontSize="10" fontFamily="monospace">
                            {val}
                          </text>
                        </g>
                      );
                    })}

                    {/* Intermediate 1ml tick lines */}
                    {[41, 42, 43, 44, 46, 47, 48, 49].map(val => {
                      const yPos = 200 - (val - 25) * 6.5;
                      return (
                        <line key={val} x1="20" y1={yPos} x2="28" y2={yPos} stroke="#64748b" strokeWidth="1" />
                      );
                    })}

                    {/* Liquid Body (Water concave meniscus at 42ml) */}
                    <path
                      d="M 20 89.5 C 50 93.5, 70 93.5, 90 89.5 L 90 195 L 20 195 Z"
                      fill="rgba(56, 189, 248, 0.35)"
                      stroke="#38bdf8"
                      strokeWidth="1.5"
                    />

                    {/* Meniscus bottom line highlight */}
                    <line x1="20" y1="91" x2="90" y2="91" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="2,2" />

                    {/* Eye level indicator line based on guess */}
                    <g transform={`translate(0, ${200 - (meniscusGuess - 25) * 6.5})`}>
                      <line x1="15" y1="0" x2="95" y2="0" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3,3" />
                      <text x="96" y="3" fill="#f59e0b" fontSize="8" fontFamily="monospace">Aras Mata</text>
                    </g>
                  </svg>
                </div>

                {/* Slider and Manual Input Controls */}
                <div className="flex-1 space-y-3 w-full">
                  <div className="text-xs text-slate-300">
                    {puzzle.meniscusData.description}
                  </div>

                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Laraskan Aras Pandangan Mata:</span>
                      <span className="text-cyan-300 font-mono font-bold text-base">{meniscusGuess.toFixed(1)} ml</span>
                    </div>

                    <input
                      type="range"
                      min={38}
                      max={46}
                      step={0.5}
                      value={meniscusGuess}
                      onChange={e => {
                        setMeniscusGuess(parseFloat(e.target.value));
                        sounds.playClick();
                      }}
                      className="w-full accent-cyan-400 cursor-pointer"
                    />

                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                      <span>38.0 ml</span>
                      <span>42.0 ml (Sasaran)</span>
                      <span>46.0 ml</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-amber-300/80 bg-amber-950/20 p-2.5 rounded-lg border border-amber-900/30">
                    💡 Petua Sains KSSM: Kedudukan mata mestilah tepat selari dengan bahagian paling bawah meniskus air untuk mengelakkan ralat paralaks!
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Feedback message */}
          {feedback && (
            <div
              className={`p-3.5 rounded-xl border text-xs sm:text-sm leading-relaxed ${
                feedback.isSuccess
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                  : 'bg-red-950/40 border-red-500/50 text-red-200'
              }`}
            >
              <div className="font-semibold mb-0.5">
                {feedback.isSuccess ? '✓ Jawapan Disahkan Tepat!' : '⚠️ Semakan Diperlukan:'}
              </div>
              {feedback.message}
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-400">
            Percubaan: <span className="font-mono text-slate-200">{attempts}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                sounds.playClick();
                onClose();
              }}
              className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              Kembali Ke Makmal
            </button>
            <button
              onClick={handleVerify}
              className="px-5 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg shadow-md shadow-cyan-950/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Sahkan Jawapan Saintifik
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
