"use client";

import type { RegionWithDestinations } from "@/lib/graphql";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const baseLinks = [
  { label: "Home", href: "/" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/about#contact" },
];

export default function NavLinks({
  regions,
}: {
  regions: RegionWithDestinations[];
}) {
  const pathname = usePathname();
  const [destOpen, setDestOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href.split("#")[0]);
  };

  const linkClass = (active: boolean) =>
    active
      ? "text-emerald-800 dark:text-emerald-400 font-bold border-b-2 border-emerald-800 transition-all duration-300"
      : "text-zinc-600 dark:text-zinc-400 hover:text-emerald-700 hover:opacity-80 transition-all duration-300";

  return (
    <div className="hidden md:flex items-center space-x-8 font-headline font-medium tracking-tight">
      {/* Home */}
      <Link href="/" className={linkClass(isActive("/"))}>
        Home
      </Link>

      {/* Destinations with hover dropdown */}
      <div
        className="relative"
        onMouseEnter={() => setDestOpen(true)}
        onMouseLeave={() => setDestOpen(false)}
      >
        <Link
          href="/destinations"
          className={`${linkClass(isActive("/destinations"))} flex items-center gap-1`}
        >
          Destinations
          <span
            className={`material-symbols-outlined text-base transition-transform duration-300 ${
              destOpen ? "rotate-180" : ""
            }`}
          >
            expand_more
          </span>
        </Link>

        {/* Dropdown */}
        <div
          className={`absolute left-1/2 -translate-x-1/2 top-full pt-4 transition-all duration-200 ${
            destOpen
              ? "opacity-100 visible translate-y-0"
              : "opacity-0 invisible -translate-y-2"
          }`}
        >
          <div className="bg-surface-container-lowest dark:bg-zinc-900 rounded-lg shadow-2xl border border-outline-variant/15 overflow-hidden min-w-[640px]">
            {regions.length === 0 ? (
              <div className="p-8 text-center text-outline font-body italic text-sm">
                No regions yet. Assign regions to destinations in WordPress.
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-2 p-6">
                {regions.map((region) => (
                  <div key={region.id} className="p-3">
                    <h4 className="text-xs font-label font-bold uppercase tracking-widest text-secondary mb-3 pb-2 border-b border-outline-variant/15">
                      {region.name}
                    </h4>
                    <ul className="space-y-2">
                      {region.destinations.nodes.map((dest) => (
                        <li key={dest.id}>
                          <Link
                            href={`/destinations/${dest.slug}`}
                            className="font-body text-sm text-on-surface-variant hover:text-secondary transition-colors flex items-center gap-2 group"
                          >
                            <span className="w-1 h-1 rounded-full bg-outline-variant group-hover:bg-secondary transition-colors" />
                            {dest.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {/* Footer link */}
            <Link
              href="/destinations"
              className="flex items-center justify-between bg-surface-container-low px-6 py-4 text-sm font-headline font-bold text-secondary hover:bg-secondary-container transition-colors"
            >
              <span>View All Destinations</span>
              <span className="material-symbols-outlined text-base">
                arrow_forward
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Other base links */}
      {baseLinks.slice(1).map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={linkClass(isActive(link.href))}
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}
