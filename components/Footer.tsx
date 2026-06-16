import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full rounded-t-[32px] bg-zinc-50 dark:bg-zinc-950">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-12 py-20 max-w-7xl mx-auto">
        <div className="md:col-span-2">
          <div className="text-lg font-bold text-zinc-900 dark:text-white font-headline mb-6">
            Travel With Emma
          </div>
          <p className="text-zinc-500 dark:text-zinc-500 font-body text-sm max-w-sm leading-relaxed mb-8">
            Ένα ψηφιακό ημερολόγιο που γιορτάζει την τέχνη του αργού ταξιδιού
            και της editorial φωτογραφίας. Γίνετε μέλος της κοινότητάς μας.
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
            Εξερευνήστε
          </h5>
          <ul className="space-y-4 font-body text-sm tracking-wide">
            <li>
              <Link
                href="/destinations"
                className="text-zinc-500 hover:text-emerald-600 transition-colors"
              >
                Προορισμοί
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
                Επικοινωνία
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="text-zinc-500 hover:text-emerald-600 transition-colors"
              >
                Σχετικά
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h5 className="font-headline font-bold text-on-background mb-6">
            Νομικά
          </h5>
          <ul className="space-y-4 font-body text-sm tracking-wide">
            <li>
              <a
                href="#"
                className="text-zinc-500 hover:text-emerald-600 transition-colors"
              >
                Πολιτική Απορρήτου
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-zinc-500 hover:text-emerald-600 transition-colors"
              >
                Όροι Χρήσης
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-12 pb-12">
        <div className="border-t border-outline-variant/10 pt-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <div>
            <p className="text-zinc-400 font-body text-xs uppercase tracking-widest mb-1">Company</p>
            <span className="text-zinc-600 dark:text-zinc-400 font-body text-sm font-medium">Travel With Emma</span>
          </div>
          <div className="text-left md:text-center">
            <p className="text-zinc-500 font-body text-sm">© 2025 All Rights Reserved.</p>
            <p className="text-zinc-400 font-body text-xs mt-1">Design &amp; Development — Mike Goumenakis</p>
          </div>
          <div className="text-left md:text-right">
            <p className="text-zinc-400 font-body text-xs uppercase tracking-widest mb-1">Company Address</p>
            <span className="text-zinc-600 dark:text-zinc-400 font-body text-sm">Heraklion, Crete</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
