import SimpleCrudPage from "@/components/admin/SimpleCrudPage";
import { createServerClient } from "@/lib/supabase-server";

export default async function AdminRegionsPage() {
  const supabase = await createServerClient();
  const { data: regions } = await supabase
    .from("regions")
    .select("id, name, slug, description")
    .order("name");

  return <SimpleCrudPage table="regions" items={regions ?? []} label="Regions" />;
}
