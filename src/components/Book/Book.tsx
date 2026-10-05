import { useState } from "react";
import { Leaf } from "./Leaf";
import { useRef } from "react";
import { content } from "../../content/level1";

interface BookProps {
  onClose: () => void;
}

export const Book: React.FC<BookProps> = ({ onClose }) => {
  const [currentLeaf, setCurrentLeaf] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const totalMessages = content.messages.length;
  const totalLeaves = totalMessages + 1;

  const handlePrevious = () => {
    if (currentLeaf > 0) {
      setCurrentLeaf(currentLeaf - 1);
    } else {
      // Close book if at first page and go back
      onClose();
    }
  };

  const handleNext = () => {
    if (currentLeaf < totalLeaves - 1) {
      setCurrentLeaf(currentLeaf + 1);
    } else {
      // Trigger confetti on last page
      (window as any).burstConfetti?.(0.5, 0.6);
      onClose();
    }
  };

  const displayPageNumber = currentLeaf === 0 ? "Sampul" : `${currentLeaf} / ${totalMessages}`;

  return (
    <>
      {/* Book Stage */}
      <div
        className={`book-container ${currentLeaf === 0 ? "book-cover" : "book-open"}`}
        onTouchStart={(event) => {
          touchStartX.current = event.touches[0]?.clientX ?? null;
        }}
        onTouchEnd={(event) => {
          const startX = touchStartX.current;
          const endX = event.changedTouches[0]?.clientX;
          touchStartX.current = null;

          if (startX === null || endX === undefined || Math.abs(endX - startX) < 48) return;
          if (endX < startX) handleNext();
          else handlePrevious();
        }}
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          perspective: 2000,
          transformStyle: "preserve-3d",
          touchAction: "pan-y",
        }}
      >
        {/* Book Container */}
        <div 
          style={{ 
            position: "relative", 
            width: "100%", 
            height: "100%",
            transformStyle: "preserve-3d",
          }}
        >
          {Array.from({ length: totalLeaves }).map((_, leafIndex) => {
            const frontMessage = leafIndex === 0
              ? { title: "", body: [] }
              : content.messages[leafIndex - 1];
            const backMessage = { title: "", body: [] };

            return (
              <Leaf
                key={leafIndex}
                index={leafIndex}
                currentPage={currentLeaf}
                frontMessage={frontMessage}
                backMessage={backMessage}
                isFlipped={leafIndex < currentLeaf}
                totalPages={totalMessages}
              />
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="book-navigation">
        <button
          className="w-12 h-12 rounded-full border-4 border-white bg-blue-soft text-white font-jua text-2xl shadow-[0_5px_0_#5f95c8] cursor-pointer transition-all active:translate-y-1 active:shadow-none disabled:opacity-35 disabled:cursor-not-allowed"
          onClick={handlePrevious}
          title={currentLeaf === 0 ? "Tutup buku" : "Halaman sebelumnya"}
        >
          ◀
        </button>
        <span className="tag page-indicator">
          {displayPageNumber}
        </span>
        <button
          className="w-12 h-12 rounded-full border-4 border-white bg-blue-soft text-white font-jua text-2xl shadow-[0_5px_0_#5f95c8] cursor-pointer transition-all active:translate-y-1 active:shadow-none disabled:opacity-35 disabled:cursor-not-allowed"
          onClick={handleNext}
          disabled={false}
          title={currentLeaf >= totalLeaves - 1 ? "Tutup buku" : "Halaman berikutnya"}
        >
          ▶
        </button>
      </div>
    </>
  );
};
