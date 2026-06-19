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

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Travel With Emma",
  url: "https://travelwithemma.gr",
  sameAs: [
    "https://www.instagram.com/travelwithemma.gr/",
    "https://www.tiktok.com/@emma.mazaraki",
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://travelwithemma.gr"),
  title: {
    default: "Travel With Emma",
    template: "%s | Travel With Emma",
  },
  description:
    "Ψηφιακό ημερολόγιο αργού ταξιδιού και editorial φωτογραφίας από την Emma Mazaraki.",
  openGraph: {
    type: "website",
    locale: "el_GR",
    url: "https://travelwithemma.gr",
    siteName: "Travel With Emma",
    title: "Travel With Emma",
    description:
      "Ψηφιακό ημερολόγιο αργού ταξιδιού και editorial φωτογραφίας από την Emma Mazaraki.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Travel With Emma",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Travel With Emma",
    description:
      "Ψηφιακό ημερολόγιο αργού ταξιδιού και editorial φωτογραφίας από την Emma Mazaraki.",
    images: ["/og-image.jpg"],
  },
  alternates: { canonical: "/" },
  icons: { icon: "/favicon.ico" },
  verification: { google: "Y4e_po8u45o4VtF3W2Zkj7ujE20PeQ17kLS4WFFBx4s" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="el" className="light">
      <body
        className={`${plusJakartaSans.variable} ${manrope.variable} bg-background text-on-background font-body selection:bg-secondary-fixed-dim selection:text-on-secondary-fixed`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <SmoothScroller>
          <PageTransition>{children}</PageTransition>
        </SmoothScroller>
      </body>
    </html>
  );
}
