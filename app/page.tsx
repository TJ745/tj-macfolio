"use client";
import Dock from "@/components/Dock";
import Navbar from "@/components/Navbar";
import Welcome from "@/components/Welcome";

import Terminal from "@/windows/Terminal";
import Safari from "@/windows/Safari";
import Resume from "@/windows/Resume";
import Text from "@/windows/Text";

import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import Finder from "@/windows/Finder";
import ImageWin from "@/windows/ImageWin";
import Contact from "@/windows/Contact";
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
    </main>
  );
}
