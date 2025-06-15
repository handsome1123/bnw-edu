"use client";

import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

const ProtectedRoute = ({ children, requiredRole }: { children: React.ReactNode, requiredRole?: string }) => {
  const { user, loading, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/");
      } else if (requiredRole && role !== requiredRole) {
        router.push("/unauthorized");
      }
    }
  },
    [user, loading, role, requiredRole, router]);

  if (loading) 
    return <p>Loading...</p>;
  

  return <>{children}</>;
};

export default ProtectedRoute;
