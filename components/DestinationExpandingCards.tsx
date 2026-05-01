"use client";

import { ExpandingCards, type CardItem } from "@/components/ui/expanding-cards";
import {
  MapPin,
  Globe,
  Camera,
  Mountain,
  Compass,
  Landmark,
  Waves,
  TreePine,
  Sun,
  Building,
} from "lucide-react";

const ICONS = [
  MapPin,
  Globe,
  Camera,
  Mountain,
  Compass,
  Landmark,
  Waves,
  TreePine,
  Sun,
  Building,
];

interface DestData {
  id: string;
  title: string;
  excerpt: string | null;
  imgSrc: string;
  slug: string;
}

export function DestinationExpandingCards({
  destinations,
}: {
  destinations: DestData[];
}) {
  const items: CardItem[] = destinations.map((dest, i) => {
    const Icon = ICONS[i % ICONS.length];
    return {
      id: dest.id,
      title: dest.title,
      description: dest.excerpt ?? "A destination waiting to be explored.",
      imgSrc: dest.imgSrc,
      icon: <Icon size={22} />,
      linkHref: `/destinations/${dest.slug}`,
    };
  });

  return <ExpandingCards items={items} defaultActiveIndex={0} />;
}
