"use client";

import React from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, db } from '../lib/firebase';
import { useRouter } from 'next/navigation';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const LoginButton = () => {
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        // Create user in Firestore if not exist
        await setDoc(userRef, {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          role: 'user', // Default role
          progress: [],
          createdAt: new Date().toISOString()
        });
      }

      router.push("/dashboard");
    } catch (error) {
      console.error("Login error", error);
    }
  };

  return (
    <button onClick={handleLogin} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
      Sign in with Google
    </button>
  );
};

export default LoginButton;
