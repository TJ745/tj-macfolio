"use client";
import { dockApps } from "@/constants";
import useWindowStore, { WindowKey } from "@/store/window";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import React, { useRef } from "react";
import { Tooltip } from "react-tooltip";

type DockApp = {
  id: WindowKey;
  name: string;
  icon: string;
  canOpen?: boolean;
};

const Dock: React.FC = () => {
  const { openWindow, windows, maximizeWindow, restoreWindow } =
    useWindowStore();
  const dockRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const dock = dockRef.current;
    if (!dock) return () => {};

    const icons = dock.querySelectorAll(".dock-icon");

    const animateIcons = (mouseX: number) => {
      const { left } = dock.getBoundingClientRect();

      icons.forEach((icon) => {
        const { left: iconLeft, width } = icon.getBoundingClientRect();
        const center = iconLeft - left + width / 2;
        const distance = Math.abs(mouseX - center);
        const intensity = Math.exp(-(distance ** 2.5 / 20000));

        gsap.to(icon, {
          scale: 1 + 0.25 * intensity,
          y: -15 * intensity,
          duration: 0.2,
          ease: "power1.out",
        });
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      const { left } = dock.getBoundingClientRect();

      animateIcons(e.clientX - left);
    };

    const resetIcons = () =>
      icons.forEach((icon) =>
        gsap.to(icon, {
          scale: 1,
          y: 0,
          duration: 0.3,
          ease: "power1.out",
        })
      );
    dock.addEventListener("mousemove", handleMouseMove);
    dock.addEventListener("mouseleave", resetIcons);

    return () => {
      dock.removeEventListener("mousemove", handleMouseMove);
      dock.removeEventListener("mouseleave", resetIcons);
    };
  }, []);

  const toggleApp = (app: DockApp) => {
    if (!app.canOpen) return;

    const win = windows[app.id];

    if (!win) {
      return;
    }

    if (win.isOpen && !win.isMinimized && !win.isMaximized) {
      // maximize window on click if open
      maximizeWindow(app.id);
    } else if (win.isMinimized) {
      restoreWindow(app.id); // restore if minimized
    } else if (win.isMaximized) {
      restoreWindow(app.id); // restore if maximized
    } else {
      openWindow(app.id); // first time open
    }
  };

  return (
    <section
      id="dock"
      className="absolute bottom-5 left-1/2 -translate-x-1/2 z-50 select-none max-sm:hidden"
    >
      <div
        ref={dockRef}
        className="bg-white/20 backdrop-blur-md rounded-2xl p-1.5 flex items-end gap-1.5"
      >
        {dockApps.map((app) => {
          const win = windows[app.id];
          const isActive = win?.isOpen;
          const isMinimized = win?.isMinimized;

          return (
            <div key={app.id} className="relative flex flex-col items-center">
              <button
                type="button"
                className="dock-icon size-14 cursor-pointer"
                aria-label={app.name}
                data-tooltip-id="dock-tooltip"
                data-tooltip-content={app.name}
                data-tooltip-delay-show={150}
                disabled={!app.canOpen}
                onClick={() => toggleApp(app as DockApp)}
              >
                <Image
                  src={`/images/${app.icon}`}
                  alt={app.name}
                  loading="lazy"
                  className={`object-cover object-center ${
                    app.canOpen ? "" : "opacity-60"
                  }`}
                  height={100}
                  width={100}
                />
              </button>
              {(isActive || isMinimized) && (
                <span
                  className={`mt-1 h-1.5 w-1.5 rounded-full
            ${isActive ? "bg-white opacity-100" : "bg-white opacity-40"}
          `}
                />
              )}
            </div>
          );
        })}

        <Tooltip
          id="dock-tooltip"
          place="top"
          className="py-1! px-3! w-fit! text-center! text-xs! rounded-md! bg-blue-200! text-blue-900! shadow-2xl!"
        />
      </div>
    </section>
  );
};

export default Dock;
