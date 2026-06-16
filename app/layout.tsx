import type { Metadata } from "next";
import { Manrope, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { PageTransition } from "@/components/motion/PageTransition";
import { SmoothScroller } from "@/components/SmoothScroller";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
  weight: ["400", "500", "600", "700", "800"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Travel With Emma",
  description:
    "A digital journal celebrating the art of slow travel and high-end editorial photography.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <body
        className={`${plusJakartaSans.variable} ${manrope.variable} bg-background text-on-background font-body selection:bg-secondary-fixed-dim selection:text-on-secondary-fixed`}
      >
        <SmoothScroller>
          <PageTransition>{children}</PageTransition>
        </SmoothScroller>
      </body>
    </html>
  );
}
