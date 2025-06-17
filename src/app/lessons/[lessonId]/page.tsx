"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useAuth } from "../../../context/AuthContext";
import ProtectedRoute from "../../../components/ProtectedRoute";
import { useSound } from "../../../context/SoundContext";
import LoadingSpinner from '../../../components/LoadingSpinner';

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

  useEffect(() => {
    const fetchLesson = async () => {
      const lessonRef = doc(db, "lessons", lessonId as string);
      const lessonSnap = await getDoc(lessonRef);
      if (lessonSnap.exists()) {
        setLesson(lessonSnap.data() as Lesson);
      }
    };
    fetchLesson();
  }, [lessonId]);

  if (!lesson) return <LoadingSpinner message="Checking authentication..." size="lg" color="text-indigo-600" />;

  const handleAnswer = () => {
    const currentQuestion = lesson.questions[currentQuestionIndex];
    if (selectedOption === currentQuestion.answer) {
      setScore(score + 1);
      play("correct.mp3");
      setBgColor("bg-green-100");
    } else {
      play("wrong.mp3");
      setBgColor("bg-red-100");
    }

    setTimeout(() => {
      if (currentQuestionIndex + 1 < lesson.questions.length) {
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

  if (finished) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold mb-4">Lesson Completed!</h2>
        <p>Your score: {score} / {lesson.questions.length}</p>
        <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded" onClick={() => router.push("/dashboard")}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  const currentQuestion = lesson.questions[currentQuestionIndex];

  return (
    <ProtectedRoute>
      <div className={`flex flex-col items-center justify-center min-h-screen ${bgColor}`}>
        <h2 className="text-xl font-bold mb-4">{lesson.title}</h2>
        <p className="mb-4">{currentQuestion.question}</p>
        <div className="flex flex-col gap-2 mb-4">
          {currentQuestion.options.map((option: string, idx: number) => (
            <button
              key={idx}
              onClick={() => setSelectedOption(option)}
              className={`px-4 py-2 border rounded ${selectedOption === option ? "bg-blue-500 text-white" : "bg-white"}`}
            >
              {option}
            </button>
          ))}
        </div>
        <button
          disabled={!selectedOption}
          onClick={handleAnswer}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          {currentQuestionIndex + 1 === lesson.questions.length ? "Finish" : "Next"}
        </button>
      </div>
    </ProtectedRoute>
  );
}
