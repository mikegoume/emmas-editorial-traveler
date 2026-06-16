import DestinationView from "@/components/DestinationView";
import RegionView from "@/components/RegionView";
import {
  getAllDestinationSlugs,
  getAllRegionSlugs,
  getDestinationBySlug,
  getRegionBySlug,
  stripHtml,
} from "@/lib/db";
import { notFound } from "next/navigation";

export const revalidate = 3600;

export async function generateStaticParams() {
  const [destSlugs, regionSlugs] = await Promise.all([
    getAllDestinationSlugs(),
    getAllRegionSlugs(),
  ]);
  return [...destSlugs, ...regionSlugs].map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const decodedSlug = decodeURIComponent(params.slug);

  const destination = await getDestinationBySlug(decodedSlug);
  if (destination) {
    return {
      title: `${destination.title} | Travel With Emma`,
      description:
        destination.excerpt ?? stripHtml(destination.content).slice(0, 160),
    };
  }
  const region = await getRegionBySlug(decodedSlug);
  if (region) {
    return {
      title: `${region.name} | Travel With Emma`,
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
  const decodedSlug = decodeURIComponent(params.slug);

  const destination = await getDestinationBySlug(decodedSlug);
  if (destination) {
    return <DestinationView destination={destination} />;
  }

  const region = await getRegionBySlug(decodedSlug);
  if (region) {
    return <RegionView region={region} />;
  }

  notFound();
}
