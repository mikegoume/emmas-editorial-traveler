import PostForm from "@/components/admin/PostForm";
import { createServerClient } from "@/lib/supabase-server";

export default async function NewPostPage() {
  const supabase = await createServerClient();
  const [{ data: categories }, { data: tags }] = await Promise.all([
    supabase.from("categories").select("id, name, slug, description").order("name"),
    supabase.from("tags").select("id, name, slug, description").order("name"),
  ]);

  return (
    <div>
      <h1 className="font-headline text-3xl font-bold text-on-background mb-8">
        New Blog Post
      </h1>
      <PostForm categories={categories ?? []} tags={tags ?? []} />
    </div>
  );
}
