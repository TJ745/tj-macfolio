import useWindowStore from "@/store/window";
import React from "react";

interface WindowControlsProps {
  target: keyof typeof import("@/constants").WINDOW_CONFIG;
}

const WindowControls = ({ target }: WindowControlsProps) => {
  const { closeWindow, maximizeWindow, minimizeWindow } = useWindowStore();

  return (
    <div id="window-controls">
      <div
        className="close"
        role="button"
        aria-label="Close Window"
        onClick={() => closeWindow(target)}
      />
      <div
        className="minimize"
        role="button"
        aria-label="Minimize Window"
        onClick={() => minimizeWindow(target)}
      />
      <div
        className="maximize"
        role="button"
        aria-label="Maximize Window"
        onClick={() => maximizeWindow(target)}
      />
    </div>
  );
};

export default WindowControls;
