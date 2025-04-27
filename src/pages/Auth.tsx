import React, { useState } from "react";
import LoginForm from "./login";
import SignupForm from "./signup";

const AuthPage = () => {
  const [showLogin, setShowLogin] = useState(true);
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      {showLogin ? (
        <LoginForm onToggle={() => setShowLogin(false)} />
      ) : (
        <SignupForm onToggle={() => setShowLogin(true)} />
      )}
    </div>
  );
};

export default AuthPage;
