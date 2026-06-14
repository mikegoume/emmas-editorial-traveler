"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface CardItem {
  id: string | number;
  title: string;
  description: string;
  imgSrc: string;
  icon: React.ReactNode;
  linkHref: string;
}

interface ExpandingCardsProps extends React.HTMLAttributes<HTMLUListElement> {
  items: CardItem[];
  defaultActiveIndex?: number;
}

export const ExpandingCards = React.forwardRef<
  HTMLUListElement,
  ExpandingCardsProps
>(({ className, items, defaultActiveIndex = 0, ...props }, ref) => {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(
    defaultActiveIndex
  );
  const [isDesktop, setIsDesktop] = React.useState(false);

  React.useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const gridStyle = React.useMemo(() => {
    if (activeIndex === null) return {};

    if (isDesktop) {
      const columns = items
        .map((_, index) => (index === activeIndex ? "5fr" : "1fr"))
        .join(" ");
      return { gridTemplateColumns: columns };
    } else {
      const rows = items
        .map((_, index) => (index === activeIndex ? "5fr" : "1fr"))
        .join(" ");
      return { gridTemplateRows: rows };
    }
  }, [activeIndex, items.length, isDesktop]);

  return (
    <ul
      className={cn(
        "w-full gap-2 grid",
        "h-[600px] md:h-[520px]",
        "transition-[grid-template-columns,grid-template-rows] duration-500 ease-out",
        className
      )}
      style={{
        ...gridStyle,
        ...(isDesktop
          ? { gridTemplateRows: "1fr" }
          : { gridTemplateColumns: "1fr" }),
      }}
      ref={ref}
      {...props}
    >
      {items.map((item, index) => (
        <li
          key={item.id}
          className={cn(
            "group relative cursor-pointer overflow-hidden rounded-lg shadow-lg",
            "md:min-w-[80px] min-h-0 min-w-0"
          )}
          onMouseEnter={() => setActiveIndex(index)}
          onFocus={() => setActiveIndex(index)}
          onClick={() => setActiveIndex(index)}
          tabIndex={0}
          data-active={activeIndex === index}
        >
          <img
            src={item.imgSrc}
            alt={item.title}
            className="absolute inset-0 h-full w-full object-cover transition-all duration-500 ease-out group-data-[active=true]:scale-100 group-data-[active=true]:grayscale-0 scale-110 grayscale"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          <article className="absolute inset-0 flex flex-col justify-end gap-2 p-6">
            {/* Rotated title shown when card is collapsed (desktop only) */}
            <h3 className="hidden origin-left rotate-90 text-xs font-label font-bold uppercase tracking-widest text-white/70 transition-all duration-300 ease-out md:block group-data-[active=true]:opacity-0">
              {item.title}
            </h3>

            {/* Icon — visible when active */}
            <div className="text-white/90 opacity-0 transition-all duration-300 delay-75 ease-out group-data-[active=true]:opacity-100">
              {item.icon}
            </div>

            {/* Title — visible when active */}
            <h3 className="font-headline text-2xl font-bold text-white opacity-0 transition-all duration-300 delay-150 ease-out group-data-[active=true]:opacity-100 tracking-tight">
              {item.title}
            </h3>

            {/* Description — visible when active */}
            <p className="w-full max-w-xs font-body text-sm text-white/80 opacity-0 transition-all duration-300 delay-[225ms] ease-out group-data-[active=true]:opacity-100 line-clamp-3">
              {item.description}
            </p>

            {/* Link indicator */}
            <a
              href={item.linkHref}
              className="mt-1 inline-flex items-center gap-1 font-label text-xs font-bold uppercase tracking-widest text-secondary-fixed-dim opacity-0 transition-all duration-300 delay-300 ease-out group-data-[active=true]:opacity-100 hover:text-white"
              onClick={(e) => e.stopPropagation()}
            >
              Explore
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </a>
          </article>
        </li>
      ))}
    </ul>
  );
});
ExpandingCards.displayName = "ExpandingCards";
