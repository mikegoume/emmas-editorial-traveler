import { createServerClient } from "@/lib/supabase-server";

export default async function AdminDashboard() {
  const supabase = await createServerClient();

  const [
    { count: postCount },
    { count: destCount },
    { count: regionCount },
    { count: catCount },
  ] = await Promise.all([
    supabase.from("posts").select("*", { count: "exact", head: true }),
    supabase.from("destinations").select("*", { count: "exact", head: true }),
    supabase.from("regions").select("*", { count: "exact", head: true }),
    supabase.from("categories").select("*", { count: "exact", head: true }),
  ]);

  const stats = [
    { label: "Blog Posts", value: postCount ?? 0, href: "/admin/posts", icon: "article" },
    { label: "Destinations", value: destCount ?? 0, href: "/admin/destinations", icon: "explore" },
    { label: "Regions", value: regionCount ?? 0, href: "/admin/regions", icon: "map" },
    { label: "Categories", value: catCount ?? 0, href: "/admin/categories", icon: "label" },
  ];

  return (
    <div>
      <h1 className="font-headline text-3xl font-bold text-on-background mb-2">
        Dashboard
      </h1>
      <p className="text-on-surface-variant font-body mb-8">
        Overview of your content.
      </p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {stats.map((stat) => (
          <a
            key={stat.label}
            href={stat.href}
            className="bg-surface-container-lowest border border-outline-variant/15 rounded-lg p-6 hover:border-secondary/30 transition-colors"
          >
            <span className="material-symbols-outlined text-secondary text-2xl mb-3 block">
              {stat.icon}
            </span>
            <div className="text-3xl font-headline font-bold text-on-background mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-outline font-label">{stat.label}</div>
          </a>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <a
          href="/admin/destinations/new"
          className="flex items-center gap-4 bg-secondary text-on-secondary rounded-lg p-6 hover:bg-secondary-dim transition-colors"
        >
          <span className="material-symbols-outlined text-3xl">add_location</span>
          <div>
            <div className="font-headline font-bold">New Destination</div>
            <div className="text-on-secondary/70 text-sm font-body">
              Add a new travel destination
            </div>
          </div>
        </a>
        <a
          href="/admin/posts/new"
          className="flex items-center gap-4 bg-surface-container-lowest border border-outline-variant/15 rounded-lg p-6 hover:border-secondary/30 transition-colors"
        >
          <span className="material-symbols-outlined text-secondary text-3xl">
            edit_note
          </span>
          <div>
            <div className="font-headline font-bold text-on-background">
              New Blog Post
            </div>
            <div className="text-outline text-sm font-body">
              Write a new editorial story
            </div>
          </div>
        </a>
      </div>
    </div>
  );
}
