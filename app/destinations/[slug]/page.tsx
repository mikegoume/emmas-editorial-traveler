import DestinationView from "@/components/DestinationView";
import RegionView from "@/components/RegionView";
import {
  getAllDestinations,
  getDestinationBySlug,
  getRegionBySlug,
  stripHtml,
} from "@/lib/graphql";
import { notFound } from "next/navigation";

export const revalidate = 60;

// Pre-build paths for both regions AND destinations
export async function generateStaticParams() {
  const destinations = await getAllDestinations();
  return destinations.map((d) => ({ slug: d.slug }));
  // Region slugs are still rendered on-demand (ISR) — no need to list them here
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const decodedSlug = decodeURIComponent(params.slug);

  // Try destination first
  const destination = await getDestinationBySlug(decodedSlug);
  if (destination) {
    return {
      title: `${destination.title} | The Editorial Traveler`,
      description:
        destination.destinationDetails?.excerpt ??
        stripHtml(destination.content).slice(0, 160),
    };
  }
  // Then try region
  const region = await getRegionBySlug(decodedSlug);
  if (region) {
    return {
      title: `${region.name} | The Editorial Traveler`,
      description:
        region.description ?? `Explore destinations in ${region.name}.`,
    };
  }
  return {};
}

export default async function DestinationOrRegionPage({
  params,
}: {
  params: { slug: string };
}) {
  // Decode the slug in case it contains non-ASCII characters (Greek, etc.)
  const decodedSlug = decodeURIComponent(params.slug);

  // Try destination first
  const destination = await getDestinationBySlug(decodedSlug);
  if (destination) {
    return <DestinationView destination={destination} />;
  }

  // Fall back to region
  const region = await getRegionBySlug(decodedSlug);
  if (region) {
    return <RegionView region={region} />;
  }

  notFound();
}
