import { getRegionsWithDestinations } from "@/lib/db";
import Link from "next/link";
import NavLinks from "./NavLinks";

export default async function TopNavBar() {
  const regions = await getRegionsWithDestinations();

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-lg tonal-transition animate-slide-down">
      <div className="flex justify-between items-center px-6 md:px-8 py-4 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <span className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white font-headline">
            Travel With Emma
          </span>
        </Link>
        <NavLinks regions={regions} />
      </div>
    </nav>
  );
}
