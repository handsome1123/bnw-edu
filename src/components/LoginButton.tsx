// components/LoginButton.tsx (or .js if not using TypeScript)
"use client";

import React, { useState } from 'react';
import { signInWithPopup } from 'firebase/auth'; // Import AuthError
import { auth, googleProvider, db } from '../lib/firebase';
import { useRouter } from 'next/navigation';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import Image from 'next/image';


interface LoginButtonProps {
  className?: string; // Allows for external styling overrides
}

const LoginButton: React.FC<LoginButtonProps> = ({ className }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async () => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          role: 'user',
          progress: [],
          createdAt: new Date().toISOString()
        });
      }

      router.push("/dashboard");
    } catch (error) { // No longer 'any'
      console.error("Login error:", error);
      // Check if error has a Firebase Auth error code
      if (error && typeof error === 'object' && 'code' in error) {
        const err = error as { code: string; message?: string };
        switch (err.code) {
          case 'auth/popup-closed-by-user':
            setErrorMsg("Sign-in cancelled. Please try again.");
            break;
          case 'auth/cancelled-popup-request':
            setErrorMsg("Sign-in already in progress. Please wait or try again.");
            break;
          case 'auth/network-request-failed':
            setErrorMsg("Network error. Please check your internet connection.");
            break;
          case 'auth/operation-not-allowed':
            setErrorMsg("Sign-in method not enabled. Contact support.");
            break;
          case 'auth/account-exists-with-different-credential':
             setErrorMsg("An account with this email already exists using a different sign-in method. Please try signing in with your existing method.");
             break;
          // Add more specific Firebase Auth error codes if you encounter them
          default:
            setErrorMsg(`Sign-in failed: ${err.message || "An unknown error occurred."}`);
        }
      } else {
        // Fallback for non-Firebase errors or unexpected errors
        setErrorMsg("An unexpected error occurred during sign-in.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={handleLogin}
        disabled={loading}
        className={`
          flex items-center justify-center
          bg-[#4285F4] text-white
          font-semibold py-3 px-6
          rounded-lg
          shadow-md
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-[#4285F4] focus:ring-opacity-50
          w-full md:w-auto
          min-w-[240px]
          ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#357AE8]'}
          ${className || ''}
        `}
        aria-label={loading ? "Signing in..." : "Sign in with Google"}
      >
        {loading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Signing in...
          </>
        ) : (
          <>
            <div className="mr-3 bg-white p-2 rounded-sm flex items-center justify-center">
              <Image
                src="/images/google-g-logo.png"
                alt="Google G logo"
                width={20}
                height={20}
                className="block"
              />
            </div>
            <span className="text-lg">Sign in with Google</span>
          </>
        )}
      </button>

      {errorMsg && (
        <p className="text-red-500 mt-2 text-sm text-center max-w-xs">
          {errorMsg}
        </p>
      )}
    </div>
  );
};

export default LoginButton;