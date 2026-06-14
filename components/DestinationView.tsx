import DocxViewer from "@/components/DocxViewer";
import Footer from "@/components/Footer";
import TopNavBar from "@/components/TopNavBar";
import { formatDate, getImageUrl, getOptimizedImageUrl } from "@/lib/db";
import type { Destination } from "@/lib/types";
import Link from "next/link";

export default function DestinationView({
  destination,
}: {
  destination: Destination;
}) {
  const region = destination.region;
  const heroImage = getImageUrl(destination);
  const documentUrl = destination.document_url;

  return (
    <>
      <TopNavBar />
      <main className="pt-20">
        {/* Hero */}
        <section className="relative h-[870px] w-full overflow-hidden">
          <img
            alt={destination.featured_image_alt || destination.title}
            className="absolute inset-0 w-full h-full object-cover"
            src={getOptimizedImageUrl(heroImage, { width: 1600, quality: 85 })}
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-on-background/60 via-transparent to-transparent" />
          <div className="relative h-full flex flex-col justify-end items-center text-center pb-24 px-6 max-w-7xl mx-auto">
            {region && (
              <Link
                href={`/destinations/${region.slug}`}
                className="font-label text-white text-xs tracking-[0.2em] mb-4 uppercase hover:text-secondary-fixed-dim transition-colors"
              >
                {region.name}
              </Link>
            )}
            <h1 className="font-headline font-extrabold text-white text-5xl md:text-8xl tracking-tighter leading-none mb-6">
              {destination.title}
            </h1>
            {destination.excerpt && (
              <p className="font-body text-white/90 text-lg md:text-xl max-w-2xl leading-relaxed">
                {destination.excerpt}
              </p>
            )}
          </div>
        </section>

        {/* Body */}
        <section className="py-16 px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Sticky Sidebar */}
            <div className="lg:col-span-4 lg:sticky lg:top-32 self-start">
              <span className="font-label text-secondary text-xs font-bold tracking-widest mb-4 block">
                ΟΔΗΓΟΣ ΠΡΟΟΡΙΣΜΟΥ
              </span>
              <h2 className="font-headline text-3xl font-bold text-on-surface mb-6 tracking-tight">
                Σχετικά με {destination.title}
              </h2>
              <div className="space-y-4 mb-8">
                {region && (
                  <div className="flex items-center gap-3 text-on-surface-variant font-body">
                    <span className="material-symbols-outlined text-secondary">
                      location_on
                    </span>
                    <Link
                      href={`/destinations/${region.slug}`}
                      className="hover:text-secondary transition-colors"
                    >
                      {region.name}
                    </Link>
                  </div>
                )}
                {destination.visit_date && (
                  <div className="flex items-center gap-3 text-on-surface-variant font-body">
                    <span className="material-symbols-outlined text-secondary">
                      calendar_today
                    </span>
                    <span>Επίσκεψη: {formatDate(destination.visit_date)}</span>
                  </div>
                )}
                {documentUrl && (
                  <div className="flex items-center gap-3 text-on-surface-variant font-body">
                    <span className="material-symbols-outlined text-secondary">
                      description
                    </span>
                    <span>Οδηγός προορισμού επισυνημμένος</span>
                  </div>
                )}
              </div>
              <Link
                href="/destinations"
                className="inline-flex items-center gap-2 text-secondary font-bold font-headline hover:gap-3 transition-all"
              >
                <span className="material-symbols-outlined">arrow_back</span>
                Όλοι οι Προορισμοί
              </Link>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-8 space-y-12">
              {destination.content && (
                <div
                  className="prose prose-lg max-w-none font-body text-on-surface-variant leading-relaxed
                    prose-headings:font-headline prose-headings:text-on-surface prose-headings:font-bold
                    prose-a:text-secondary prose-a:no-underline hover:prose-a:underline
                    prose-img:rounded-lg prose-img:shadow-md"
                  dangerouslySetInnerHTML={{ __html: destination.content }}
                />
              )}

              {documentUrl && (
                <div>
                  <h3 className="font-headline text-2xl font-bold text-on-surface mb-6 flex items-center gap-3">
                    <span className="material-symbols-outlined text-secondary">
                      menu_book
                    </span>
                    Πλήρης Οδηγός Προορισμού
                  </h3>
                  <DocxViewer url={documentUrl} />
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
