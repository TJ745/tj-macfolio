import WindowControls from "@/components/WindowControls";
import WindowWrapper from "@/components/WindowWrapper";
import { socials } from "@/constants";
import Image from "next/image";
import React from "react";

const Contact = () => {
  return (
    <>
      <div id="window-header">
        <WindowControls target="contact" />
        <h2 className="font-bold text-sm text-center w-full">Contact Me</h2>
      </div>

      <div className="p-5 space-y-5">
        <Image
          src="/images/adrian.jpg"
          alt="TJ"
          className="w-20 rounded-full"
          height={100}
          width={100}
        />
        <h3 className="text-xl font-semibold">Let&apos;s Connect</h3>
        <p>
          Got an idea? A bug to squash? Or just wanna talk tech? I&apos;m in.
        </p>
        <p>contact@talhajamil.com</p>

        <ul className="flex items-center gap-3">
          {socials.map(({ id, bg, link, icon, text }) => (
            <li
              key={id}
              style={{ backgroundColor: bg }}
              className="rounded-lg p-3 w-60 hover:-translate-y-0.5 hover:scale-105 origin-center transition-all duration-300"
            >
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                title={text}
                className="space-y-5"
              >
                <Image
                  src={icon}
                  alt={text}
                  className="size-5"
                  height={100}
                  width={100}
                />
                <p className="font-semibold text-sm text-white">{text}</p>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

const ContactWindow = WindowWrapper(Contact, "contact");
export default ContactWindow;
