import DestinationForm from "@/components/admin/DestinationForm";
import { createServerClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";

export default async function EditDestinationPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createServerClient();
  const [{ data: destination }, { data: regions }] = await Promise.all([
    supabase
      .from("destinations")
      .select("*")
      .eq("id", params.id)
      .single(),
    supabase.from("regions").select("id, name, slug, description, parent_id").order("name"),
  ]);

  if (!destination) notFound();

  return (
    <div>
      <h1 className="font-headline text-3xl font-bold text-on-background mb-8">
        Edit: {destination.title}
      </h1>
      <DestinationForm destination={destination} regions={regions ?? []} />
    </div>
  );
}
