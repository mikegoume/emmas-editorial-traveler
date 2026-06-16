import { getAllDestinations, getRegionsWithDestinations } from "@/lib/db";
import { MetadataRoute } from "next";

const BASE_URL = "https://travelwithemma.gr";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [destinations, regions] = await Promise.all([
    getAllDestinations(),
    getRegionsWithDestinations(),
  ]);

  const destinationUrls: MetadataRoute.Sitemap = destinations.map((d) => ({
    url: `${BASE_URL}/destinations/${d.slug}`,
    lastModified: d.created_at ? new Date(d.created_at) : new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const regionUrls: MetadataRoute.Sitemap = regions.map((r) => ({
    url: `${BASE_URL}/destinations/${r.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/destinations`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/gallery`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    ...destinationUrls,
    ...regionUrls,
  ];
}
