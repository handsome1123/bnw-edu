"use client";

import React, { useEffect } from 'react';
import LoginButton from '../components/LoginButton';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Next.js 13 Firebase Auth</h1>
      <LoginButton />
    </div>
  );
}
