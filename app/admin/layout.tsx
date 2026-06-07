"use client";

import { createClient } from "@/lib/supabase";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: "dashboard" },
  { label: "Destinations", href: "/admin/destinations", icon: "explore" },
  { label: "Regions", href: "/admin/regions", icon: "map" },
  { label: "Gallery", href: "/admin/gallery", icon: "photo_library" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [open, setOpen] = useState(false);

  // Close drawer on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const navLinkClass = (active: boolean) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
      active
        ? "bg-secondary-container text-on-secondary-container"
        : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
    }`;

  const SidebarContent = () => (
    <>
      <div className="px-6 py-6 border-b border-outline-variant/15 flex items-center justify-between">
        <Link href="/" className="block">
          <p className="font-headline font-extrabold text-sm tracking-tighter text-on-background">
            The Editorial Traveler
          </p>
          <p className="text-xs text-outline font-label mt-0.5">Admin</p>
        </Link>
        {/* Close button — mobile only */}
        <button
          onClick={() => setOpen(false)}
          className="md:hidden p-1 rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-colors"
          aria-label="Close menu"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={navLinkClass(isActive(item.href))}
          >
            <span className="material-symbols-outlined text-lg">
              {item.icon}
            </span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-outline-variant/15 space-y-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-on-surface-variant hover:bg-surface-container-low transition-colors"
        >
          <span className="material-symbols-outlined text-lg">open_in_new</span>
          View site
        </Link>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-on-surface-variant hover:bg-surface-container-low transition-colors"
        >
          <span className="material-symbols-outlined text-lg">logout</span>
          Sign out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-surface">
      {/* ── Mobile top bar ─────────────────────────────────────────── */}
      <header className="md:hidden fixed top-0 inset-x-0 z-40 h-14 bg-surface-container-lowest border-b border-outline-variant/15 flex items-center gap-3 px-4">
        <button
          onClick={() => setOpen(true)}
          className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-colors"
          aria-label="Open menu"
        >
          <span className="material-symbols-outlined text-xl">menu</span>
        </button>
        <p className="font-headline font-extrabold text-sm tracking-tighter text-on-background">
          The Editorial Traveler
          <span className="text-outline font-label font-normal ml-1.5 text-xs">
            Admin
          </span>
        </p>
      </header>

      {/* ── Backdrop (mobile) ──────────────────────────────────────── */}
      {open && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ── Sidebar ───────────────────────────────────────────────── */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-50 w-64
          bg-surface-container-lowest border-r border-outline-variant/15
          flex flex-col
          transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <SidebarContent />
      </aside>

      {/* ── Main content ──────────────────────────────────────────── */}
      <main className="md:ml-64 pt-14 md:pt-0 min-h-screen">
        <div className="p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
}
