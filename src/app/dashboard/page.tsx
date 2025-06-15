"use client";

import React, { useEffect, useState } from 'react';
import LogoutButton from '../../components/LogoutButton';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';
import { useSound } from '../../context/SoundContext';
import SoundToggle from '@/components/SoundToggle';

import { db } from '../../lib/firebase'; 
import { collection, getDocs, doc, getDoc } from 'firebase/firestore'; 

type Lesson = {
  id: string;
  title: string;
  // add other fields if needed
};

export default function DashboardPage ()  {
  const { playBackground } = useSound();

  useEffect(() => {
    playBackground();
  }, [playBackground]);

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [progress, setProgress] = useState<string[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchLessons = async () => {
      const querySnapshot = await getDocs(collection(db, "lessons"));
      const fetchedLessons = querySnapshot.docs.map(doc => {
        const data = doc.data() as { title: string };  // add fields as needed
        return { id: doc.id, ...data };
      });
      setLessons(fetchedLessons);
    };

    const fetchProgress = async () => {
      if (!user) return;
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        setProgress(data.progress || []);
      }
    };

    fetchLessons();
    fetchProgress();
  }, [user]);

  return (
    <ProtectedRoute>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <SoundToggle />
        <h1 className="text-2xl font-bold mb-4">Your Lessons</h1>
        <div className="flex flex-col gap-2">
          {lessons.map(lesson => (
            <div key={lesson.id} className="flex justify-between w-64">
              <Link href={`/lessons/${lesson.id}`} className="underline text-blue-600">
                {lesson.title}
              </Link>
              {progress.includes(lesson.id) ? (
                <span className="text-green-500">Completed✅</span>
              ) : (
                <span className="text-gray-500">In Progress</span>
              )}
            </div>
          ))}
        </div>
        <div className="mt-8">
          <LogoutButton />
        </div>
      </div>
    </ProtectedRoute>
  );
}
