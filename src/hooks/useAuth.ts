// src/hooks/useAuth.ts
import { useState, useEffect, useCallback } from 'react';
import { auth } from '@/firebaseConfig'; // googleProvider আর লাগছে না এখানে
import { onAuthStateChanged, User } from 'firebase/auth';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
      // যদি ইউজার লগইন অবস্থায় পাওয়া যায়, এরর ক্লিয়ার করুন
      if (currentUser) setError(null);
    });
    return () => unsubscribe();
  }, []);

  const loginWithGoogle = useCallback(async () => {
    setError(null);

    // Office.js লোড হয়েছে কিনা চেক করা
    if (!window.Office || !window.Office.context) {
      setError("Office JS লোড হয়নি। ব্রাউজারে পপআপ ব্লক থাকতে পারে।");
      return;
    }

    // ডায়ালগ ইউআরএল তৈরি (বর্তমান ডোমেইন + login-popup.html)
    // যখন লোকালহোস্টে থাকবেন তখন এটি https://localhost:3000/login-popup.html হবে
    const url = `${window.location.origin}/login-popup.html`;

    window.Office.context.ui.displayDialogAsync(
      url,
      { height: 60, width: 30, displayInIframe: false },
      (asyncResult) => {
        if (asyncResult.status === window.Office.AsyncResultStatus.Failed) {
          setError(`ডায়ালগ খোলা সম্ভব হয়নি: ${asyncResult.error.message}`);
          return;
        }

        const dialog = asyncResult.value;

        // পপআপ থেকে মেসেজ রিসিভ করা
        dialog.addEventHandler(window.Office.EventType.DialogMessageReceived, (arg: any) => {
          dialog.close(); // মেসেজ পেলে ডায়ালগ বন্ধ করুন

          try {
            const message = JSON.parse(arg.message);
            
            if (message.status === 'success') {
              // ডায়ালগে লগইন সফল হয়েছে।
              // যেহেতু একই ডোমেইন (Origin), ফায়ারবেস অটোমেটিক্যালি মেইন উইন্ডোতে সিঙ্ক করে নেবে (Web-এ)।
              // তবে ডেস্কটপ অ্যাপে একটু সময় লাগতে পারে, তাই আমরা পেজ রিফ্রেশ বা রিলোড করতে পারি।
              // অথবা onAuthStateChanged অটোমেটিক ডিটেক্ট করবে।
              console.log("Login successful via dialog");
            } else {
              setError("লগইন ব্যর্থ হয়েছে: " + message.message);
            }
          } catch (e) {
            setError("লগইন প্রসেসে সমস্যা হয়েছে।");
          }
        });

        // ডায়ালগ বন্ধ হলে হ্যান্ডেল করা
        dialog.addEventHandler(window.Office.EventType.DialogEventReceived, () => {
          // ইউজার যদি ক্রস (X) দিয়ে কেটে দেয়
          // setError("লগইন বাতিল করা হয়েছে।");
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
