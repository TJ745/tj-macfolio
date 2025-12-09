"use client";
import Dock from "@/components/Dock";
import Navbar from "@/components/Navbar";
import Welcome from "@/components/Welcome";

import HomePage from "@/components/HomePage";
import Terminal from "@/windows/Terminal";
import Safari from "@/windows/Safari";
import Resume from "@/windows/Resume";
import Text from "@/windows/Text";
import Finder from "@/windows/Finder";
import ImageWin from "@/windows/ImageWin";
import Contact from "@/windows/Contact";
import Photos from "@/windows/Photos";

import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
gsap.registerPlugin(Draggable);

export default function Home() {
  return (
    <main>
      <Navbar />
      <Welcome />
      <Dock />

      <Terminal />
      <Safari />
      <Resume />
      <Finder />
      <Text />
      <ImageWin />
      <Contact />
      <Photos />

      <HomePage />
    </main>
  );
}
