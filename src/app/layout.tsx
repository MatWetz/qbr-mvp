import type { Metadata } from "next";
import { JetBrains_Mono, Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";

import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CodeRabbit QBR Template",
  description: "Generate customer QBR decks from mock data.",
};

/**
 * Root layout component that provides the HTML skeleton and global font classes.
 *
 * Renders an `<html lang="en" class="dark">` element containing a `<body>` with the configured font CSS variables and the `antialiased` utility, and places `children` inside the body.
 *
 * @param children - The React nodes to render inside the document body
 * @returns The root React element that wraps the application children
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${plusJakartaSans.variable} ${spaceGrotesk.variable} ${jetBrainsMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
