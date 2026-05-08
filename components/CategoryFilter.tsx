"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Category = {
  id: string;
  name: string;
  slug: string;
  count: number | null;
};

export default function CategoryFilter({
  categories,
}: {
  categories: Category[];
}) {
  const pathname = usePathname();

  const isAllActive = pathname === "/blog";
  const activeSlug = pathname.startsWith("/blog/category/")
    ? pathname.split("/blog/category/")[1]
    : null;

  return (
    <div className="flex gap-3 overflow-x-auto pb-2 mb-8 scrollbar-hide">
      <Link
        href="/blog"
        className={`inline-block shrink-0 px-5 py-2 rounded-full text-sm font-bold transition-colors border ${
          isAllActive
            ? "bg-secondary-container text-on-secondary-container border-secondary-container"
            : "bg-transparent text-on-surface-variant border-outline-variant hover:bg-secondary-container/40 hover:border-secondary-container"
        }`}
      >
        All
      </Link>
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`/blog/category/${cat.slug}`}
          className={`inline-block shrink-0 px-5 py-2 rounded-full text-sm font-bold transition-colors border ${
            activeSlug === cat.slug
              ? "bg-secondary-container text-on-secondary-container border-secondary-container"
              : "bg-transparent text-on-surface-variant border-outline-variant hover:bg-secondary-container/40 hover:border-secondary-container"
          }`}
        >
          {cat.name}
        </Link>
      ))}
    </div>
  );
}
