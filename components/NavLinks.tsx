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
                      Travel With Emma
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

                  {/* Social follow section */}
                  <div className="px-4 pt-5 pb-4 border-t border-outline-variant/15">
                    <p className="text-[10px] font-label uppercase tracking-[0.25em] text-zinc-400 dark:text-zinc-500 mb-2 px-3">
                      Βρες με στα Social
                    </p>
                    <div className="space-y-1">
                      <a
                        href="https://www.instagram.com/travelwithemma.gr/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-3 py-3 rounded-xl font-headline font-medium text-lg text-zinc-700 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                        Instagram
                      </a>
                      <a
                        href="https://www.tiktok.com/@emma.mazaraki"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-3 py-3 rounded-xl font-headline font-medium text-lg text-zinc-700 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                        </svg>
                        TikTok
                      </a>
                      <a
                        href="https://www.facebook.com/emmaki.mazaraki"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-3 py-3 rounded-xl font-headline font-medium text-lg text-zinc-700 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                        Facebook
                      </a>
                    </div>
                  </div>

                  {/* Panel footer */}
                  <div className="px-6 py-4 border-t border-outline-variant/15">
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
