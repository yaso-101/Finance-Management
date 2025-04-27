import { Link, useLocation } from "react-router-dom";
import { BarChart, Home, LogOut } from "lucide-react";
import { signOut } from "@/utils/auth";

const Header = () => {
  const location = useLocation();
  const navItems = [
    { name: "Dashboard", path: "/", icon: Home },
    { name: "Analysis", path: "/analysis", icon: BarChart },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 animate-fade-in backdrop-blur-md bg-white/80 border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo/Brand */}
        <div className="flex items-center space-x-2 bg-black/60 p-2 rounded-full">
          <img
            src="/public/favicon.ico"
            alt="Logo"
            className="h-8 w-8 rounded-full"
          />
          <span className="font-display text-xl font-semibold tracking-tight text-white">
            Clarity Finance
          </span>
        </div>
        {/* Navigation and Sign Out on the right */}
        <div className="flex items-center space-x-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Icon className="mr-2 h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
          <button
            onClick={async () => {
              await signOut();
              window.location.href = "/login";
            }}
            className="flex items-center px-4 py-2 rounded-full bg-red-500 text-white font-semibold hover:bg-red-600 transition-all ml-2"
          >
            <LogOut className="mr-2 h-4 w-4" /> Sign Out
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
