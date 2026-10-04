import React from 'react';

interface StickerProps {
  delay: number;
}

export const StarSticker: React.FC<StickerProps> = ({ delay }) => (
  <svg
    className="fixed pointer-events-none animate-float"
    width="44"
    height="44"
    style={{
      top: '5%',
      left: '7%',
      rotate: '-12deg',
      animationDelay: `${delay}s`,
      zIndex: 0,
    }}
    viewBox="0 0 50 50"
  >
    <polygon
      points="25,4 31,19 47,19 34,29 39,45 25,35 11,45 16,29 3,19 19,19"
      fill="#fff3a0"
      stroke="#ff8fc0"
      strokeWidth="4"
      strokeLinejoin="round"
    />
  </svg>
);

export const HeartSticker: React.FC<StickerProps> = ({ delay }) => (
  <svg
    className="fixed pointer-events-none animate-float"
    width="34"
    height="34"
    style={{
      top: '11%',
      right: '8%',
      rotate: '10deg',
      animationDelay: `${delay}s`,
      zIndex: 0,
    }}
    viewBox="0 0 50 50"
  >
    <path
      d="M25 44C8 31 4 20 11 12c6-6 13-2 14 3 1-5 8-9 14-3 7 8 3 19-14 32z"
      fill="#ff9ccb"
      stroke="#e0559a"
      strokeWidth="4"
      strokeLinejoin="round"
    />
  </svg>
);

export const SparkSticker: React.FC<StickerProps> = ({ delay }) => (
  <svg
    className="fixed pointer-events-none animate-float"
    width="36"
    height="36"
    style={{
      bottom: '9%',
      left: '9%',
      rotate: '0deg',
      animationDelay: `${delay}s`,
      zIndex: 0,
    }}
    viewBox="0 0 50 50"
  >
    <path
      d="M25 3c2 12 6 18 22 22-16 4-20 10-22 22-2-12-6-18-22-22 16-4 20-10 22-22z"
      fill="#fff"
      stroke="#8fc6f0"
      strokeWidth="4"
      strokeLinejoin="round"
    />
  </svg>
);

export const CloudSticker: React.FC<StickerProps> = ({ delay }) => (
  <svg
    className="fixed pointer-events-none animate-float"
    width="54"
    height="54"
    style={{
      top: '42%',
      left: '2%',
      rotate: '0deg',
      animationDelay: `${delay}s`,
      zIndex: 0,
    }}
    viewBox="0 0 50 50"
  >
    <path
      d="M12 38a9 9 0 0 1 2-17 12 12 0 0 1 23-2 10 10 0 0 1 2 19z"
      fill="#d6ecff"
      stroke="#8fb8ea"
      strokeWidth="4"
      strokeLinejoin="round"
    />
  </svg>
);

export const TofuSticker: React.FC<StickerProps> = ({ delay }) => (
  <svg
    className="fixed pointer-events-none animate-float"
    width="46"
    height="46"
    style={{
      top: '22%',
      right: '3%',
      rotate: '12deg',
      animationDelay: `${delay}s`,
      zIndex: 0,
    }}
    viewBox="0 0 100 100"
  >
    <ellipse cx="14" cy="38" rx="11" ry="17" fill="#fffdf0" stroke="#e8a6c4" strokeWidth="4" />
    <ellipse cx="86" cy="38" rx="11" ry="17" fill="#fffdf0" stroke="#e8a6c4" strokeWidth="4" />
    <rect x="12" y="16" width="76" height="72" rx="28" fill="#fffdf0" stroke="#e8a6c4" strokeWidth="4" />
    <circle cx="36" cy="54" r="4.5" fill="#6b3b6e" />
    <circle cx="64" cy="54" r="4.5" fill="#6b3b6e" />
    <ellipse cx="26" cy="65" rx="7" ry="4.5" fill="#ffb3cf" />
    <ellipse cx="74" cy="65" rx="7" ry="4.5" fill="#ffb3cf" />
    <path d="M44 63q6 6 12 0" fill="none" stroke="#6b3b6e" strokeWidth="3.5" strokeLinecap="round" />
  </svg>
);

export const AllStickers: React.FC = () => (
  <>
    <style>{`
      @keyframes float {
        50% {
          transform: translateY(-14px) rotate(14deg);
        }
      }
      .animate-float {
        animation: float 5s ease-in-out infinite;
      }
    `}</style>
    <StarSticker delay={0} />
    <HeartSticker delay={1} />
    <SparkSticker delay={2} />
    <StarSticker delay={0.5} />
    <CloudSticker delay={1.5} />
    <SparkSticker delay={2.5} />
    <TofuSticker delay={0.8} />
  </>
);
