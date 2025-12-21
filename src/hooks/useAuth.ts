// src/hooks/useAuth.ts
import { useState, useEffect, useCallback } from 'react';
import { auth } from '@/firebaseConfig';
import { onAuthStateChanged, User } from 'firebase/auth';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
      if (currentUser) setError(null);
    });
    return () => unsubscribe();
  }, []);

  const loginWithGoogle = useCallback(async () => {
    setError(null);

    if (!window.Office || !window.Office.context) {
      setError("Office JS লোড হয়নি। ব্রাউজারে পপআপ ব্লক থাকতে পারে।");
      return;
    }

    // --- ফিক্স শুরু ---
    // আগে ছিল: const url = `${window.location.origin}/login-popup.html`;
    // এখন আমরা ডাইনামিক ভাবে পুরো পাথ নিচ্ছি যাতে GitHub Pages এ কাজ করে
    const currentUrl = window.location.href;
    const basePath = currentUrl.substring(0, currentUrl.lastIndexOf('/') + 1);
    const url = `${basePath}login-popup.html`;
    // --- ফিক্স শেষ ---

    console.log("Dialog URL:", url); // কনসোলে চেক করার জন্য

    window.Office.context.ui.displayDialogAsync(
      url,
      { height: 60, width: 30, displayInIframe: false },
      (asyncResult) => {
        if (asyncResult.status === window.Office.AsyncResultStatus.Failed) {
          setError(`ডায়ালগ খোলা সম্ভব হয়নি: ${asyncResult.error.message}`);
          return;
        }

        const dialog = asyncResult.value;

        dialog.addEventHandler(window.Office.EventType.DialogMessageReceived, (arg: any) => {
          dialog.close();
          try {
            const message = JSON.parse(arg.message);
            if (message.status === 'success') {
              console.log("Login successful via dialog");
            } else {
              setError("লগইন ব্যর্থ হয়েছে: " + message.message);
            }
          } catch (e) {
            setError("লগইন প্রসেসে সমস্যা হয়েছে।");
          }
        });
      }
    );
  }, []);

  const logout = async () => {
    try {
      await auth.signOut();
    } catch (err) {
      console.error("Logout Failed", err);
    }
  };

  return { user, authLoading, error, loginWithGoogle, logout };
};
