"use client";

import React, { useEffect } from 'react';
import LoginButton from '../components/LoginButton';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import LoadingSpinner from '../components/LoadingSpinner';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();


  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) {
    // Use the LoadingSpinner component here
    return <LoadingSpinner message="Checking authentication..." size="lg" color="text-indigo-600" />;
  }

  // Main Home Page content (only shown once authLoading is false)
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-50 to-green-50 relative overflow-hidden"
    >
      {/* Playful background shapes (assuming you have 'animate-blob' defined in tailwind.config.js) */}
      <div className="absolute top-0 left-0 w-48 h-48 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>

      <div className="relative z-10 bg-white p-8 md:p-12 rounded-2xl shadow-xl flex flex-col items-center max-w-xl text-center">
        <div className="w-64 h-48 md:w-80 md:h-60 mb-6 flex items-center justify-center">
          <Image
            src="/images/hero.png"
            alt="Happy kids learning English"
            width={320}
            height={240}
            className="max-w-full h-auto animate-pop-in" // Apply your chosen animation here
            priority // Assuming this is above the fold
          />
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4 tracking-tight leading-tight">
          Welcome to <span className="text-emerald-600">Black And White EDU</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 font-padauk leading-relaxed">
          အင်္ဂလိပ်စာ လေ့လာရန် ကြိုဆိုပါတယ်!
        </p>

        {/* Since LoginButton now handles its own state, you just render it */}
        <LoginButton /> {/* No longer needs onClick, loading, errorMsg props here */}
      </div>
    </div>
  );
}

