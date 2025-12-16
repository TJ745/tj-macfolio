"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

import BootScreen from "@/components/BootScreen";
import LoginScreen from "@/components/LoginScreen";
import Desktop from "@/windows/Desktop";
import SleepScreen from "@/components/SleepScreen";
import ShutdownScreen from "@/components/ShutdownScreen";

import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
gsap.registerPlugin(Draggable);

type SystemState =
  | "booting"
  | "login"
  | "desktop"
  | "sleeping"
  | "shutdown"
  | "restarting";

export default function Home() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted] = useState(() => typeof window !== "undefined");
  const [systemState, setSystemState] = useState<SystemState>("booting");

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

  if (!mounted) return null;

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

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
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
        return <LoginScreen onLogin={handleLogin} />;

      case "desktop":
        return (
          <Desktop
            onLogout={handleLogout}
            onSleep={handleSleep}
            onShutdown={handleShutdown}
            onRestart={handleRestart}
            isDark={resolvedTheme === "dark"}
            onToggleTheme={toggleTheme} // optional
            initialBrightness={screenBrightness}
            onBrightnessChange={updateBrightness}
          />
        );

      case "sleeping":
        return <SleepScreen onWakeUp={handleWakeUp} />;

      case "shutdown":
        return <ShutdownScreen onBoot={handleBoot} />;

      default:
        return <BootScreen />;
    }
  };

  return (
    <div className={`relative ${resolvedTheme === "dark" ? "dark" : ""}`}>
      {renderScreen()}

      {/* Brightness overlay - apply to all screens */}
      <div
        className="absolute inset-0 bg-black pointer-events-none z-50 transition-opacity duration-300"
        style={{ opacity: Math.max(0.1, 0.9 - screenBrightness / 100) }}
      />
    </div>
  );
}
