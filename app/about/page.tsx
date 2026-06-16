import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import TopNavBar from "@/components/TopNavBar";
import WorldMapWrapper from "@/components/WorldMapWrapper";
import {
  getAllDestinations,
  getOptimizedImageUrl,
  getSiteSetting,
} from "@/lib/db";

export const revalidate = 60;

const DEFAULT_PHOTO =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCF_3viPywrcJhKi4OzDiCg3PiRY1hw_oVzRnMEH5nO_ZpT7QixnsePwamOPUupbgc9R38k-p76DcvF2XQkQ9KIeXNb88q7KaK7rwtJejMTp-kw9F_aHrwYkdXp-qTPfIg7dk767vreUfH9XN1xoZR2RQX1V4JTrIBRdInyKWCUFhqyweQ5M5uQs8Gw_VlOMndI95dFA6IKMOoK5SbK1pr4HZWBTmPYAmACeNrvHiiB1WD2lOgv0CfwGQb-m3qbsQ-DzZ8sq99tXg";

const DEFAULT_HEADING = "Curating the world, one story at a time.";

const DEFAULT_BIO = [
  "Travel is more than a movement between coordinates; it is a discipline of observation. My journey began not with a suitcase, but with a camera and an insatiable curiosity for the quiet corners of the world that rarely make it to the front of a brochure.",
  "As a former architectural journalist, I spent years documenting how structures define our lives. Now, I apply that same editorial lens to the world at large. Through Travel With Emma, I curate experiences that prioritize depth over speed and atmosphere over checkboxes.",
  "From the misty peaks of the Alentejo to the hidden tea houses of Kyoto, my goal is to bridge the gap between high-end aesthetics and raw, authentic human connection. We don't just visit places; we inhabit them, if only for a moment.",
];

export default async function AboutPage() {
  const [
    destinations,
    aboutPhoto,
    aboutHeading,
    aboutBio,
    stat1Value,
    stat1Label,
    stat2Value,
    stat2Label,
    stat3Value,
    stat3Label,
  ] = await Promise.all([
    getAllDestinations(),
    getSiteSetting("about_photo_url").catch(() => null),
    getSiteSetting("about_heading").catch(() => null),
    getSiteSetting("about_bio").catch(() => null),
    getSiteSetting("about_stat_1_value").catch(() => null),
    getSiteSetting("about_stat_1_label").catch(() => null),
    getSiteSetting("about_stat_2_value").catch(() => null),
    getSiteSetting("about_stat_2_label").catch(() => null),
    getSiteSetting("about_stat_3_value").catch(() => null),
    getSiteSetting("about_stat_3_label").catch(() => null),
  ]);

  const photo = aboutPhoto || DEFAULT_PHOTO;
  const heading = aboutHeading || DEFAULT_HEADING;
  const bioParagraphs = aboutBio
    ? aboutBio.split(/\n\n+/).filter(Boolean)
    : DEFAULT_BIO;

  const stats = [
    { value: stat1Value || "42", label: stat1Label || "Χώρες" },
    { value: stat2Value || "150+", label: stat2Label || "Δοκίμια" },
    { value: stat3Value || "12k", label: stat3Label || "Αναγνώστες" },
  ];

  return (
    <>
      <TopNavBar />
      <main className="pt-32 pb-24">
        {/* About Section */}
        <section className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Narrative */}
          <div className="lg:col-span-7 order-2 lg:order-1">
            <span className="text-[0.75rem] font-bold tracking-[0.05em] text-on-surface-variant uppercase font-label block mb-4">
              Η ΠΟΡΕΙΑ
            </span>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter font-headline text-on-background mb-8 leading-tight">
              {heading}
            </h1>
            <div className="space-y-6 text-lg leading-relaxed text-on-surface-variant max-w-2xl font-body">
              {bioParagraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="p-6 bg-surface-container-low rounded-lg"
                >
                  <div className="text-3xl font-extrabold font-headline text-secondary">
                    {stat.value}
                  </div>
                  <div className="text-sm font-label text-on-surface-variant uppercase tracking-wider mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Portrait */}
          <div className="lg:col-span-5 order-1 lg:order-2 relative">
            <div className="aspect-[4/5] rounded-lg overflow-hidden editorial-shadow relative group">
              <img
                alt="Portrait of the creator"
                className="w-full h-full object-cover"
                src={getOptimizedImageUrl(photo, { width: 800, quality: 85 })}
                fetchPriority="high"
              />
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-primary-dim/60 to-transparent">
                <p className="text-on-primary font-medium italic">
                  &ldquo;Ο κόσμος είναι ένα βιβλίο και όσοι δεν ταξιδεύουν
                  διαβάζουν μόνο μία σελίδα.&rdquo;
                </p>
              </div>
            </div>
            <div className="hidden lg:block absolute -bottom-8 -left-8 w-48 h-48 bg-secondary-container rounded-lg -z-10 opacity-40" />
          </div>
        </section>

        {/* ── Map Section — REPLACE the old SVG map with this ── */}
        <section className="max-w-7xl mx-auto px-8 my-32">
          <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-xl">
              <span className="text-[0.75rem] font-bold tracking-[0.05em] text-on-surface-variant uppercase font-label block mb-4">
                ΧΑΡΤΟΓΡΑΦΩΝΤΑΣ ΙΣΤΟΡΙΕΣ
              </span>
              <h2 className="text-4xl font-extrabold font-headline tracking-tight mb-4">
                Τα ίχνη ενός οδοιπόρου.
              </h2>
              <p className="text-on-surface-variant leading-relaxed">
                Ένα οπτικό αρχείο από τοπία που διαμόρφωσαν την οπτική μου.
                Κάντε κλικ σε οποιοδήποτε σημείο για να εξερευνήσετε έναν
                προορισμό.
              </p>
            </div>
            <div className="flex items-center gap-3 bg-surface-container-low px-4 py-2 rounded-full border border-outline-variant/10">
              <div className="w-2 h-2 rounded-full bg-secondary" />
              <span className="text-xs font-bold uppercase tracking-widest font-label text-on-surface-variant">
                {destinations.filter((d) => d.latitude && d.longitude).length}{" "}
                Τεκμηριωμένοι Προορισμοί
              </span>
            </div>
          </div>

          {/* Real interactive map */}
          <WorldMapWrapper destinations={destinations} />

          <div className="mt-4 flex items-center justify-center gap-2 text-on-surface-variant/60 italic text-sm">
            <span className="material-symbols-outlined text-sm">info</span>
            <span>
              Κάντε κλικ στα σημεία για εξερεύνηση. Κυλίστε για μεγέθυνση.
            </span>
          </div>
        </section>

        {/* Divider */}
        <div className="max-w-7xl mx-auto px-8 mb-24">
          <div className="h-px w-full bg-outline-variant/20" />
        </div>

        {/* Contact Section */}
        <section className="max-w-7xl mx-auto px-8" id="contact">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-4">
              <span className="text-[0.75rem] font-bold tracking-[0.05em] text-on-surface-variant uppercase font-label block mb-4">
                ΕΠΙΚΟΙΝΩΝΙΑ
              </span>
              <h2 className="text-4xl font-extrabold font-headline tracking-tight mb-6">
                Ας δημιουργήσουμε κάτι όμορφο μαζί.
              </h2>
              <p className="text-on-surface-variant mb-8 leading-relaxed font-body">
                Είτε σας ενδιαφέρει μια εταιρική συνεργασία, editorial
                συνεργασία, ή απλά θέλετε να μοιραστείτε ένα κρυμμένο
                ταξιδιωτικό στολίδι, θα χαρώ να σας ακούσω.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-on-surface">
                  <span className="material-symbols-outlined text-secondary font-bold">
                    mail
                  </span>
                  <span className="font-medium">emmamazaraki1@gmail.com</span>
                </div>
                <div className="flex items-center gap-4 text-on-surface">
                  <span className="material-symbols-outlined text-secondary font-bold">
                    location_on
                  </span>
                  <span className="font-medium">
                    Αυτή τη στιγμή στη: Ηράκλειο, Κρήτη
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8">
              <ContactForm />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
