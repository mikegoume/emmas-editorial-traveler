import CategoryFilter from "@/components/CategoryFilter";
import Footer from "@/components/Footer";
import PostListView from "@/components/PostListView";
import TopNavBar from "@/components/TopNavBar";
import { getAllCategories, getCategoryBySlug } from "@/lib/graphql";
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
  const decodedSlug = decodeURIComponent(params.slug);
  const cat = await getCategoryBySlug(decodedSlug);
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
  const decodedSlug = decodeURIComponent(params.slug);
  const [category, allCategories] = await Promise.all([
    getCategoryBySlug(decodedSlug),
    getAllCategories(),
  ]);
  if (!category) notFound();

  return (
    <>
      <TopNavBar />
      <main className="pt-32 max-w-7xl mx-auto px-8 pb-24">
        <CategoryFilter categories={allCategories} />
        <PostListView
          eyebrow="Category"
          title={category.name}
          description={category.description}
          posts={category.posts.nodes}
          emptyMessage={`No posts in "${category.name}" yet.`}
        />
      </main>
      <Footer />
    </>
  );
}
