import BlogSidebar from "@/components/BlogSidebar";
import PostListView from "@/components/PostListView";
import TopNavBar from "@/components/TopNavBar";
import { getTagBySlug } from "@/lib/graphql";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const tag = await getTagBySlug(params.slug);
  if (!tag) return {};
  return {
    title: `#${tag.name} | The Editorial Traveler`,
    description: tag.description ?? `Articles tagged with ${tag.name}.`,
  };
}

export default async function TagPage({
  params,
}: {
  params: { slug: string };
}) {
  const tag = await getTagBySlug(params.slug);
  if (!tag) notFound();

  return (
    <>
      <TopNavBar />
      <main className="pt-32 max-w-7xl mx-auto px-8 pb-24">
        <nav className="flex items-center space-x-2 text-sm font-label uppercase tracking-widest text-outline-variant mb-12">
          <Link href="/" className="hover:text-secondary transition-colors">
            Home
          </Link>
          <span className="material-symbols-outlined text-xs">
            chevron_right
          </span>
          <Link href="/blog" className="hover:text-secondary transition-colors">
            Blog
          </Link>
          <span className="material-symbols-outlined text-xs">
            chevron_right
          </span>
          <span className="text-on-surface">#{tag.name}</span>
        </nav>

        <PostListView
          eyebrow="Tag"
          title={`#${tag.name}`}
          description={tag.description}
          posts={tag.posts.nodes}
          sidebar={<BlogSidebar />}
          emptyMessage={`No posts tagged with "${tag.name}" yet.`}
        />
      </main>
    </>
  );
}
