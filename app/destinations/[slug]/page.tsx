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

const BASE_URL = "https://travelwithemma.gr";

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
    const description =
      destination.excerpt ?? stripHtml(destination.content).slice(0, 160);
    const image =
      destination.hero_image_url ?? destination.featured_image_url ?? null;
    return {
      title: destination.title,
      description,
      openGraph: {
        type: "article",
        locale: "el_GR",
        title: `${destination.title} | Travel With Emma`,
        description,
        url: `${BASE_URL}/destinations/${destination.slug}`,
        ...(image && {
          images: [{ url: image, width: 1200, height: 630, alt: destination.featured_image_alt ?? destination.title }],
        }),
      },
      twitter: {
        card: "summary_large_image",
        title: `${destination.title} | Travel With Emma`,
        description,
        ...(image && { images: [image] }),
      },
      alternates: { canonical: `/destinations/${destination.slug}` },
    };
  }

  const region = await getRegionBySlug(decodedSlug);
  if (region) {
    const description =
      region.description ?? `Εξερεύνησε προορισμούς στην περιοχή ${region.name}.`;
    return {
      title: region.name,
      description,
      openGraph: {
        type: "website",
        locale: "el_GR",
        title: `${region.name} | Travel With Emma`,
        description,
        url: `${BASE_URL}/destinations/${region.slug}`,
        images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: region.name }],
      },
      alternates: { canonical: `/destinations/${region.slug}` },
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
    const image =
      destination.hero_image_url ?? destination.featured_image_url ?? null;
    const description =
      destination.excerpt ?? stripHtml(destination.content).slice(0, 160);

    const articleJsonLd = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: destination.title,
      description,
      ...(image && { image }),
      ...(destination.visit_date && { datePublished: destination.visit_date }),
      dateModified: destination.created_at,
      author: {
        "@type": "Person",
        name: "Emma Mazaraki",
        url: `${BASE_URL}/about`,
      },
      publisher: {
        "@type": "Organization",
        name: "Travel With Emma",
        url: BASE_URL,
      },
      mainEntityOfPage: `${BASE_URL}/destinations/${destination.slug}`,
    };

    const breadcrumbJsonLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Αρχική", item: BASE_URL },
        { "@type": "ListItem", position: 2, name: "Προορισμοί", item: `${BASE_URL}/destinations` },
        { "@type": "ListItem", position: 3, name: destination.title, item: `${BASE_URL}/destinations/${destination.slug}` },
      ],
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
        <DestinationView destination={destination} />
      </>
    );
  }

  const region = await getRegionBySlug(decodedSlug);
  if (region) {
    const breadcrumbJsonLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Αρχική", item: BASE_URL },
        { "@type": "ListItem", position: 2, name: "Προορισμοί", item: `${BASE_URL}/destinations` },
        { "@type": "ListItem", position: 3, name: region.name, item: `${BASE_URL}/destinations/${region.slug}` },
      ],
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
        <RegionView region={region} />
      </>
    );
  }

  notFound();
}
