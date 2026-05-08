"use client";

import type { WPDestination } from "@/lib/graphql";
import dynamic from "next/dynamic";

const WorldMap = dynamic(() => import("./WorldMap"), {
  ssr: false,
  loading: () => (
    <div className="relative w-full aspect-[21/9] bg-surface-container-low rounded-lg flex items-center justify-center border border-outline-variant/10 animate-pulse">
      <div className="flex items-center gap-3 text-outline">
        <span className="material-symbols-outlined animate-spin">refresh</span>
        <span className="font-label text-sm uppercase tracking-widest">
          Loading map...
        </span>
      </div>
    </div>
  ),
});

export default function WorldMapWrapper({
  destinations,
}: {
  destinations: WPDestination[];
}) {
  return <WorldMap destinations={destinations} />;
}
