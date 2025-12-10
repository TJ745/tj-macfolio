"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { User, Moon, Sun } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
import Image from "next/image";

interface LoginScreenProps {
  onLogin: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function LoginScreen({
  onLogin,
  isDarkMode,
  onToggleDarkMode,
}: LoginScreenProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [time, setTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length >= 0) {
      onLogin();
    } else {
      setError(true);
    }
  };

  const formattedTime = time.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const formattedDate = time.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  // Choose wallpaper based on dark/light mode
  const wallpaper = isDarkMode ? "/wallpaper-night.jpg" : "/wallpaper-day.jpg";

  return (
    <div
      className="h-screen w-screen bg-cover bg-center flex flex-col items-center justify-center"
      style={{ backgroundImage: `url('${wallpaper}')` }}
    >
      <div className="flex flex-col items-center mb-8">
        <div className="text-white text-5xl font-light mb-2">
          {formattedTime}
        </div>
        <div className="text-white text-xl font-light">{formattedDate}</div>
      </div>

      <div className="flex flex-col items-center">
        <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center mb-4">
          <span className="text-white text-5xl font-bold">TJ</span>
        </div>
        {/* <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-300 flex items-center justify-center mb-4">
          <Image
            src="/letter-d.png"
            alt="User avatar"
            width={96}
            height={96}
            className="object-cover w-full h-full"
          />
        </div> */}
        <h2 className="text-white text-2xl font-medium mb-6">Talha Jamil</h2>

        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          {/* <Input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
            className={`w-64 bg-white/20 backdrop-blur-md border-0 text-white placeholder:text-white/70 mb-2 ${
              error ? "ring-2 ring-red-500" : ""
            }`}
          /> */}

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
            className={`w-64 bg-white/20 backdrop-blur-md border-0 text-white placeholder:text-white/70 mb-2 ${
              error ? "ring-2 ring-red-500" : ""
            } flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm`}
          />

          {error && (
            <p className="text-red-500 text-sm mb-2">Please enter a password</p>
          )}
          {/* <Button
            type="submit"
            variant="outline"
            className="mt-2 bg-white/20 backdrop-blur-md border-0 text-white hover:bg-white/30"
          >
            Login
          </Button> */}

          <button
            type="submit"
            // variant="outline"
            className="border border-input bg-background hover:bg-accent hover:text-accent-foreground mt-2 bg-white/20 backdrop-blur-md text-white hover:bg-white/30 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-12 w-24"
          >
            Login
          </button>
        </form>
      </div>

      <div className="fixed bottom-8">
        <button
          className="text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10"
          onClick={onToggleDarkMode}
        >
          {isDarkMode ? (
            <Sun className="w-6 h-6" />
          ) : (
            <Moon className="w-6 h-6" />
          )}
        </button>
      </div>
    </div>
  );
}
