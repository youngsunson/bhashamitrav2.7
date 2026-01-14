// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { auth, googleProvider } from '@/firebaseConfig';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      setError(null);
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.error("Login Failed:", err);
      // Word Add-in এ পপআপ ব্লক হলে এই এরর আসতে পারে
      setError("লগইন করা সম্ভব হয়নি। পপআপ ব্লক করা থাকলে অনুমতি দিন।");
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Logout Failed", err);
    }
  };

  return { user, authLoading, error, loginWithGoogle, logout };
};