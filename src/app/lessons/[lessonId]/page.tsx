"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useAuth } from "../../../context/AuthContext";
import ProtectedRoute from "../../../components/ProtectedRoute";
import { useSound } from "../../../context/SoundContext";
import LoadingSpinner from "../../../components/LoadingSpinner";

type Question = {
  question: string;
  options: string[];
  answer: string;
};

type Lesson = {
  title: string;
  questions: Question[];
};

export default function LessonPage() {
  const { play } = useSound();
  const { lessonId } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [bgColor, setBgColor] = useState("");

  const speak = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      speechSynthesis.cancel();
      speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    const fetchLesson = async () => {
      const lessonRef = doc(db, "lessons", lessonId as string);
      const lessonSnap = await getDoc(lessonRef);
      if (lessonSnap.exists()) {
        const lessonData = lessonSnap.data() as Lesson;
        setLesson(lessonData);
        speak(lessonData.questions[0].question);
      }
    };
    fetchLesson();
  }, [lessonId]);

  useEffect(() => {
    if (lesson) {
      speak(lesson.questions[currentQuestionIndex].question);
    }
  }, [currentQuestionIndex, lesson]);

  const handleAnswer = () => {
    const currentQuestion = lesson!.questions[currentQuestionIndex];
    if (selectedOption === currentQuestion.answer) {
      setScore(score + 1);
      play("correct.mp3");
      setBgColor("bg-green-100");
    } else {
      play("wrong.mp3");
      setBgColor("bg-red-100");
    }

    setTimeout(() => {
      if (currentQuestionIndex + 1 < lesson!.questions.length) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedOption("");
        setBgColor("");
      } else {
        setFinished(true);
        updateProgress();
      }
    }, 1000);
  };

  const updateProgress = async () => {
    const userRef = doc(db, "users", user!.uid);
    await updateDoc(userRef, {
      progress: arrayUnion(lessonId),
    });
    play("finish.mp3");
  };

  if (!lesson)
    return (
      <LoadingSpinner
        message="Loading lesson..."
        size="lg"
        color="text-indigo-600"
      />
    );

  if (finished) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-indigo-100 to-purple-200 text-center">
        <div className="bg-white shadow-xl rounded-xl p-8 max-w-md">
          <h2 className="text-3xl font-bold text-indigo-700 mb-4">
            🎉 Lesson Completed!
          </h2>
          <p className="text-lg mb-4">
            Your score: <span className="font-semibold">{score}</span> /{" "}
            {lesson.questions.length}
          </p>
          <button
            className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition"
            onClick={() => router.push("/dashboard")}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = lesson.questions[currentQuestionIndex];

  return (
    <ProtectedRoute>
      <div
        className={`flex flex-col items-center justify-center min-h-screen px-4 py-10 transition-all duration-500 ${bgColor}`}
      >
        <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-xl text-center space-y-6">
          <h2 className="text-gl font-bold text-indigo-700">
            📘 {lesson.title}
          </h2>
          <p className="text-2xl text-gray-800">{currentQuestion.question}</p>

          <button
            onClick={() => speak(currentQuestion.question)}
            className="text-indigo-500 hover:underline"
          >
            🔊 Read Question Aloud
          </button>

          <div className="flex flex-col gap-3">
            {currentQuestion.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedOption(option)}
                className={`px-4 py-2 rounded border transition ${
                  selectedOption === option
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          <button
            disabled={!selectedOption}
            onClick={handleAnswer}
            className="bg-green-500 disabled:bg-green-200 text-white px-6 py-2 rounded mt-4 transition hover:bg-green-600"
          >
            {currentQuestionIndex + 1 === lesson.questions.length
              ? "Finish Lesson"
              : "Next Question"}
          </button>
        </div>
      </div>
    </ProtectedRoute>
  );
}
