import WindowControls from "@/components/WindowControls";
import WindowWrapper from "@/components/WindowWrapper";
import { blogPosts } from "@/constants";
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  MoveRight,
  PanelLeft,
  Plus,
  Search,
  Share,
  ShieldHalf,
} from "lucide-react";
import Image from "next/image";
import React from "react";

const Safari = () => {
  return (
    <>
      <div id="window-header">
        <WindowControls target="safari" />

        <PanelLeft className="ml-10" size={16} />

        <div className="flex items-center gap-1 ml-5">
          <ChevronLeft size={16} />
          <ChevronRight size={16} />
        </div>

        <div className="flex-1 flex items-center justify-center gap-3">
          <ShieldHalf size={16} />

          <div className="flex items-center gap-3 w-2/3  border border-gray-300 rounded-lg px-3 py-2">
            <Search size={16} />

            <input
              type="text"
              placeholder="Search or enter website name"
              className="flex-1 placeholder:text-gray-400"
            />
          </div>
        </div>

        <div className="flex items-center gap-5">
          <Share size={16} />
          <Plus size={16} />
          <Copy size={16} />
        </div>
      </div>

      <div className="p-10 max-w-3xl mx-auto">
        <h2 className="text-xl font-bold text-pink-600 mb-10">
          My Developer Blog
        </h2>

        <div className="space-y-8">
          {blogPosts.map(({ id, image, title, date, link }) => (
            <div key={id} className="grid grid-cols-12 space-x-5">
              <div className="col-span-2 size-full rounded-md object-cover">
                <Image src={image} alt={title} height={100} width={100} />
              </div>

              <div className="col-span-10 space-y-3">
                <p className="text-xs text-gray-500">{date}</p>
                <h3 className="font-semibold text-base text-gray-800">
                  {title}
                </h3>
                <a
                  href={link}
                  target="_blank"
                  rel="noopener"
                  className="text-blue-600 text-xs hover:underline flex items-center gap-3"
                >
                  Check out the full post{" "}
                  <MoveRight className="icon-hover" size={16} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

const SafariWindow = WindowWrapper(Safari, "safari");

export default SafariWindow;
