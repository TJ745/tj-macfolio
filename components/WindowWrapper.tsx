"use client";
import useWindowStore from "@/store/window";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import React, { useLayoutEffect, useRef } from "react";

type WindowKey = keyof typeof import("@/constants").WINDOW_CONFIG;

const WindowWrapper = <P extends object>(
  Component: React.ComponentType<P>,
  windowKey: WindowKey
) => {
  const Wrapped: React.FC<P> = (props) => {
    const { focusWindow, windows } = useWindowStore();
    const win = windows[windowKey as keyof typeof windows];
    const { isOpen, isMaximized, zIndex } = win;
    const ref = useRef<HTMLElement>(null);

    useGSAP(() => {
      const el = ref.current;
      if (!el || !isOpen) return;

      el.style.display = "block";

      gsap.fromTo(
        el,
        { scale: 0.8, opacity: 0, y: 40 },
        { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: "power3.out" }
      );
    }, [isOpen]);

    useGSAP(() => {
      const el = ref.current;
      if (!el) return;

      const header = el.querySelector("#window-header") as HTMLElement;
      if (!header) return;

      const instances = Draggable.create(el, {
        trigger: header,
        onPress: () => focusWindow(windowKey),
      });

      // return () => instance.kill();
      return () => instances.forEach((inst) => inst.kill());
    }, []);

    useLayoutEffect(() => {
      const el = ref.current;
      if (!el) return;

      if (!isOpen) {
        el.style.display = "none";
      } else if (isMaximized) {
        el.style.display = "block";
        const navbarHeight = 40;
        el.style.top = `${navbarHeight}px`;
        el.style.left = "0";
        el.style.width = "100%";
        el.style.height = `calc(100% - ${navbarHeight}px)`;
      } else {
        // normal window, can override width/height with CSS
        el.style.display = "block";
        el.style.top = "";
        el.style.left = "";
        el.style.width = "";
        el.style.height = "";
      }
    }, [isOpen, isMaximized]);

    return (
      <section
        id={windowKey}
        ref={ref}
        style={{ zIndex }}
        className="absolute bg-[#F6F6F6] dark:bg-[#282828]"
      >
        <Component {...props} />
      </section>
    );
  };

  Wrapped.displayName = `WindowWrapper(${
    Component.displayName || Component.name || "Component"
  })`;

  return Wrapped;
};

export default WindowWrapper;
