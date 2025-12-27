import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import HeroProvider from "@/context/HeroProvider";
import "../css/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Swagger support swagger-ui",
  description: "Swagger support swagger-ui",
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
        <HeroProvider>{children}</HeroProvider>
      </body>
    </html>
  );
}
