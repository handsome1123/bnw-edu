"use client";

import React from "react";

interface TextToSpeechProps {
  text: string;
  lang?: string; // Optional: default is 'en-US'
}

const TextToSpeech: React.FC<TextToSpeechProps> = ({ text, lang = "en-US" }) => {
  const handleSpeak = () => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    speechSynthesis.speak(utterance);
  };

  return (
    <button
      onClick={handleSpeak}
      className="mt-2 px-4 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
    >
      🔊 Read
    </button>
  );
};

export default TextToSpeech;
