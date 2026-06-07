import SimpleCrudPage from "@/components/admin/SimpleCrudPage";
import { createServerClient } from "@/lib/supabase-server";

export default async function AdminCategoriesPage() {
  const supabase = await createServerClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug, description")
    .order("name");

  return (
    <SimpleCrudPage
      table="categories"
      items={categories ?? []}
      label="Categories"
    />
  );
}
