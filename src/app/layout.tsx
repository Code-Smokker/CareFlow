/* eslint-disable @next/next/no-page-custom-font */
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CareFlow Clinical Workspace · OPD General Medicine",
  description: "CareFlow Clinical Intelligence and Electronic Health Record workspace",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body className="bg-surface font-body-default text-on-surface antialiased selection:bg-primary-container selection:text-on-primary">
        <Header />
        <Sidebar />
        <div className="pl-64 print:pl-0">
          <main className="relative pt-14 print:pt-0 w-full bg-surface print:bg-white min-h-screen print:min-h-0 px-gutter-normal print:px-0 py-space-md print:py-0">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
