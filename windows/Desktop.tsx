"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import Dock from "@/components/Dock";
import Navbar from "@/components/Navbar";
import Wallpaper from "@/components/Wallpaper";
import ControlCenter from "@/components/ControlCenter";
import Spotlight from "@/components/Spotlight";

import HomePage from "@/components/HomePage";
import Welcome from "@/components/Welcome";

import Finder from "./Finder";
import Safari from "./Safari";
import Photos from "./Photos";
import Contact from "./Contact";
import Terminal from "./Terminal";

import Text from "./Text";
import ImageWin from "./ImageWin";
import Resume from "./Resume";

import useWindowStore, { WindowKey } from "@/store/window";
import Launchpad from "@/components/Launchpad";

interface DesktopProps {
  onLogout: () => void;
  onSleep: () => void;
  onShutdown: () => void;
  onRestart: () => void;
  initialDarkMode: boolean;
  onToggleDarkMode: () => void;
  initialBrightness: number;
  onBrightnessChange: (value: number) => void;
}

export default function Desktop({
  onLogout,
  onSleep,
  onShutdown,
  onRestart,
  initialDarkMode,
  onToggleDarkMode,
  initialBrightness,
  onBrightnessChange,
}: DesktopProps) {
  const [time, setTime] = useState(new Date());
  const [isDarkMode, setIsDarkMode] = useState(initialDarkMode);
  const [screenBrightness, setScreenBrightness] = useState(initialBrightness);
  const [showControlCenter, setShowControlCenter] = useState(false);
  const [showSpotlight, setShowSpotlight] = useState(false);
  const [showLaunchpad, setShowLaunchpad] = useState(false);

  const desktopRef = useRef<HTMLDivElement>(null);
  const { windows } = useWindowStore();

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setIsDarkMode(initialDarkMode);
  }, [initialDarkMode]);

  useEffect(() => {
    setScreenBrightness(initialBrightness);
  }, [initialBrightness]);

  const toggleControlCenter = () => {
    setShowControlCenter(!showControlCenter);
    if (showSpotlight) setShowSpotlight(false);
  };

  const toggleSpotlight = () => {
    setShowSpotlight(!showSpotlight);
    if (showControlCenter) setShowControlCenter(false);
  };

  const toggleLaunchpad = () => {
    setShowLaunchpad(!showLaunchpad);
    if (showControlCenter) setShowControlCenter(false);
    if (showSpotlight) setShowSpotlight(false);
  };

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    onToggleDarkMode();
  };

  const updateBrightness = (value: number) => {
    setScreenBrightness(value);
    onBrightnessChange(value);
  };

  const handleDesktopClick = (e: React.MouseEvent) => {
    if (e.target === desktopRef.current) {
      setShowControlCenter(false);
      setShowSpotlight(false);
    }
  };

  return (
    <div className="relative">
      <div
        ref={desktopRef}
        className={`relative h-screen w-screen overflow-hidden ${
          isDarkMode ? "dark" : ""
        }`}
        onClick={handleDesktopClick}
      >
        <Wallpaper isDarkMode={isDarkMode} />

        <Navbar
          onLogout={onLogout}
          onSleep={onSleep}
          onShutdown={onShutdown}
          onRestart={onRestart}
          onSpotlightClick={toggleSpotlight}
          onControlCenterClick={toggleControlCenter}
          isDarkMode={isDarkMode}
          activeWindow={null}
        />

        {/* Control Center */}
        {showControlCenter && (
          <ControlCenter
            onClose={() => setShowControlCenter(false)}
            isDarkMode={isDarkMode}
            onToggleDarkMode={toggleDarkMode}
            brightness={screenBrightness}
            onBrightnessChange={updateBrightness}
          />
        )}

        {/* Spotlight */}
        {showSpotlight && <Spotlight onClose={() => setShowSpotlight(false)} />}

        {showLaunchpad && <Launchpad onClose={() => setShowLaunchpad(false)} />}

        <Dock isDarkMode={isDarkMode} />

        <HomePage />
        <Welcome />

        {Object.entries(windows).map(([key, win]) => {
          if (!win.isOpen) return null;

          // Map window keys to imported wrappers
          switch (key as WindowKey) {
            case "finder":
              return <Finder key={key} />;
            case "safari":
              return <Safari key={key} />;
            case "photos":
              return <Photos key={key} />;
            case "contact":
              return <Contact key={key} />;
            case "terminal":
              return <Terminal key={key} />;
            case "txtfile":
              return <Text key={key} />;
            case "imgfile":
              return <ImageWin key={key} />;
            case "resume":
              return <Resume key={key} />;
            default:
              return null;
          }
        })}
      </div>

      {/* Brightness overlay */}
      <div
        className="absolute inset-0 bg-black pointer-events-none z-50 transition-opacity duration-300"
        style={{ opacity: Math.max(0.1, 0.9 - screenBrightness / 100) }}
      />
    </div>
  );
}
