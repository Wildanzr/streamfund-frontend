import type { Metadata } from "next";
import { Protest_Strike, Space_Grotesk, Play } from "next/font/google";
import "./globals.css";
import SocketProvider from "@/provider/SocketProvider";
import Web3Provider from "@/provider/Web3Provider";

const protest = Protest_Strike({
  weight: ["400"],
  style: "normal",
  variable: "--font-protest-strike",
  subsets: ["latin"],
});

const space_grotesk = Space_Grotesk({
  weight: ["300", "400", "500", "600", "700"],
  style: "normal",
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const play = Play({
  weight: ["400", "700"],
  style: "normal",
  variable: "--font-play",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${protest.variable} ${space_grotesk.variable} ${play.variable} antialiased bg-transparent font-grotesk`}
      >
        <Web3Provider>
          <SocketProvider>{children}</SocketProvider>
        </Web3Provider>
      </body>
    </html>
  );
}
