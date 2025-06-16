"use client";

import React, { useEffect } from 'react';
import LoginButton from '../components/LoginButton';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) {
    // Elegant loading state with a spinner or custom animation
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-green-100">
        {/* Replace with a beautiful spinner SVG or Lottie animation */}
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-lg text-gray-700 font-semibold">Loading your learning journey...</p>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-50 to-green-50 relative overflow-hidden"
      // You can add subtle background patterns here later via CSS or a background image
    >
      {/* Example: Playful background shapes or subtle patterns */}
      <div className="absolute top-0 left-0 w-48 h-48 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>

      <div className="relative z-10 bg-white p-8 md:p-12 rounded-2xl shadow-xl flex flex-col items-center max-w-xl text-center">
        {/* Placeholder for your main illustration */}
        {/* You'd replace this with an actual SVG/Image component */}
        <div className="w-64 h-48 md:w-80 md:h-60 mb-6 flex items-center justify-center">
          <Image src="/images/hero.png" alt="Happy kids learning English" className="max-w-full h-auto" />
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4 tracking-tight leading-tight">
          Welcome to <span className="text-emerald-600">Black And White EDU</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 font-padauk leading-relaxed">
          အင်္ဂလိပ်စာ လေ့လာရန် ကြိုဆိုပါတယ်!
        </p>

        <LoginButton
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transform transition-transform duration-300 hover:scale-105"
        />
        {/* Tailwind's default LoginButton styling might need to be customized if it's a separate component */}
      </div>
    </div>
  );
}

