import type { Metadata } from "next";
import { Georama, Roboto_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Georama({
  variable: "--font-georama",
  // subsets: ["latin"],
});

const geistMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  // subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TJ's Portfolio",
  description: "It's not just portfolio, it's Macfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
