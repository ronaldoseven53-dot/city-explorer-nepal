import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import PWARegistrar from "@/components/PWARegistrar";
import AIAssistant from "@/components/AIAssistant";
import { UserPassportProvider } from "@/context/UserPassportContext";
import MasterExplorerModal from "@/components/MasterExplorerModal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "City Explorer Nepal",
  description: "Explore Nepal's most breathtaking destinations — from Himalayan peaks to ancient heritage sites and sacred pilgrimage spots.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <meta name="theme-color" content="#b91c1c" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Nepal Explorer" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className="min-h-full flex flex-col">
        <UserPassportProvider>
          {children}
          <PWARegistrar />
          <AIAssistant />
          <MasterExplorerModal />
        </UserPassportProvider>
      </body>
    </html>
  );
}
