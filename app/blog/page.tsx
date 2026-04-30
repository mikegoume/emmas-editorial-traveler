import BlogSidebar from "@/components/BlogSidebar";
import PostListView from "@/components/PostListView";
import TopNavBar from "@/components/TopNavBar";
import { getAllPosts } from "@/lib/graphql";
import Link from "next/link";

export const revalidate = 60;

export default async function BlogPage() {
  const posts = await getAllPosts();
  const featuredPost =
    posts.find((p) => p.blogPostDetails?.featured) ?? posts[0] ?? null;
  const feedPosts = posts.filter((p) => p.id !== featuredPost?.id);

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
          <span className="text-on-surface">Blog</span>
        </nav>

        <PostListView
          eyebrow="The Journal"
          title="Latest Chronicles"
          description="In-depth stories, photography tips, and the quiet moments between the landmarks."
          posts={feedPosts}
          featuredPost={featuredPost}
          sidebar={<BlogSidebar />}
          emptyMessage="No posts published yet. Add some in WordPress → Posts → Add New."
        />
      </main>
    </>
  );
}
