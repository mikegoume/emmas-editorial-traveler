import { createServerClient } from "@/lib/supabase-server";
import { formatDate } from "@/lib/db";
import Link from "next/link";

export default async function AdminPostsPage() {
  const supabase = await createServerClient();
  const { data: posts } = await supabase
    .from("posts")
    .select(`*, post_categories(categories(name))`)
    .order("date", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-headline text-3xl font-bold text-on-background">
            Blog Posts
          </h1>
          <p className="text-outline font-body text-sm mt-1">
            {posts?.length ?? 0} total
          </p>
        </div>
        <Link
          href="/admin/posts/new"
          className="flex items-center gap-2 bg-secondary text-on-secondary px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-secondary-dim transition-colors"
        >
          <span className="material-symbols-outlined text-base">add</span>
          New post
        </Link>
      </div>

      {posts?.length === 0 ? (
        <div className="text-center py-24 bg-surface-container-low rounded-lg">
          <span className="material-symbols-outlined text-outline text-5xl mb-4 block">
            article
          </span>
          <p className="text-outline font-body italic">
            No posts yet. Write your first one.
          </p>
        </div>
      ) : (
        <div className="bg-surface-container-lowest border border-outline-variant/15 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface-container-low border-b border-outline-variant/15">
              <tr>
                <th className="text-left px-4 py-3 font-label text-xs uppercase tracking-widest text-outline">
                  Title
                </th>
                <th className="text-left px-4 py-3 font-label text-xs uppercase tracking-widest text-outline hidden md:table-cell">
                  Category
                </th>
                <th className="text-left px-4 py-3 font-label text-xs uppercase tracking-widest text-outline hidden md:table-cell">
                  Date
                </th>
                <th className="text-left px-4 py-3 font-label text-xs uppercase tracking-widest text-outline">
                  Featured
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {posts?.map((post: any) => {
                const category = post.post_categories?.[0]?.categories?.name;
                return (
                  <tr key={post.id} className="hover:bg-surface-container-low/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {(post.hero_image_url || post.featured_image_url) && (
                          <img
                            src={post.hero_image_url ?? post.featured_image_url}
                            alt=""
                            className="w-10 h-10 rounded object-cover shrink-0"
                          />
                        )}
                        <div>
                          <p className="font-medium text-on-surface">
                            {post.title}
                          </p>
                          <p className="text-xs text-outline">{post.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-on-surface-variant hidden md:table-cell">
                      {category ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-on-surface-variant hidden md:table-cell">
                      {formatDate(post.date)}
                    </td>
                    <td className="px-4 py-3">
                      {post.featured ? (
                        <span className="inline-block px-2 py-0.5 bg-secondary-container text-on-secondary-container rounded-full text-[10px] font-bold">
                          Yes
                        </span>
                      ) : (
                        <span className="text-outline-variant text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/posts/${post.id}/edit`}
                        className="text-secondary text-xs font-bold hover:underline"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
