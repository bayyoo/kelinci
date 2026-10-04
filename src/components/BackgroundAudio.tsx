import { useEffect, useRef } from "react";

export const BackgroundAudio: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      // Set attributes
      audio.loop = true;
      audio.volume = 0.5;

      // Try to play
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Browser blocked autoplay - user needs to interact first
          console.log("Autoplay blocked - waiting for user interaction");
        });
      }

      // Fallback: play on first user interaction
      const playOnInteraction = () => {
        audio.play().catch(() => console.log("Play failed"));
        document.removeEventListener("click", playOnInteraction);
        document.removeEventListener("touchstart", playOnInteraction);
      };

      document.addEventListener("click", playOnInteraction);
      document.addEventListener("touchstart", playOnInteraction);

      return () => {
        document.removeEventListener("click", playOnInteraction);
        document.removeEventListener("touchstart", playOnInteraction);
      };
    }
  }, []);

  return (
    <audio
      ref={audioRef}
      src="/backsound.mp3"
      preload="auto"
      style={{ display: "none" }}
    />
  );
};
