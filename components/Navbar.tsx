"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Search, Wifi, WifiOff } from "lucide-react";
import { AppleIcon } from "./AppleIcon";
import { useTheme } from "next-themes";

interface BatteryManager {
  level: number;
  charging: boolean;
  addEventListener: (
    type: "levelchange" | "chargingchange",
    listener: () => void
  ) => void;
}
interface NavbarProps {
  onLogout: () => void;
  onSleep: () => void;
  onShutdown: () => void;
  onRestart: () => void;
  onSpotlightClick: () => void;
  onControlCenterClick: () => void;
  activeWindow: { id: string; title: string } | null;
}

const Navbar = ({
  onLogout,
  onSleep,
  onShutdown,
  onRestart,
  onSpotlightClick,
  onControlCenterClick,
  activeWindow,
}: NavbarProps) => {
  const { theme, resolvedTheme } = useTheme();
  const isDarkMode = (resolvedTheme ?? theme) === "dark";

  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [batteryLevel, setBatteryLevel] = useState(100);
  const [isCharging, setIsCharging] = useState(false);
  const [showWifiToggle, setShowWifiToggle] = useState(false);

  const [wifiEnabled, setWifiEnabled] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("wifiEnabled") === "true";
    }
    return true;
  });

  const [time, setTime] = useState<Date | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);
  const wifiRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => setTime(new Date());
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const formattedTime =
    time?.toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }) || "";

  useEffect(() => {
    if ("getBattery" in navigator) {
      // @ts-expect-error - navigator.getBattery is non-standard
      navigator.getBattery().then((battery: BatteryManager) => {
        setBatteryLevel(Math.round(battery.level * 100));
        setIsCharging(battery.charging);
        battery.addEventListener("levelchange", () =>
          setBatteryLevel(Math.round(battery.level * 100))
        );
        battery.addEventListener("chargingchange", () =>
          setIsCharging(battery.charging)
        );
      });
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }

      if (
        wifiRef.current &&
        !wifiRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest(".wifi-icon")
      ) {
        setShowWifiToggle(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenu = (menuName: string) => {
    if (activeMenu === menuName) {
      setActiveMenu(null);
    } else {
      setActiveMenu(menuName);
    }
  };

  const toggleWifi = () => {
    const newState = !wifiEnabled;
    setWifiEnabled(newState);
    localStorage.setItem("wifiEnabled", newState.toString());
  };

  const toggleWifiPopup = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowWifiToggle(!showWifiToggle);
  };

  return (
    <div
      ref={menuRef}
      className={`fixed top-0 left-0 right-0 h-10 z-1400 ${
        isDarkMode
          ? "bg-black/10 backdrop-blur-md"
          : "bg-white/10 backdrop-blur-md"
      } z-50 flex items-center px-5 p-2 ${
        isDarkMode ? "text-white" : "text-gray-800"
      }`}
    >
      <div className="flex-1 flex items-center gap-3">
        <button
          className="flex items-center hover:bg-white/10 px-2 py-0.5 rounded cursor-pointer"
          onClick={() => toggleMenu("apple")}
        >
          <AppleIcon className="w-7 h-7" />
        </button>

        {activeMenu === "apple" && (
          <div
            className={`absolute top-10 left-2 ${
              isDarkMode
                ? "bg-gray-800/90 backdrop-blur-md"
                : "bg-gray-300/90 backdrop-blur-md"
            } rounded-lg shadow-xl ${
              isDarkMode ? "text-white" : "text-gray-800"
            } py-1 w-56`}
          >
            <button
              className={`w-full text-left px-4 py-1 ${
                isDarkMode ? "hover:bg-blue-600" : "hover:bg-blue-400"
              }`}
            >
              About This Mac
            </button>
            <div className="border-t border-gray-700 my-1"></div>
            <button
              className={`w-full text-left px-4 py-1 ${
                isDarkMode ? "hover:bg-blue-600" : "hover:bg-blue-400"
              }`}
            >
              System Settings...
            </button>
            <button
              className={`w-full text-left px-4 py-1 ${
                isDarkMode ? "hover:bg-blue-600" : "hover:bg-blue-400"
              }`}
            >
              App Store...
            </button>
            <div className="border-t border-gray-700 my-1"></div>
            <button
              className={`w-full text-left px-4 py-1 ${
                isDarkMode ? "hover:bg-blue-600" : "hover:bg-blue-400"
              }`}
              onClick={onSleep}
            >
              Sleep
            </button>
            <button
              className={`w-full text-left px-4 py-1 ${
                isDarkMode ? "hover:bg-blue-600" : "hover:bg-blue-400"
              }`}
              onClick={onRestart}
            >
              Restart
            </button>
            <button
              className={`w-full text-left px-4 py-1 ${
                isDarkMode ? "hover:bg-blue-600" : "hover:bg-blue-400"
              }`}
              onClick={onShutdown}
            >
              Shut Down
            </button>
            <div className="border-t border-gray-700 my-1"></div>
            <button
              className={`w-full text-left px-4 py-1 ${
                isDarkMode ? "hover:bg-blue-600" : "hover:bg-blue-400"
              }`}
              onClick={onLogout}
            >
              Log Out Talha
            </button>
          </div>
        )}

        <p className="font-bold">TJ&apos;s Portfolio</p>

        {activeWindow && (
          <button
            className={`mr-4 font-medium hover:bg-white/10 px-2 py-0.5 rounded ${
              activeMenu === "app" ? "bg-white/10" : ""
            }`}
            onClick={() => toggleMenu("app")}
          >
            {activeWindow.title}
          </button>
        )}
      </div>

      <div className="flex items-center gap-4">
        <span className="mr-1">{batteryLevel}%</span>
        <div className="relative">
          <div className="w-6 h-3 border border-current rounded-sm relative">
            <div
              className="absolute top-0 left-0 bottom-0 bg-current"
              style={{ width: `${batteryLevel}%` }}
            ></div>
            <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-1 h-2 bg-current rounded-r-sm"></div>
            {isCharging && (
              <div className="absolute inset-0 flex items-center justify-center text-xs">
                ⚡
              </div>
            )}
          </div>
        </div>

        <div className="relative">
          <button className="cursor-pointer" onClick={toggleWifiPopup}>
            {wifiEnabled ? (
              <Wifi className="w-5 h-5" />
            ) : (
              <WifiOff className="w-5 h-5" />
            )}
          </button>

          {showWifiToggle && (
            <div
              ref={wifiRef}
              className={`absolute top-8 right-0 ${
                isDarkMode
                  ? "bg-gray-800/90 backdrop-blur-md"
                  : "bg-gray-300/90 backdrop-blur-md"
              } rounded-lg shadow-xl ${
                isDarkMode ? "text-white" : "text-gray-800"
              } py-3 px-4 w-64`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">Wi-Fi</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={wifiEnabled}
                    onChange={toggleWifi}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-500 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.2 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                </label>
              </div>
            </div>
          )}
        </div>

        <button onClick={onSpotlightClick} className="cursor-pointer">
          <Search className="w-5 h-5" />
        </button>

        <button
          onClick={onControlCenterClick}
          className="flex items-center justify-center cursor-pointer"
        >
          <Image
            src="/icons/mode.svg"
            alt="Control Center"
            className="w-5 h-5"
            style={{
              filter: isDarkMode ? "invert(1)" : "none",
              opacity: 0.9,
            }}
            width={5}
            height={5}
          />
        </button>

        <span>{formattedTime}</span>
      </div>
    </div>
  );
};

export default Navbar;
