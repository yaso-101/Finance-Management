import React, { useState } from 'react';
import { Eye, EyeOff, LogIn, Mail, Lock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import useAuthRedirect from "@/hooks/useAuthRedirect";

const LoginForm = ({ onToggle }: { onToggle: () => void }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { toast } = useToast();

  const loading = useAuthRedirect({ redirectIfAuth: true, redirectIfAuthTo: "/" });
  if (loading) return <div className="flex items-center justify-center min-h-screen">Checking session...</div>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    try {
      const res = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast({ title: "Success", description: "Logged in! Redirecting...", variant: "default" });
        setTimeout(() => {
          window.location.href = "/";
        }, 700);
      } else {
        toast({ title: "Login Failed", description: data.error || "Invalid credentials", variant: "destructive" });
      }
    } catch (err) {
      toast({ title: "Error", description: "Server error", variant: "destructive" });
    }
  };

  return (
    <div className="w-full max-w-md p-8 rounded-2xl bg-white/80 backdrop-blur-md shadow-xl animate-fade-in flex flex-col items-center">
      <img
        src="/favicon.ico"
        alt="Clarity Finance Logo"
        className="h-14 w-14 mb-4 rounded-full shadow-lg animate-slide-up"
        style={{ animationDelay: '0.1s' }}
      />
      <form onSubmit={handleSubmit} className="space-y-6 w-full animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-5 w-5 text-primary" />
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10 bg-primary/10 border-primary/30 focus:border-primary focus:ring-primary/40 transition"
          />
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-5 w-5 text-primary" />
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10 bg-primary/10 border-primary/30 focus:border-primary focus:ring-primary/40 transition"
          />
          <button
            type="button"
            className="absolute right-3 top-3 text-primary"
            onClick={() => setShowPassword((prev) => !prev)}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        <Button
          type="submit"
          className="w-full bg-primary text-white font-semibold rounded-full py-3 shadow-md hover:bg-primary/90 transition animate-slide-up"
          style={{ animationDelay: '0.3s' }}
        >
          <LogIn className="mr-2 h-5 w-5" /> Log In
        </Button>
      </form>
      <div className="mt-6 text-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
        <span className="text-gray-600">Don't have an account?</span>
        <button
          type="button"
          onClick={onToggle}
          className="ml-2 text-primary font-semibold hover:underline"
        >
          Sign up
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
