import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://auravix.com"),
  title: "AURAVIX - Premium Bathroom Renovation & Interior Design",
  description: "Transform your bathroom with AURAVIX. Modern designs, expert consultations, transparent pricing, and 10-year warranty. Book a Slot today.",
  keywords: ["bathroom renovation", "modern bathroom designs", "bathroom interior", "luxury bathroom", "AURAVIX", "renovation India"],
  authors: [{ name: "AURAVIX" }],
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "AURAVIX - Premium Bathroom Renovation & Interior Design",
    description: "Transform your bathroom with AURAVIX. Modern designs, expert consultations, transparent pricing.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
