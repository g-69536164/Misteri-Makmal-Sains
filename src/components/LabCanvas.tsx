import React, { useRef, useEffect } from 'react';
import { PlayerPosition, Station, ClueTerminal } from '../types/game';
import { sounds } from '../audio/soundManager';

interface LabCanvasProps {
  player: PlayerPosition;
  setPlayer: React.Dispatch<React.SetStateAction<PlayerPosition>>;
  stations: Station[];
  clues: ClueTerminal[];
  onInteractStation: (station: Station) => void;
  onInteractClue: (clue: ClueTerminal) => void;
  activePrompt: string | null;
  setActivePrompt: (prompt: string | null) => void;
  onOpenStationPrompt: () => void;
}

interface LabParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
  wobbleSpeed: number;
  wobbleAmp: number;
  phase: number;
  colorType: 'dust' | 'cyan' | 'amber';
}

function createInitialParticles(count: number, width: number, height: number): LabParticle[] {
  const particles: LabParticle[] = [];
  for (let i = 0; i < count; i++) {
    const colorRoll = Math.random();
    const colorType: 'dust' | 'cyan' | 'amber' =
      colorRoll < 0.58 ? 'dust' : colorRoll < 0.88 ? 'cyan' : 'amber';

    particles.push({
      x: Math.random() * width,
      y: 50 + Math.random() * (height - 80),
      vx: (Math.random() - 0.25) * 10 + 3, // gentle eastward ventilation drift
      vy: (Math.random() - 0.5) * 8 - 2, // gentle thermal float
      radius: Math.random() * 1.5 + 0.6,
      baseAlpha: Math.random() * 0.35 + 0.15,
      wobbleSpeed: Math.random() * 2 + 1,
      wobbleAmp: Math.random() * 8 + 4,
      phase: Math.random() * Math.PI * 2,
      colorType,
    });
  }
  return particles;
}

export const LabCanvas: React.FC<LabCanvasProps> = ({
  player,
  setPlayer,
  stations,
  clues,
  onInteractStation,
  onInteractClue,
  activePrompt,
  setActivePrompt,
  onOpenStationPrompt,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const keysDown = useRef<{ [key: string]: boolean }>({});
  const lastTimeRef = useRef<number>(performance.now());
  const footstepCounter = useRef<number>(0);
  const animFrameId = useRef<number>(0);
  const pulsePhase = useRef<number>(0);
  const particlesRef = useRef<LabParticle[]>([]);

  // Lab Map boundary constants
  const MAP_WIDTH = 1120;
  const MAP_HEIGHT = 700;
  const PLAYER_SPEED = 240; // pixels per second
  const INTERACTION_DIST = 58;

  // Initialize particles once
  if (particlesRef.current.length === 0) {
    particlesRef.current = createInitialParticles(60, MAP_WIDTH, MAP_HEIGHT);
  }

  // Key tracking
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent scrolling on arrow keys or space
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'KeyW', 'KeyA', 'KeyS', 'KeyD', 'KeyE'].includes(e.code)) {
        if (e.target === document.body) {
          e.preventDefault();
        }
      }

      keysDown.current[e.code] = true;

      // Handle interaction key trigger (E or Space)
      if (e.code === 'KeyE' || e.code === 'Space') {
        onOpenStationPrompt();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysDown.current[e.code] = false;
    };

    const handleBlur = () => {
      keysDown.current = {};
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, [onOpenStationPrompt]);

  // Main 60fps Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let localPlayer = { ...player };

    const updateAndRender = (currentTime: number) => {
      const rawDt = (currentTime - lastTimeRef.current) / 1000;
      lastTimeRef.current = currentTime;
      const dt = Math.min(rawDt, 0.05); // clamp delta time for stability

      pulsePhase.current += dt * 3;

      // 1. Process movement inputs
      let dx = 0;
      let dy = 0;
      const keys = keysDown.current;

      if (keys['KeyW'] || keys['ArrowUp']) dy -= 1;
      if (keys['KeyS'] || keys['ArrowDown']) dy += 1;
      if (keys['KeyA'] || keys['ArrowLeft']) dx -= 1;
      if (keys['KeyD'] || keys['ArrowRight']) dx += 1;

      // Normalize diagonal movement
      if (dx !== 0 && dy !== 0) {
        dx *= 0.7071;
        dy *= 0.7071;
      }

      const isMoving = dx !== 0 || dy !== 0;

      if (isMoving) {
        let newDir: 'up' | 'down' | 'left' | 'right' = localPlayer.direction;
        if (Math.abs(dx) > Math.abs(dy)) {
          newDir = dx > 0 ? 'right' : 'left';
        } else {
          newDir = dy > 0 ? 'down' : 'up';
        }

        localPlayer.x += dx * PLAYER_SPEED * dt;
        localPlayer.y += dy * PLAYER_SPEED * dt;
        localPlayer.direction = newDir;
        localPlayer.isMoving = true;

        // Keep inside bounds
        localPlayer.x = Math.max(30, Math.min(MAP_WIDTH - 30, localPlayer.x));
        localPlayer.y = Math.max(60, Math.min(MAP_HEIGHT - 40, localPlayer.y));

        // Procedural footstep audio
        footstepCounter.current += dt;
        if (footstepCounter.current > 0.28) {
          sounds.playFootstep();
          footstepCounter.current = 0;
        }
      } else {
        localPlayer.isMoving = false;
        footstepCounter.current = 0.2; // primed for immediate step
      }

      // Check proximity to stations & clues
      let foundPrompt: string | null = null;
      let closestStation: Station | null = null;
      let closestClue: ClueTerminal | null = null;
      let minDist = INTERACTION_DIST;

      for (const st of stations) {
        const cx = st.x + st.width / 2;
        const cy = st.y + st.height / 2;
        const dist = Math.hypot(localPlayer.x - cx, localPlayer.y - cy);
        if (dist < minDist) {
          minDist = dist;
          closestStation = st;
        }
      }

      for (const cl of clues) {
        const dist = Math.hypot(localPlayer.x - cl.x, localPlayer.y - cl.y);
        if (dist < minDist) {
          minDist = dist;
          closestStation = null;
          closestClue = cl;
        }
      }

      if (closestStation) {
        if (closestStation.isCompleted) {
          foundPrompt = `[E/Space] Semak Semula: ${closestStation.name} (Selesai)`;
        } else if (closestStation.isUnlocked) {
          foundPrompt = `[E/Space] Akses: ${closestStation.name}`;
        } else {
          foundPrompt = `Terkunci: Selesaikan Langkah ${closestStation.stepNumber - 1} Dahulu`;
        }
      } else if (closestClue) {
        foundPrompt = `[E/Space] Baca ${closestClue.title}`;
      }

      if (foundPrompt !== activePrompt) {
        setActivePrompt(foundPrompt);
      }

      // Update floating laboratory dust and air current particles
      const particles = particlesRef.current;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        // Dynamic air currents: horizontal drift + sine wave turbulence
        const turbulence = Math.sin(p.phase + currentTime * 0.0015 * p.wobbleSpeed) * p.wobbleAmp;
        p.x += (p.vx + turbulence * 0.3) * dt;

        // Thermal convection draft near Sector 5 reactor (x > 880) and Sector 3 fume hood
        let vyEff = p.vy;
        if (p.x > 880) {
          vyEff -= 8; // upward thermal lift
        } else if (p.x < 150 && p.y > 380) {
          vyEff -= 4; // fume hood ventilation draw
        }
        p.y += vyEff * dt;

        // Screen boundary wraps
        if (p.x > MAP_WIDTH + 15) {
          p.x = 20;
          p.y = 50 + Math.random() * (MAP_HEIGHT - 80);
        } else if (p.x < 15) {
          p.x = MAP_WIDTH - 20;
          p.y = 50 + Math.random() * (MAP_HEIGHT - 80);
        }

        if (p.y < 45) {
          p.y = MAP_HEIGHT - 35;
          p.x = 20 + Math.random() * (MAP_WIDTH - 40);
        } else if (p.y > MAP_HEIGHT - 30) {
          p.y = 55;
          p.x = 20 + Math.random() * (MAP_WIDTH - 40);
        }
      }

      // 2. Render Lab Map & Visuals
      renderLab(ctx, localPlayer, stations, clues, pulsePhase.current, particles, currentTime);

      animFrameId.current = requestAnimationFrame(updateAndRender);
    };

    animFrameId.current = requestAnimationFrame(updateAndRender);

    return () => {
      cancelAnimationFrame(animFrameId.current);
    };
  }, [stations, clues, activePrompt, setActivePrompt]);

  // Click on canvas to move player / interact
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clickX = (e.clientX - rect.x) * scaleX;
    const clickY = (e.clientY - rect.y) * scaleY;

    // Check if clicked directly on a station or clue
    for (const st of stations) {
      if (
        clickX >= st.x &&
        clickX <= st.x + st.width &&
        clickY >= st.y &&
        clickY <= st.y + st.height
      ) {
        if (st.isUnlocked || st.isCompleted) {
          onInteractStation(st);
          return;
        }
      }
    }

    for (const cl of clues) {
      if (Math.hypot(clickX - cl.x, clickY - cl.y) < 32) {
        onInteractClue(cl);
        return;
      }
    }

    // Otherwise, move player closer to clicked spot
    setPlayer(prev => ({
      ...prev,
      x: Math.max(30, Math.min(1090, clickX)),
      y: Math.max(60, Math.min(670, clickY)),
    }));
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-slate-950 p-2 md:p-4">
      {/* Canvas container with subtle neon border */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl shadow-cyan-950/20 max-w-[1140px] w-full aspect-[16/10] bg-slate-950">
        <canvas
          ref={canvasRef}
          width={1120}
          height={700}
          onClick={handleCanvasClick}
          className="w-full h-full object-contain cursor-crosshair block"
        />

        {/* Ambient Proximity floating notification indicator */}
        {activePrompt && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none transition-all duration-200">
            <div className="bg-slate-900/90 border border-cyan-500/50 backdrop-blur-md px-4 py-2 rounded-xl text-xs md:text-sm font-medium text-cyan-200 shadow-lg shadow-cyan-950/40 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping inline-block" />
              <span>{activePrompt}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Canvas 2D Drawing Helper Functions
function renderLab(
  ctx: CanvasRenderingContext2D,
  player: PlayerPosition,
  stations: Station[],
  clues: ClueTerminal[],
  pulse: number,
  particles: LabParticle[],
  currentTime: number
) {
  const W = 1120;
  const H = 700;

  ctx.clearRect(0, 0, W, H);

  // 1. Floor tiling background
  ctx.fillStyle = '#090d16';
  ctx.fillRect(0, 0, W, H);

  // Draw Sector floor quadrants
  // Sektor 1 (Top Left): Bilik Persoalan & Hipotesis
  ctx.fillStyle = '#0c1524';
  ctx.fillRect(20, 50, 520, 290);

  // Sektor 2 (Top Right): Bilik Kawalan Parameter
  ctx.fillStyle = '#111328';
  ctx.fillRect(560, 50, 320, 290);

  // Sektor 3 (Bottom Left): Makmal Radas & Simbol Bahaya
  ctx.fillStyle = '#1a1412';
  ctx.fillRect(20, 360, 520, 310);

  // Sektor 4 (Bottom Right): Zon Pengukuran
  ctx.fillStyle = '#0d1b18';
  ctx.fillRect(560, 360, 320, 310);

  // Sektor 5 (Far Right): Teras Utama
  ctx.fillStyle = '#141724';
  ctx.fillRect(900, 50, 200, 620);

  // Grid lines on floor
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
  ctx.lineWidth = 1;
  for (let x = 30; x < W - 20; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 50);
    ctx.lineTo(x, H - 30);
    ctx.stroke();
  }
  for (let y = 60; y < H - 20; y += 40) {
    ctx.beginPath();
    ctx.moveTo(20, y);
    ctx.lineTo(W - 20, y);
    ctx.stroke();
  }

  // Corridors & Divider Walls
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 6;
  // Vertical divider between left and right sectors
  ctx.beginPath();
  ctx.moveTo(540, 50);
  ctx.lineTo(540, 280);
  ctx.moveTo(540, 380);
  ctx.lineTo(540, 670);
  ctx.stroke();

  // Horizontal divider between top and bottom sectors
  ctx.beginPath();
  ctx.moveTo(20, 350);
  ctx.lineTo(440, 350);
  ctx.moveTo(540, 350);
  ctx.lineTo(880, 350);
  ctx.stroke();

  // Vertical divider to Reactor Sector
  ctx.beginPath();
  ctx.moveTo(890, 50);
  ctx.lineTo(890, 300);
  ctx.moveTo(890, 420);
  ctx.lineTo(890, 670);
  ctx.stroke();

  // Sector Labels on floor
  ctx.fillStyle = 'rgba(148, 163, 184, 0.25)';
  ctx.font = '600 13px "JetBrains Mono", monospace';
  ctx.fillText('SEKTOR 1: PERSOALAN & HIPOTESIS', 40, 80);
  ctx.fillText('SEKTOR 2: KAWALAN PEMBOLEH UBAH', 580, 80);
  ctx.fillText('SEKTOR 3: RADAS & KESELAMATAN', 40, 390);
  ctx.fillText('SEKTOR 4: PENGUKURAN KUANTITATIF', 580, 390);
  ctx.fillText('SEKTOR 5: TERAS MAKMAL', 915, 80);

  // Outer safety barrier line
  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 2;
  ctx.strokeRect(20, 50, W - 40, H - 70);

  // Laboratory decorative props
  // 1. Chemical fume hood in Sektor 3
  drawFumeHood(ctx, 40, 430);
  // 2. Centrifuge & reagent rack in Sektor 4
  drawCentrifugeRack(ctx, 600, 430);
  // 3. Central Reactor Core in Sektor 5
  drawReactorCore(ctx, 1000, 360, pulse);

  // Ambient dust and air currents particle system
  drawDustParticles(ctx, particles, currentTime);

  // Render Clue Terminals
  for (const cl of clues) {
    drawClueTerminal(ctx, cl, pulse);
  }

  // Render Stations
  for (const st of stations) {
    drawStation(ctx, st, pulse);
  }

  // Render Player Character
  drawPlayer(ctx, player);
}

function drawDustParticles(
  ctx: CanvasRenderingContext2D,
  particles: LabParticle[],
  currentTime: number
) {
  ctx.save();
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];

    // Subtle sinusoidal breathing / twinkle
    const twinkle = 0.65 + 0.35 * Math.sin(p.phase + currentTime * 0.002);
    const alpha = Math.min(0.65, Math.max(0.06, p.baseAlpha * twinkle));

    let coreRgb = '203, 213, 225'; // slate-300 floating dust mote
    let glowRgb = '148, 163, 184';

    if (p.colorType === 'cyan') {
      coreRgb = '56, 189, 248'; // cyan ionizing glow
      glowRgb = '14, 165, 233';
    } else if (p.colorType === 'amber') {
      coreRgb = '251, 191, 36'; // warm amber mote
      glowRgb = '245, 158, 11';
    }

    // Faint atmospheric glow halo for medium/larger particles
    if (p.radius > 1.1) {
      ctx.fillStyle = `rgba(${glowRgb}, ${alpha * 0.32})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius * 2.8, 0, Math.PI * 2);
      ctx.fill();
    }

    // Micro dust trail / air streak to visualize air current
    if (p.radius > 1.25 && Math.abs(p.vx) > 3) {
      ctx.strokeStyle = `rgba(${glowRgb}, ${alpha * 0.28})`;
      ctx.lineWidth = p.radius * 0.7;
      ctx.beginPath();
      ctx.moveTo(p.x - p.vx * 0.45, p.y - p.vy * 0.45);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    }

    // Particle core
    ctx.fillStyle = `rgba(${coreRgb}, ${alpha})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawFumeHood(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(x, y, 70, 45);
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, 70, 45);

  // Glass sash with chemical glow
  ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
  ctx.fillRect(x + 5, y + 5, 60, 25);
  ctx.strokeStyle = '#38bdf8';
  ctx.strokeRect(x + 5, y + 5, 60, 25);

  // Small flasks inside
  ctx.fillStyle = '#06b6d4';
  ctx.beginPath();
  ctx.arc(x + 20, y + 20, 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#10b981';
  ctx.beginPath();
  ctx.arc(x + 40, y + 20, 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#cbd5e1';
  ctx.font = '9px "JetBrains Mono", monospace';
  ctx.fillText('KEBUK WASAP', x + 5, y + 40);
}

function drawCentrifugeRack(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(x, y, 75, 45);
  ctx.strokeStyle = '#475569';
  ctx.strokeRect(x, y, 75, 45);

  // Rotating centrifuge display
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(x + 24, y + 22, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Test tube rack
  for (let i = 0; i < 4; i++) {
    ctx.fillStyle = i % 2 === 0 ? '#38bdf8' : '#ec4899';
    ctx.fillRect(x + 48 + (i % 2) * 10, y + 10 + Math.floor(i / 2) * 14, 6, 10);
  }

  ctx.fillStyle = '#cbd5e1';
  ctx.font = '9px "JetBrains Mono", monospace';
  ctx.fillText('SENTRIFUG', x + 12, y + 42);
}

function drawReactorCore(ctx: CanvasRenderingContext2D, cx: number, cy: number, pulse: number) {
  // Glow aura
  const radius = 45;
  const glow = Math.sin(pulse) * 6;
  const gradient = ctx.createRadialGradient(cx, cy, 10, cx, cy, radius + glow);
  gradient.addColorStop(0, 'rgba(56, 189, 248, 0.4)');
  gradient.addColorStop(0.7, 'rgba(14, 165, 233, 0.1)');
  gradient.addColorStop(1, 'transparent');

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(cx, cy, radius + glow + 10, 0, Math.PI * 2);
  ctx.fill();

  // Outer metallic reactor containment ring
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.stroke();

  // Inner plasma core
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(cx, cy, radius - 6, 0, Math.PI * 2);
  ctx.fill();

  // Spinning core rods
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(pulse * 0.5);
  ctx.strokeStyle = '#67e8f9';
  ctx.lineWidth = 3;
  for (let i = 0; i < 3; i++) {
    ctx.rotate((Math.PI * 2) / 3);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, radius - 12);
    ctx.stroke();
  }
  ctx.restore();

  // Core orb
  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.arc(cx, cy, 12, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#e0f2fe';
  ctx.font = '600 10px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('TERAS ALPHA', cx, cy + radius + 18);
  ctx.textAlign = 'start';
}

function drawClueTerminal(ctx: CanvasRenderingContext2D, clue: ClueTerminal, pulse: number) {
  const x = clue.x;
  const y = clue.y;

  // Small floating desk / terminal pad
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.roundRect(x - 16, y - 16, 32, 32, 6);
  ctx.fill();
  ctx.strokeStyle = clue.isRead ? '#64748b' : '#38bdf8';
  ctx.lineWidth = clue.isRead ? 1 : 2;
  ctx.stroke();

  // Floating hologram note icon
  const bob = Math.sin(pulse * 1.5 + x) * 2;
  ctx.fillStyle = clue.isRead ? '#94a3b8' : '#38bdf8';
  ctx.font = '14px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('📋', x, y + 4 + bob);

  // Label
  ctx.fillStyle = clue.isRead ? '#64748b' : '#7dd3fc';
  ctx.font = '9px "JetBrains Mono", monospace';
  ctx.fillText('NOTA', x, y + 26);
  ctx.textAlign = 'start';
}

function drawStation(ctx: CanvasRenderingContext2D, st: Station, pulse: number) {
  const { x, y, width, height, isCompleted, isUnlocked, themeColor, stepNumber } = st;

  // Station base desk
  ctx.fillStyle = isCompleted ? '#064e3b' : isUnlocked ? '#0f172a' : '#1e1e24';
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, 8);
  ctx.fill();

  // Border & Glow
  const glow = Math.sin(pulse + stepNumber) * 2;
  ctx.strokeStyle = isCompleted ? '#10b981' : isUnlocked ? themeColor : '#334155';
  ctx.lineWidth = isUnlocked ? 2.5 : 1.5;
  ctx.stroke();

  if (isUnlocked && !isCompleted) {
    ctx.shadowColor = themeColor;
    ctx.shadowBlur = 8 + glow;
  } else if (isCompleted) {
    ctx.shadowColor = '#10b981';
    ctx.shadowBlur = 6;
  } else {
    ctx.shadowBlur = 0;
  }

  // Terminal screen monitor
  ctx.fillStyle = isCompleted ? '#065f46' : isUnlocked ? '#0284c7' : '#0f172a';
  ctx.fillRect(x + 10, y + 8, width - 20, 20);
  ctx.shadowBlur = 0; // reset

  // Screen scanline
  ctx.fillStyle = isCompleted ? '#34d399' : isUnlocked ? '#bae6fd' : '#475569';
  ctx.fillRect(x + 14, y + 12, width - 28, 2);
  ctx.fillRect(x + 14, y + 18, (width - 28) * 0.7, 2);

  // Status Indicator LED
  ctx.fillStyle = isCompleted ? '#10b981' : isUnlocked ? '#38bdf8' : '#ef4444';
  ctx.beginPath();
  ctx.arc(x + width - 14, y + 36, 4, 0, Math.PI * 2);
  ctx.fill();

  // Step Number Badge
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 11px "JetBrains Mono", monospace';
  ctx.fillText(`0${stepNumber}`, x + 12, y + 42);

  // Station title underneath
  ctx.fillStyle = isCompleted ? '#34d399' : isUnlocked ? '#e2e8f0' : '#64748b';
  ctx.font = '500 10px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  const label = isCompleted ? `✓ Langkah ${stepNumber}` : `Langkah ${stepNumber}`;
  ctx.fillText(label, x + width / 2, y + height + 14);
  ctx.textAlign = 'start';
}

function drawPlayer(ctx: CanvasRenderingContext2D, p: PlayerPosition) {
  const { x, y, direction, isMoving } = p;

  ctx.save();
  ctx.translate(x, y);

  // Shadow under player
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.beginPath();
  ctx.ellipse(0, 16, 12, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  // Body / Lab coat (White with teal collar)
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.roundRect(-10, -6, 20, 20, 4);
  ctx.fill();
  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Lab coat buttons / pen pocket
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(-6, -2, 3, 5);

  // Legs / Boots
  const legOffset = isMoving ? Math.sin(performance.now() * 0.015) * 4 : 0;
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(-7, 12 + legOffset, 5, 8);
  ctx.fillRect(2, 12 - legOffset, 5, 8);

  // Head (Skin tone)
  ctx.fillStyle = '#fed7aa';
  ctx.beginPath();
  ctx.arc(0, -14, 10, 0, Math.PI * 2);
  ctx.fill();

  // Hair (Dark brown/slate)
  ctx.fillStyle = '#334155';
  ctx.beginPath();
  ctx.arc(0, -17, 10, Math.PI, Math.PI * 2);
  ctx.fill();

  // Protective Science Goggles
  ctx.fillStyle = '#38bdf8';
  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 1;

  if (direction === 'down' || direction === 'right' || direction === 'left') {
    // Left eye lens
    ctx.fillRect(-7, -16, 5, 4);
    // Right eye lens
    ctx.fillRect(2, -16, 5, 4);
    // Goggle strap
    ctx.strokeStyle = '#475569';
    ctx.strokeRect(-8, -16, 16, 4);
  }

  // Facing direction dot / clipboard
  if (direction === 'right') {
    ctx.fillStyle = '#eab308';
    ctx.fillRect(8, 0, 5, 8); // Scientist clipboard
  } else if (direction === 'left') {
    ctx.fillStyle = '#eab308';
    ctx.fillRect(-13, 0, 5, 8);
  } else if (direction === 'down') {
    ctx.fillStyle = '#eab308';
    ctx.fillRect(-3, 2, 6, 8);
  }

  ctx.restore();
}
