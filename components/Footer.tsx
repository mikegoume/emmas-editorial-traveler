import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full rounded-t-[32px] bg-zinc-50 dark:bg-zinc-950">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-12 py-20 max-w-7xl mx-auto">
        <div className="md:col-span-2">
          <div className="text-lg font-bold text-zinc-900 dark:text-white font-headline mb-6">
            The Editorial Traveler
          </div>
          <p className="text-zinc-500 dark:text-zinc-500 font-body text-sm max-w-sm leading-relaxed mb-8">
            A digital journal celebrating the art of slow travel and high-end
            editorial photography. Join our community of mindful explorers.
          </p>
          <div className="flex gap-6">
            <a
              className="text-zinc-400 hover:text-emerald-600 transition-colors"
              href="#"
            >
              <span className="material-symbols-outlined">public</span>
            </a>
            <a
              className="text-zinc-400 hover:text-emerald-600 transition-colors"
              href="#"
            >
              <span className="material-symbols-outlined">camera</span>
            </a>
            <a
              className="text-zinc-400 hover:text-emerald-600 transition-colors"
              href="#"
            >
              <span className="material-symbols-outlined">share</span>
            </a>
          </div>
        </div>

        <div>
          <h5 className="font-headline font-bold text-on-background mb-6">
            Explore
          </h5>
          <ul className="space-y-4 font-body text-sm tracking-wide">
            <li>
              <Link
                href="/destinations"
                className="text-zinc-500 hover:text-emerald-600 transition-colors"
              >
                Destinations
              </Link>
            </li>
            <li>
              <a
                href="#"
                className="text-zinc-500 hover:text-emerald-600 transition-colors"
              >
                Newsletter
              </a>
            </li>
            <li>
              <Link
                href="/about#contact"
                className="text-zinc-500 hover:text-emerald-600 transition-colors"
              >
                Contact
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="text-zinc-500 hover:text-emerald-600 transition-colors"
              >
                About Me
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h5 className="font-headline font-bold text-on-background mb-6">
            Legal
          </h5>
          <ul className="space-y-4 font-body text-sm tracking-wide">
            <li>
              <a
                href="#"
                className="text-zinc-500 hover:text-emerald-600 transition-colors"
              >
                Privacy Policy
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-zinc-500 hover:text-emerald-600 transition-colors"
              >
                Terms of Service
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-12 pb-12">
        <div className="border-t border-outline-variant/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-zinc-500 font-body text-sm">
            © 2024 The Editorial Traveler. All rights reserved.
          </span>
          <span className="text-emerald-700 font-semibold font-body text-sm">
            Curated with Intention.
          </span>
        </div>
      </div>
    </footer>
  );
}
