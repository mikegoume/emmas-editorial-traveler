import { getRegionsWithDestinations } from "@/lib/graphql";
import Link from "next/link";
import NavLinks from "./NavLinks";

export default async function TopNavBar() {
  const regions = await getRegionsWithDestinations();

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-lg tonal-transition animate-slide-down">
      <div className="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto">
        <Link
          href="/"
          className="text-xl font-bold tracking-tighter text-zinc-900 dark:text-white font-headline"
        >
          The Editorial Traveler
        </Link>

        <NavLinks regions={regions} />

        <div className="flex items-center space-x-4">
          <button className="material-symbols-outlined text-emerald-900 dark:text-emerald-500 hover:opacity-80 transition-all duration-300">
            search
          </button>
          <button className="md:hidden material-symbols-outlined">menu</button>
        </div>
      </div>
    </nav>
  );
}
