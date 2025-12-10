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
      <h3>{name}</h3>
      <ul>
        {items.map((item) => (
          <li
            key={item.id}
            onClick={() => setActiveLocation(item)}
            className={item.id === activeLocation.id ? "active" : "non-active"}
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
        <Search className="icon" />
      </div>

      <div className="bg-white flex h-full">
        <div className="sidebar">
          {renderList("Favourites", Object.values(locations))}
          {renderList("Work", locations.work.children)}
        </div>

        <ul className="content">
          {activeLocation?.children?.map((item: FileItem | FolderItem) => (
            <li
              key={item.id}
              className={item.position}
              onClick={() => openItem(item)}
            >
              <Image src={item.icon} alt={item.name} height={100} width={100} />
              <p>{item.name}</p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

const FinderWindow = WindowWrapper(Finder, "finder");

export default FinderWindow;
