import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface CounterProps {
  onComplete: () => void;
}

export const Counter: React.FC<CounterProps> = ({ onComplete }) => {
  const numberRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obj = { value: 0 };

    gsap.to(obj, {
      value: 18,
      duration: 3.8,
      ease: 'power2.out',
      onUpdate: () => {
        if (numberRef.current) {
          numberRef.current.textContent = Math.round(obj.value).toString();
        }
      },
      onComplete: () => {
        if (numberRef.current) {
          numberRef.current.textContent = '18';
          numberRef.current.classList.add('animate-pop');
          (window as any).burstConfetti?.(0.5, 0.4);
          setTimeout(() => (window as any).burstConfetti?.(0.2, 0.5), 300);
          setTimeout(() => (window as any).burstConfetti?.(0.8, 0.5), 500);
          setTimeout(onComplete, 1400);
        }
      },
    });
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
