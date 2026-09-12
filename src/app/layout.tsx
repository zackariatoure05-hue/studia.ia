import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/contexts/AuthContext";
import { DataProvider } from "@/contexts/DataContext";
import { RecordingProvider } from "@/contexts/RecordingContext";
import { CookieBanner } from "@/components/ui/CookieBanner";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "StudIA — Révise mieux, retiens plus",
  description:
    "L'IA qui transforme tes cours en résumés et flashcards. Transcription en direct, révision intelligente.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={cn("antialiased", inter.variable)}>
      <body>
        <AuthProvider>
          <DataProvider>
            <RecordingProvider>
              {children}
              <CookieBanner />
            </RecordingProvider>
          </DataProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
