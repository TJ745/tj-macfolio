"use client";
import WindowControls from "@/components/WindowControls";
import WindowWrapper from "@/components/WindowWrapper";
import { techStack } from "@/constants";
import { Check, Flag } from "lucide-react";
import React from "react";

const Terminal = () => {
  return (
    <>
      <div id="window-header">
        <WindowControls target="terminal" />
        <h2 className="font-bold text-sm text-center w-full">Tech Stack</h2>
      </div>

      <div className="text-sm font-roboto p-5">
        <p>
          <span>@TJ %</span>
          show tech stack
        </p>

        <div className="flex items-center ms-10 mt-7">
          <p className="w-32">Category</p>
          <p>Technologies</p>
        </div>

        <ul className="py-5 my-5 border-y border-dashed space-y-1">
          {techStack.map(({ category, items }) => (
            <li key={category} className="flex items-center">
              <Check className="text-[#00A154] w-5" size={20} />
              <h3 className="font-semibold text-[#00A154] w-32 ms-5">
                {category}
              </h3>
              <ul className="flex flex-1 items-center flex-wrap">
                {items.map((item, index) => (
                  <li key={index}>
                    {item}
                    {index < items.length - 1 ? "," : "."}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>

        <div className="text-[#00A154] space-y-1">
          <p className="flex items-center gap-5">
            <Check size={20} />
            {""} 5 of 5 stacks loaded successfully (100%)
          </p>

          <p className="text-black dark:text-white flex items-center gap-5">
            <Flag size={20} fill="black" />
            {""}
            Render time: 6ms
          </p>
        </div>
      </div>
    </>
  );
};

const TerminalWindow = WindowWrapper(Terminal, "terminal");

export default TerminalWindow;
