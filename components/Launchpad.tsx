"use client";

import { dockApps } from "@/constants";
import useWindowStore, { WindowKey } from "@/store/window";
import Image from "next/image";
import { useState, useEffect } from "react";

interface LaunchpadProps {
  onClose: () => void;
}

type LaunchpadApp = {
  id: WindowKey;
  name: string;
  icon: string;
  canOpen?: boolean;
};

// Improve Launchpad appearance
export default function Launchpad({ onClose }: LaunchpadProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredApps, setFilteredApps] = useState(dockApps as LaunchpadApp[]);
  const [isVisible, setIsVisible] = useState(false);

  const { openWindow } = useWindowStore();

  useEffect(() => {
    // Animation effect
    setIsVisible(true);

    if (searchTerm) {
      setFilteredApps(
        (dockApps as LaunchpadApp[]).filter((app) =>
          app.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredApps(dockApps as LaunchpadApp[]);
    }
  }, [searchTerm]);

  const handleAppClick = (app: LaunchpadApp) => {
    openWindow(app.id);
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 bg-black/40 backdrop-blur-md z-1500 flex flex-col items-center justify-center
        transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      onClick={onClose}
    >
      <div
        className={`w-full max-w-4xl px-8 py-12 transition-transform duration-300
          ${isVisible ? "translate-y-0" : "translate-y-10"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-64 mx-auto mb-12">
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-white/20 backdrop-blur-md text-white border-0 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-white/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-8">
          {filteredApps.map((app) => (
            <div
              key={app.id}
              className="flex flex-col items-center justify-center cursor-pointer group"
              onClick={() => handleAppClick(app)}
            >
              <div className="w-16 h-16 flex items-center justify-center mb-2 rounded-xl group-hover:bg-white/20 transition-colors">
                <Image
                  src={`/images/${app.icon}`}
                  alt={app.name}
                  className="w-12 h-12 object-contain"
                  width={48}
                  height={48}
                />
              </div>
              <span className="text-white text-sm text-center">{app.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
