import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navbar } from "@/components/Navbar";
import { SearchOverlay } from "@/components/ui/SearchOverlay";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Slashdot Competition - Themed App",
  description: "A responsive themed website for the Slashdot competition.",
};

import { Footer } from "@/components/Footer";
import { LoadingScreen } from "@/components/LoadingScreen";
import { TouchNavDelay } from "@/components/TouchNavDelay";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <base href="/slashdot-website-2026/" />
      </head>
      <body className="min-h-full flex flex-col overflow-x-hidden">
        <LoadingScreen />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TouchNavDelay />
          <div id="site-wrapper-loading" className="flex-1 flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1 flex flex-col">
              {children}
            </main>
            <Footer />
            <SearchOverlay />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

