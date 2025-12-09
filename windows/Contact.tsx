import WindowControls from "@/components/WindowControls";
import WindowWrapper from "@/components/WindowWrapper";
import { socials } from "@/constants";
import React from "react";

const Contact = () => {
  return (
    <>
      <div id="window-header">
        <WindowControls target="contact" />
        <h2>Contact Me</h2>
      </div>

      <div className="p-5 space-y-5">
        <img src="/images/adrian.jpg" alt="TJ" className="w-20 rounded-full" />
        <h3>Let&apos;s Connect</h3>
        <p>
          Got an idea? A bug to squash? Or just wanna talk tech? I&apos;m in.
        </p>
        <p>contact@talhajamil.com</p>

        <ul>
          {socials.map(({ id, bg, link, icon, text }) => (
            <li key={id} style={{ backgroundColor: bg }}>
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                title={text}
              >
                <img src={icon} alt={text} className="size-5" />
                <p>{text}</p>
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
