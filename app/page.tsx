import { DestinationExpandingCards } from "@/components/DestinationExpandingCards";
import Footer from "@/components/Footer";
import TopNavBar from "@/components/TopNavBar";
import { FadeUp } from "@/components/motion/FadeUp";
import { PortfolioGallery } from "@/components/ui/portfolio-gallery";
import ScrollExpandMedia from "@/components/ui/scroll-expansion-hero";
import {
  getFeaturedDestinations,
  getGalleryImages,
  getImageUrl,
  getOptimizedImageUrl,
  getSiteSetting,
} from "@/lib/db";
import Link from "next/link";

export const revalidate = 60;

export default async function HomePage() {
  const [destinations, galleryImages, heroSetting] = await Promise.all([
    getFeaturedDestinations(),
    getGalleryImages().catch(() => []),
    getSiteSetting("hero_image_url").catch(() => null),
  ]);

  const rawHeroImage =
    heroSetting ||
    (destinations[0]
      ? getImageUrl(destinations[0])
      : "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1920&auto=format");
  const heroImage = getOptimizedImageUrl(rawHeroImage, {
    width: 1920,
    quality: 85,
  });

  const marqueeImages =
    galleryImages.length > 0
      ? galleryImages
          .slice(0, galleryImages.length < 9 ? galleryImages.length : 9)
          .map((img) => ({ src: img.url, alt: img.alt }))
      : undefined;

  return (
    <>
      <TopNavBar />
      <main>
        {/* ── Hero ───────────────────────────────────────────────────── */}
        <ScrollExpandMedia
          mediaType="image"
          mediaSrc={heroImage}
          bgImageSrc={heroImage}
          title="Your next story starts here"
          date="Ίδρ. 2024"
          scrollToExpand="Κυλίστε για εξερεύνηση"
          textBlend
        />

        {/* ── Featured Destinations ──────────────────────────────────── */}
        <section className="py-32 px-8 max-w-7xl mx-auto" id="destinations">
          <FadeUp>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
              <div className="max-w-xl">
                <span className="text-secondary font-label font-bold tracking-widest text-xs mb-4 block uppercase">
                  Το Αρχείο
                </span>
                <h2 className="text-4xl md:text-5xl font-headline font-bold tracking-tight text-on-background">
                  Επιλεγμένοι Προορισμοί
                </h2>
              </div>
              <p className="text-primary max-w-xs font-body italic border-l-2 border-outline-variant pl-4">
                Μια επιλογή από μέρη που έμειναν μαζί μου πολύ αφότου τα
                εγκατέλειψα.
              </p>
            </div>
          </FadeUp>

          <FadeUp delay={0.1}>
            <DestinationExpandingCards />
          </FadeUp>
        </section>

        <PortfolioGallery
          title="Εξερευνήστε το Οπτικό μας Ημερολόγιο"
          archiveButton={{
            text: "Δείτε όλες τις φωτογραφίες",
            href: "/gallery",
          }}
          images={marqueeImages}
        />

        {/* ── Explore All ────────────────────────────────────────────── */}
        <section className="py-32 bg-surface-container-low">
          <div className="max-w-3xl mx-auto px-8 text-center">
            <FadeUp>
              <h2 className="text-4xl md:text-5xl font-headline font-bold tracking-tight text-on-background mb-6 italic">
                Κάθε Ταξίδι Λέει μια Ιστορία
              </h2>
              <p className="text-primary font-body text-lg mb-10">
                Περιηγηθείτε στη συλλογή των προορισμών — κάθε ένας
                τεκμηριωμένος με φωτογραφίες, οδηγούς και τις λεπτές
                λεπτομέρειες που κάνουν έναν τόπο αξέχαστο.
              </p>
              <Link
                href="/destinations"
                className="inline-flex items-center gap-2 bg-secondary text-on-secondary px-8 py-4 rounded-lg font-headline font-bold hover:bg-secondary/90 transition-colors"
              >
                Εξερευνήστε όλους τους προορισμούς
                <span className="material-symbols-outlined text-base">
                  arrow_forward
                </span>
              </Link>
            </FadeUp>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
