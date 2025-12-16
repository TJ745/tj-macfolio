"use client";

import { Search } from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import useWindowStore from "@/store/window";
import { dockApps } from "@/constants";

interface SpotlightProps {
  onClose: () => void;
}

export default function Spotlight({ onClose }: SpotlightProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const { openWindow } = useWindowStore();

  const filteredApps = useMemo(() => {
    if (!searchTerm) return dockApps;
    return dockApps.filter((app) =>
      app.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleAppClick = useCallback(
    (app: (typeof dockApps)[0]) => {
      const windowId = app.id as keyof ReturnType<
        typeof useWindowStore.getState
      >["windows"];
      openWindow(windowId);
      onClose();
    },
    [openWindow, onClose]
  );

  useEffect(() => {
    // Focus the input when spotlight opens
    inputRef.current?.focus();

    // Handle escape key to close
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        setSelectedIndex((prev) =>
          prev < filteredApps.length - 1 ? prev + 1 : prev
        );
        e.preventDefault();
      } else if (e.key === "ArrowUp") {
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        e.preventDefault();
      } else if (e.key === "Enter" && filteredApps.length > 0) {
        handleAppClick(filteredApps[selectedIndex]);
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [filteredApps, selectedIndex, handleAppClick, onClose]);

  useEffect(() => {
    requestAnimationFrame(() => setSelectedIndex(0));
  }, [filteredApps]);

  return (
    <div
      className="fixed inset-0 bg-transparent z-40 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-gray-800/80 backdrop-blur-xl rounded-xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search"
            className="w-full bg-transparent text-white border-0 py-4 pl-12 pr-4 focus:outline-none text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {filteredApps.length > 0 && (
          <div className="max-h-80 overflow-y-auto">
            {filteredApps.map((app, index) => (
              <div
                key={app.id}
                className={`flex items-center px-4 py-3 cursor-pointer ${
                  index === selectedIndex ? "bg-blue-500" : "hover:bg-gray-700"
                }`}
                onClick={() => handleAppClick(app)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div className="w-8 h-8 flex items-center justify-center mr-3">
                  <Image
                    src={`/images/${app.icon}` || "/placeholder.svg"}
                    alt={app.name}
                    className="w-6 h-6 object-contain"
                    height={6}
                    width={6}
                  />
                </div>
                <span className="text-white">{app.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
