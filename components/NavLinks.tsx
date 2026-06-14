"use client";

import type { RegionWithDestinations } from "@/lib/db";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

// ─── animation variants ───────────────────────────────────────────────────────

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.2, delay: 0.1 } },
};

const panelVariants = {
  hidden: { x: "100%" },
  visible: {
    x: 0,
    transition: { type: "spring" as const, damping: 28, stiffness: 260 },
  },
  exit: {
    x: "100%",
    transition: { type: "spring" as const, damping: 30, stiffness: 300 },
  },
};

const listVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: 24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring" as const, damping: 22, stiffness: 240 },
  },
};

// ─── component ────────────────────────────────────────────────────────────────

export default function NavLinks({
  regions,
}: {
  regions: RegionWithDestinations[];
}) {
  const pathname = usePathname();
  const [destOpen, setDestOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileDestOpen, setMobileDestOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMobileDestOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href.split("#")[0]);
  };

  const linkClass = (active: boolean) =>
    active
      ? "text-emerald-800 dark:text-emerald-400 font-bold border-b-2 border-emerald-800 transition-all duration-300"
      : "text-zinc-600 dark:text-zinc-400 hover:text-emerald-700 hover:opacity-80 transition-all duration-300";

  return (
    <div className="flex items-center gap-4">
      {/* ── Desktop nav ──────────────────────────────────────────────────────── */}
      <div className="hidden md:flex items-center space-x-8 font-headline font-medium tracking-tight">
        <Link href="/" className={linkClass(isActive("/"))}>
          Αρχική
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
            Προορισμοί
            <span
              className={`material-symbols-outlined text-base transition-transform duration-300 ${
                destOpen ? "rotate-180" : ""
              }`}
            >
              expand_more
            </span>
          </Link>

          <div
            className={`absolute right-0 top-full pt-4 transition-all duration-200 ${
              destOpen
                ? "opacity-100 visible translate-y-0"
                : "opacity-0 invisible -translate-y-2"
            }`}
          >
            <div className="bg-surface-container-lowest dark:bg-zinc-900 rounded-lg shadow-2xl border border-outline-variant/15 overflow-hidden min-w-[640px]">
              {regions.length === 0 ? (
                <div className="p-8 text-center text-outline font-body italic text-sm">
                  Δεν υπάρχουν προορισμοί ακόμα.
                </div>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-2 p-6">
                  {regions.map((region) => (
                    <div key={region.id} className="p-3">
                      <h4 className="text-xs font-label font-bold uppercase tracking-widest text-secondary mb-3 pb-2 border-b border-outline-variant/15">
                        {region.name}
                      </h4>
                      {region.destinations.length > 0 && (
                        <ul className="space-y-2 mb-3">
                          {region.destinations.map((dest) => (
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
                      )}
                      {region.children.map((child) => (
                        <div key={child.id} className="mb-3">
                          <p className="text-[10px] font-label font-bold uppercase tracking-wider text-outline mb-1.5">
                            {child.name}
                          </p>
                          <ul className="space-y-2">
                            {child.destinations.map((dest) => (
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
                  ))}
                </div>
              )}
              <Link
                href="/destinations"
                className="flex items-center justify-between bg-surface-container-low px-6 py-4 text-sm font-headline font-bold text-secondary hover:bg-secondary-container transition-colors"
              >
                <span>Όλοι οι Προορισμοί</span>
                <span className="material-symbols-outlined text-base">
                  arrow_forward
                </span>
              </Link>
            </div>
          </div>
        </div>

        <Link href="/about" className={linkClass(isActive("/about"))}>
          Σχετικά
        </Link>
        <Link href="/gallery" className={linkClass(isActive("/gallery"))}>
          Γκαλερί
        </Link>
      </div>

      {/* ── Hamburger button (mobile only) ───────────────────────────────────── */}
      <button
        className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-[5px]"
        aria-label={mobileOpen ? "Κλείσιμο μενού" : "Άνοιγμα μενού"}
        onClick={() => setMobileOpen((o) => !o)}
      >
        <motion.span
          animate={mobileOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="block w-5 h-[1.5px] bg-zinc-900 dark:bg-white origin-center"
        />
        <motion.span
          animate={
            mobileOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }
          }
          transition={{ duration: 0.15 }}
          className="block w-5 h-[1.5px] bg-zinc-900 dark:bg-white"
        />
        <motion.span
          animate={mobileOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="block w-5 h-[1.5px] bg-zinc-900 dark:bg-white origin-center"
        />
      </button>

      {/* ── Mobile menu overlay ──────────────────────────────────────────────── */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {mobileOpen && (
              <>
                {/* Backdrop */}
                <motion.div
                  key="backdrop"
                  variants={overlayVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[90]"
                  onClick={() => setMobileOpen(false)}
                />

                {/* Slide-in panel */}
                <motion.div
                  key="panel"
                  variants={panelVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="fixed top-0 right-0 h-full w-4/5 max-w-sm bg-white dark:bg-zinc-900 z-[100] flex flex-col shadow-2xl"
                >
                  {/* Panel header */}
                  <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/15">
                    <span className="font-headline font-bold text-base tracking-tight text-zinc-900 dark:text-white">
                      The Editorial Traveler
                    </span>
                    <button
                      onClick={() => setMobileOpen(false)}
                      className="material-symbols-outlined text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
                      aria-label="Κλείσιμο μενού"
                    >
                      close
                    </button>
                  </div>

                  {/* Nav links */}
                  <motion.nav
                    variants={listVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex-1 overflow-y-auto px-4 py-6 space-y-1"
                  >
                    {/* Home */}
                    <motion.div variants={itemVariants}>
                      <Link
                        href="/"
                        className={`flex items-center gap-3 px-3 py-3 rounded-xl font-headline font-medium text-lg transition-colors ${
                          isActive("/")
                            ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400"
                            : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                        }`}
                      >
                        <span className="material-symbols-outlined text-[22px]">
                          home
                        </span>
                        Αρχική
                      </Link>
                    </motion.div>

                    {/* Destinations accordion */}
                    <motion.div variants={itemVariants}>
                      <button
                        onClick={() => setMobileDestOpen((o) => !o)}
                        className={`w-full flex items-center justify-between gap-3 px-3 py-3 rounded-xl font-headline font-medium text-lg transition-colors ${
                          isActive("/destinations")
                            ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400"
                            : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-[22px]">
                            explore
                          </span>
                          Προορισμοί
                        </span>
                        <motion.span
                          animate={{ rotate: mobileDestOpen ? 180 : 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 25,
                          }}
                          className="material-symbols-outlined text-base text-zinc-400"
                        >
                          expand_more
                        </motion.span>
                      </button>

                      <AnimatePresence initial={false}>
                        {mobileDestOpen && (
                          <motion.div
                            key="dest-accordion"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{
                              height: "auto",
                              opacity: 1,
                              transition: {
                                duration: 0.25,
                                ease: [0.25, 0.1, 0.25, 1],
                              },
                            }}
                            exit={{
                              height: 0,
                              opacity: 0,
                              transition: { duration: 0.2 },
                            }}
                            className="overflow-hidden"
                          >
                            <div className="ml-4 mt-1 mb-2 pl-4 border-l-2 border-emerald-200 dark:border-emerald-800 space-y-4 py-2">
                              {regions.length === 0 ? (
                                <p className="text-sm text-zinc-400 italic px-2">
                                  Δεν υπάρχουν προορισμοί ακόμα.
                                </p>
                              ) : (
                                regions.map((region) => (
                                  <div key={region.id}>
                                    <p className="text-[10px] font-label font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-500 mb-2 px-2">
                                      {region.name}
                                    </p>
                                    <ul className="space-y-1">
                                      {region.destinations.map((dest) => (
                                        <li key={dest.id}>
                                          <Link
                                            href={`/destinations/${dest.slug}`}
                                            className="block px-2 py-1.5 text-sm font-body text-zinc-600 dark:text-zinc-400 hover:text-emerald-700 dark:hover:text-emerald-400 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                                          >
                                            {dest.title}
                                          </Link>
                                        </li>
                                      ))}
                                      {region.children.map((child) => (
                                        <li key={child.id}>
                                          <p className="text-[10px] font-label uppercase tracking-wider text-zinc-400 mb-1 px-2 mt-2">
                                            {child.name}
                                          </p>
                                          {child.destinations.map((dest) => (
                                            <Link
                                              key={dest.id}
                                              href={`/destinations/${dest.slug}`}
                                              className="block px-2 py-1.5 text-sm font-body text-zinc-600 dark:text-zinc-400 hover:text-emerald-700 dark:hover:text-emerald-400 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                                            >
                                              {dest.title}
                                            </Link>
                                          ))}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ))
                              )}
                              <Link
                                href="/destinations"
                                className="flex items-center gap-2 px-2 py-2 text-sm font-headline font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
                              >
                                Όλοι οι Προορισμοί
                                <span className="material-symbols-outlined text-base">
                                  arrow_forward
                                </span>
                              </Link>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>

                    {/* About */}
                    <motion.div variants={itemVariants}>
                      <Link
                        href="/about"
                        className={`flex items-center gap-3 px-3 py-3 rounded-xl font-headline font-medium text-lg transition-colors ${
                          isActive("/about")
                            ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400"
                            : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                        }`}
                      >
                        <span className="material-symbols-outlined text-[22px]">
                          person
                        </span>
                        Σχετικά
                      </Link>
                    </motion.div>

                    {/* Gallery */}
                    <motion.div variants={itemVariants}>
                      <Link
                        href="/gallery"
                        className={`flex items-center gap-3 px-3 py-3 rounded-xl font-headline font-medium text-lg transition-colors ${
                          isActive("/gallery")
                            ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400"
                            : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                        }`}
                      >
                        <span className="material-symbols-outlined text-[22px]">
                          photo_library
                        </span>
                        Γκαλερί
                      </Link>
                    </motion.div>
                  </motion.nav>

                  {/* Panel footer */}
                  <div className="px-6 py-5 border-t border-outline-variant/15">
                    <p className="text-xs font-body text-zinc-400 dark:text-zinc-500 tracking-wide">
                      Ταξιδιωτικές ιστορίες & editorial οδηγοί
                    </p>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </div>
  );
}
