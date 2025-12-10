"use client";

import { useState, useEffect } from "react";
import BootScreen from "@/components/BootScreen";
import LoginScreen from "@/components/LoginScreen";
import Desktop from "@/windows/Desktop";
import SleepScreen from "@/components/SleepScreen";
import ShutdownScreen from "@/components/ShutdownScreen";

type SystemState =
  | "booting"
  | "login"
  | "desktop"
  | "sleeping"
  | "shutdown"
  | "restarting";

import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
gsap.registerPlugin(Draggable);

export default function Home() {
  const [systemState, setSystemState] = useState<SystemState>("booting");
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("isDarkMode") === "true";
    }
    return false;
  });

  const [screenBrightness, setScreenBrightness] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("screenBrightness");
      return saved ? Number(saved) : 90;
    }
    return 90;
  });

  useEffect(() => {
    if (systemState === "booting" || systemState === "restarting") {
      const timer = setTimeout(() => {
        setSystemState("login");
      }, 3000); // 3 seconds boot sequence

      return () => clearTimeout(timer);
    }
  }, [systemState]);

  const handleLogin = () => {
    setSystemState("desktop");
  };

  const handleLogout = () => {
    setSystemState("login");
  };

  const handleSleep = () => {
    setSystemState("sleeping");
  };

  const handleWakeUp = () => {
    setSystemState("login");
  };

  const handleShutdown = () => {
    setSystemState("shutdown");
  };

  const handleBoot = () => {
    setSystemState("booting");
  };

  const handleRestart = () => {
    setSystemState("restarting");
  };

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("isDarkMode", newMode.toString());
  };

  const updateBrightness = (value: number) => {
    setScreenBrightness(value);
    localStorage.setItem("screenBrightness", value.toString());
  };

  // Render the appropriate screen based on system state
  const renderScreen = () => {
    switch (systemState) {
      case "booting":
      case "restarting":
        return <BootScreen />;

      case "login":
        return (
          <LoginScreen
            onLogin={handleLogin}
            isDarkMode={isDarkMode}
            onToggleDarkMode={toggleDarkMode}
          />
        );

      case "desktop":
        return (
          <Desktop
            onLogout={handleLogout}
            onSleep={handleSleep}
            onShutdown={handleShutdown}
            onRestart={handleRestart}
            initialDarkMode={isDarkMode}
            onToggleDarkMode={toggleDarkMode}
            initialBrightness={screenBrightness}
            onBrightnessChange={updateBrightness}
          />
        );

      case "sleeping":
        return <SleepScreen onWakeUp={handleWakeUp} isDarkMode={isDarkMode} />;

      case "shutdown":
        return <ShutdownScreen onBoot={handleBoot} />;

      default:
        return <BootScreen />;
    }
  };

  return (
    <div className="relative">
      {renderScreen()}

      {/* Brightness overlay - apply to all screens */}
      <div
        className="absolute inset-0 bg-black pointer-events-none z-50 transition-opacity duration-300"
        style={{ opacity: Math.max(0.1, 0.9 - screenBrightness / 100) }}
      />
    </div>
  );
}
