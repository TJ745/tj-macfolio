import { locations } from "@/constants";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export type FileItem = {
  id: number;
  name: string;
  icon: string;
  kind?: "file";
  fileType: "txt" | "img" | "url" | "fig" | "pdf";
  position?: string;
  href?: string;
  imageUrl?: string;
  subtitle?: string;
  description?: string[];
};

export type FolderItem = {
  id: number;
  type?: string; // <-- "work" | "about" | "resume" | "trash"
  name: string;
  icon: string;
  kind?: "folder" | string;
  position?: string;
  windowPosition?: string;
  children?: Array<FolderItem | FileItem>;
};

export type LocationItem = FolderItem;


type LocationStore = {
  activeLocation: LocationItem;
  setActiveLocation: (location: LocationItem) => void;
  resetActiveLocation: () => void;
};



const DEFAULT_LOCATION: FolderItem = locations.work;


const useLocationStore = create<LocationStore>()(immer((set) =>({
    activeLocation: DEFAULT_LOCATION,

    setActiveLocation: (location) => set((state)=>{
        if (!location) return
        state.activeLocation = location;

    }),

    resetActiveLocation: () => set((state)=> {
        state.activeLocation = DEFAULT_LOCATION;
    })
})))


export default useLocationStore;