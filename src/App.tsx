import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Counter } from "./components/Counter";
import { Book } from "./components/Book";
import { Confetti } from "./components/Confetti";
import { AllStickers } from "./components/Stickers";
import { BackgroundAudio } from "./components/BackgroundAudio";

type Screen = "counting" | "celebration" | "book";

function App() {
  const [screen, setScreen] = useState<Screen>("counting");

  const handleCounterComplete = () => {
    setScreen("celebration");
  };

  const handleCelebrationComplete = () => {
    setScreen("book");
  };

  const handleBookClose = () => {
    (window as any).burstConfetti?.(0.5, 0.5);
  };

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden">
      <BackgroundAudio />
      <Confetti />
      <AllStickers />

      <AnimatePresence mode="wait">
        {screen === "counting" && (
          <div key="counting" className="fixed inset-0 flex flex-col items-center justify-center">
            <Counter onComplete={handleCounterComplete} />
          </div>
        )}
        {screen === "celebration" && (
          <div key="celebration" className="fixed inset-0 flex flex-col items-center justify-center gap-[22px] p-5">
            <span className="tag">selamat hari nabilah naisa sedunia</span>
            <h1 className="bubble text-center" style={{ fontSize: "clamp(40px, 12vw, 64px)" }}>
              Happy 18th
              <br />
              Birthday,
              <br />
              Lalaa!
            </h1>
            <button
              className="btn"
              onClick={handleCelebrationComplete}
            >
              yuhu
            </button>
          </div>
        )}
        {screen === "book" && <Book key="book" onClose={handleBookClose} />}
      </AnimatePresence>
    </div>
  );
}

export default App;
