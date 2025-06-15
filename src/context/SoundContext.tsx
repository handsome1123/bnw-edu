"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Howl } from "howler";

interface SoundContextType {
  play: (src: string) => void;
  toggleSound: () => void;
  soundEnabled: boolean;
  playBackground: () => void;
  stopBackground: () => void;
}

const SoundContext = createContext<SoundContextType>({
  play: () => {},
  toggleSound: () => {},
  soundEnabled: true,
  playBackground: () => {},
  stopBackground: () => {},
});

export const SoundProvider = ({ children }: { children: React.ReactNode }) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [backgroundSound, setBackgroundSound] = useState<Howl | null>(null);

  useEffect(() => {
    // Load user preference from localStorage
    const stored = localStorage.getItem("soundEnabled");
    if (stored !== null) {
      setSoundEnabled(stored === "true");
    }
  }, []);

  const play = (src: string) => {
    if (!soundEnabled) return;
    const sound = new Howl({
      src: [`/sounds/${src}`],
      volume: 1,
    });
    sound.play();
  };

  const playBackground = () => {
    if (!soundEnabled || backgroundSound) return;
    const bg = new Howl({
      src: ["/sounds/background.mp3"],
      volume: 0.3,
      loop: true,
    });
    bg.play();
    setBackgroundSound(bg);
  };

  const stopBackground = () => {
    if (backgroundSound) {
      backgroundSound.stop();
      setBackgroundSound(null);
    }
  };

  const toggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    localStorage.setItem("soundEnabled", newState.toString());
    if (!newState) {
      stopBackground();
    } else {
      playBackground();
    }
  };

  return (
    <SoundContext.Provider value={{ play, toggleSound, soundEnabled, playBackground, stopBackground }}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => useContext(SoundContext);
