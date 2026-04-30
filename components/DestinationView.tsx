import TopNavBar from "@/components/TopNavBar";
import { getImageUrl, type WPDestination } from "@/lib/graphql";
import Link from "next/link";

export default function DestinationView({
  destination,
}: {
  destination: WPDestination;
}) {
  const region = destination.regions?.nodes[0];
  const heroImage = getImageUrl(destination);

  return (
    <>
      <TopNavBar />
      <main className="pt-20">
        {/* Hero */}
        <section className="relative h-[870px] w-full overflow-hidden">
          <img
            alt={destination.featuredImage?.node.altText ?? destination.title}
            className="absolute inset-0 w-full h-full object-cover"
            src={heroImage}
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
            {destination.destinationDetails?.excerpt && (
              <p className="font-body text-white/90 text-lg md:text-xl max-w-2xl leading-relaxed">
                {destination.destinationDetails.excerpt}
              </p>
            )}
          </div>
        </section>

        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-8 py-6">
          <nav className="flex items-center space-x-2 text-sm font-label uppercase tracking-widest text-outline-variant">
            <Link href="/" className="hover:text-secondary transition-colors">
              Home
            </Link>
            <span className="material-symbols-outlined text-xs">
              chevron_right
            </span>
            <Link
              href="/destinations"
              className="hover:text-secondary transition-colors"
            >
              Destinations
            </Link>
            {region && (
              <>
                <span className="material-symbols-outlined text-xs">
                  chevron_right
                </span>
                <Link
                  href={`/destinations/${region.slug}`}
                  className="hover:text-secondary transition-colors"
                >
                  {region.name}
                </Link>
              </>
            )}
            <span className="material-symbols-outlined text-xs">
              chevron_right
            </span>
            <span className="text-on-surface">{destination.title}</span>
          </nav>
        </div>

        {/* Body */}
        <section className="py-16 px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-4 lg:sticky lg:top-32 self-start">
              <span className="font-label text-secondary text-xs font-bold tracking-widest mb-4 block">
                DESTINATION GUIDE
              </span>
              <h2 className="font-headline text-3xl font-bold text-on-surface mb-6 tracking-tight">
                About {destination.title}
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
                {destination.destinationDetails?.visitDate && (
                  <div className="flex items-center gap-3 text-on-surface-variant font-body">
                    <span className="material-symbols-outlined text-secondary">
                      calendar_today
                    </span>
                    <span>
                      Visited: {destination.destinationDetails.visitDate}
                    </span>
                  </div>
                )}
              </div>

              <Link
                href="/destinations"
                className="inline-flex items-center gap-2 text-secondary font-bold font-headline hover:gap-3 transition-all"
              >
                <span className="material-symbols-outlined">arrow_back</span>
                All Destinations
              </Link>
            </div>

            <div className="lg:col-span-8">
              <div
                className="prose prose-lg max-w-none font-body text-on-surface-variant leading-relaxed
                  prose-headings:font-headline prose-headings:text-on-surface prose-headings:font-bold
                  prose-a:text-secondary prose-a:no-underline hover:prose-a:underline
                  prose-img:rounded-lg prose-img:shadow-md"
                dangerouslySetInnerHTML={{ __html: destination.content }}
              />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
