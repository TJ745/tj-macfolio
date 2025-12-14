import { locations } from "@/constants";
import useLocationStore, { LocationItem } from "@/store/location";
import useWindowStore from "@/store/window";
import { useGSAP } from "@gsap/react";
import { Draggable } from "gsap/Draggable";
import Image from "next/image";
import React from "react";

const projects: LocationItem[] = locations.work?.children ?? [];

const HomePage = () => {
  const { setActiveLocation } = useLocationStore();
  const { openWindow, focusWindow } = useWindowStore();

  const handleOpenProjectFinder = (project: LocationItem) => {
    setActiveLocation(project);
    openWindow("finder");
    focusWindow("finder");
  };

  useGSAP(() => {
    Draggable.create(".folder", {
      bounds: "#home",
    });
  }, []);

  return (
    <section id="home" className="relative h-full w-full overflow-hidden">
      <ul>
        {projects.map((project: LocationItem) => (
          <li
            key={project.id}
            className={`absolute z-10 cursor-pointer select-none flex items-center flex-col group folder ${project.windowPosition}`}
            onClick={() => handleOpenProjectFinder(project)}
          >
            <div className="relative h-16 w-16 p-1 rounded-md group-hover:bg-gray-950/10">
              <Image
                src="/images/folder.png"
                alt={project.name}
                sizes="64px"
                fill
                draggable="false"
              />
            </div>
            <p className="text-sm text-white text-center px-1 rounded-md group-hover:bg-blue-400 transition-colors max-w-40">
              {project.name}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default HomePage;
