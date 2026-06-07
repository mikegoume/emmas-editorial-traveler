import { formatDate, getImageUrl, stripHtml } from "@/lib/db";
import type { Post } from "@/lib/types";
import Link from "next/link";

type Props = {
  title: string;
  eyebrow?: string;
  description?: string | null;
  posts: Post[];
  featuredPost?: Post | null;
  sidebar?: React.ReactNode;
  emptyMessage?: string;
};

export default function PostListView({
  title,
  eyebrow,
  description,
  posts,
  featuredPost,
  sidebar,
  emptyMessage = "No posts to show.",
}: Props) {
  return (
    <>
      {/* Header */}
      <header className="mb-16">
        {eyebrow && (
          <span className="font-label text-secondary text-xs font-bold tracking-widest mb-4 block uppercase">
            {eyebrow}
          </span>
        )}
        <h1 className="font-headline text-5xl md:text-6xl font-extrabold tracking-tighter text-on-background mb-6 leading-tight">
          {title}
        </h1>
        {description && (
          <p className="font-body text-lg text-on-surface-variant max-w-2xl leading-relaxed">
            {description}
          </p>
        )}
      </header>

      {/* Featured (if provided) */}
      {featuredPost && (
        <section className="relative mb-24">
          <div className="grid grid-cols-12 gap-8 items-center">
            <div className="col-span-12 lg:col-span-8 relative rounded-lg overflow-hidden h-[600px] editorial-shadow">
              <img
                alt={featuredPost.featured_image_alt || featuredPost.title}
                className="w-full h-full object-cover"
                src={getImageUrl(featuredPost)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
            </div>
            <div className="col-span-12 lg:col-span-6 lg:absolute lg:right-0 lg:bottom-12 bg-surface-container-lowest p-10 lg:p-16 rounded-lg editorial-shadow lg:-mr-12 z-10 max-w-2xl border-l-4 border-secondary">
              <span className="font-label text-[0.75rem] tracking-[0.1em] text-secondary font-bold uppercase mb-4 block">
                Featured Story
              </span>
              <h2 className="font-headline text-3xl md:text-4xl font-extrabold tracking-tighter text-on-background mb-6 leading-tight">
                {featuredPost.title}
              </h2>
              <p className="font-body text-lg text-on-surface-variant leading-relaxed mb-8 line-clamp-3">
                {stripHtml(featuredPost.excerpt)}
              </p>
              <Link
                href={`/blog/${featuredPost.slug}`}
                className="inline-flex items-center gap-2 text-secondary font-bold font-headline hover:gap-3 transition-all"
              >
                Read Story
                <span className="material-symbols-outlined text-sm">
                  arrow_forward
                </span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Grid + sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className={sidebar ? "lg:col-span-8" : "lg:col-span-12"}>
          <div className="flex items-center justify-between mb-12">
            <h2 className="font-headline text-3xl font-bold tracking-tight">
              {featuredPost ? "More Articles" : "All Articles"}
            </h2>
            <span className="text-outline font-label text-sm">
              {posts.length} {posts.length === 1 ? "article" : "articles"}
            </span>
          </div>

          {posts.length === 0 ? (
            <p className="text-center py-16 text-outline font-body italic">
              {emptyMessage}
            </p>
          ) : (
            <div
              className={`grid grid-cols-1 ${
                sidebar ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3"
              } gap-x-12 gap-y-16`}
            >
              {posts.map((post) => (
                <article key={post.id} className="group">
                  <Link href={`/blog/${post.slug}`}>
                    <div className="relative rounded-lg overflow-hidden aspect-[4/5] mb-6 editorial-shadow transition-transform duration-500 group-hover:scale-[1.02]">
                      <img
                        alt={post.featured_image_alt || post.title}
                        className="w-full h-full object-cover"
                        src={getImageUrl(post)}
                      />
                      {post.categories?.[0] && (
                        <div className="absolute top-4 left-4">
                          <span className="bg-surface-container-lowest/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">
                            {post.categories[0].name}
                          </span>
                        </div>
                      )}
                    </div>
                    <h3 className="font-headline text-2xl font-bold mb-3 leading-tight group-hover:text-secondary transition-colors">
                      {post.title}
                    </h3>
                  </Link>
                  <p className="font-body text-on-surface-variant line-clamp-3 mb-4">
                    {stripHtml(post.excerpt)}
                  </p>
                  <div className="flex items-center text-xs font-label text-outline uppercase tracking-wider">
                    <span>{formatDate(post.date)}</span>
                    {post.read_time && (
                      <>
                        <span className="mx-2">•</span>
                        <span>{post.read_time}</span>
                      </>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {sidebar && (
          <aside className="lg:col-span-4 space-y-16">{sidebar}</aside>
        )}
      </div>
    </>
  );
}
