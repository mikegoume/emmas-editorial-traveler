import Footer from "@/components/Footer";
import TopNavBar from "@/components/TopNavBar";
import {
  formatDate,
  getAllPosts,
  getImageUrl,
  getPostBySlug,
  stripHtml,
  type WPPost,
} from "@/lib/graphql";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 60;

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const decodedSlug = decodeURIComponent(params.slug);
  const post = await getPostBySlug(decodedSlug);
  if (!post) return {};

  const description =
    stripHtml(post.excerpt).slice(0, 160) ||
    stripHtml(post.content).slice(0, 160) ||
    post.title;

  return {
    title: `${post.title} | The Editorial Traveler`,
    description,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const decodedSlug = decodeURIComponent(params.slug);

  const [post, allPosts] = await Promise.all([
    getPostBySlug(decodedSlug),
    getAllPosts(),
  ]);

  if (!post) notFound();

  const category = post.categories.nodes[0];
  // Related: prefer same category, otherwise most recent
  const related = allPosts
    .filter((p) => p.id !== post.id)
    .filter((p) =>
      category
        ? p.categories.nodes.some((c) => c.name === category.name)
        : true,
    )
    .slice(0, 3);

  return (
    <>
      <TopNavBar />
      <main className="pt-20">
        {/* ── Hero ───────────────────────────────────────────────────── */}
        <section className="relative h-[600px] md:h-[720px] w-full overflow-hidden">
          <img
            alt={post.featuredImage?.node.altText ?? post.title}
            className="absolute inset-0 w-full h-full object-cover"
            src={getImageUrl(post)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-on-background/80 via-on-background/20 to-transparent" />

          <div className="relative h-full flex flex-col justify-end pb-20 px-8 max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-8 flex-wrap">
              {category && (
                <Link
                  href={`/blog/category/${category.slug ?? ""}`}
                  className="px-4 py-1.5 bg-secondary text-on-secondary rounded-full text-xs font-label uppercase tracking-widest hover:bg-secondary-dim transition-colors"
                >
                  {category.name}
                </Link>
              )}
              {post.blogPostDetails?.readTime && (
                <span className="text-white/80 text-xs font-label uppercase tracking-widest">
                  {post.blogPostDetails.readTime}
                </span>
              )}
            </div>

            <h1 className="font-headline font-extrabold text-white text-4xl md:text-6xl tracking-tighter leading-[1.05] mb-6 max-w-4xl">
              {post.title}
            </h1>

            <div className="flex items-center gap-3 text-white/70 text-sm font-label">
              <span className="material-symbols-outlined text-base">
                calendar_today
              </span>
              <span>{formatDate(post.date)}</span>
            </div>
          </div>
        </section>

        {/* ── Article Body ───────────────────────────────────────────── */}
        <article className="max-w-4xl mx-auto px-8 py-12">
          {/* Lede / excerpt */}
          {post.excerpt && (
            <p className="text-2xl text-on-surface font-body leading-relaxed mb-12 pb-12 border-b border-outline-variant/20 italic font-light">
              {stripHtml(post.excerpt)}
            </p>
          )}

          {/* Article content from WordPress */}
          <div
            className="prose prose-lg max-w-none font-body text-on-surface-variant leading-relaxed
              prose-headings:font-headline prose-headings:text-on-surface prose-headings:font-bold prose-headings:tracking-tight
              prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
              prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
              prose-p:mb-6 prose-p:text-lg
              prose-a:text-secondary prose-a:no-underline prose-a:font-semibold hover:prose-a:underline
              prose-img:rounded-lg prose-img:shadow-md prose-img:my-10
              prose-blockquote:border-l-4 prose-blockquote:border-secondary prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-on-surface
              prose-strong:text-on-surface prose-strong:font-semibold
              prose-ul:my-6 prose-ol:my-6
              prose-li:my-2 prose-li:text-lg"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Share + meta footer */}
          <div className="mt-16 pt-12 border-t border-outline-variant/20 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="text-sm text-outline font-label uppercase tracking-wider">
              Published {formatDate(post.date)}
              {category && (
                <>
                  {" in "}
                  <Link
                    href={`/blog/category/${category.slug ?? ""}`}
                    className="text-secondary hover:underline font-bold"
                  >
                    {category.name}
                  </Link>
                </>
              )}
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-secondary font-bold font-headline hover:gap-3 transition-all"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              Back to all posts
            </Link>
          </div>
        </article>

        {/* ── Related Posts ──────────────────────────────────────────── */}
        {related.length > 0 && (
          <section className="bg-surface-container-low py-24 px-8 mt-16 border-t border-outline-variant/15">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <span className="font-label text-secondary text-xs font-bold tracking-widest mb-4 block uppercase">
                  Continue Reading
                </span>
                <h2 className="font-headline text-3xl md:text-4xl font-bold text-on-surface tracking-tight">
                  More from {category ? category.name : "the Journal"}
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {related.map((rel: WPPost) => (
                  <Link
                    key={rel.id}
                    href={`/blog/${rel.slug}`}
                    className="group block"
                  >
                    <div className="rounded-lg overflow-hidden aspect-[4/5] mb-6 editorial-shadow transition-transform duration-500 group-hover:scale-[1.02]">
                      <img
                        alt={rel.title}
                        className="w-full h-full object-cover"
                        src={getImageUrl(rel)}
                      />
                    </div>
                    {rel.categories.nodes[0] && (
                      <span className="text-[10px] font-label font-bold text-secondary uppercase tracking-widest mb-2 block">
                        {rel.categories.nodes[0].name}
                      </span>
                    )}
                    <h3 className="font-headline text-xl font-bold leading-tight group-hover:text-secondary transition-colors mb-3">
                      {rel.title}
                    </h3>
                    <p className="font-body text-on-surface-variant text-sm line-clamp-2 mb-3">
                      {stripHtml(rel.excerpt)}
                    </p>
                    <div className="flex items-center text-xs font-label text-outline uppercase tracking-wider">
                      <span>{formatDate(rel.date)}</span>
                      {rel.blogPostDetails?.readTime && (
                        <>
                          <span className="mx-2">•</span>
                          <span>{rel.blogPostDetails.readTime}</span>
                        </>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Newsletter CTA ─────────────────────────────────────────── */}
        <section className="py-24 px-6 bg-secondary text-on-secondary text-center">
          <h2 className="font-headline text-4xl font-bold mb-6 tracking-tight">
            Enjoyed this story?
          </h2>
          <p className="font-body text-on-secondary/80 max-w-xl mx-auto mb-10 text-lg">
            Subscribe to get more like this delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              className="bg-white/10 border-white/20 text-white rounded-full px-6 py-4 flex-grow placeholder:text-white/40 focus:ring-0"
              placeholder="Your email address"
              type="email"
            />
            <button className="bg-white text-secondary px-8 py-4 rounded-full font-bold hover:bg-surface-container transition-colors">
              Subscribe
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
