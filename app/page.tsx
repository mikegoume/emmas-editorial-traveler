import { DestinationExpandingCards } from "@/components/DestinationExpandingCards";
import Footer from "@/components/Footer";
import TopNavBar from "@/components/TopNavBar";
import { FadeUp } from "@/components/motion/FadeUp";
import { PortfolioGallery } from "@/components/ui/portfolio-gallery";
import ScrollExpandMedia from "@/components/ui/scroll-expansion-hero";
import { getFeaturedDestinations, getGalleryImages, getImageUrl } from "@/lib/db";
import Link from "next/link";

export const revalidate = 60;

export default async function HomePage() {
  const [destinations, galleryImages] = await Promise.all([
    getFeaturedDestinations(),
    getGalleryImages().catch(() => []),
  ]);

  const heroImage =
    destinations[0]
      ? getImageUrl(destinations[0])
      : "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1920&auto=format";

  const destinationData = destinations.map((dest) => ({
    id: dest.id,
    title: dest.title,
    excerpt: dest.excerpt ?? null,
    imgSrc: getImageUrl(dest),
    slug: dest.slug,
  }));

  const marqueeImages =
    galleryImages.length > 0
      ? galleryImages.map((img) => ({ src: img.url, alt: img.alt }))
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
          title="Silent Moments"
          date="Est. 2024"
          scrollToExpand="Scroll to explore"
          textBlend
        />

        {/* ── Featured Destinations ──────────────────────────────────── */}
        <section className="py-32 px-8 max-w-7xl mx-auto" id="destinations">
          <FadeUp>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
              <div className="max-w-xl">
                <span className="text-secondary font-label font-bold tracking-widest text-xs mb-4 block uppercase">
                  The Portfolio
                </span>
                <h2 className="text-4xl md:text-5xl font-headline font-bold tracking-tight text-on-background">
                  Featured Destinations
                </h2>
              </div>
              <p className="text-primary max-w-xs font-body italic border-l-2 border-outline-variant pl-4">
                A selection of places that stayed with me long after I left
                their borders.
              </p>
            </div>
          </FadeUp>

          {destinations.length === 0 ? (
            <p className="text-center py-16 text-outline font-body italic">
              No destinations yet — add some in the admin!
            </p>
          ) : (
            <FadeUp delay={0.1}>
              <DestinationExpandingCards destinations={destinationData} />
            </FadeUp>
          )}
        </section>

        <PortfolioGallery
          title="Explore Our Visual Journal"
          archiveButton={{
            text: "Browse all photos",
            href: "/gallery",
          }}
          images={marqueeImages}
        />

        {/* ── Explore All ────────────────────────────────────────────── */}
        <section className="py-32 bg-surface-container-low">
          <div className="max-w-3xl mx-auto px-8 text-center">
            <FadeUp>
              <h2 className="text-4xl md:text-5xl font-headline font-bold tracking-tight text-on-background mb-6 italic">
                Every Journey Tells a Story
              </h2>
              <p className="text-primary font-body text-lg mb-10">
                Browse the full collection of destinations — each one documented
                with photography, guides, and the quiet details that make a
                place unforgettable.
              </p>
              <Link
                href="/destinations"
                className="inline-flex items-center gap-2 bg-secondary text-on-secondary px-8 py-4 rounded-lg font-headline font-bold hover:bg-secondary/90 transition-colors"
              >
                Explore all destinations
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
