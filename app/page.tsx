import Footer from "@/components/Footer";
import TopNavBar from "@/components/TopNavBar";
import {
  formatDate,
  getAllPosts,
  getFeaturedDestinations,
  getImageUrl,
  stripHtml,
  type WPDestination,
  type WPPost,
} from "@/lib/graphql";
import Link from "next/link";

export const revalidate = 60;

export default async function HomePage() {
  const [posts, destinations] = await Promise.all([
    getAllPosts(),
    getFeaturedDestinations(),
  ]);

  const featuredPost =
    posts.find((p) => p.blogPostDetails?.featured) ?? posts[0] ?? null;
  const sidebarPosts = posts
    .filter((p) => p.id !== featuredPost?.id)
    .slice(0, 2);

  return (
    <>
      <TopNavBar />
      <main className="pt-20">
        {/* ── Hero ───────────────────────────────────────────────────── */}
        <section className="relative h-[921px] min-h-[600px] flex items-center overflow-hidden mx-4 md:mx-8 rounded-lg mt-4">
          <div className="absolute inset-0 z-0">
            {featuredPost && (
              <img
                className="w-full h-full object-cover"
                src={getImageUrl(featuredPost)}
                alt={featuredPost.title}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-on-background/50 to-transparent" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-8 w-full">
            <div className="max-w-2xl">
              <span className="inline-block mb-4 px-4 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold tracking-widest font-label">
                EST. 2024
              </span>
              <h1 className="text-5xl md:text-7xl font-headline font-extrabold text-white mb-6 leading-tight tracking-tighter">
                Curating the world&apos;s most <br />
                <span className="italic font-light">silent moments.</span>
              </h1>
              <p className="text-white/90 text-lg md:text-xl font-body max-w-lg mb-10 leading-relaxed">
                An editorial photographer and slow traveler dedicated to
                uncovering the authentic soul of every landscape I encounter.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/destinations"
                  className="px-8 py-4 bg-secondary text-on-secondary rounded-full font-headline font-bold text-lg hover:scale-105 transition-transform duration-300 inline-flex items-center gap-2"
                >
                  Explore Destinations
                  <span className="material-symbols-outlined">
                    arrow_forward
                  </span>
                </Link>
                <Link
                  href="/about"
                  className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full font-headline font-bold text-lg hover:bg-white/20 transition-all duration-300"
                >
                  Read the Bio
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── Featured Destinations ──────────────────────────────────── */}
        <section className="py-32 px-8 max-w-7xl mx-auto" id="destinations">
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
              A selection of places that stayed with me long after I left their
              borders.
            </p>
          </div>

          {destinations.length === 0 ? (
            <p className="text-center py-16 text-outline font-body italic">
              No destinations yet — add some in WordPress!
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {destinations.map((dest: WPDestination, i: number) => (
                <Link
                  key={dest.id}
                  href={`/destinations/${dest.slug}`}
                  className={`group relative aspect-[4/5] rounded-lg overflow-hidden cursor-pointer shadow-lg block${
                    i === 1 ? " md:translate-y-12" : ""
                  }`}
                >
                  <img
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    src={getImageUrl(dest)}
                    alt={dest.featuredImage?.node.altText ?? dest.title}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                  <div className="absolute bottom-0 left-0 p-8 w-full transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    {dest.regions?.nodes[0] && (
                      <span className="text-white/80 text-xs font-label tracking-widest mb-2 block uppercase">
                        {dest.regions.nodes[0].name}
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
              ))}
            </div>
          )}
        </section>

        {/* ── Latest Chronicles ──────────────────────────────────────── */}
        <section className="py-32 bg-surface-container-low">
          <div className="max-w-7xl mx-auto px-8">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-headline font-bold tracking-tight text-on-background mb-4 italic">
                Latest Chronicles
              </h2>
              <p className="text-primary max-w-xl mx-auto font-body text-lg">
                In-depth stories, photography tips, and the quiet moments
                between the landmarks.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredPost ? (
                <div className="md:col-span-2 bg-surface-container-lowest rounded-lg overflow-hidden group">
                  <div className="h-96 overflow-hidden">
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                      src={getImageUrl(featuredPost)}
                      alt={featuredPost.title}
                    />
                  </div>
                  <div className="p-10">
                    <div className="flex items-center gap-4 mb-4">
                      {featuredPost.categories.nodes[0] && (
                        <span className="px-3 py-1 bg-tertiary-container text-on-tertiary-container rounded-full text-[10px] font-bold font-label uppercase">
                          {featuredPost.categories.nodes[0].name}
                        </span>
                      )}
                      {featuredPost.blogPostDetails?.readTime && (
                        <span className="text-outline text-xs font-label uppercase">
                          {featuredPost.blogPostDetails.readTime}
                        </span>
                      )}
                    </div>
                    <h3 className="text-3xl font-headline font-bold text-on-background mb-4 leading-tight group-hover:text-secondary transition-colors">
                      {featuredPost.title}
                    </h3>
                    <p className="text-primary font-body mb-8 line-clamp-2">
                      {stripHtml(featuredPost.excerpt)}
                    </p>
                    <Link
                      href={`/blog/${featuredPost.slug}`}
                      className="inline-flex items-center gap-2 text-secondary font-bold font-headline group/link"
                    >
                      Read the story
                      <span className="material-symbols-outlined text-sm group-hover/link:translate-x-1 transition-transform">
                        arrow_forward
                      </span>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="md:col-span-2 bg-surface-container-lowest rounded-lg p-10 flex items-center justify-center text-outline font-body italic">
                  No posts yet — add some in WordPress!
                </div>
              )}

              <div className="flex flex-col gap-8">
                {sidebarPosts.map((post: WPPost) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="bg-surface-container-lowest rounded-lg p-8 group block"
                  >
                    {post.categories.nodes[0] && (
                      <span className="text-secondary-dim text-[10px] font-bold font-label uppercase mb-2 block">
                        {post.categories.nodes[0].name}
                      </span>
                    )}
                    <h4 className="text-xl font-headline font-bold mb-3 group-hover:text-secondary transition-colors">
                      {post.title}
                    </h4>
                    <p className="text-primary text-sm font-body line-clamp-2 mb-4">
                      {stripHtml(post.excerpt)}
                    </p>
                    <span className="text-outline-variant text-xs">
                      {formatDate(post.date)}
                    </span>
                  </Link>
                ))}

                <div className="bg-secondary p-8 rounded-lg text-on-secondary">
                  <h4 className="text-2xl font-headline font-bold mb-4">
                    The Curated Letter
                  </h4>
                  <p className="text-on-secondary/80 text-sm mb-6">
                    Bi-weekly stories and exclusive photography guides delivered
                    to your inbox.
                  </p>
                  <div className="relative">
                    <input
                      className="w-full bg-white/10 border-none border-b border-on-secondary/30 text-white placeholder:text-on-secondary/50 focus:ring-0 px-0 py-2"
                      placeholder="Email address"
                      type="email"
                    />
                    <button className="absolute right-0 top-1/2 -translate-y-1/2 material-symbols-outlined">
                      send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── About Teaser ───────────────────────────────────────────── */}
        <section className="py-32 px-8 max-w-7xl mx-auto overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <div className="aspect-[4/5] bg-surface-container-high rounded-lg relative overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxF8Mrkdfo4cg09JrTErtqRjUXNP97IrSSp_FVggnLyhsoOruYsStxqs5mmYHK3SU_gSdbAly5lDVu36bavntxzG6Zp4YzU6_X-Bf8WOMvI43ckmBKoxwSyPCeTb8vCNGnBd2fO4JXsccEiKMvWWBaRGSQxxilBeUVhriY12F53Qa00PySHGPrcE--1vER_ETBIjZI2FfvpjsGXuFN853v1SzxMySNU8g1POIVOXzlknEQbBAB6ef-V3-QaidU6R7feGaAEQLuYw"
                  alt="Author portrait"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -z-10" />
            </div>
            <div>
              <span className="text-secondary font-label font-bold tracking-widest text-xs mb-4 block uppercase">
                Behind the Lens
              </span>
              <h2 className="text-4xl md:text-5xl font-headline font-extrabold text-on-background mb-8 leading-tight">
                Capturing the world, <br />
                one frame at a time.
              </h2>
              <div className="space-y-6 text-primary font-body text-lg leading-relaxed">
                <p>
                  I believe travel isn&apos;t about the distance covered, but
                  the depth of the presence we bring to new environments. My
                  work focuses on the intersection of human heritage and the
                  untamed natural world.
                </p>
                <p>
                  With a background in editorial design and a passion for slow
                  journalism, I aim to create a space where you can escape the
                  rush and truly see the beauty of our planet through a curated
                  lens.
                </p>
              </div>
              <div className="mt-10 flex gap-8">
                {[
                  { value: "42+", label: "Countries" },
                  { value: "12", label: "Exhibitions" },
                  { value: "8y", label: "Experience" },
                ].map((s) => (
                  <div key={s.label} className="flex flex-col">
                    <span className="text-3xl font-headline font-bold text-on-background">
                      {s.value}
                    </span>
                    <span className="text-xs font-label text-outline uppercase tracking-wider">
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
