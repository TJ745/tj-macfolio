"use client";
import Dock from "@/components/Dock";
import Navbar from "@/components/Navbar";
import Welcome from "@/components/Welcome";

import Terminal from "@/windows/Terminal";
import Safari from "@/windows/Safari";

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
    </main>
  );
}
