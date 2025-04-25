
import React from "react";
import { cn } from "@/lib/utils";
import Header from "./Header";

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const MainLayout = ({ children, className }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Header />
      <main 
        className={cn(
          "pt-24 pb-16 px-4 md:px-6 max-w-7xl mx-auto space-y-8 animate-fade-in",
          className
        )}
      >
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
