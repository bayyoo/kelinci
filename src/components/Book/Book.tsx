import { useLayoutEffect, useRef, useState } from "react";
import { Leaf, PageKind } from "./Leaf";
import { Block, paginate } from "./blocks";
import { content } from "../../content/level1";

interface BookProps {
  onClose: () => void;
}

const emptyPage: PageKind = { kind: "empty" };
const coverPage: PageKind = { kind: "cover" };

export const Book: React.FC<BookProps> = ({ onClose }) => {
  const [currentLeaf, setCurrentLeaf] = useState(0);
  const [pages, setPages] = useState<Block[][]>([[]]);
  const touchStartX = useRef<number | null>(null);
  const measureRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const measurer = measureRef.current;
    if (!measurer) return;

    let raf = 0;
    const run = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const next = paginate(content.messages, measurer);
        setPages((prev) => (JSON.stringify(prev) === JSON.stringify(next) ? prev : next));
      });
    };

    run();
    const observer = new ResizeObserver(run);
    observer.observe(measurer);
    window.addEventListener("resize", run);
    window.addEventListener("orientationchange", run);
    if (document.fonts?.ready) document.fonts.ready.then(run).catch(() => {});

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("resize", run);
      window.removeEventListener("orientationchange", run);
    };
  }, []);

  const totalLeaves = pages.length + 1;

  useLayoutEffect(() => {
    setCurrentLeaf((leaf) => Math.min(leaf, pages.length));
  }, [pages.length]);

  const handlePrevious = () => {
    if (currentLeaf > 0) {
      setCurrentLeaf(currentLeaf - 1);
    } else {
      onClose();
    }
  };

  const handleNext = () => {
    if (currentLeaf < totalLeaves - 1) {
      setCurrentLeaf(currentLeaf + 1);
    } else {
      (window as any).burstConfetti?.(0.5, 0.6);
      onClose();
    }
  };

  const pageKind = (leafIndex: number): PageKind => {
    if (leafIndex === 0) return coverPage;
    const blocks = pages[leafIndex - 1];
    if (!blocks || blocks.length === 0) return emptyPage;
    return { kind: "content", blocks };
  };

  const displayPageNumber = currentLeaf === 0 ? "Sampul" : `${currentLeaf} / ${pages.length}`;

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
          {Array.from({ length: totalLeaves }).map((_, leafIndex) => (
            <Leaf
              key={leafIndex}
              index={leafIndex}
              front={pageKind(leafIndex)}
              back={leafIndex === 0 ? emptyPage : pageKind(leafIndex)}
              isFlipped={leafIndex < currentLeaf}
              totalPages={pages.length}
            />
          ))}

          {/* Hidden measurer used to paginate messages across fixed-font pages */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: "50%",
              height: "100%",
              visibility: "hidden",
              pointerEvents: "none",
            }}
          >
            <div
              className="book-page book-page-right w-full h-full flex flex-col overflow-hidden"
              style={{
                border: "5px solid transparent",
                borderLeftWidth: "3px",
                borderRightWidth: "5px",
                borderRadius: "3px 26px 26px 3px",
              }}
            >
              <div
                ref={measureRef}
                className="book-page-copy flex-1 flex flex-col overflow-hidden font-gaegu"
              />
            </div>
          </div>
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
        <span className="tag page-indicator">{displayPageNumber}</span>
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
