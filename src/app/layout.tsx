import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import { ProgressProvider } from "@/lib/ProgressContext";
import Providers from "@/components/Providers";
import SyncBanner from "@/components/SyncBanner";
import AuthModal from "@/components/AuthModal";

const inter = Inter({ subsets: ["latin", "latin-ext"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin", "latin-ext"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Matura Filozofia",
  description: "Aplikacja do nauki filozofii na maturę",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Filozofia",
  },
};

export const viewport: Viewport = {
  themeColor: "#0F0F0F",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" className={`${inter.variable} ${playfair.variable}`}>
      <body className="antialiased overflow-x-hidden" suppressHydrationWarning>
        <Providers>
          <SyncBanner />
          <AuthModal />
          <ProgressProvider>
            <main className="min-h-screen pb-20">
              {children}
            </main>
            <BottomNav />
          </ProgressProvider>
        </Providers>
      </body>
    </html>
  );
}
