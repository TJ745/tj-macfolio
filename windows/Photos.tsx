import WindowControls from "@/components/WindowControls";
import WindowWrapper from "@/components/WindowWrapper";
import { gallery, photosLinks } from "@/constants";
import useWindowStore from "@/store/window";
import { Mail, Search } from "lucide-react";
import Image from "next/image";
import React from "react";

const Photos = () => {
  const { openWindow } = useWindowStore();

  return (
    <>
      <div id="window-header">
        <WindowControls target="photos" />
        <div className="w-full flex justify-end items-center gap-3 text-gray-500">
          <Mail size={16} />
          <Search size={16} />
        </div>
      </div>

      <div className="flex w-full h-screen">
        <div className="w-3/12 flex-none border-r border-gray-200 flex flex-col p-5">
          <h2 className="text-xs font-medium text-gray-400 mb-1">Photos</h2>
          <ul>
            {photosLinks.map(({ id, icon, title }) => (
              <li
                key={id}
                className="flex space-y-1 items-center gap-2 px-3 py-2 rounded-md cursor-pointer transition-colors first:bg-blue-100 first:text-blue-700"
              >
                <Image
                  src={icon}
                  alt={title}
                  className="w-4"
                  height={100}
                  width={100}
                />
                <p className="text-sm font-medium">{title}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-5 h-full w-full overflow-y-scroll pb-50">
          <ul className="grid grid-cols-5 grid-rows-5 gap-2.5">
            {gallery.map(({ id, img }) => (
              <li
                key={id}
                onClick={() =>
                  openWindow("imgfile", {
                    id,
                    name: "Gallery image",
                    icon: "/images/image.png",
                    kind: "file",
                    fileType: "img",
                    imageUrl: img,
                  })
                }
                className="first:row-start-1 first:row-span-3 first:col-start-1 first:col-span-3 nth-[2]:row-start-1 nth-[2]:row-span-3 nth-[2]:col-start-4 nth-[2]:col-span-3 nth-[3]:row-start-4 nth-[3]:row-span-2 nth-[3]:col-start-3 nth-[3]:col-span-3 last:row-start-4 last:row-span-2 last:col-start-1 last:col-span-2"
              >
                <Image
                  src={img}
                  alt={`Gallery Image ${id}`}
                  className="size-full object-cover rounded-lg "
                  height={1000}
                  width={1000}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

const PhotosWindow = WindowWrapper(Photos, "photos");

export default PhotosWindow;
