import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { INITIAL_Z_INDEX, WINDOW_CONFIG } from "@/constants";

interface WindowState {
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  data: unknown;
  title: string;
}

export type WindowKey = keyof typeof WINDOW_CONFIG;

export interface WindowStore {
  windows: Record<WindowKey, WindowState>;
  nextZIndex: number;

  openWindow: (windowKey: WindowKey, data?: unknown) => void;
  closeWindow: (windowKey: WindowKey) => void;
  focusWindow: (windowKey: WindowKey) => void;
  minimizeWindow: (windowKey: WindowKey) => void;
  maximizeWindow: (windowKey: WindowKey) => void;
  restoreWindow: (windowKey: WindowKey) => void;
}

const useWindowStore = create<WindowStore>()(
  immer((set) => ({
    // windows: WINDOW_CONFIG,
    windows: JSON.parse(JSON.stringify(WINDOW_CONFIG)),
    nextZIndex: INITIAL_Z_INDEX + 1,

    openWindow: (windowKey, data = null) =>
      set((state) => {
        const win = state.windows[windowKey];
        if(!win) return;
        win.isOpen = true;
        win.isMinimized = false;
        win.zIndex = state.nextZIndex;
        win.data = data ?? win.data;
        state.nextZIndex++;
      }),

    closeWindow: (windowKey) => set((state) => {
        const win = state.windows[windowKey];
        if(!win) return;
        win.isOpen = false;
        win.isMinimized = false;
        win.zIndex = INITIAL_Z_INDEX;
        win.data = null;
    }),

    focusWindow: (windowKey) => set((state) => {
        const win = state.windows[windowKey];
        if(!win) return;
        win.isOpen = true;
    win.isMinimized = false;
        win.zIndex = state.nextZIndex++;
    }),

    minimizeWindow: (windowKey) =>
  set((state) => {
    const win = state.windows[windowKey];
    if (!win) return;
    win.isOpen = false; // or just visually minimize
        win.isMinimized = true;

  }),

maximizeWindow: (windowKey) =>
  set((state) => {
    const win = state.windows[windowKey];
    if (!win) return;
    win.isOpen = true;
    win.isMinimized = false;
    win.isMaximized = true;
    win.zIndex = state.nextZIndex++;
  }),

  restoreWindow: (windowKey: WindowKey) =>
  set((state) => {
    const win = state.windows[windowKey];
    if (!win) return;

    win.isOpen = true;
    win.isMinimized = false;
    win.isMaximized = false; // restore normal size
    win.zIndex = state.nextZIndex++;
  }),
  }))
);

export default useWindowStore;
