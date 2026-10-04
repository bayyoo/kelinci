import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Counter } from "./Counter";
import { content } from "../content/level1";

interface IntroProps {
  onComplete: () => void;
}

export const Intro: React.FC<IntroProps> = ({ onComplete }) => {
  const [stage, setStage] = useState<"start" | "counting" | "celebration">("start");

  const handleStart = () => {
    setStage("counting");
  };

  const handleCounterComplete = () => {
    setStage("celebration");
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center gap-[22px] p-5">
      <AnimatePresence mode="wait">
        {stage === "start" && (
          <motion.div
            key="start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center gap-[22px]"
          >
            <span className="tag">BIRTHDAY ID · LEVEL 1</span>
            <div className="panel p-[26px] text-center max-w-sm">
              <svg width="80" height="80" viewBox="0 0 100 100" className="mx-auto mb-3">
                <ellipse cx="14" cy="38" rx="11" ry="17" fill="#fffdf0" stroke="#e8a6c4" strokeWidth="4" />
                <ellipse cx="86" cy="38" rx="11" ry="17" fill="#fffdf0" stroke="#e8a6c4" strokeWidth="4" />
                <rect x="12" y="16" width="76" height="72" rx="28" fill="#fffdf0" stroke="#e8a6c4" strokeWidth="4" />
                <circle cx="36" cy="54" r="4.5" fill="#6b3b6e" />
                <circle cx="64" cy="54" r="4.5" fill="#6b3b6e" />
                <ellipse cx="26" cy="65" rx="7" ry="4.5" fill="#ffb3cf" />
                <ellipse cx="74" cy="65" rx="7" ry="4.5" fill="#ffb3cf" />
                <path
                  d="M44 63q6 6 12 0"
                  fill="none"
                  stroke="#6b3b6e"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <button className="btn" onClick={handleStart}>
              Start
            </button>
          </motion.div>
        )}

        {stage === "counting" && (
          <motion.div
            key="counting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Counter onComplete={handleCounterComplete} />
          </motion.div>
        )}

        {stage === "celebration" && (
          <motion.div
            key="celebration"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-[22px]"
          >
            <span className="tag">LEVEL 1 · UNLOCKED</span>
            <h1 className="bubble text-center" style={{ fontSize: "clamp(40px, 12vw, 64px)" }}>
              Pricieng
              <br />
              Upload,
              <br />
              {content.name}!
            </h1>
            <button className="btn" onClick={onComplete}>
            
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
