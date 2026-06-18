"use client";

import { cn } from "@/lib/utils";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export type BentoImageItem = {
  id: number | string;
  title: string;
  desc: string;
  url: string;
  fullUrl?: string;
  span: string;
  category?: string;
};

const ImageModal = ({
  item,
  onClose,
}: {
  item: BentoImageItem;
  onClose: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm"
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.9, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.9, y: 20 }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      className="relative flex w-full max-w-4xl flex-col items-center p-4"
      onClick={(e) => e.stopPropagation()}
    >
      <img
        src={item.fullUrl ?? item.url}
        alt={item.title}
        className="max-h-[85vh] max-w-full mx-auto block rounded-2xl shadow-2xl"
      />
      <div className="mt-4 px-1 text-center">
        <h3 className="text-xl font-bold text-white">{item.title}</h3>
        <p className="mt-1 text-sm text-white/60">{item.desc}</p>
      </div>
    </motion.div>
    <button
      onClick={onClose}
      className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white/80 backdrop-blur-sm transition-colors hover:bg-white/20 hover:text-white"
      aria-label="Close"
    >
      <X size={20} />
    </button>
  </motion.div>
);

function CategoryTabs({
  categories,
  selected,
  onChange,
}: {
  categories: string[];
  selected: string | null;
  onChange: (cat: string | null) => void;
}) {
  if (categories.length === 0) return null;
  return (
    <div className="flex flex-wrap justify-center gap-2 mt-6 px-4">
      <button
        onClick={() => onChange(null)}
        className={cn(
          "px-4 py-1.5 rounded-full text-sm font-label font-semibold tracking-wide transition-colors",
          selected === null
            ? "bg-secondary text-on-secondary"
            : "border border-outline-variant/40 text-on-surface-variant hover:border-secondary/50 hover:text-on-surface",
        )}
      >
        Όλα
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={cn(
            "px-4 py-1.5 rounded-full text-sm font-label font-semibold tracking-wide transition-colors",
            selected === cat
              ? "bg-secondary text-on-secondary"
              : "border border-outline-variant/40 text-on-surface-variant hover:border-secondary/50 hover:text-on-surface",
          )}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

interface InteractiveImageBentoGalleryProps {
  imageItems: BentoImageItem[];
  categories?: string[];
  title: string;
  description: string;
}

export default function InteractiveImageBentoGallery({
  imageItems,
  categories = [],
  title,
  description,
}: InteractiveImageBentoGalleryProps) {
  const [selected, setSelected] = useState<BentoImageItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const displayItems = activeCategory
    ? imageItems.filter((i) => i.category === activeCategory)
    : imageItems;

  useEffect(() => {
    if (!selected) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selected]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const headerOpacity = useTransform(
    scrollYProgress,
    [0, 0.1, 0.9, 1],
    [0, 1, 1, 0],
  );
  const headerY = useTransform(scrollYProgress, [0, 0.15], [30, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen bg-background flex flex-col pt-20 sm:pt-28"
    >
      {/* Header */}
      <motion.div
        style={{ opacity: headerOpacity, y: headerY }}
        className="container mx-auto px-4 text-center mb-4 shrink-0"
      >
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground">
          {description}
        </p>
      </motion.div>

      {/* Category filters — always fully visible */}
      <CategoryTabs
        categories={categories}
        selected={activeCategory}
        onChange={setActiveCategory}
      />

      {/* 4-column grid */}
      <div className="container mx-auto px-4 pb-16 mt-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelected(item)}
              className="relative group aspect-square rounded-lg overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
            >
              <img
                src={item.fullUrl}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <p className="font-headline text-sm font-bold text-white leading-tight line-clamp-1">
                  {item.title}
                </p>
                <p className="text-xs text-white/70 mt-0.5 line-clamp-1">
                  {item.desc}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <ImageModal item={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
