"use client";

import { getImageUrl } from "@/lib/db";
import type { Destination } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

// Predefined block layout — tiles seamlessly with zero gaps
// Block: 840 × 560 px
//
//  ┌──────────────────────┬──────────┐
//  │   Slot 0  (560×320)  │ Slot 1   │
//  │                      │ 280×320  │
//  ├──────────┬───────────┤          │
//  │  Slot 2  │  Slot 3   ├──────────┤
//  │ 280×240  │  280×240  │ Slot 4   │
//  │          │           │ 280×240  │
//  └──────────┴───────────┴──────────┘
const BLOCK_W = 840;
const BLOCK_H = 560;

const LAYOUT_SLOTS = [
  { x: 0,   y: 0,   w: 560, h: 320 },
  { x: 560, y: 0,   w: 280, h: 320 },
  { x: 0,   y: 320, w: 280, h: 240 },
  { x: 280, y: 320, w: 280, h: 240 },
  { x: 560, y: 320, w: 280, h: 240 },
] as const;

const CARD_GAP = 6; // visual gap between cards (inset, doesn't affect block tiling)

const TILES_X = 9;
const TILES_Y = 9;

interface TileEntry {
  key: string;
  dest: Destination;
  x: number;
  y: number;
  w: number;
  h: number;
}

function buildTiles(destinations: Destination[]): {
  tiles: TileEntry[];
  totalW: number;
  totalH: number;
} {
  const n = destinations.length;
  const totalW = TILES_X * BLOCK_W;
  const totalH = TILES_Y * BLOCK_H;
  const tiles: TileEntry[] = [];
  let idx = 0;

  for (let ty = 0; ty < TILES_Y; ty++) {
    for (let tx = 0; tx < TILES_X; tx++) {
      for (const slot of LAYOUT_SLOTS) {
        tiles.push({
          key: `${tx}-${ty}-${idx}`,
          dest: destinations[idx % n],
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

function getCarouselImages(dest: Destination): string[] {
  return [
    getImageUrl(dest),
    `https://picsum.photos/seed/${dest.slug}-a/1200/800`,
    `https://picsum.photos/seed/${dest.slug}-b/1200/800`,
    `https://picsum.photos/seed/${dest.slug}-c/1200/800`,
    `https://picsum.photos/seed/${dest.slug}-d/1200/800`,
  ];
}

interface DetailOverlayProps {
  dest: Destination;
  onClose: () => void;
}

function DetailOverlay({ dest, onClose }: DetailOverlayProps) {
  const region = dest.region;
  const excerpt = dest.excerpt ?? "";
  const images = getCarouselImages(dest);

  const [activeIdx, setActiveIdx] = useState(0);
  const [direction, setDirection] = useState(1);

  const go = (delta: number) => {
    setDirection(delta);
    setActiveIdx((prev) => (prev + delta + images.length) % images.length);
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      <button
        className="absolute top-5 right-5 z-10 rounded-full bg-white/10 p-2 text-white/70 backdrop-blur-sm transition-colors hover:bg-white/20 hover:text-white"
        onClick={onClose}
        aria-label="Close"
      >
        <span className="material-symbols-outlined text-xl">close</span>
      </button>

      <motion.div
        className="relative w-full max-w-2xl"
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 20, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Carousel */}
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-5 bg-black shadow-2xl">
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.img
              key={activeIdx}
              src={images[activeIdx]}
              alt={`${dest.title} — photo ${activeIdx + 1}`}
              className="absolute inset-0 w-full h-full object-cover"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
              draggable={false}
            />
          </AnimatePresence>

          <button
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
            onClick={(e) => { e.stopPropagation(); go(-1); }}
            aria-label="Previous image"
          >
            <span className="material-symbols-outlined text-xl">chevron_left</span>
          </button>
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
            onClick={(e) => { e.stopPropagation(); go(1); }}
            aria-label="Next image"
          >
            <span className="material-symbols-outlined text-xl">chevron_right</span>
          </button>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  setDirection(i > activeIdx ? 1 : -1);
                  setActiveIdx(i);
                }}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-200",
                  i === activeIdx ? "bg-white w-4" : "bg-white/40 w-1.5",
                )}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>

          <div className="absolute top-3 right-3 z-10 text-[10px] font-label tracking-widest bg-black/50 backdrop-blur-sm text-white/70 px-2 py-1 rounded-full">
            {activeIdx + 1} / {images.length}
          </div>
        </div>

        <div className="px-1">
          {region && (
            <p className="text-[11px] font-label uppercase tracking-widest text-white/40 mb-1.5">
              {region.name}
            </p>
          )}
          <h2 className="font-headline text-3xl font-bold text-white mb-3">
            {dest.title}
          </h2>
          {excerpt && (
            <p className="font-body text-sm text-white/60 leading-relaxed mb-5">
              {excerpt}
            </p>
          )}
          <Link
            href={`/destinations/${dest.slug}`}
            className="inline-flex items-center gap-2 bg-secondary text-on-secondary font-label font-bold px-6 py-3 rounded-full hover:bg-secondary-dim transition-colors"
          >
            Explore destination
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}

interface InfiniteGalleryProps {
  destinations: Destination[];
  belowSectionId?: string;
}

export function InfiniteGallery({ destinations, belowSectionId }: InfiniteGalleryProps) {
  const [isPanning, setIsPanning] = useState(false);
  const [selected, setSelected] = useState<Destination | null>(null);
  const [showHint, setShowHint] = useState(true);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { tiles, totalW, totalH } = buildTiles(destinations);

  const initialX =
    -(totalW / 2) + (typeof window !== "undefined" ? window.innerWidth / 2 : 760);
  const initialY =
    -(totalH / 2) + (typeof window !== "undefined" ? window.innerHeight / 2 : 400);

  const rawX = useMotionValue(initialX);
  const rawY = useMotionValue(initialY);
  const x = useSpring(rawX, { stiffness: 200, damping: 40, mass: 1 });
  const y = useSpring(rawY, { stiffness: 200, damping: 40, mass: 1 });

  useEffect(() => {
    const t = setTimeout(() => setShowHint(false), 3000);
    return () => clearTimeout(t);
  }, []);

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

  const lastPointer = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e: React.PointerEvent) => {
    if (selected) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    lastPointer.current = { x: e.clientX, y: e.clientY };
    setIsPanning(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPanning) return;
    const dx = e.clientX - lastPointer.current.x;
    const dy = e.clientY - lastPointer.current.y;
    lastPointer.current = { x: e.clientX, y: e.clientY };
    rawX.set(rawX.get() + dx);
    rawY.set(rawY.get() + dy);
  };

  const handlePointerUp = () => setIsPanning(false);

  return (
    <div
      ref={wrapperRef}
      className={cn(
        "w-screen h-screen overflow-hidden select-none relative",
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
        {tiles.map(({ key, dest, x: cx, y: cy, w, h }) => (
          <DestinationCard
            key={key}
            dest={dest}
            x={cx}
            y={cy}
            w={w}
            h={h}
            onClick={() => {
              setSelected(dest);
              setShowHint(false);
            }}
          />
        ))}
      </motion.div>

      <AnimatePresence>
        {showHint && (
          <motion.div
            className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/60 backdrop-blur-sm border border-white/10 text-white/70 text-xs font-label tracking-widest uppercase px-5 py-3 rounded-full pointer-events-none"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.4 }}
          >
            <span className="material-symbols-outlined text-sm">pan_tool</span>
            Drag or scroll to explore
          </motion.div>
        )}
      </AnimatePresence>

      {belowSectionId && (
        <button
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-0.5 text-white/40 hover:text-white/80 transition-colors"
          onClick={() =>
            document.getElementById(belowSectionId)?.scrollIntoView({ behavior: "smooth" })
          }
        >
          <span className="text-[9px] font-label tracking-[0.2em] uppercase">Collection</span>
          <span className="material-symbols-outlined text-lg animate-bounce">expand_more</span>
        </button>
      )}

      <AnimatePresence>
        {selected && (
          <DetailOverlay dest={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

interface DestinationCardProps {
  dest: Destination;
  x: number;
  y: number;
  w: number;
  h: number;
  onClick: () => void;
}

function DestinationCard({ dest, x, y, w, h, onClick }: DestinationCardProps) {
  const region = dest.region;

  return (
    <div
      className="absolute group overflow-hidden cursor-pointer"
      style={{ left: x + CARD_GAP / 2, top: y + CARD_GAP / 2, width: w - CARD_GAP, height: h - CARD_GAP }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <img
        src={getImageUrl(dest)}
        alt={dest.title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
        decoding="async"
        draggable={false}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
        {region && (
          <p className="text-[10px] font-label uppercase tracking-widest text-white/60 mb-1">
            {region.name}
          </p>
        )}
        <p className="font-headline text-sm font-bold text-white leading-tight line-clamp-2">
          {dest.title}
        </p>
      </div>
    </div>
  );
}

