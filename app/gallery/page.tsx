import TopNavBar from "@/components/TopNavBar";
import InteractiveImageBentoGallery from "@/components/ui/bento-gallery";
import { getAllDestinations, WPDestination } from "@/lib/graphql";
import { featuredDestinations } from "@/lib/mockData";

export const revalidate = 60;

function mockToDestination(
  mock: (typeof featuredDestinations)[number],
): WPDestination {
  return {
    id: mock.slug,
    title: mock.title,
    slug: mock.slug,
    content: "",
    featuredImage: {
      node: { sourceUrl: mock.image, altText: mock.imageAlt },
    },
    regions: {
      nodes: [{ name: mock.region, slug: mock.region.toLowerCase() }],
    },
    destinationDetails: {
      excerpt: null,
      visitDate: mock.date ?? null,
      featured: true,
      heroImage: null,
    },
  };
}

const bentoItems = [
  {
    id: 1,
    title: featuredDestinations[0].title,
    desc: "Cliffside villages perched above the cobalt Mediterranean.",
    url: featuredDestinations[0].image,
    span: "md:col-span-2 md:row-span-2",
  },
  {
    id: 2,
    title: featuredDestinations[1].title,
    desc: "Ancient temples holding centuries of silence.",
    url: featuredDestinations[1].image,
    span: "md:row-span-1",
  },
  {
    id: 3,
    title: featuredDestinations[2].title,
    desc: "The city of light before the world wakes.",
    url: featuredDestinations[2].image,
    span: "md:row-span-1",
  },
  {
    id: 4,
    title: "Into the Wild",
    desc: "Untouched landscapes beyond the last road.",
    url: "https://picsum.photos/seed/patagonia-wild/800/600",
    span: "md:row-span-2",
  },
  {
    id: 5,
    title: "Desert Light",
    desc: "Golden hour across endless dunes.",
    url: "https://picsum.photos/seed/sahara-dunes/800/500",
    span: "md:row-span-1",
  },
  {
    id: 6,
    title: "Northern Shores",
    desc: "Where the fjords carve deep into the mountain.",
    url: "https://picsum.photos/seed/norway-fjord/800/600",
    span: "md:col-span-2 md:row-span-1",
  },
];

export default async function GalleryPage() {
  let destinations: WPDestination[] = [];

  try {
    destinations = await getAllDestinations();
  } catch {
    // GraphQL unavailable — fall through to mock data
  }

  if (destinations.length === 0) {
    destinations = featuredDestinations.map(mockToDestination);
  }

  return (
    <>
      <TopNavBar />
      <div id="bento-gallery">
        <InteractiveImageBentoGallery
          imageItems={bentoItems}
          title="Curated Collection"
          description="Landmarks captured at the edge of the world. Drag to explore, click to open."
        />
      </div>
    </>
  );
}
