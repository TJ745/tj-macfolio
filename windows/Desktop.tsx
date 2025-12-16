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
import FaceTime from "./Facetime";
import Music from "./Music";
import Spotify from "./Spotify";
import Weather from "./Weather";
import Notes from "./Notes";
import Calculator from "./Calculator";
import Calendar from "./Calendar";
import Snake from "./Snake";
import Settings from "./Settings";

import Text from "./Text";
import ImageWin from "./ImageWin";
import Resume from "./Resume";

import Launchpad from "@/components/Launchpad";

import useWindowStore, { WindowKey } from "@/store/window";

interface DesktopProps {
  onLogout: () => void;
  onSleep: () => void;
  onShutdown: () => void;
  onRestart: () => void;
  initialBrightness: number;
  onBrightnessChange: (value: number) => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export default function Desktop({
  onLogout,
  onSleep,
  onShutdown,
  onRestart,
  initialBrightness,
  onBrightnessChange,
  isDark,
  onToggleTheme,
}: DesktopProps) {
  const [screenBrightness, setScreenBrightness] = useState(initialBrightness);
  const [showControlCenter, setShowControlCenter] = useState(false);
  const [showSpotlight, setShowSpotlight] = useState(false);

  const desktopRef = useRef<HTMLDivElement>(null);
  const { windows } = useWindowStore();

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

  const activeWindowEntry = Object.entries(windows)
    .filter(([, win]) => win.isOpen)
    .sort((a, b) => b[1].zIndex - a[1].zIndex)[0]; // top-most window

  const activeWindow = activeWindowEntry
    ? {
        id: activeWindowEntry[0],
        title: activeWindowEntry[1].title, // use the title from your window object
      }
    : null;

  return (
    <div className="relative">
      <div
        ref={desktopRef}
        className={`relative h-screen w-screen overflow-hidden`}
        onClick={handleDesktopClick}
      >
        <Wallpaper isDark={isDark} />
        <HomePage />
        <Welcome />

        <Navbar
          onLogout={onLogout}
          onSleep={onSleep}
          onShutdown={onShutdown}
          onRestart={onRestart}
          onSpotlightClick={toggleSpotlight}
          onControlCenterClick={toggleControlCenter}
          activeWindow={activeWindow}
          isDark={isDark}
        />

        {/* Control Center */}
        {showControlCenter && (
          <ControlCenter
            onClose={() => setShowControlCenter(false)}
            brightness={screenBrightness}
            onBrightnessChange={updateBrightness}
            isDark={isDark}
            onToggleTheme={onToggleTheme}
          />
        )}

        {/* Spotlight */}
        {showSpotlight && <Spotlight onClose={() => setShowSpotlight(false)} />}

        <Dock />

        {Object.entries(windows).map(([key, win]) => {
          if (!win.isOpen) return null;

          const style: React.CSSProperties = win.isMaximized
            ? {
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                zIndex: win.zIndex,
              }
            : { zIndex: win.zIndex };

          // Map window keys to imported wrappers
          switch (key as WindowKey) {
            case "finder":
              return <Finder key={key} style={style} />;
            case "safari":
              return <Safari key={key} style={style} />;
            case "photos":
              return <Photos key={key} style={style} />;
            case "contact":
              return <Contact key={key} style={style} />;
            case "terminal":
              return <Terminal key={key} style={style} />;
            case "txtfile":
              return <Text key={key} style={style} />;
            case "imgfile":
              return <ImageWin key={key} style={style} />;
            case "resume":
              return <Resume key={key} style={style} />;
            case "facetime":
              return <FaceTime key={key} style={style} />;
            case "music":
              return <Music key={key} style={style} />;
            case "spotify":
              return <Spotify key={key} style={style} />;
            case "notes":
              return <Notes key={key} style={style} isDark={isDark} />;
            case "weather":
              return <Weather key={key} style={style} />;
            case "snake":
              return <Snake key={key} style={style} />;
            case "settings":
              return <Settings key={key} style={style} />;
            case "calculator":
              return <Calculator key={key} style={style} />;
            case "calendar":
              return <Calendar key={key} style={style} isDark={isDark} />;
            default:
              return null;
          }
        })}

        {windows.launchpad.isOpen && (
          <Launchpad
            onClose={() => useWindowStore.getState().closeWindow("launchpad")}
          />
        )}
      </div>

      {/* Brightness overlay */}
      <div
        className="absolute inset-0 bg-black pointer-events-none z-50 transition-opacity duration-300"
        style={{ opacity: Math.max(0.1, 0.9 - screenBrightness / 100) }}
      />
    </div>
  );
}
