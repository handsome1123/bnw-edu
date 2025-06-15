"use client";

import React, { useState } from "react";
import { db } from "../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

export default function LessonForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([{ question: "", options: ["", "", ""], answer: "" }]);

  const handleQuestionChange = (
    index: number,
    field: "question" | "options" | "answer",
    value: string | string[]
  ) => {
    const updatedQuestions = [...questions];
    if (field === "options" && Array.isArray(value)) {
      updatedQuestions[index].options = value;
    } else if ((field === "question" || field === "answer") && typeof value === "string") {
      updatedQuestions[index][field] = value;
    }
    setQuestions(updatedQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, { question: "", options: ["", "", ""], answer: "" }]);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const lessonId = uuidv4();
    await setDoc(doc(db, "lessons", lessonId), {
      title,
      description,
      questions,
    });

    alert("Lesson created successfully!");
    setTitle("");
    setDescription("");
    setQuestions([{ question: "", options: ["", "", ""], answer: "" }]);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-[500px]">

      <input
        type="text"
        placeholder="Lesson Title"
        className="border p-2"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <textarea
        placeholder="Lesson Description"
        className="border p-2"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />

      <h3 className="font-bold text-lg">Questions</h3>

      {questions.map((q, index) => (
        <div key={index} className="border p-3 rounded bg-gray-50">
          <input
            type="text"
            placeholder="Question"
            className="border p-2 w-full mb-2"
            value={q.question}
            onChange={(e) => handleQuestionChange(index, "question", e.target.value)}
            required
          />
          <div className="flex flex-col gap-2">
            {q.options.map((opt, optIndex) => (
              <input
                key={optIndex}
                type="text"
                placeholder={`Option ${optIndex + 1}`}
                className="border p-2"
                value={opt}
                onChange={(e) => {
                  const newOptions = [...q.options];
                  newOptions[optIndex] = e.target.value;
                  handleQuestionChange(index, "options", newOptions);
                }}
                required
              />
            ))}
          </div>

          <input
            type="text"
            placeholder="Correct Answer"
            className="border p-2 mt-2 w-full"
            value={q.answer}
            onChange={(e) => handleQuestionChange(index, "answer", e.target.value)}
            required
          />
        </div>
      ))}

      <button
        type="button"
        onClick={addQuestion}
        className="bg-yellow-500 text-white px-4 py-2 rounded"
      >
        + Add Question
      </button>

      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
        Save Lesson
      </button>
    </form>
  );
}
