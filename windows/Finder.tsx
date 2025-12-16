import WindowControls from "@/components/WindowControls";
import WindowWrapper from "@/components/WindowWrapper";
import { locations } from "@/constants";
import useLocationStore from "@/store/location";
import useWindowStore from "@/store/window";
import { Search } from "lucide-react";
import Image from "next/image";
import React from "react";

import type { FolderItem, FileItem, LocationItem } from "@/store/location"; // <-- adjust path

const Finder = () => {
  const { openWindow } = useWindowStore();
  const { activeLocation, setActiveLocation } = useLocationStore();

  const openItem = (item: FileItem | FolderItem) => {
    if (!item) return;

    if ("fileType" in item) {
      if (item.fileType === "pdf") return openWindow("resume", item);

      if (["fig", "url"].includes(item.fileType) && item.href)
        return window.open(item.href, "_blank");

      return openWindow(`${item.fileType}${item.kind}`, item);
    }

    if (item.kind === "folder") return setActiveLocation(item);
  };

  const renderList = (name: string, items: LocationItem[]) => (
    <div>
      <h3 className="text-xs font-medium text-gray-400 mb-1">{name}</h3>
      <ul className="space-y-1">
        {items.map((item) => (
          <li
            key={item.id}
            onClick={() => setActiveLocation(item)}
            className={`${
              item.id === activeLocation.id
                ? "bg-blue-100 text-blue-700"
                : "text-gray-700 hover:bg-gray-200"
            } flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer transition-colors`}
          >
            <Image
              src={item.icon}
              className="w-4"
              alt={item.name}
              width={100}
              height={100}
            />
            <p className="text-sm font-medium truncate">{item.name}</p>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <>
      <div id="window-header">
        <WindowControls target="finder" />
        <Search size={16} />
      </div>

      <div className=" flex h-full">
        <div className="w-48 border-r border-gray-200 dark:border-gray-600 flex flex-col p-5 space-y-3">
          {renderList("Favourites", Object.values(locations))}
          {renderList("Work", locations.work.children)}
        </div>

        <ul className="flex-1 p-8 max-w-2xl relative">
          {activeLocation?.children?.map((item: FileItem | FolderItem) => (
            <li
              key={item.id}
              className={`${item.position} absolute flex items-center flex-col gap-3`}
              onClick={() => openItem(item)}
            >
              <Image
                src={item.icon}
                alt={item.name}
                height={100}
                width={100}
                className="object-contain object-center size-16 relative group-hover:scale-105"
              />
              <p className="text-sm text-center font-medium w-40">
                {item.name}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

const FinderWindow = WindowWrapper(Finder, "finder");

export default FinderWindow;
