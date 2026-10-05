import React from 'react';
import { Message } from '../../content/level1';
import finalCat from '../../assets/final-cat-full.png';

interface LeafProps {
  index: number;
  currentPage: number;
  frontMessage: Message;
  backMessage: Message;
  isFlipped: boolean;
  totalPages: number;
}

export const Leaf: React.FC<LeafProps> = ({
  index,
  frontMessage,
  backMessage,
  isFlipped,
  totalPages,
}) => {
  const frontPageNum = index;
  const backPageNum = index;

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
        <PageContent message={frontMessage} pageNumber={frontPageNum} totalPages={totalPages} isCover={index === 0} isBack={false} />
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
      <PageContent message={backMessage} pageNumber={backPageNum} totalPages={totalPages} isCover={false} isBack={true} />
      </div>
    </div>
  );
};

const PageContent: React.FC<{
  message: Message;
  pageNumber: number;
  totalPages: number;
  isCover: boolean;
  isBack: boolean;
}> = ({ message, pageNumber, totalPages, isCover, isBack }) => {
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
      {isCover ? (
        <CoverPage />
      ) : message.body.length === 0 ? (
        <DecoPage message={message} />
      ) : (
        <ContentPage message={message} pageNumber={pageNumber} totalPages={totalPages} />
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
      backgroundImage: 'url(/src/assets/cover-photo.png)',
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

const DecoPage: React.FC<{ message: Message }> = ({ message }) => (
  <div className='flex-1 flex flex-col gap-3 p-5'>
    <TofuSVG size={70} />
    {message.body.map((paragraph, i) => (
      <p key={i} className='font-gaegu text-purple text-xs leading-relaxed'>
        {paragraph}
      </p>
    ))}
  </div>
);

const ContentPage: React.FC<{
  message: Message;
  pageNumber: number;
  totalPages: number;
}> = ({ message, pageNumber, totalPages }) => (
  <>
    <div
      className={`book-page-copy ${pageNumber === totalPages ? 'book-page-copy--final' : ''} flex-1 px-3 py-3 font-gaegu text-xs leading-[26px] overflow-y-auto flex flex-col gap-1`}
      style={{
        background: 'repeating-linear-gradient(transparent 0 25px, #bfe6ea 25px 26px)',
        backgroundPosition: '0 12px',
        color: '#8a4a7a',
      }}
    >
      {message.title && (
        <h2 className='font-jua font-normal text-pink-bright text-sm leading-tight mb-1'>
          {message.title}
        </h2>
      )}
      {message.body.map((paragraph, i) => (
        <p key={i} className='m-0 leading-[26px] text-purple break-words'>
          {paragraph}
        </p>
      ))}
      {message.signature && (
        <div className={`mt-auto pt-1 text-right text-pink-bright font-gaegu text-xs ${pageNumber === totalPages ? 'final-page-signature' : ''}`}>
          {message.signature}
        </div>
      )}
      {pageNumber === totalPages && (
        <img className='final-page-cat' src={finalCat} alt='' aria-hidden='true' />
      )}
    </div>
  </>
);
