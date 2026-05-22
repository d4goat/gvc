import type { Metadata } from "next";
import "./globals.css";
import { Geist } from 'next/font/google'
import { cn } from "@/app/libs/utils";
import { Toaster } from "./components/ui/sonner";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Pakra | Paham Birokrasi",
  description: "Pahami Dokumen Anda dengan Mudah",
};

const geist = Geist({subsets:['latin'],variable:'--font-sans'})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={cn("h-full antialiased light", "font-sans", geist.variable)}>
      <body className="font-body-md text-on-surface bg-background min-h-full flex flex-col">
        {children}
        <Toaster/>
        <Script src={`https://code.responsivevoice.org/responsivevoice.js?key=${process.env.RESPONSIVE_API_KEY}`} strategy="beforeInteractive" />
      </body>
    </html>
  );
}
