import TopNavBar from "@/components/TopNavBar";
import { formatDate, getImageUrl, getOptimizedImageUrl } from "@/lib/db";
import type { RegionWithFullDestinations } from "@/lib/db";
import type { Destination } from "@/lib/types";
import Link from "next/link";

export default function RegionView({
  region,
}: {
  region: RegionWithFullDestinations;
}) {
  const destinations = region.destinations;
  const [hero, ...rest] = destinations;
  void rest;

  return (
    <>
      <TopNavBar />
      <main className="pt-16">
        {/* Hero Banner */}
        <section className="max-w-[1440px] mx-auto px-4 md:px-8">
          <div className="relative h-[600px] rounded-xl md:rounded-lg overflow-hidden">
            {hero && (
              <img
                alt={region.name}
                className="w-full h-full object-cover"
                src={getOptimizedImageUrl(getImageUrl(hero), { width: 1440, quality: 85 })}
                fetchPriority="high"
              />
            )}
            <div className="absolute inset-0 bg-black/30 flex flex-col justify-end p-8 md:p-16">
              <div className="max-w-3xl">
                <span className="inline-block px-4 py-1 bg-secondary text-on-secondary rounded-full text-xs font-label uppercase tracking-widest mb-6">
                  Περιοχή
                </span>
                <h1 className="text-5xl md:text-7xl font-headline font-extrabold text-white tracking-tighter mb-6">
                  {region.name}
                </h1>
                {region.description && (
                  <p className="text-lg md:text-xl text-white/90 font-body leading-relaxed max-w-2xl">
                    {region.description}
                  </p>
                )}
                <p className="text-sm text-white/70 font-label mt-4 uppercase tracking-widest">
                  {destinations.length}{" "}
                  {destinations.length === 1 ? "Προορισμός" : "Προορισμοί"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Destinations Grid */}
        <section className="max-w-7xl mx-auto px-8 py-16">
          <h2 className="text-3xl md:text-4xl font-headline font-bold text-on-surface tracking-tight mb-12">
            Εξερευνήστε {region.name}
          </h2>

          {destinations.length === 0 ? (
            <p className="text-center py-16 text-outline font-body italic">
              Δεν υπάρχουν δημοσιευμένοι προορισμοί σε αυτή την περιοχή ακόμα.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {destinations.map((dest: Destination, i: number) => (
                <Link
                  key={dest.id}
                  href={`/destinations/${dest.slug}`}
                  className={`group relative aspect-[4/5] rounded-lg overflow-hidden cursor-pointer shadow-lg block${
                    i % 2 === 1 ? " md:translate-y-12" : ""
                  }`}
                >
                  <img
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    src={getImageUrl(dest)}
                    alt={dest.title}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                  <div className="absolute bottom-0 left-0 p-8 w-full transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-2xl font-headline font-bold text-white mb-2">
                      {dest.title}
                    </h3>
                    {dest.visit_date && (
                      <div className="flex items-center text-white/60 text-sm gap-2">
                        <span className="material-symbols-outlined text-base">
                          calendar_today
                        </span>
                        <span>{formatDate(dest.visit_date)}</span>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
