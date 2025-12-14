"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Wallpaper() {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = (resolvedTheme ?? theme) === "dark";

  return (
    <div
      className="absolute inset-0 bg-cover bg-center transition-all duration-500"
      style={{
        backgroundImage: isDark
          ? "url('/images/wallpaper-night.jpg')"
          : "url('/images/wallpaper-day.jpg')",
      }}
    />
  );
}
