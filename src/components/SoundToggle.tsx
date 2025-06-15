"use client";

import React from "react";
import { useSound } from "../context/SoundContext";

export default function SoundToggle() {
  const { toggleSound, soundEnabled } = useSound();

  return (
    <button onClick={toggleSound} className="px-4 py-2 rounded bg-gray-700 text-white">
      Sound: {soundEnabled ? "On 🔊" : "Off 🔇"}
    </button>
  );
}
