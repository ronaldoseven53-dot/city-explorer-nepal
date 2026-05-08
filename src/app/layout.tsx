import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import PWARegistrar from "@/components/PWARegistrar";
import AIAssistant from "@/components/AIAssistant";
import { UserPassportProvider } from "@/context/UserPassportContext";
import { ThemeProvider } from "@/context/ThemeContext";
import MasterExplorerModal from "@/components/MasterExplorerModal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "City Explorer Nepal",
  description: "Explore Nepal's most breathtaking destinations — from Himalayan peaks to ancient heritage sites and sacred pilgrimage spots.",
};

// Runs before React hydrates — applies saved theme to <html> with zero flash.
const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem('theme');document.documentElement.classList.toggle('dark',t!=='light');}catch(e){document.documentElement.classList.add('dark');}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} dark h-full antialiased`}
    >
      <head>
        {/* Inject before any CSS — prevents flash of wrong theme */}
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <meta name="theme-color" content="#b91c1c" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Nepal Explorer" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <UserPassportProvider>
            {children}
            <PWARegistrar />
            <AIAssistant />
            <MasterExplorerModal />
          </UserPassportProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
