import SimpleCrudPage from "@/components/admin/SimpleCrudPage";
import { createServerClient } from "@/lib/supabase-server";

export default async function AdminTagsPage() {
  const supabase = await createServerClient();
  const { data: tags } = await supabase
    .from("tags")
    .select("id, name, slug, description")
    .order("name");

  return <SimpleCrudPage table="tags" items={tags ?? []} label="Tags" />;
}
