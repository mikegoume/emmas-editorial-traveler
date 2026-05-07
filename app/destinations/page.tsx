import TopNavBar from "@/components/TopNavBar";
import {
  getAllDestinations,
  getImageUrl,
  getRegionsWithDestinations,
  type WPDestination,
} from "@/lib/graphql";
import Link from "next/link";

export const revalidate = 60;

export default async function DestinationsPage() {
  const [destinations, regions] = await Promise.all([
    getAllDestinations(),
    getRegionsWithDestinations(),
  ]);

  // Pick a hero image — use the first featured destination, or just the first one
  const heroDestination =
    destinations.find((d) => d.destinationDetails?.featured) ?? destinations[0];

  return (
    <>
      <TopNavBar />
      <main className="pt-16">
        {/* Hero */}
        <section className="max-w-[1440px] mx-auto px-4 md:px-8">
          <div className="relative h-[600px] rounded-xl md:rounded-lg overflow-hidden">
            <img
              alt="All destinations"
              className="w-full h-full object-cover"
              src={
                heroDestination
                  ? getImageUrl(heroDestination)
                  : "https://placehold.co/1440x600/eceeef/5b6061?text=Destinations"
              }
            />
            <div className="absolute inset-0 bg-black/35 flex flex-col justify-end p-8 md:p-16">
              <div className="max-w-3xl">
                <span className="inline-block px-4 py-1 bg-secondary text-on-secondary rounded-full text-xs font-label uppercase tracking-widest mb-6">
                  {destinations.length}{" "}
                  {destinations.length === 1 ? "Destination" : "Destinations"} ·{" "}
                  {regions.length} {regions.length === 1 ? "Region" : "Regions"}
                </span>
                <h1 className="text-5xl md:text-7xl font-headline font-extrabold text-white tracking-tighter mb-6">
                  Explore the World
                </h1>
                <p className="text-lg md:text-xl text-white/90 font-body leading-relaxed max-w-2xl">
                  A curated archive of destinations — from the sun-drenched
                  coasts of the Mediterranean to the rugged peaks of the Alps.
                  Every place here was visited, photographed, and lived in.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Regions navigator */}
        {regions.length > 0 && (
          <section className="max-w-7xl mx-auto px-8 py-16">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
              <div>
                <span className="text-secondary font-label font-bold tracking-widest text-xs mb-3 block uppercase">
                  Browse by Region
                </span>
                <h2 className="text-3xl md:text-4xl font-headline font-bold text-on-surface tracking-tight">
                  Choose your continent
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {regions.map((region) => (
                <Link
                  key={region.id}
                  href={`/destinations/${region.slug}`}
                  className="group bg-surface-container-low hover:bg-secondary-container rounded-lg p-6 transition-all duration-300 hover:-translate-y-1"
                >
                  <h3 className="font-headline font-bold text-xl text-on-surface group-hover:text-on-secondary-container mb-2">
                    {region.name}
                  </h3>
                  <p className="text-sm text-outline group-hover:text-on-secondary-container/70 font-label">
                    {region.destinations.nodes.length}{" "}
                    {region.destinations.nodes.length === 1
                      ? "destination"
                      : "destinations"}
                  </p>
                  <span className="material-symbols-outlined text-secondary group-hover:text-on-secondary-container mt-4 block transition-transform group-hover:translate-x-1">
                    arrow_forward
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* All destinations grid */}
        <section className="max-w-7xl mx-auto px-8 py-16 border-t border-outline-variant/15">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div>
              <span className="text-secondary font-label font-bold tracking-widest text-xs mb-3 block uppercase">
                The Archive
              </span>
              <h2 className="text-3xl md:text-4xl font-headline font-bold text-on-surface tracking-tight">
                Every Destination
              </h2>
              <p className="text-outline mt-2 font-body">
                The complete archive — every place that&apos;s been documented.
              </p>
            </div>
          </div>

          {destinations.length === 0 ? (
            <div className="text-center py-32 bg-surface-container-low rounded-lg">
              <p className="text-outline font-body italic mb-2">
                No destinations published yet.
              </p>
              <p className="text-sm text-outline-variant font-label">
                Add some in WordPress → Destinations → Add New.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {destinations.map((dest: WPDestination, i: number) => {
                const region = dest.regions?.nodes[0];
                return (
                  <Link
                    key={dest.id}
                    href={`/destinations/${dest.slug}`}
                    className={`group relative aspect-[4/5] rounded-lg overflow-hidden cursor-pointer shadow-lg block${
                      i % 3 === 1 ? " md:translate-y-12" : ""
                    }`}
                  >
                    <img
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      src={getImageUrl(dest)}
                      alt={dest.featuredImage?.node.altText ?? dest.title}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                    <div className="absolute bottom-0 left-0 p-8 w-full transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                      {region && (
                        <span className="text-white/80 text-xs font-label tracking-widest mb-2 block uppercase">
                          {region.name}
                        </span>
                      )}
                      <h3 className="text-2xl font-headline font-bold text-white mb-2">
                        {dest.title}
                      </h3>
                      {dest.destinationDetails?.visitDate && (
                        <div className="flex items-center text-white/60 text-sm gap-2">
                          <span className="material-symbols-outlined text-base">
                            calendar_today
                          </span>
                          <span>{dest.destinationDetails.visitDate}</span>
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* Newsletter */}
        <section className="max-w-7xl mx-auto px-8 py-24">
          <div className="relative bg-secondary-container rounded-lg overflow-hidden p-12 md:p-24 text-center">
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-headline font-extrabold text-on-secondary-container mb-6 tracking-tighter">
                Stay Inspired
              </h2>
              <p className="text-on-secondary-container/80 text-lg mb-10 font-body">
                Join our weekly newsletter for curated travel itineraries,
                hidden gems, and exclusive editorial stories delivered to your
                inbox.
              </p>
              <div className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
                <input
                  className="flex-1 bg-surface-container-lowest/50 border-none rounded-full px-6 py-4 text-on-surface focus:ring-2 focus:ring-secondary outline-none placeholder:text-outline-variant"
                  placeholder="Your email address"
                  type="email"
                />
                <button className="bg-secondary text-on-secondary px-8 py-4 rounded-full font-label text-sm tracking-widest uppercase hover:scale-105 transition-transform">
                  Subscribe
                </button>
              </div>
            </div>
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-white/20 blur-3xl rounded-full" />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-zinc-50 w-full rounded-t-[32px] mt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 px-12 py-20 max-w-7xl mx-auto font-body text-sm tracking-wide">
          <div>
            <h3 className="text-lg font-bold text-zinc-900 mb-6 font-headline">
              The Editorial Traveler
            </h3>
            <p className="text-zinc-500 leading-relaxed">
              Crafting immersive digital journeys for the modern connoisseur of
              world travel.
            </p>
          </div>
          <div>
            <h4 className="text-emerald-900 font-bold mb-6">Regions</h4>
            <ul className="space-y-4 text-zinc-500">
              {regions.slice(0, 5).map((r) => (
                <li key={r.id}>
                  <Link
                    href={`/destinations/${r.slug}`}
                    className="hover:text-emerald-600 transition-colors"
                  >
                    {r.name}
                  </Link>
                </li>
              ))}
              {regions.length === 0 && (
                <li className="italic text-zinc-400">No regions yet</li>
              )}
            </ul>
          </div>
          <div>
            <h4 className="text-emerald-900 font-bold mb-6">Navigate</h4>
            <ul className="space-y-4 text-zinc-500">
              {[
                { label: "Home", href: "/" },
                { label: "Blog", href: "/blog" },
                { label: "About", href: "/about" },
              ].map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="hover:text-emerald-600 transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-12 pb-12 border-t border-zinc-200 pt-8 flex justify-between items-center text-xs text-zinc-400">
          <span>© 2024 The Editorial Traveler. All rights reserved.</span>
          <span className="text-emerald-700 font-semibold">
            Curated with Intention.
          </span>
        </div>
      </footer>
    </>
  );
}
