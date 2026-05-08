import CategoryFilter from "@/components/CategoryFilter";
import Footer from "@/components/Footer";
import PostListView from "@/components/PostListView";
import TopNavBar from "@/components/TopNavBar";
import { getAllCategories, getAllPosts } from "@/lib/graphql";

export const revalidate = 60;

export default async function BlogPage() {
  const [posts, categories] = await Promise.all([
    getAllPosts(),
    getAllCategories(),
  ]);
  const featuredPost =
    posts.find((p) => p.blogPostDetails?.featured) ?? posts[0] ?? null;
  const feedPosts = posts.filter((p) => p.id !== featuredPost?.id);

  return (
    <>
      <TopNavBar />
      <main className="pt-32 max-w-7xl mx-auto px-8 pb-24">
        <CategoryFilter categories={categories} />
        <PostListView
          eyebrow="The Journal"
          title="Latest Chronicles"
          description="In-depth stories, photography tips, and the quiet moments between the landmarks."
          posts={feedPosts}
          featuredPost={featuredPost}
          emptyMessage="No posts published yet. Add some in WordPress → Posts → Add New."
        />
      </main>
      <Footer />
    </>
  );
}
