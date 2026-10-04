import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  c: string;
  r: number;
  vr: number;
  o: boolean;
  l: number;
}

const colors = [
  '#ff7eb6',
  '#ffe066',
  '#7fd3d6',
  '#8fc6f0',
  '#bff0c8',
  '#fff',
  '#ffb6d6',
];

export const Confetti: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const runningRef = useRef(false);

  const handleResize = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth * devicePixelRatio;
      canvas.height = window.innerHeight * devicePixelRatio;
    }
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const burst = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    for (let i = 0; i < 70; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 6 + Math.random() * 10;
      const particle: Particle = {
        x: x * canvas.width,
        y: y * canvas.height,
        vx: Math.cos(angle) * speed * devicePixelRatio,
        vy: (Math.sin(angle) * speed - 6) * devicePixelRatio,
        w: (6 + Math.random() * 8) * devicePixelRatio,
        c: colors[i % colors.length],
        r: Math.random() * 6,
        vr: (Math.random() * 0.4 - 0.2),
        o: Math.random() < 0.3,
        l: 110 + Math.random() * 60,
      };
      particlesRef.current.push(particle);
    }

    if (!runningRef.current) {
      runningRef.current = true;
      tick();
    }
  };

  const tick = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particlesRef.current = particlesRef.current.filter((p) => p.l > 0);

    for (const p of particlesRef.current) {
      p.vy += 0.35 * devicePixelRatio;
      p.vx *= 0.985;
      p.x += p.vx;
      p.y += p.vy;
      p.r += p.vr;
      p.l--;

      ctx.save();
      ctx.globalAlpha = Math.min(1, p.l / 30);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.r);
      ctx.fillStyle = p.c;

      if (p.o) {
        ctx.beginPath();
        ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(-p.w / 2, -p.w / 4, p.w, p.w / 2);
      }

      ctx.restore();
    }

    if (particlesRef.current.length) {
      requestAnimationFrame(tick);
    } else {
      runningRef.current = false;
    }
  };

  // Expose burst function globally
  useEffect(() => {
    (window as any).burstConfetti = burst;
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-50" />;
};
