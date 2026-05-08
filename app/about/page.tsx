import TopNavBar from "@/components/TopNavBar";

const mapMarkers = [
  { top: "35%", left: "48%", title: "Lisbon, Portugal" },
  { top: "28%", left: "51%", title: "Paris, France" },
  { top: "45%", left: "53%", title: "Marrakech, Morocco" },
  { top: "38%", left: "81%", title: "Kyoto, Japan" },
  { top: "32%", left: "25%", title: "New York, USA" },
  { top: "65%", left: "28%", title: "Patagonia, Chile" },
  { top: "52%", left: "44%", title: "Cape Verde" },
  { top: "42%", left: "74%", title: "Hanoi, Vietnam" },
  { top: "82%", left: "85%", title: "Melbourne, Australia" },
  { top: "22%", left: "65%", title: "Tbilisi, Georgia" },
];

export default function AboutPage() {
  return (
    <>
      <TopNavBar />
      <main className="pt-32 pb-24">
        {/* About Section */}
        <section className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Narrative */}
          <div className="lg:col-span-7 order-2 lg:order-1">
            <span className="text-[0.75rem] font-bold tracking-[0.05em] text-on-surface-variant uppercase font-label block mb-4">
              THE JOURNEY
            </span>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter font-headline text-on-background mb-8 leading-tight">
              Curating the world, one story at a time.
            </h1>
            <div className="space-y-6 text-lg leading-relaxed text-on-surface-variant max-w-2xl font-body">
              <p>
                Travel is more than a movement between coordinates; it is a
                discipline of observation. My journey began not with a suitcase,
                but with a camera and an insatiable curiosity for the quiet
                corners of the world that rarely make it to the front of a
                brochure.
              </p>
              <p>
                As a former architectural journalist, I spent years documenting
                how structures define our lives. Now, I apply that same
                editorial lens to the world at large. Through{" "}
                <span className="italic text-secondary font-semibold">
                  The Editorial Traveler
                </span>
                , I curate experiences that prioritize depth over speed and
                atmosphere over checkboxes.
              </p>
              <p>
                From the misty peaks of the Alentejo to the hidden tea houses of
                Kyoto, my goal is to bridge the gap between high-end aesthetics
                and raw, authentic human connection. We don&apos;t just visit
                places; we inhabit them, if only for a moment.
              </p>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-4">
              {[
                { value: "42", label: "Countries" },
                { value: "150+", label: "Essays" },
                { value: "12k", label: "Readers" },
              ].map((stat) => (
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
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCF_3viPywrcJhKi4OzDiCg3PiRY1hw_oVzRnMEH5nO_ZpT7QixnsePwamOPUupbgc9R38k-p76DcvF2XQkQ9KIeXNb88q7KaK7rwtJejMTp-kw9F_aHrwYkdXp-qTPfIg7dk767vreUfH9XN1xoZR2RQX1V4JTrIBRdInyKWCUFhqyweQ5M5uQs8Gw_VlOMndI95dFA6IKMOoK5SbK1pr4HZWBTmPYAmACeNrvHiiB1WD2lOgv0CfwGQb-m3qbsQ-DzZ8sq99tXg"
              />
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-primary-dim/60 to-transparent">
                <p className="text-on-primary font-medium italic">
                  &ldquo;The world is a book, and those who do not travel read
                  only one page.&rdquo;
                </p>
              </div>
            </div>
            <div className="hidden lg:block absolute -bottom-8 -left-8 w-48 h-48 bg-secondary-container rounded-lg -z-10 opacity-40" />
          </div>
        </section>

        {/* Interactive Map */}
        <section className="max-w-7xl mx-auto px-8 my-32">
          <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-xl">
              <span className="text-[0.75rem] font-bold tracking-[0.05em] text-on-surface-variant uppercase font-label block mb-4">
                MAPPING STORIES
              </span>
              <h2 className="text-4xl font-extrabold font-headline tracking-tight mb-4">
                Footsteps of a wanderer.
              </h2>
              <p className="text-on-surface-variant leading-relaxed">
                A visual archive of the landscapes that have shaped my
                perspective. Each marker represents a location where an essay
                was born or a story was lived.
              </p>
            </div>
            <div className="flex items-center gap-3 bg-surface-container-low px-4 py-2 rounded-full border border-outline-variant/10">
              <div className="w-2 h-2 rounded-full bg-secondary" />
              <span className="text-xs font-bold uppercase tracking-widest font-label text-on-surface-variant">
                Documented Destinations
              </span>
            </div>
          </div>

          <div className="relative w-full aspect-[21/9] bg-surface-container-low rounded-lg overflow-hidden shadow-inner border border-outline-variant/10 group">
            {/* SVG continental outlines */}
            <svg
              className="absolute inset-0 w-full h-full text-outline-variant/30"
              fill="currentColor"
              viewBox="0 0 1000 450"
            >
              <path d="M150,120 Q180,80 220,100 T280,140 T320,100 T380,120 T420,180 L400,250 Q350,300 280,280 T200,250 T150,120 Z" />
              <path d="M250,280 Q300,320 280,380 T240,430 T180,380 T220,320 Z" />
              <path d="M450,150 Q500,100 550,130 T600,180 T580,250 T520,300 T450,250 Z" />
              <path d="M600,130 Q700,80 850,120 T900,200 T800,300 T650,250 Z" />
              <path d="M780,320 Q850,320 880,380 T800,420 T750,350 Z" />
            </svg>

            {/* Map markers */}
            {mapMarkers.map((marker) => (
              <div
                key={marker.title}
                title={marker.title}
                className="absolute w-3 h-3 bg-secondary rounded-full border-2 border-white shadow-sm cursor-pointer transition-all duration-300 hover:scale-150 hover:bg-emerald-800 hover:ring-4 hover:ring-emerald-900/10"
                style={{ top: marker.top, left: marker.left }}
              />
            ))}

            <div className="absolute inset-0 bg-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </div>

          <div className="mt-4 flex items-center justify-center gap-2 text-on-surface-variant/60 italic text-sm">
            <span className="material-symbols-outlined text-sm">info</span>
            <span>
              Hover over markers to view locations from past editorial features.
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
                CONNECT
              </span>
              <h2 className="text-4xl font-extrabold font-headline tracking-tight mb-6">
                Let&apos;s craft something beautiful together.
              </h2>
              <p className="text-on-surface-variant mb-8 leading-relaxed font-body">
                Whether you&apos;re interested in a brand partnership, editorial
                collaboration, or just want to share a hidden travel gem,
                I&apos;d love to hear from you.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-on-surface">
                  <span className="material-symbols-outlined text-secondary font-bold">
                    mail
                  </span>
                  <span className="font-medium">
                    hello@editorialtraveler.com
                  </span>
                </div>
                <div className="flex items-center gap-4 text-on-surface">
                  <span className="material-symbols-outlined text-secondary font-bold">
                    location_on
                  </span>
                  <span className="font-medium">
                    Currently in: Lisbon, Portugal
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8">
              <div className="bg-surface-container-lowest p-8 md:p-12 rounded-lg editorial-shadow border border-white/50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[
                    {
                      label: "Full Name",
                      type: "text",
                      placeholder: "Julianne Smith",
                    },
                    {
                      label: "Email Address",
                      type: "email",
                      placeholder: "julianne@example.com",
                    },
                  ].map((field) => (
                    <div key={field.label} className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant font-label">
                        {field.label}
                      </label>
                      <input
                        className="w-full bg-surface-container-low border-0 border-b border-outline-variant/20 focus:ring-0 focus:border-secondary transition-all py-3 px-0 text-on-surface placeholder:text-outline-variant/50"
                        placeholder={field.placeholder}
                        type={field.type}
                      />
                    </div>
                  ))}

                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant font-label">
                      Inquiry Type
                    </label>
                    <div className="flex flex-wrap gap-3 mt-2">
                      {["Collaboration", "Speaking", "Say Hello"].map(
                        (type, i) => (
                          <button
                            key={type}
                            type="button"
                            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                              i === 0
                                ? "bg-secondary-container text-on-secondary-container scale-105"
                                : "bg-surface-container-high text-on-surface-variant hover:bg-secondary-container/50"
                            }`}
                          >
                            {type}
                          </button>
                        ),
                      )}
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant font-label">
                      Your Message
                    </label>
                    <textarea
                      className="w-full bg-surface-container-low border-0 border-b border-outline-variant/20 focus:ring-0 focus:border-secondary transition-all py-3 px-0 text-on-surface resize-none placeholder:text-outline-variant/50"
                      placeholder="Tell me about your project or destination..."
                      rows={4}
                    />
                  </div>

                  <div className="md:col-span-2 pt-4">
                    <button
                      type="submit"
                      className="w-full md:w-auto px-10 py-4 bg-gradient-to-r from-secondary to-secondary-dim text-on-secondary rounded-full font-bold text-lg transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
                    >
                      Send Message
                      <span className="material-symbols-outlined">send</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-zinc-100 pt-12 pb-8 mt-24 bg-zinc-50">
        <div className="flex flex-col md:flex-row justify-between items-center px-8 max-w-7xl mx-auto gap-4">
          <p className="font-body text-sm tracking-wide text-zinc-400">
            © 2024 The Editorial Traveler. Curated for the modern wanderer.
          </p>
          <div className="flex gap-8">
            {[
              "Privacy Policy",
              "Terms of Service",
              "Instagram",
              "Newsletter",
            ].map((l) => (
              <a
                key={l}
                className="font-body text-sm text-zinc-500 hover:text-zinc-900 underline decoration-emerald-800/30 underline-offset-4 opacity-80 hover:opacity-100 transition-opacity"
                href="#"
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
}
