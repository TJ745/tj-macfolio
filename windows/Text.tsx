import WindowControls from "@/components/WindowControls";
import WindowWrapper from "@/components/WindowWrapper";
import useWindowStore from "@/store/window";
import Image from "next/image";
import React from "react";

interface TxtFileData {
  name: string;
  image?: string;
  subtitle?: string;
  description?: string[];
}

const Text = () => {
  const { windows } = useWindowStore();
  const data = windows.txtfile?.data as TxtFileData | undefined;
  if (!data) return null;

  const { name, image, subtitle, description } = data;

  return (
    <>
      <div id="window-header">
        <WindowControls target="txtfile" />
        <h2 className="font-bold text-sm text-center w-full">{name}</h2>
      </div>

      <div className="p-5 h-full pb-16 overflow-y-scroll space-y-6">
        {image ? (
          <div className="w-full">
            <Image
              src={image}
              alt={name}
              className="w-full h-auto rounded"
              height={1000}
              width={1000}
            />
          </div>
        ) : null}

        {subtitle ? (
          <h3 className="text-lg font-semibold">{subtitle}</h3>
        ) : null}

        {Array.isArray(description) && description.length > 0 ? (
          <div className="space-y-3 leading-relaxed text-base text-gray-800 dark:text-gray-200">
            {description.map((para, index) => (
              <p key={index}>{para}</p>
            ))}
          </div>
        ) : null}
      </div>
    </>
  );
};

const TextWindow = WindowWrapper(Text, "txtfile");
export default TextWindow;
