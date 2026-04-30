import BlogSidebar from "@/components/BlogSidebar";
import PostListView from "@/components/PostListView";
import TopNavBar from "@/components/TopNavBar";
import { getAllCategories, getCategoryBySlug } from "@/lib/graphql";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 60;

export async function generateStaticParams() {
  const categories = await getAllCategories();
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const cat = await getCategoryBySlug(params.slug);
  if (!cat) return {};
  return {
    title: `${cat.name} | The Editorial Traveler`,
    description: cat.description ?? `Articles in ${cat.name}.`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const category = await getCategoryBySlug(params.slug);
  if (!category) notFound();

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
          <span className="text-on-surface">{category.name}</span>
        </nav>

        <PostListView
          eyebrow="Category"
          title={category.name}
          description={category.description}
          posts={category.posts.nodes}
          sidebar={<BlogSidebar />}
          emptyMessage={`No posts in "${category.name}" yet.`}
        />
      </main>
    </>
  );
}
