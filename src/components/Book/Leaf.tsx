import React from 'react';
import { Block } from './blocks';
import coverPhoto from '../../assets/cover-photo.png';
import finalCat from '../../assets/final-cat-full.png';

export type PageKind =
  | { kind: 'cover' }
  | { kind: 'empty' }
  | { kind: 'content'; blocks: Block[] };

interface LeafProps {
  index: number;
  front: PageKind;
  back: PageKind;
  isFlipped: boolean;
  totalPages: number;
}

export const Leaf: React.FC<LeafProps> = ({ index, front, back, isFlipped, totalPages }) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: 0,
        width: '50%',
        height: '100%',
        transformOrigin: 'left center',
        transformStyle: 'preserve-3d',
        transform: isFlipped ? 'rotateY(-180deg)' : 'rotateY(0deg)',
        transition: 'transform 0.8s ease-in-out',
        zIndex: isFlipped ? index + 1 : totalPages - index,
      }}
    >
      {/* Front */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
        }}
      >
        <PageContent page={front} isBack={false} />
      </div>

      {/* Back */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
        }}
      >
        <PageContent page={back} isBack={true} />
      </div>
    </div>
  );
};

const PageContent: React.FC<{ page: PageKind; isBack: boolean }> = ({ page, isBack }) => {
  const isCover = page.kind === 'cover';
  const isContent = page.kind === 'content';
  const isFinal = isContent && page.blocks.some((block) => block.type === 'sign');

  return (
    <div
      className={`book-page ${isBack ? 'book-page-left' : 'book-page-right'} w-full h-full flex flex-col overflow-hidden`}
      style={{
        background: isCover ? 'linear-gradient(135deg, #fff3b0, #ffe1ef)' : '#fff8d6',
        border: '5px solid #7fd3d6',
        borderRadius: isBack ? '26px 3px 3px 26px' : '3px 26px 26px 3px',
        borderLeftWidth: isBack ? '5px' : '3px',
        borderRightWidth: isBack ? '3px' : '5px',
        boxShadow: isBack
          ? 'inset -300px 0 80px rgba(0,0,0,0.08), -3px 0 8px rgba(91, 179, 184, 0.4)'
          : 'inset 300px 0 80px rgba(0,0,0,0.08), 3px 0 8px rgba(91, 179, 184, 0.4)',
        position: 'relative',
      }}
    >
      {page.kind === 'cover' && <CoverPage />}
      {page.kind === 'empty' && <EmptyPage />}
      {isContent && (
        <ContentPage blocks={page.blocks} isFinal={isFinal} />
      )}
    </div>
  );
};

const TofuSVG = ({ size = 80 }: { size?: number }) => (
  <svg width={size} height={size} viewBox='0 0 100 100'>
    <ellipse cx='14' cy='38' rx='11' ry='17' fill='#fffdf0' stroke='#e8a6c4' strokeWidth='4' />
    <ellipse cx='86' cy='38' rx='11' ry='17' fill='#fffdf0' stroke='#e8a6c4' strokeWidth='4' />
    <rect x='12' y='16' width='76' height='72' rx='28' fill='#fffdf0' stroke='#e8a6c4' strokeWidth='4' />
    <circle cx='36' cy='54' r='4.5' fill='#6b3b6e' />
    <circle cx='64' cy='54' r='4.5' fill='#6b3b6e' />
    <ellipse cx='26' cy='65' rx='7' ry='4.5' fill='#ffb3cf' />
    <ellipse cx='74' cy='65' rx='7' ry='4.5' fill='#ffb3cf' />
    <path d='M44 63q6 6 12 0' fill='none' stroke='#6b3b6e' strokeWidth='3.5' strokeLinecap='round' />
  </svg>
);

const CoverPage: React.FC = () => (
  <div
    className='flex-1 flex flex-col items-center justify-center gap-3 text-center p-6'
    style={{
      backgroundImage: `url(${coverPhoto})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative',
    }}
  >
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(180deg, rgba(255,243,176,0.3) 0%, rgba(255,225,239,0.3) 100%)',
        pointerEvents: 'none',
      }}
    />
  </div>
);

const EmptyPage: React.FC = () => (
  <div className='flex-1 flex flex-col items-center justify-center p-5'>
    <TofuSVG size={70} />
  </div>
);

const ContentPage: React.FC<{ blocks: Block[]; isFinal: boolean }> = ({ blocks, isFinal }) => {
  return (
    <div
      className={`book-page-copy ${isFinal ? 'book-page-copy--final' : ''} flex-1 flex flex-col overflow-hidden font-gaegu`}
    >
      {blocks.map((block, i) => {
        if (block.type === 'title') {
          return (
            <h2 key={i} className='page-title'>
              {block.text}
            </h2>
          );
        }
        if (block.type === 'sign') {
          return (
            <div key={i} className='page-sign final-page-signature'>
              {block.text}
            </div>
          );
        }
        return (
          <p key={i} className='page-para'>
            {block.text}
          </p>
        );
      })}
      {isFinal && <img className='final-page-cat' src={finalCat} alt='' aria-hidden='true' />}
    </div>
  );
};
