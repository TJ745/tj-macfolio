"use client";

interface WallpaperProps {
  isDark: boolean;
}

export default function Wallpaper({ isDark }: WallpaperProps) {
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
