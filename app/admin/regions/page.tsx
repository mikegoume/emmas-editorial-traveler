import SimpleCrudPage from "@/components/admin/SimpleCrudPage";
import { createServerClient } from "@/lib/supabase-server";

export default async function AdminRegionsPage() {
  const supabase = await createServerClient();
  const { data: regions } = await supabase
    .from("regions")
    .select("id, name, slug, description, parent_id")
    .order("name");

  const items = regions ?? [];

  return (
    <SimpleCrudPage
      table="regions"
      items={items}
      label="Regions"
      parentItems={items.map((r) => ({ id: r.id, name: r.name }))}
    />
  );
}
