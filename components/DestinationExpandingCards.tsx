"use client";

import { ExpandingCards, type CardItem } from "@/components/ui/expanding-cards";
import { MapPin, Landmark, Building, Compass, Sun } from "lucide-react";

const STATIC_DESTINATIONS: CardItem[] = [
  {
    id: "paris",
    title: "Paris",
    description:
      "The City of Light — where art, cuisine, and timeless elegance converge along the Seine.",
    imgSrc:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=75",
    icon: <Landmark size={22} />,
    linkHref: "/destinations/paris",
  },
  {
    id: "london",
    title: "London",
    description:
      "A city of contrasts where ancient history meets cutting-edge culture across every borough.",
    imgSrc:
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=75",
    icon: <Building size={22} />,
    linkHref: "/destinations/london",
  },
  {
    id: "rome",
    title: "Rome",
    description:
      "The Eternal City, where every cobblestone holds a story and every corner reveals a masterpiece.",
    imgSrc:
      "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=75",
    icon: <MapPin size={22} />,
    linkHref: "/destinations/rome",
  },
  {
    id: "istanbul",
    title: "Istanbul",
    description:
      "Where East meets West — a city of minarets, bazaars, and the shimmering Bosphorus strait.",
    imgSrc:
      "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=75",
    icon: <Compass size={22} />,
    linkHref: "/destinations/istanbul",
  },
  {
    id: "egypt",
    title: "Egypt",
    description:
      "Ancient wonders rising from the desert — the pyramids, the Nile, and millennia of civilization.",
    imgSrc:
      "https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=800&q=75",
    icon: <Sun size={22} />,
    linkHref: "/destinations/egypt",
  },
];

export function DestinationExpandingCards() {
  return <ExpandingCards items={STATIC_DESTINATIONS} defaultActiveIndex={0} />;
}
