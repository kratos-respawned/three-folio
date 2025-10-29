import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import localFont from "next/font/local";
import Link from "next/link";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Deepak Bhandari",
  description: "A 3D Animator crafting vivid, immersive worlds",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background text-foreground  w-full relative h-full font-sans antialiased max-w-2xl mx-auto pt-12 sm:pt-24 px-6",
          geistSans.variable,
          geistMono.variable
        )}
      >
        {children}
        <Toaster />
        {/* <footer className="absolute flex flex-col items-center  justify-center left-1/2 w-fit -translate-x-1/2  mx-auto  bottom-4">
          <p>Made with ❤️</p>
          <Link
            target="_blank"
            className="text-blue-500 hover:underline"
            referrerPolicy="no-referrer"
            href="https://x.com/kratosRespawned"
          >
            @kratos-respawned
          </Link>
        </footer> */}
      </body>
    </html>
  );
}
