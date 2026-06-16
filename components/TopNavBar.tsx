import { getRegionsWithDestinations } from "@/lib/db";
import Link from "next/link";
import NavLinks from "./NavLinks";

export default async function TopNavBar() {
  const regions = await getRegionsWithDestinations();

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-lg tonal-transition animate-slide-down">
      <div className="flex justify-between items-center px-6 md:px-8 py-4 max-w-7xl mx-auto">
        <Link
          href="/"
          className="text-xl font-bold tracking-tighter text-zinc-900 dark:text-white font-headline shrink-0"
        >
          Travel With Emma
        </Link>

        <NavLinks regions={regions} />
      </div>
    </nav>
  );
}
