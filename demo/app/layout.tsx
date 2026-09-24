import type { Metadata, Viewport } from "next";
import { Unbounded, Manrope, Michroma } from "next/font/google";
import "./globals.css";

const display = Unbounded({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "600", "800", "900"],
});

const brand = Michroma({
  variable: "--font-brand",
  subsets: ["latin"],
  weight: "400",
});

const body = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Spotlight",
  description: "Talent and Ideas: the shows you vote on. Showcase your gift or pitch your business, and the public decides.",
  appleWebApp: { capable: true, title: "Spotlight", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${brand.variable} ${body.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
