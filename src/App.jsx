import { useState, useCallback, useRef, useEffect } from 'react';
import StarField from './components/StarField';
import ProgressBar from './components/ProgressBar';
import GrimoireCard from './components/GrimoireCard';
import ArtifactGrid from './components/ArtifactGrid';
import SuccessModal from './components/SuccessModal';
import { ARTIFACTS } from './data/gameData';
import './index.css';

// ─── Utility: spawn golden particles from center ──────────────────────────
function spawnParticles(container) {
  if (!container) return;
  for (let i = 0; i < 22; i++) {
    const el = document.createElement('div');
    const angle = (i / 22) * Math.PI * 2;
    const dist = 60 + Math.random() * 80;
    el.style.cssText = `
      position:absolute;width:${4 + Math.random() * 5}px;height:${4 + Math.random() * 5}px;
      border-radius:50%;background:${Math.random() > .5 ? '#f5c518' : '#fce588'};
      left:50%;top:50%;pointer-events:none;z-index:99;
      --tx:${Math.cos(angle) * dist}px;--ty:${Math.sin(angle) * dist}px;
      animation:particle-float ${.5 + Math.random() * .7}s ${Math.random() * .2}s ease-out forwards;
    `;
    container.appendChild(el);
    setTimeout(() => el.remove(), 1300);
  }
}

// ─── Destruction Effect overlay ────────────────────────────────────────────
function DestructionScreen({ onRestart }) {
  const [phase, setPhase] = useState(0); // 0 = crack, 1 = dark, 2 = message

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 600);
    const t2 = setTimeout(() => setPhase(2), 1800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{
        background: phase >= 1
          ? 'radial-gradient(ellipse at center, #1a0000 0%, #000000 100%)'
          : 'transparent',
        transition: 'background 1s ease-in',
      }}
    >
      {/* Crack SVG overlay */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity: phase === 0 ? 0 : phase === 1 ? 1 : 0.3, transition: 'opacity 0.8s' }}
        viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <filter id="glow-red">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {/* Main crack lines from center */}
        {[
          'M720,450 L300,100 M720,450 L200,600 M720,450 L1100,80 M720,450 L1300,550',
          'M720,450 L600,900 M720,450 L900,900 M720,450 L100,400 M720,450 L1400,300',
          'M720,450 L500,200 L400,250 M720,450 L850,150 L950,100',
        ].map((d, i) => (
          <path
            key={i}
            d={d}
            stroke="#8b0000"
            strokeWidth={i === 0 ? 3 : 1.5}
            fill="none"
            filter="url(#glow-red)"
            style={{
              strokeDasharray: 2000,
              strokeDashoffset: phase >= 1 ? 0 : 2000,
              transition: `stroke-dashoffset ${0.4 + i * 0.15}s ease-out`,
            }}
          />
        ))}
        {/* Shatter pieces */}
        {phase >= 1 && Array.from({ length: 24 }).map((_, i) => {
          const x = 400 + Math.random() * 640;
          const y = 200 + Math.random() * 500;
          const size = 15 + Math.random() * 40;
          return (
            <polygon
              key={i}
              points={`${x},${y} ${x + size * .6},${y - size} ${x + size},${y + size * .4}`}
              fill={`rgba(139,0,0,${0.1 + Math.random() * 0.2})`}
              stroke="rgba(180,0,0,0.4)"
              strokeWidth="0.5"
            />
          );
        })}
      </svg>

      {/* Text message */}
      {phase >= 2 && (
        <div
          className="relative z-10 text-center px-8 flex flex-col items-center gap-8"
          style={{ animation: 'modal-in 0.6s ease-out forwards' }}
        >
          <div className="flex flex-col gap-3">
            <p className="font-cinzel text-4xl font-bold tracking-widest text-red-700"
              style={{ textShadow: '0 0 40px rgba(180,0,0,0.9)' }}>
              𝕿𝖔𝖉𝖔 𝖍𝖆 𝖙𝖊𝖗𝖒𝖎𝖓𝖆𝖉𝖔
            </p>
            <div className="flex justify-center gap-2 text-red-900/60 text-2xl">
              {'💔'.repeat(3)}
            </div>
            <p className="font-cormorant text-lg text-red-400/80 italic tracking-wide">
              El conjuro fue roto... la magia se desvanece.
            </p>
          </div>

          <button
            onClick={onRestart}
            className="mt-4 px-8 py-3 rounded font-cinzel text-sm tracking-widest uppercase"
            style={{
              background: 'linear-gradient(135deg, #2a0000, #4a0000)',
              border: '1px solid rgba(180,30,30,0.5)',
              color: '#e05555',
              transition: 'all 0.3s',
            }}
          >
            ↩ Volver a intentar
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Magic Wand / Love Finale Screen ──────────────────────────────────────
function LoveFinaleScreen({ message }) {
  const [phase, setPhase] = useState(0);
  const canvasRef = useRef(null);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 300);
    const t2 = setTimeout(() => setPhase(2), 1200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  // Canvas sparkle animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const sparks = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 3,
      vy: -1 - Math.random() * 3,
      r: 1 + Math.random() * 3,
      life: 1,
      decay: 0.008 + Math.random() * 0.012,
      hue: 40 + Math.random() * 30,
    }));

    let raf;
    let alive = true;

    const draw = () => {
      if (!alive) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      sparks.forEach((s, i) => {
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.04; // gravity
        s.life -= s.decay;
        if (s.life <= 0) {
          // respawn
          sparks[i] = {
            x: canvas.width * 0.2 + Math.random() * canvas.width * 0.6,
            y: canvas.height * 0.3 + Math.random() * canvas.height * 0.4,
            vx: (Math.random() - 0.5) * 4,
            vy: -2 - Math.random() * 4,
            r: 1 + Math.random() * 3,
            life: 1,
            decay: 0.006 + Math.random() * 0.014,
            hue: 40 + Math.random() * 30,
          };
          return;
        }
        ctx.save();
        ctx.globalAlpha = s.life;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${s.hue}, 100%, 70%)`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = `hsl(${s.hue}, 100%, 60%)`;
        ctx.fill();
        // Star shape cross
        ctx.beginPath();
        ctx.moveTo(s.x - s.r * 3, s.y);
        ctx.lineTo(s.x + s.r * 3, s.y);
        ctx.moveTo(s.x, s.y - s.r * 3);
        ctx.lineTo(s.x, s.y + s.r * 3);
        ctx.strokeStyle = `hsla(${s.hue}, 100%, 80%, ${s.life * 0.5})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
        ctx.restore();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { alive = false; cancelAnimationFrame(raf); };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at center, #0e1b47 0%, #03060f 100%)',
      }}
    >
      {/* Sparkle canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* Central message */}
      {phase >= 2 && (
        <div
          className="relative z-10 text-center px-8 max-w-lg flex flex-col items-center gap-6"
          style={{ animation: 'modal-in 0.8s cubic-bezier(0.34,1.56,0.64,1) forwards' }}
        >
          {/* Wands icon */}
          <div className="flex gap-3 text-4xl" style={{ filter: 'drop-shadow(0 0 12px rgba(245,197,24,0.8))' }}>
            <span style={{ transform: 'rotate(-30deg)', display: 'inline-block' }}>🪄</span>
            <span>✨</span>
            <span style={{ transform: 'rotate(30deg)', display: 'inline-block' }}>🪄</span>
          </div>

          {/* Love message */}
          <p
            className="font-cormorant text-xl md:text-2xl text-gold-200 leading-relaxed italic"
            style={{
              textShadow: '0 0 30px rgba(245,197,24,0.5)',
              fontFamily: "'Cormorant Garamond', serif",
            }}
          >
            {message}
          </p>

          {/* Gold divider */}
          <div className="gold-divider w-48 mx-auto" />

          <p className="font-cinzel text-xs tracking-[0.4em] text-gold-500 uppercase animate-pulse">
            ✦ Siempre ✦
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Main App ──────────────────────────────────────────────────────────────
export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [unlockedIds, setUnlockedIds] = useState([]);
  const [isShaking, setIsShaking] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [endScreen, setEndScreen] = useState(null); // null | 'destruction' | 'love'
  const particleRef = useRef(null);

  const currentArtifact = ARTIFACTS[currentIndex] ?? null;

  // ── Normalize answer comparison ──
  const normalize = (s) =>
    s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

  // ── Lock index after all normal fragments but before rayo ──
  const alreadyUnlocked = (id) => unlockedIds.includes(id);

  const handleUnlock = useCallback(
    (inputValue) => {
      if (!currentArtifact) return;
      const { riddle, id } = currentArtifact;
      const type = riddle.type ?? 'text';

      // ── Final fragment: Rayo ─────────────────────────────────────────
      if (type === 'final') {
        const choice = normalize(inputValue);
        if (choice === 'si') {
          // Unlock the rayo artifact and show love screen
          setUnlockedIds((prev) => [...prev, id]);
          setTimeout(() => setEndScreen('love'), 400);
        } else {
          setEndScreen('destruction');
        }
        return;
      }

      // ── Button-only: always pass ─────────────────────────────────────
      if (type === 'button-only') {
        setErrorMsg('');
        unlock(id);
        return;
      }

      // ── Multiple-choice: all options are correct ─────────────────────
      if (type === 'multiple-choice') {
        setErrorMsg('');
        unlock(id);
        return;
      }

      // ── Date / text: compare answer ──────────────────────────────────
      if (!inputValue) {
        setErrorMsg('El pergamino aguarda tu respuesta...');
        triggerShake();
        return;
      }

      const correct = normalize(riddle.answer ?? '');
      const given = normalize(inputValue);

      // Support both a single answer and an array of accepted answers
      const isCorrect = Array.isArray(riddle.answers)
        ? riddle.answers.some((a) => normalize(a) === given)
        : normalize(riddle.answer ?? '') === given;

      if (isCorrect) {
        setErrorMsg('');
        unlock(id);
      } else {
        setErrorMsg('La magia no resuena... intenta de nuevo.');
        triggerShake();
      }
    },
    [currentArtifact, unlockedIds]
  );

  function unlock(id) {
    // ⚠️ Side effects (setTimeout, DOM mutations) must stay OUTSIDE the updater
    // because React StrictMode invokes updaters twice in development.
    setUnlockedIds((prev) => [...prev, id]);
    spawnParticles(particleRef.current);
    setTimeout(() => setCurrentIndex((i) => i + 1), 600);
  }

  function triggerShake() {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 600);
  }

  const handleRestartFromDestruction = () => {
    setEndScreen(null);
    // Go back to rayo fragment
    setCurrentIndex(ARTIFACTS.findIndex((a) => a.riddle.type === 'final'));
  };

  // ── End screens ──────────────────────────────────────────────────────────
  if (endScreen === 'destruction') {
    return <DestructionScreen onRestart={handleRestartFromDestruction} />;
  }
  if (endScreen === 'love') {
    return (
      <LoveFinaleScreen
        message={ARTIFACTS.find((a) => a.riddle.type === 'final')?.riddle.finalMessage ?? ''}
      />
    );
  }

  // ── Normal game UI ───────────────────────────────────────────────────────
  return (
    <div className="relative min-h-screen flex flex-col">
      <StarField />

      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 20% 30%, rgba(14,27,71,0.4) 0%, transparent 60%), radial-gradient(ellipse at 80% 70%, rgba(10,20,51,0.4) 0%, transparent 60%)',
        }}
      />

      {/* Title */}
      <div className="relative z-10 text-center pt-8 pb-2 px-4">
        <p className="font-cinzel text-[10px] tracking-[0.5em] text-gold-600 uppercase mb-2">✦ ✦ ✦</p>
        <h1
          className="font-cinzel text-2xl md:text-4xl font-bold text-gold-300 tracking-[0.1em]"
          style={{ textShadow: '0 0 30px rgba(245,197,24,0.4)' }}
        >
          El Grimorio de los Secretos
        </h1>
        <p className="font-cormorant text-sm text-gold-500/70 mt-1 italic tracking-wider">
          — Un viaje a través de los fragmentos del alma —
        </p>
      </div>

      {/* Progress */}
      <ProgressBar found={unlockedIds.length} total={ARTIFACTS.length} />

      {/* Particle anchor */}
      <div ref={particleRef} className="relative z-10" />

      {/* Active Grimoire card */}
      {currentArtifact && (
        <GrimoireCard
          artifact={currentArtifact}
          onUnlock={handleUnlock}
          isShaking={isShaking}
          errorMsg={errorMsg}
        />
      )}

      {/* Artifact inventory */}
      <ArtifactGrid
        artifacts={ARTIFACTS}
        unlockedIds={unlockedIds}
        currentId={currentArtifact?.id}
      />

      <footer className="relative z-10 text-center pb-6">
        <p className="font-cormorant text-xs italic text-gold-700/50 tracking-widest">
          Creado con magia y amor ✦
        </p>
      </footer>
    </div>
  );
}
