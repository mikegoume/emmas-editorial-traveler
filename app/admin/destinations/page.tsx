import { createServerClient } from "@/lib/supabase-server";
import type { Destination } from "@/lib/types";
import Link from "next/link";

export default async function AdminDestinationsPage() {
  const supabase = await createServerClient();
  const { data: destinations } = await supabase
    .from("destinations")
    .select(`*, region:regions(name)`)
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-headline text-3xl font-bold text-on-background">
            Destinations
          </h1>
          <p className="text-outline font-body text-sm mt-1">
            {destinations?.length ?? 0} total
          </p>
        </div>
        <Link
          href="/admin/destinations/new"
          className="flex items-center gap-2 bg-secondary text-on-secondary px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-secondary-dim transition-colors"
        >
          <span className="material-symbols-outlined text-base">add</span>
          New destination
        </Link>
      </div>

      {destinations?.length === 0 ? (
        <div className="text-center py-24 bg-surface-container-low rounded-lg">
          <span className="material-symbols-outlined text-outline text-5xl mb-4 block">
            explore
          </span>
          <p className="text-outline font-body italic">
            No destinations yet. Add your first one.
          </p>
        </div>
      ) : (
        <div className="bg-surface-container-lowest border border-outline-variant/15 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[480px]">
            <thead className="bg-surface-container-low border-b border-outline-variant/15">
              <tr>
                <th className="text-left px-4 py-3 font-label text-xs uppercase tracking-widest text-outline">
                  Title
                </th>
                <th className="text-left px-4 py-3 font-label text-xs uppercase tracking-widest text-outline hidden md:table-cell">
                  Region
                </th>
                <th className="text-left px-4 py-3 font-label text-xs uppercase tracking-widest text-outline hidden md:table-cell">
                  Visit date
                </th>
                <th className="text-left px-4 py-3 font-label text-xs uppercase tracking-widest text-outline">
                  Featured
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {destinations?.map((dest: Destination & { region: { name: string } | null }) => (
                <tr key={dest.id} className="hover:bg-surface-container-low/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {(dest.hero_image_url || dest.featured_image_url) && (
                        <img
                          src={dest.hero_image_url ?? dest.featured_image_url!}
                          alt=""
                          className="w-10 h-10 rounded object-cover shrink-0"
                        />
                      )}
                      <div>
                        <p className="font-medium text-on-surface">
                          {dest.title}
                        </p>
                        <p className="text-xs text-outline">{dest.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-on-surface-variant hidden md:table-cell">
                    {dest.region?.name ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-on-surface-variant hidden md:table-cell">
                    {dest.visit_date ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    {dest.featured ? (
                      <span className="inline-block px-2 py-0.5 bg-secondary-container text-on-secondary-container rounded-full text-[10px] font-bold">
                        Yes
                      </span>
                    ) : (
                      <span className="text-outline-variant text-xs">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/destinations/${dest.id}/edit`}
                      className="text-secondary text-xs font-bold hover:underline"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}
    </div>
  );
}
