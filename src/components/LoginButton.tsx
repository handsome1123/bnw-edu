"use client";

import React, { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, db } from '../lib/firebase';
import { useRouter } from 'next/navigation';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const LoginButton = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setErrorMsg("");

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
    } catch (error) {
      console.error("Login error", error);
      setErrorMsg("Failed to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleLogin}
        className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        disabled={loading}
      >
        {loading ? "Signing in..." : "Sign in with Google"}
      </button>

      {errorMsg && (
        <p className="text-red-500 mt-2">{errorMsg}</p>
      )}
    </div>
  );
};

export default LoginButton;
