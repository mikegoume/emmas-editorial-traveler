import { DestinationExpandingCards } from "@/components/DestinationExpandingCards";
import Footer from "@/components/Footer";
import TopNavBar from "@/components/TopNavBar";
import { FadeUp } from "@/components/motion/FadeUp";
import { PortfolioGallery } from "@/components/ui/portfolio-gallery";
import ScrollExpandMedia from "@/components/ui/scroll-expansion-hero";
import {
  formatDate,
  getAllPosts,
  getFeaturedDestinations,
  getImageUrl,
  stripHtml,
} from "@/lib/db";
import type { Post } from "@/lib/types";
import Link from "next/link";

export const revalidate = 60;

export default async function HomePage() {
  const [posts, destinations] = await Promise.all([
    getAllPosts(),
    getFeaturedDestinations(),
  ]);

  const featuredPost = posts.find((p) => p.featured) ?? posts[0] ?? null;
  const sidebarPosts = posts.filter((p) => p.id !== featuredPost?.id).slice(0, 2);

  const heroImage = featuredPost
    ? getImageUrl(featuredPost)
    : "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1920&auto=format";

  const destinationData = destinations.map((dest) => ({
    id: dest.id,
    title: dest.title,
    excerpt: dest.excerpt ?? null,
    imgSrc: getImageUrl(dest),
    slug: dest.slug,
  }));

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
        />

        {/* ── Latest Chronicles ──────────────────────────────────────── */}
        <section className="py-32 bg-surface-container-low">
          <div className="max-w-7xl mx-auto px-8">
            <FadeUp>
              <div className="text-center mb-20">
                <h2 className="text-4xl md:text-5xl font-headline font-bold tracking-tight text-on-background mb-4 italic">
                  Latest Chronicles
                </h2>
                <p className="text-primary max-w-xl mx-auto font-body text-lg">
                  In-depth stories, photography tips, and the quiet moments
                  between the landmarks.
                </p>
              </div>
            </FadeUp>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FadeUp delay={0} className="md:col-span-2">
                {featuredPost ? (
                  <div className="bg-surface-container-lowest rounded-lg overflow-hidden group h-full">
                    <div className="h-96 overflow-hidden">
                      <img
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                        src={getImageUrl(featuredPost)}
                        alt={featuredPost.title}
                      />
                    </div>
                    <div className="p-10">
                      <div className="flex items-center gap-4 mb-4">
                        {featuredPost.categories?.[0] && (
                          <span className="px-3 py-1 bg-tertiary-container text-on-tertiary-container rounded-full text-[10px] font-bold font-label uppercase">
                            {featuredPost.categories[0].name}
                          </span>
                        )}
                        {featuredPost.read_time && (
                          <span className="text-outline text-xs font-label uppercase">
                            {featuredPost.read_time}
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
                  <div className="bg-surface-container-lowest rounded-lg p-10 flex items-center justify-center text-outline font-body italic h-full">
                    No posts yet — add some in the admin!
                  </div>
                )}
              </FadeUp>

              <FadeUp delay={0.12}>
                <div className="flex flex-col gap-8">
                  {sidebarPosts.map((post: Post) => (
                    <Link
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      className="bg-surface-container-lowest rounded-lg p-8 group block"
                    >
                      {post.categories?.[0] && (
                        <span className="text-secondary-dim text-[10px] font-bold font-label uppercase mb-2 block">
                          {post.categories[0].name}
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
                      Bi-weekly stories and exclusive photography guides
                      delivered to your inbox.
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
              </FadeUp>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
