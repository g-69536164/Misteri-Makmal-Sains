import React, { useState, useEffect, useCallback } from 'react';
import {
  GameScreen,
  PlayerPosition,
  Station,
  ClueTerminal,
  GameStats,
  Achievement,
} from './types/game';
import {
  INITIAL_STATIONS,
  CLUE_TERMINALS,
  PUZZLES_DATA,
  INITIAL_ACHIEVEMENTS,
} from './data/scientificMethodData';
import { sounds } from './audio/soundManager';
import { LabCanvas } from './components/LabCanvas';
import { HUD } from './components/HUD';
import { PuzzleModal } from './components/PuzzleModal';
import { ClueModal } from './components/ClueModal';
import { JournalModal } from './components/JournalModal';
import { TitleScreen } from './components/TitleScreen';
import { PauseModal } from './components/PauseModal';
import { VictoryScreen } from './components/VictoryScreen';
import { VirtualControls } from './components/VirtualControls';

export default function App() {
  const [screen, setScreen] = useState<GameScreen>('TITLE');
  const [isMuted, setIsMuted] = useState<boolean>(sounds.getMuted());
  
  // Game map elements state
  const [stations, setStations] = useState<Station[]>(INITIAL_STATIONS);
  const [clues, setClues] = useState<ClueTerminal[]>(CLUE_TERMINALS);
  const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);

  // Player state
  const [player, setPlayer] = useState<PlayerPosition>({
    x: 80,
    y: 190,
    vx: 0,
    vy: 0,
    direction: 'right',
    isMoving: false,
  });

  // Active interaction modals
  const [activeStation, setActiveStation] = useState<Station | null>(null);
  const [activeClue, setActiveClue] = useState<ClueTerminal | null>(null);
  const [isJournalOpen, setIsJournalOpen] = useState<boolean>(false);
  const [activePrompt, setActivePrompt] = useState<string | null>(null);

  // Game Statistics
  const [stats, setStats] = useState<GameStats>({
    score: 0,
    stepsCompleted: 0,
    startTime: Date.now(),
    endTime: null,
    attemptsCount: 0,
    correctCount: 0,
  });

  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  // Timer loop while playing
  useEffect(() => {
    let interval: number | null = null;
    if (screen === 'PLAYING' && !activeStation && !activeClue && !isJournalOpen) {
      interval = window.setInterval(() => {
        setElapsedSeconds(s => s + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [screen, activeStation, activeClue, isJournalOpen]);

  // Global keyboard shortcuts (J for Journal, Esc for Pause)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'KeyJ' && screen === 'PLAYING' && !activeStation && !activeClue) {
        e.preventDefault();
        sounds.playClick();
        setIsJournalOpen(prev => !prev);
      } else if (e.code === 'Escape') {
        if (activeStation) {
          setActiveStation(null);
        } else if (activeClue) {
          setActiveClue(null);
        } else if (isJournalOpen) {
          setIsJournalOpen(false);
        } else if (screen === 'PLAYING') {
          setScreen('PAUSED');
        } else if (screen === 'PAUSED') {
          setScreen('PLAYING');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [screen, activeStation, activeClue, isJournalOpen]);

  // Audio mute toggle
  const handleToggleMute = () => {
    const newMuted = sounds.toggleMute();
    setIsMuted(newMuted);
  };

  // Start game from title
  const handleStartGame = () => {
    sounds.startAmbientHum();
    setStats({
      score: 0,
      stepsCompleted: 0,
      startTime: Date.now(),
      endTime: null,
      attemptsCount: 0,
      correctCount: 0,
    });
    setElapsedSeconds(0);
    setScreen('PLAYING');
  };

  // Restart game
  const handleRestart = () => {
    setStations(INITIAL_STATIONS);
    setClues(CLUE_TERMINALS);
    setAchievements(INITIAL_ACHIEVEMENTS);
    setPlayer({
      x: 80,
      y: 190,
      vx: 0,
      vy: 0,
      direction: 'right',
      isMoving: false,
    });
    setActiveStation(null);
    setActiveClue(null);
    setIsJournalOpen(false);
    setActivePrompt(null);
    handleStartGame();
  };

  // Interact with station
  const handleInteractStation = (station: Station) => {
    if (!station.isUnlocked && !station.isCompleted) {
      sounds.playError();
      return;
    }
    sounds.playOpenTerminal();
    setActiveStation(station);
  };

  // Interact with clue
  const handleInteractClue = (clue: ClueTerminal) => {
    sounds.playOpenTerminal();
    // Mark clue as read
    setClues(prev => prev.map(c => c.id === clue.id ? { ...c, isRead: true } : c));
    setActiveClue(clue);
  };

  // Trigger interaction from keyboard (E or Space) or Virtual button
  const handleOpenActivePrompt = useCallback(() => {
    if (activeStation || activeClue || isJournalOpen || screen !== 'PLAYING') return;

    // Check closest station within reach
    let closestStation: Station | null = null;
    let closestClue: ClueTerminal | null = null;
    let minDist = 65;

    for (const st of stations) {
      const cx = st.x + st.width / 2;
      const cy = st.y + st.height / 2;
      const dist = Math.hypot(player.x - cx, player.y - cy);
      if (dist < minDist) {
        minDist = dist;
        closestStation = st;
      }
    }

    for (const cl of clues) {
      const dist = Math.hypot(player.x - cl.x, player.y - cl.y);
      if (dist < minDist) {
        minDist = dist;
        closestStation = null;
        closestClue = cl;
      }
    }

    if (closestStation && (closestStation.isUnlocked || closestStation.isCompleted)) {
      handleInteractStation(closestStation);
    } else if (closestClue) {
      handleInteractClue(closestClue);
    }
  }, [activeStation, activeClue, isJournalOpen, screen, stations, clues, player]);

  // Solve a station puzzle
  const handleSolveStation = (stationId: string, attempts: number) => {
    const stationIndex = stations.findIndex(s => s.id === stationId);
    if (stationIndex === -1) return;

    const currentStation = stations[stationIndex];
    const isFirstTime = !currentStation.isCompleted;

    // Points calculation
    const baseScore = 150;
    const penalty = Math.max(0, (attempts - 1) * 25);
    const addedScore = Math.max(50, baseScore - penalty);

    setStats(prev => ({
      ...prev,
      score: prev.score + (isFirstTime ? addedScore : 20),
      stepsCompleted: isFirstTime ? prev.stepsCompleted + 1 : prev.stepsCompleted,
      attemptsCount: prev.attemptsCount + attempts,
      correctCount: prev.correctCount + 1,
    }));

    // Unlock next station and mark current as completed
    setStations(prev => {
      return prev.map((st, idx) => {
        if (st.id === stationId) {
          return { ...st, isCompleted: true };
        }
        // Unlock next station in sequence
        if (idx === stationIndex + 1) {
          return { ...st, isUnlocked: true };
        }
        return st;
      });
    });

    // Check Achievements
    setAchievements(prev => {
      return prev.map(ach => {
        if (ach.id === 'first-step' && currentStation.stepNumber === 1) {
          return { ...ach, unlocked: true };
        }
        if (ach.id === 'variable-master' && currentStation.stepNumber === 3 && attempts === 1) {
          return { ...ach, unlocked: true };
        }
        if (ach.id === 'lab-safety' && currentStation.stepNumber === 5) {
          return { ...ach, unlocked: true };
        }
        if (ach.id === 'meniscus-eye' && currentStation.stepNumber === 6 && attempts === 1) {
          return { ...ach, unlocked: true };
        }
        if (ach.id === 'master-scientist' && currentStation.stepNumber === 8) {
          return { ...ach, unlocked: true };
        }
        return ach;
      });
    });

    // Close puzzle modal
    setActiveStation(null);

    // If last station completed, show victory!
    if (currentStation.stepNumber === 8) {
      setTimeout(() => {
        sounds.playVictoryFanfare();
        setStats(prev => ({ ...prev, endTime: Date.now() }));
        setScreen('VICTORY');
      }, 800);
    }
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans select-none">
      
      {/* 1. Title Screen */}
      {screen === 'TITLE' && (
        <TitleScreen
          onStartGame={handleStartGame}
          onOpenJournal={() => setIsJournalOpen(true)}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
        />
      )}

      {/* 2. Active Playing Screen */}
      {(screen === 'PLAYING' || screen === 'PAUSED') && (
        <div className="relative w-full h-full">
          {/* Main 60fps Interactive 2D Canvas Exploration View */}
          <LabCanvas
            player={player}
            setPlayer={setPlayer}
            stations={stations}
            clues={clues}
            onInteractStation={handleInteractStation}
            onInteractClue={handleInteractClue}
            activePrompt={activePrompt}
            setActivePrompt={setActivePrompt}
            onOpenStationPrompt={handleOpenActivePrompt}
          />

          {/* Heads Up Display (HUD) */}
          <HUD
            stations={stations}
            stats={stats}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
            onOpenJournal={() => setIsJournalOpen(true)}
            onPause={() => setScreen('PAUSED')}
            elapsedSeconds={elapsedSeconds}
          />

          {/* Mobile Touch Virtual Controls */}
          <VirtualControls
            setPlayer={setPlayer}
            onAction={handleOpenActivePrompt}
            onOpenJournal={() => setIsJournalOpen(true)}
          />
        </div>
      )}

      {/* 3. Station Puzzle Modal */}
      {activeStation && (
        <PuzzleModal
          station={activeStation}
          puzzle={PUZZLES_DATA[activeStation.id]}
          onSolve={handleSolveStation}
          onClose={() => setActiveStation(null)}
        />
      )}

      {/* 4. Researcher Clue / Audio Log Modal */}
      {activeClue && (
        <ClueModal
          clue={activeClue}
          onClose={() => setActiveClue(null)}
        />
      )}

      {/* 5. Detective Scientific Journal & KSSM Revision Modal */}
      {isJournalOpen && (
        <JournalModal
          stations={stations}
          achievements={achievements}
          onClose={() => setIsJournalOpen(false)}
        />
      )}

      {/* 6. Pause Modal */}
      {screen === 'PAUSED' && (
        <PauseModal
          onResume={() => setScreen('PLAYING')}
          onOpenJournal={() => {
            setScreen('PLAYING');
            setIsJournalOpen(true);
          }}
          onRestart={handleRestart}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
        />
      )}

      {/* 7. Victory Screen */}
      {screen === 'VICTORY' && (
        <VictoryScreen
          stats={stats}
          achievements={achievements}
          onRestart={handleRestart}
          onOpenJournal={() => setIsJournalOpen(true)}
        />
      )}

    </main>
  );
}
