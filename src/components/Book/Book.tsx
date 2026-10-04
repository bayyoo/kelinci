import { useState } from "react";
import { Leaf } from "./Leaf";
import { content } from "../../content/level1";

interface BookProps {
  onClose: () => void;
}

export const Book: React.FC<BookProps> = ({ onClose }) => {
  const [currentLeaf, setCurrentLeaf] = useState(0);
  const totalMessages = content.messages.length;
  const totalLeaves = Math.ceil(totalMessages / 2);

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

  // Calculate which page user is viewing (1-indexed for display)
  const displayPageNumber = currentLeaf === 0 ? "Sampul" : `${currentLeaf * 2} - ${Math.min(currentLeaf * 2 + 1, totalMessages)}`;

  return (
    <>
      {/* Book Stage */}
      <div
        className="book-container"
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          perspective: 2000,
          transformStyle: "preserve-3d",
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
            const frontMessageIndex = leafIndex * 2;
            const backMessageIndex = leafIndex * 2 + 1;
            const frontMessage = content.messages[frontMessageIndex];
            const backMessage = backMessageIndex < totalMessages 
              ? content.messages[backMessageIndex] 
              : { title: "♡", body: [""] };

            return (
              <Leaf
                key={leafIndex}
                index={leafIndex}
                currentPage={currentLeaf}
                frontMessage={frontMessage}
                backMessage={backMessage}
                isFlipped={leafIndex < currentLeaf}
                totalPages={totalLeaves}
              />
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div
        style={{
          position: "fixed",
          bottom: "40px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          alignItems: "center",
          gap: "16px",
          zIndex: 100,
        }}
      >
        <button
          className="w-12 h-12 rounded-full border-4 border-white bg-blue-soft text-white font-jua text-2xl shadow-[0_5px_0_#5f95c8] cursor-pointer transition-all active:translate-y-1 active:shadow-none disabled:opacity-35 disabled:cursor-not-allowed"
          onClick={handlePrevious}
          title={currentLeaf === 0 ? "Tutup buku" : "Halaman sebelumnya"}
        >
          ◀
        </button>
        <span className="tag">
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
