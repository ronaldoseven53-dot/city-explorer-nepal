import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import PWARegistrar from "@/components/PWARegistrar";
import AIAssistant from "@/components/AIAssistant";
import { UserPassportProvider } from "@/context/UserPassportContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { TripProvider } from "@/context/TripContext";
import MasterExplorerModal from "@/components/MasterExplorerModal";
import ErrorBoundary from "@/components/ErrorBoundary";
import ScrollProgressBar from "@/components/ScrollProgressBar";

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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "City Explorer Nepal",
  description: "Explore Nepal's most breathtaking destinations — from Himalayan peaks to ancient heritage sites and sacred pilgrimage spots.",
};

// Runs synchronously before React hydrates — zero flash on reload.
// Defaults to dark unless the user explicitly chose light.
const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem('theme');if(t!=='light'){document.documentElement.classList.add('dark');}}catch(e){document.documentElement.classList.add('dark');}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <meta name="theme-color" content="#b91c1c" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Nepal Explorer" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className="min-h-full flex flex-col">
        <ScrollProgressBar />
        <ThemeProvider>
          <UserPassportProvider>
            <TripProvider>
              <ErrorBoundary>
                {children}
              </ErrorBoundary>
              <PWARegistrar />
              <AIAssistant />
              <MasterExplorerModal />
            </TripProvider>
          </UserPassportProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
