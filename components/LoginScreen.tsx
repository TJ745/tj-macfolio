"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "next-themes";

interface LoginScreenProps {
  onLogin: () => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [time, setTime] = useState(new Date());
  const { theme, resolvedTheme, setTheme } = useTheme();

  const isDarkMode = (resolvedTheme ?? theme) === "dark";

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

  return (
    <div
      className="h-screen w-screen bg-cover bg-center flex flex-col items-center justify-center"
      style={{
        backgroundImage: `url('${
          isDarkMode
            ? "/images/wallpaper-night.jpg"
            : "/images/wallpaper-day.jpg"
        }')`,
      }}
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

        <h2 className="text-white text-2xl font-medium mb-6">Talha Jamil</h2>

        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <Input
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
          />

          {error && (
            <p className="text-red-500 text-sm mb-2">Please enter a password</p>
          )}
          <Button
            type="submit"
            variant="outline"
            className="mt-2 bg-white/20 backdrop-blur-md border-0 text-white hover:bg-white/30"
          >
            Login
          </Button>
        </form>
      </div>

      <div className="fixed bottom-8">
        <button
          className="text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10"
          onClick={() => setTheme(isDarkMode ? "light" : "dark")}
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
