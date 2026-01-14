// src/components/LoginScreen.tsx
import React from 'react';

interface LoginScreenProps {
  onLogin: () => void;
  error: string | null;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, error }) => {
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="app-logo-large">🌟</div>
        <h1>ভাষা মিত্রে স্বাগতম</h1>
        <p>বাংলা বানান ও ব্যাকরণ পরীক্ষক</p>
        
        <div className="login-divider"></div>

        <button onClick={onLogin} className="google-btn">
          <img 
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
            alt="Google G" 
          />
          Google দিয়ে লগইন করুন
        </button>

        {error && <p className="login-error">{error}</p>}

        <p className="login-footer">
          ব্যবহার শুরু করতে লগইন প্রয়োজন
        </p>
      </div>
    </div>
  );
};