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
        </div>
      )}

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
