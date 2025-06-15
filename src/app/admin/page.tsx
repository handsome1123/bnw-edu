"use client";

import React from "react";
import ProtectedRoute from "../../components/ProtectedRoute";
import LessonForm from "../../components/LessonForm";

export default function AdminPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Admin Panel - Create Lesson</h1>
        <LessonForm />
      </div>
    </ProtectedRoute>
  );
}
