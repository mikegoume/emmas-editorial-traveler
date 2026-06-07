import PostForm from "@/components/admin/PostForm";
import { createServerClient } from "@/lib/supabase-server";
import type { Post } from "@/lib/types";
import { notFound } from "next/navigation";

export default async function EditPostPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createServerClient();
  const [
    { data: postRaw },
    { data: categories },
    { data: tags },
  ] = await Promise.all([
    supabase
      .from("posts")
      .select(`*, post_categories(category_id, categories(*)), post_tags(tag_id, tags(*))`)
      .eq("id", params.id)
      .single(),
    supabase.from("categories").select("id, name, slug, description").order("name"),
    supabase.from("tags").select("id, name, slug, description").order("name"),
  ]);

  if (!postRaw) notFound();

  const post: Post = {
    ...postRaw,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    categories: (postRaw.post_categories ?? []).map((pc: any) => pc.categories),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tags: (postRaw.post_tags ?? []).map((pt: any) => pt.tags),
  };

  return (
    <div>
      <h1 className="font-headline text-3xl font-bold text-on-background mb-8">
        Edit: {post.title}
      </h1>
      <PostForm post={post} categories={categories ?? []} tags={tags ?? []} />
    </div>
  );
}
