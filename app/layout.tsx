import type { Metadata } from "next";
import "./globals.css";
import { Atkinson_Hyperlegible_Next, Geist } from 'next/font/google'
import { cn } from "@/app/libs/utils";

export const metadata: Metadata = {
  title: "PahamBirokrasi",
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
      </body>
    </html>
  );
}
