import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface CounterProps {
  onComplete: () => void;
}

export const Counter: React.FC<CounterProps> = ({ onComplete }) => {
  const numberRef = useRef<HTMLDivElement>(null);
  const lastNumberRef = useRef(0);

  useEffect(() => {
    const AudioContextClass = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const audioContext = new AudioContextClass();
    audioContext.resume().catch(() => undefined);

    // Mobile browsers require a user gesture before audible Web Audio can run.
    const unlockAudio = () => {
      audioContext.resume().catch(() => undefined);
    };

    document.addEventListener('pointerdown', unlockAudio, { once: true });

    const obj = { value: 0 };

    const playTick = (isFinalNumber: boolean) => {
      if (audioContext.state !== 'running') return;

      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      const now = audioContext.currentTime;

      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(isFinalNumber ? 980 : 720, now);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(isFinalNumber ? 0.09 : 0.055, now + 0.006);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.075);

      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start(now);
      oscillator.stop(now + 0.08);
    };

    const playFireworkPop = (pitch: number) => {
      if (audioContext.state !== 'running') return;

      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      const now = audioContext.currentTime;

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(pitch, now);
      oscillator.frequency.exponentialRampToValueAtTime(75, now + 0.2);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.035, now + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start(now);
      oscillator.stop(now + 0.24);
    };

    const animation = gsap.to(obj, {
      value: 18,
      duration: 3.8,
      ease: 'power2.out',
      onUpdate: () => {
        const nextNumber = Math.round(obj.value);
        if (numberRef.current) {
          numberRef.current.textContent = nextNumber.toString();
        }
        if (nextNumber !== lastNumberRef.current) {
          lastNumberRef.current = nextNumber;
          playTick(nextNumber === 18);
        }
      },
      onComplete: () => {
        if (numberRef.current) {
          numberRef.current.textContent = '18';
          numberRef.current.classList.add('animate-pop');
          (window as any).burstConfetti?.(0.5, 0.4);
          playFireworkPop(170);
          setTimeout(() => {
            (window as any).burstConfetti?.(0.2, 0.5);
            playFireworkPop(205);
          }, 300);
          setTimeout(() => {
            (window as any).burstConfetti?.(0.8, 0.5);
            playFireworkPop(185);
          }, 500);
          setTimeout(onComplete, 1400);
        }
      },
    });

    return () => {
      animation.kill();
      document.removeEventListener('pointerdown', unlockAudio);
      audioContext.close().catch(() => undefined);
    };
  }, [onComplete]);

  return (
    <div
      ref={numberRef}
      className="font-bubble text-center"
      style={{ fontSize: 'min(46vw, 190px)' }}
    >
      0
    </div>
  );
};
