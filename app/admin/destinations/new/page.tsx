import DestinationForm from "@/components/admin/DestinationForm";
import { createServerClient } from "@/lib/supabase-server";

export default async function NewDestinationPage() {
  const supabase = await createServerClient();
  const { data: regions } = await supabase
    .from("regions")
    .select("id, name, slug, description")
    .order("name");

  return (
    <div>
      <h1 className="font-headline text-3xl font-bold text-on-background mb-8">
        New Destination
      </h1>
      <DestinationForm regions={regions ?? []} />
    </div>
  );
}
