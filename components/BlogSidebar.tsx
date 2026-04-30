import { getAllCategories, getTrendingTags } from "@/lib/graphql";
import Link from "next/link";

export default async function BlogSidebar() {
  const [categories, tags] = await Promise.all([
    getAllCategories(),
    getTrendingTags(8),
  ]);

  return (
    <>
      {/* Categories */}
      {categories.length > 0 && (
        <div>
          <h4 className="font-label text-xs font-extrabold uppercase tracking-widest text-outline-variant mb-8">
            Collections
          </h4>
          <nav className="space-y-2">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/blog/category/${cat.slug}`}
                className="flex items-center justify-between group p-4 rounded-lg hover:bg-surface-container-low transition-colors"
              >
                <span className="font-headline text-lg font-bold">
                  {cat.name}
                </span>
                <span className="flex items-center gap-2">
                  {cat.count !== null && cat.count > 0 && (
                    <span className="text-xs text-outline font-label">
                      {cat.count}
                    </span>
                  )}
                  <span className="material-symbols-outlined text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
                    arrow_forward
                  </span>
                </span>
              </Link>
            ))}
          </nav>
        </div>
      )}

      {/* Newsletter */}
      <div className="bg-primary/5 p-10 rounded-lg editorial-shadow">
        <h4 className="font-headline text-2xl font-bold mb-4">
          The Monday Postcard
        </h4>
        <p className="font-body text-sm text-on-surface-variant mb-8 leading-relaxed">
          Join 15,000+ wanderers who receive our weekly curated dispatch of slow
          travel stories, exclusive guides, and visual inspiration.
        </p>
        <div className="space-y-4">
          <input
            className="w-full bg-surface-container-lowest border-none rounded-full px-6 py-4 text-sm focus:ring-2 focus:ring-secondary/20 transition-all shadow-sm"
            placeholder="Email address"
            type="email"
          />
          <button className="w-full bg-secondary text-on-secondary font-bold py-4 rounded-full shadow-lg transition-all hover:bg-secondary-dim">
            Join the Circle
          </button>
        </div>
        <p className="text-[10px] text-outline mt-6 text-center italic">
          No spam. Only inspiration. Unsubscribe anytime.
        </p>
      </div>

      {/* Trending Tags */}
      {tags.length > 0 && (
        <div>
          <h4 className="font-label text-xs font-extrabold uppercase tracking-widest text-outline-variant mb-6">
            Trending Tags
          </h4>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Link
                key={tag.id}
                href={`/blog/tag/${tag.slug}`}
                className="px-4 py-2 bg-surface-container-high rounded-full text-xs font-bold hover:bg-secondary-container hover:text-on-secondary-container transition-colors"
              >
                {tag.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
