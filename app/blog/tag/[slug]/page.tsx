import Footer from "@/components/Footer";
import PostListView from "@/components/PostListView";
import TopNavBar from "@/components/TopNavBar";
import { getTagBySlug } from "@/lib/graphql";
import { notFound } from "next/navigation";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const decodedSlug = decodeURIComponent(params.slug);
  const tag = await getTagBySlug(decodedSlug);
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
  const decodedSlug = decodeURIComponent(params.slug);
  const tag = await getTagBySlug(decodedSlug);
  if (!tag) notFound();

  return (
    <>
      <TopNavBar />
      <main className="pt-32 max-w-7xl mx-auto px-8 pb-24">
        <PostListView
          eyebrow="Tag"
          title={`#${tag.name}`}
          description={tag.description}
          posts={tag.posts.nodes}
          emptyMessage={`No posts tagged with "${tag.name}" yet.`}
        />
      </main>
      <Footer />
    </>
  );
}
