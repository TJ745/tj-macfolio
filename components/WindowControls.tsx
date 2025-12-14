import useWindowStore from "@/store/window";
import React from "react";

interface WindowControlsProps {
  target: keyof typeof import("@/constants").WINDOW_CONFIG;
}

const WindowControls = ({ target }: WindowControlsProps) => {
  const {
    closeWindow,
    maximizeWindow,
    minimizeWindow,
    restoreWindow,
    windows,
  } = useWindowStore();

  const win = windows[target];

  const handleMaximize = () => {
    if (!win) return;

    if (win.isMaximized) {
      restoreWindow(target); // restore if already maximized
    } else {
      maximizeWindow(target); // maximize if normal
    }
  };

  return (
    <div id="window-controls" className="flex gap-2">
      <div
        className="size-3.5 rounded-full bg-[#ff6157] cursor-pointer"
        role="button"
        aria-label="Close Window"
        onClick={() => closeWindow(target)}
      />
      <div
        className="size-3.5 rounded-full bg-[#ffc030] cursor-pointer"
        role="button"
        aria-label="Minimize Window"
        onClick={() => minimizeWindow(target)}
      />
      <div
        className="size-3.5 rounded-full bg-[#2acb42] cursor-pointer"
        role="button"
        aria-label="Maximize Window"
        onClick={handleMaximize}
      />
    </div>
  );
};

export default WindowControls;
