"use client";

import { cn } from "@/lib/utils";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export type BentoImageItem = {
  id: number | string;
  title: string;
  desc: string;
  url: string;       // thumbnail (optimised, smaller)
  fullUrl?: string;  // lightbox (full quality)
  span: string;
  category?: string;
};

// Predefined block: 840 × 560 px, tiles with zero gaps
const BLOCK_W = 840;
const BLOCK_H = 560;

const LAYOUT_SLOTS = [
  { x: 0, y: 0, w: 560, h: 320 },
  { x: 560, y: 0, w: 280, h: 320 },
  { x: 0, y: 320, w: 280, h: 240 },
  { x: 280, y: 320, w: 280, h: 240 },
  { x: 560, y: 320, w: 280, h: 240 },
] as const;

const CARD_GAP = 6;

const TILES_X = 9;
const TILES_Y = 9;

interface TileEntry {
  key: string;
  item: BentoImageItem;
  x: number;
  y: number;
  w: number;
  h: number;
}

function buildTiles(items: BentoImageItem[]): {
  tiles: TileEntry[];
  totalW: number;
  totalH: number;
} {
  const n = items.length;
  const totalW = TILES_X * BLOCK_W;
  const totalH = TILES_Y * BLOCK_H;
  const tiles: TileEntry[] = [];
  let idx = 0;

  for (let ty = 0; ty < TILES_Y; ty++) {
    for (let tx = 0; tx < TILES_X; tx++) {
      for (const slot of LAYOUT_SLOTS) {
        tiles.push({
          key: `${tx}-${ty}-${idx}`,
          item: items[idx % n],
          x: tx * BLOCK_W + slot.x,
          y: ty * BLOCK_H + slot.y,
          w: slot.w,
          h: slot.h,
        });
        idx++;
      }
    }
  }
  return { tiles, totalW, totalH };
}

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
      className="relative w-full max-w-4xl p-4"
      onClick={(e) => e.stopPropagation()}
    >
      <img
        src={item.fullUrl ?? item.url}
        alt={item.title}
        className="h-auto max-h-[85vh] w-full rounded-2xl object-contain shadow-2xl"
      />
      <div className="mt-4 px-1">
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

// Category filter pill bar — shared between desktop and mobile
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
  const [isPanning, setIsPanning] = useState(false);
  const [selected, setSelected] = useState<BentoImageItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const filteredItems =
    activeCategory
      ? imageItems.filter((i) => i.category === activeCategory)
      : imageItems;

  const displayItems = filteredItems.length > 0 ? filteredItems : imageItems;

  const { tiles, totalW, totalH } = buildTiles(displayItems);

  const initialX =
    -(totalW / 2) +
    (typeof window !== "undefined" ? window.innerWidth / 2 : 760);
  const initialY = -(totalH / 2) + (typeof window !== "undefined" ? 260 : 260);

  const rawX = useMotionValue(initialX);
  const rawY = useMotionValue(initialY);
  const x = useSpring(rawX, { stiffness: 200, damping: 40, mass: 1 });
  const y = useSpring(rawY, { stiffness: 200, damping: 40, mass: 1 });

  // Re-centre when category filter changes
  useEffect(() => {
    rawX.set(initialX);
    rawY.set(initialY);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory]);

  // Wheel pans the canvas (only when pointer is inside the canvas wrapper)
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (selected) return;
      e.preventDefault();
      rawX.set(rawX.get() - e.deltaX);
      rawY.set(rawY.get() - e.deltaY);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [rawX, rawY, selected]);

  useEffect(() => {
    if (!selected) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selected]);

  const lastPointer = useRef({ x: 0, y: 0 });
  const hasDragged = useRef(false);
  const pendingItem = useRef<BentoImageItem | null>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (selected) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    lastPointer.current = { x: e.clientX, y: e.clientY };
    hasDragged.current = false;
    setIsPanning(true);
  };
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPanning) return;
    const dx = e.clientX - lastPointer.current.x;
    const dy = e.clientY - lastPointer.current.y;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) hasDragged.current = true;
    lastPointer.current = { x: e.clientX, y: e.clientY };
    rawX.set(rawX.get() + dx);
    rawY.set(rawY.get() + dy);
  };
  const handlePointerUp = () => {
    setIsPanning(false);
    if (!hasDragged.current && pendingItem.current) {
      setSelected(pendingItem.current);
    }
    pendingItem.current = null;
  };

  // Scroll-based fade for the header
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

  // Mobile: group visible items by category
  const mobileGroups: { label: string; items: BentoImageItem[] }[] = [];
  if (activeCategory) {
    mobileGroups.push({ label: activeCategory, items: displayItems });
  } else if (categories.length > 0) {
    for (const cat of categories) {
      const catItems = imageItems.filter((i) => i.category === cat);
      if (catItems.length > 0) mobileGroups.push({ label: cat, items: catItems });
    }
    const uncategorised = imageItems.filter((i) => !i.category);
    if (uncategorised.length > 0)
      mobileGroups.push({ label: "Άλλα", items: uncategorised });
  } else {
    mobileGroups.push({ label: "", items: imageItems });
  }

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

        {/* Category tabs — visible on both desktop and mobile */}
        <CategoryTabs
          categories={categories}
          selected={activeCategory}
          onChange={setActiveCategory}
        />
      </motion.div>

      {/* ── DESKTOP: Infinite canvas ── */}
      <div
        ref={wrapperRef}
        className={cn(
          "relative w-full flex-1 overflow-hidden select-none hidden md:flex flex-col",
          isPanning ? "cursor-grabbing" : "cursor-grab",
        )}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <motion.div
          className="absolute top-0 left-0"
          style={{ x, y, width: totalW, height: totalH }}
        >
          {tiles.map(({ key, item, x: cx, y: cy, w, h }) => (
            <div
              key={key}
              className="absolute group overflow-hidden cursor-pointer"
              style={{
                left: cx + CARD_GAP / 2,
                top: cy + CARD_GAP / 2,
                width: w - CARD_GAP,
                height: h - CARD_GAP,
              }}
              onPointerDown={() => {
                pendingItem.current = item;
              }}
            >
              <img
                src={item.url}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                decoding="async"
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <p className="font-headline text-sm font-bold text-white leading-tight line-clamp-1">
                  {item.title}
                </p>
                <p className="text-xs text-white/70 mt-0.5 line-clamp-1">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Edge fade masks */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />
      </div>

      {/* ── MOBILE: Categorised static grid ── */}
      <div className="block md:hidden px-4 pb-16 mt-6 space-y-10">
        {mobileGroups.map((group) => (
          <div key={group.label}>
            {group.label && (
              <h3 className="font-headline font-bold text-on-surface text-lg mb-3 flex items-center gap-3">
                <span className="flex-1 h-px bg-outline-variant/30" />
                {group.label}
                <span className="flex-1 h-px bg-outline-variant/30" />
              </h3>
            )}
            <div className="grid grid-cols-2 gap-2">
              {group.items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelected(item)}
                  className="relative aspect-square rounded-lg overflow-hidden group focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
                >
                  <img
                    src={item.url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-2">
                    <p className="font-headline text-xs font-bold text-white line-clamp-1">
                      {item.title}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {selected && (
          <ImageModal item={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
