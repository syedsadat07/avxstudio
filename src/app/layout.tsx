import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  metadataBase: new URL("https://auravix.com"),
  title: "AURAVIX - Premium Bathroom Renovation & Interior Design",
  description: "Transform your bathroom with AURAVIX. Modern designs, expert consultations, transparent pricing, and 10-year warranty. Book a Slot today.",
  keywords: ["bathroom renovation", "modern bathroom designs", "bathroom interior", "luxury bathroom", "AURAVIX", "renovation India"],
  authors: [{ name: "AURAVIX" }],
  icons: {
    icon: "/favicon.jpg",
    apple: "/favicon.jpg",
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
      <body className="antialiased bg-background text-foreground" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
