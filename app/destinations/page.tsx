import Footer from "@/components/Footer";
import TopNavBar from "@/components/TopNavBar";
import {
  formatDate,
  getAllDestinations,
  getImageUrl,
  getOptimizedImageUrl,
  getRegionsWithDestinations,
} from "@/lib/db";
import type { Destination } from "@/lib/types";
import type { Metadata } from "next";
import Link from "next/link";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Προορισμοί",
  description:
    "Εξερεύνησε προορισμούς αργού ταξιδιού — από τη Μεσόγειο ως τα πέρατα του κόσμου. Editorial ταξιδιωτικές ιστορίες από την Emma Mazaraki.",
  openGraph: {
    title: "Προορισμοί | Travel With Emma",
    description:
      "Εξερεύνησε προορισμούς αργού ταξιδιού — από τη Μεσόγειο ως τα πέρατα του κόσμου. Editorial ταξιδιωτικές ιστορίες από την Emma Mazaraki.",
    url: "https://travelwithemma.gr/destinations",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Προορισμοί — Travel With Emma" }],
  },
  alternates: { canonical: "/destinations" },
};

export default async function DestinationsPage() {
  const [destinations, regions] = await Promise.all([
    getAllDestinations(),
    getRegionsWithDestinations(),
  ]);

  const heroDestination =
    destinations.find((d) => d.featured) ?? destinations[0];

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
                  ? getOptimizedImageUrl(getImageUrl(heroDestination), { width: 1440, quality: 85 })
                  : "https://placehold.co/1440x600/eceeef/5b6061?text=Destinations"
              }
              fetchPriority="high"
            />
            <div className="absolute inset-0 bg-black/35 flex flex-col justify-end p-8 md:p-16">
              <div className="max-w-3xl">
                <span className="inline-block px-4 py-1 bg-secondary text-on-secondary rounded-full text-xs font-label uppercase tracking-widest mb-6">
                  {destinations.length}{" "}
                  {destinations.length === 1 ? "Προορισμός" : "Προορισμοί"} ·{" "}
                  {regions.length} {regions.length === 1 ? "Περιοχή" : "Περιοχές"}
                </span>
                <h1 className="text-5xl md:text-7xl font-headline font-extrabold text-white tracking-tighter mb-6">
                  Εξερευνήστε τον Κόσμο
                </h1>
                <p className="text-lg md:text-xl text-white/90 font-body leading-relaxed max-w-2xl">
                  Ένα επιμελημένο αρχείο προορισμών — από τις ηλιόλουστες ακτές της Μεσογείου έως τις άγριες κορυφές των Άλπεων. Κάθε μέρος εδώ έχει επισκεφθεί, φωτογραφηθεί και ζηθεί.
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
                  Αναζήτηση ανά Περιοχή
                </span>
                <h2 className="text-3xl md:text-4xl font-headline font-bold text-on-surface tracking-tight">
                  Επιλέξτε την ήπειρό σας
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
                    {region.destinations.length}{" "}
                    {region.destinations.length === 1
                      ? "προορισμός"
                      : "προορισμοί"}
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
                Το Αρχείο
              </span>
              <h2 className="text-3xl md:text-4xl font-headline font-bold text-on-surface tracking-tight">
                Κάθε Προορισμός
              </h2>
              <p className="text-outline mt-2 font-body">
                Το πλήρες αρχείο — κάθε τόπος που έχει τεκμηριωθεί.
              </p>
            </div>
          </div>

          {destinations.length === 0 ? (
            <div className="text-center py-32 bg-surface-container-low rounded-lg">
              <p className="text-outline font-body italic mb-2">
                Δεν υπάρχουν δημοσιευμένοι προορισμοί ακόμα.
              </p>
              <p className="text-sm text-outline-variant font-label">
                Προσθέστε κάποιους στον πίνακα διαχείρισης → Προορισμοί → Νέος Προορισμός.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {destinations.map((dest: Destination, i: number) => {
                const region = dest.region;
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
                      src={getOptimizedImageUrl(getImageUrl(dest), { width: 600, quality: 75 })}
                      alt={dest.featured_image_alt || dest.title}
                      loading="lazy"
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
                Μείνετε Εμπνευσμένοι
              </h2>
              <p className="text-on-secondary-container/80 text-lg mb-10 font-body">
                Εγγραφείτε στο εβδομαδιαίο newsletter για επιλεγμένα ταξιδιωτικά δρομολόγια, κρυφά στολίδια και αποκλειστικές ιστορίες που παραδίδονται στα εισερχόμενά σας.
              </p>
              <div className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
                <input
                  className="flex-1 bg-surface-container-lowest/50 border-none rounded-full px-6 py-4 text-on-surface focus:ring-2 focus:ring-secondary outline-none placeholder:text-outline-variant"
                  placeholder="Η διεύθυνση email σας"
                  type="email"
                />
                <button className="bg-secondary text-on-secondary px-8 py-4 rounded-full font-label text-sm tracking-widest uppercase hover:scale-105 transition-transform">
                  Εγγραφή
                </button>
              </div>
            </div>
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-white/20 blur-3xl rounded-full" />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
