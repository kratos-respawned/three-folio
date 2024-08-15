import { buttonVariants } from "@/components/ui/button";
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
        className={cn(
          "min-h-screen bg-background text-foreground relative h-full font-sans antialiased max-w-2xl mx-auto py-12 sm:py-24 px-6",
          geistSans.variable,
        geistMono.variable
        )}
      >
        {children}
        <Toaster />
        <footer className="absolute left-1/2 -translate-x-1/2  mx-auto  bottom-4">
          Made with ❤️ by{" "}
          <Link
            className={cn(
              buttonVariants({ variant: "link" }),
              "text-blue-500 pl-0"
            )}
            target="_blank"
            referrerPolicy="no-referrer"
            href="https://x.com/kratosRespawned"
          >
            @kratos-respawned
          </Link>
        </footer>
      </body>
    </html>
  );
}