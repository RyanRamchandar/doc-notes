import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { AppHeader } from "@/components/app-header";
import { Toaster } from "@/components/ui/toaster";
import "@/app/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Doc Notes",
  description: "Medical AI scribe prototype for live transcription and note drafting.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <div className="min-h-screen">
          <AppHeader />
          <main>{children}</main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
