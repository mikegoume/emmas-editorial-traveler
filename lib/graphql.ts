const GRAPHQL_URL = process.env.NEXT_PUBLIC_WP_GRAPHQL_URL!;

async function fetchGraphQL<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const res = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`GraphQL request failed: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();

  if (json.errors?.length) {
    console.error("GraphQL errors:", json.errors);
    throw new Error(json.errors[0].message);
  }

  return json.data as T;
}

// ─── Types ─────────────────────────────────────────────────────────────────

export type WPImage = {
  sourceUrl: string;
  altText: string;
};

// ACF Image fields return an edge object — NOT a plain string.
// The URL lives at heroImage.node.sourceUrl
type AcfImage = { node: WPImage } | null;

export type WPPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  date: string;
  featuredImage: { node: WPImage } | null;
  categories: { nodes: { name: string; slug: string }[] };
  blogPostDetails: {
    readTime: string | null;
    featured: boolean | null;
    heroImage: AcfImage;
  } | null;
};

export type WPDestination = {
  id: string;
  title: string;
  slug: string;
  content: string;
  featuredImage: { node: WPImage } | null;
  regions: { nodes: { name: string; slug: string }[] };
  destinationDetails: {
    excerpt: string | null;
    visitDate: string | null;
    featured: boolean | null;
    heroImage: AcfImage;
  } | null;
};

// ─── Blog Posts ────────────────────────────────────────────────────────────

const POST_FIELDS = `
  id
  title
  slug
  excerpt(format: RAW)
  content
  date
  featuredImage {
    node { sourceUrl altText }
  }
  categories {
    nodes { name slug }
  }
  blogPostDetails {
    readTime
    featured
    heroImage {
      node { sourceUrl altText }
    }
  }
`;

export async function getAllPosts(): Promise<WPPost[]> {
  const data = await fetchGraphQL<{ posts: { nodes: WPPost[] } }>(`
    query GetAllPosts {
      posts(first: 20, where: { status: PUBLISH }) {
        nodes { ${POST_FIELDS} }
      }
    }
  `);
  return data.posts.nodes;
}

export async function getPostBySlug(slug: string): Promise<WPPost | null> {
  const data = await fetchGraphQL<{ post: WPPost | null }>(
    `
    query GetPostBySlug($slug: ID!) {
      post(id: $slug, idType: SLUG) {
        ${POST_FIELDS}
      }
    }
  `,
    { slug },
  );
  return data.post;
}

export async function getFeaturedPost(): Promise<WPPost | null> {
  const posts = await getAllPosts();
  return posts.find((p) => p.blogPostDetails?.featured) ?? posts[0] ?? null;
}

// ─── Destinations ──────────────────────────────────────────────────────────

const DESTINATION_FIELDS = `
  id
  title
  slug
  content
  featuredImage {
    node { sourceUrl altText }
  }
  regions {
    nodes { name slug }
  }
  destinationDetails {
    excerpt
    visitDate
    featured
    heroImage {
      node { sourceUrl altText }
    }
  }
`;

export async function getAllDestinations(): Promise<WPDestination[]> {
  const data = await fetchGraphQL<{
    destinations: { nodes: WPDestination[] };
  }>(`
    query GetAllDestinations {
      destinations(first: 20) {
        nodes { ${DESTINATION_FIELDS} }
      }
    }
  `);
  return data.destinations.nodes;
}

export async function getDestinationBySlug(
  slug: string,
): Promise<WPDestination | null> {
  const data = await fetchGraphQL<{ destination: WPDestination | null }>(
    `
    query GetDestinationBySlug($slug: ID!) {
      destination(id: $slug, idType: SLUG) {
        ${DESTINATION_FIELDS}
      }
    }
  `,
    { slug },
  );
  return data.destination;
}

export async function getFeaturedDestinations(): Promise<WPDestination[]> {
  const all = await getAllDestinations();
  const featured = all.filter((d) => d.destinationDetails?.featured);
  return featured.length > 0 ? featured.slice(0, 5) : all.slice(0, 5);
}

// ─── Helpers ───────────────────────────────────────────────────────────────

export function stripHtml(html: string | null | undefined): string {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").trim();
}

export function getImageUrl(item: WPPost | WPDestination): string {
  // heroImage is now { node: { sourceUrl } }, not a plain string
  const acfHero =
    "blogPostDetails" in item
      ? item.blogPostDetails?.heroImage?.node?.sourceUrl
      : item.destinationDetails?.heroImage?.node?.sourceUrl;

  return (
    acfHero ??
    item.featuredImage?.node?.sourceUrl ??
    "https://placehold.co/800x600/eceeef/5b6061?text=No+Image"
  );
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

// ─── Navigation (Regions + their destinations) ─────────────────────────────

export type RegionWithDestinations = {
  id: string;
  name: string;
  slug: string;
  destinations: {
    nodes: {
      id: string;
      title: string;
      slug: string;
    }[];
  };
};

export async function getRegionsWithDestinations(): Promise<
  RegionWithDestinations[]
> {
  const data = await fetchGraphQL<{
    regions: { nodes: RegionWithDestinations[] };
  }>(`
    query GetRegionsForNav {
      regions(first: 20) {
        nodes {
          id
          name
          slug
          destinations(first: 5) {
            nodes {
              id
              title
              slug
            }
          }
        }
      }
    }
  `);

  // Only return regions that actually have destinations attached
  return data.regions.nodes.filter((r) => r.destinations.nodes.length > 0);
}

export type WPRegion = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  destinations: { nodes: WPDestination[] };
};

export async function getRegionBySlug(slug: string): Promise<WPRegion | null> {
  const data = await fetchGraphQL<{ region: WPRegion | null }>(
    `
    query GetRegionBySlug($slug: ID!) {
      region(id: $slug, idType: SLUG) {
        id
        name
        slug
        description
        destinations(first: 50) {
          nodes { ${DESTINATION_FIELDS} }
        }
      }
    }
  `,
    { slug },
  );
  return data.region;
}

// ─── Tags ──────────────────────────────────────────────────────────────────

export type WPTag = {
  id: string;
  name: string;
  slug: string;
  count: number | null;
};

export async function getTrendingTags(limit = 8): Promise<WPTag[]> {
  const data = await fetchGraphQL<{ tags: { nodes: WPTag[] } }>(`
    query GetTrendingTags {
      tags(first: 50, where: { orderby: COUNT, order: DESC }) {
        nodes {
          id
          name
          slug
          count
        }
      }
    }
  `);

  // Only return tags that are actually used on at least one post
  return data.tags.nodes.filter((t) => (t.count ?? 0) > 0).slice(0, limit);
}

// ─── Category queries ──────────────────────────────────────────────────────

export type WPCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  posts: { nodes: WPPost[] };
};

export async function getAllCategories(): Promise<
  { id: string; name: string; slug: string; count: number | null }[]
> {
  const data = await fetchGraphQL<{
    categories: {
      nodes: {
        id: string;
        name: string;
        slug: string;
        count: number | null;
      }[];
    };
  }>(`
    query GetAllCategories {
      categories(first: 50, where: { hideEmpty: true }) {
        nodes { id name slug count }
      }
    }
  `);
  return data.categories.nodes;
}

export async function getCategoryBySlug(
  slug: string,
): Promise<WPCategory | null> {
  const data = await fetchGraphQL<{ category: WPCategory | null }>(
    `
    query GetCategoryBySlug($slug: ID!) {
      category(id: $slug, idType: SLUG) {
        id
        name
        slug
        description
        posts(first: 50) {
          nodes { ${POST_FIELDS} }
        }
      }
    }
  `,
    { slug },
  );
  return data.category;
}

// ─── Tag queries ───────────────────────────────────────────────────────────

export type WPTagWithPosts = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  posts: { nodes: WPPost[] };
};

export async function getTagBySlug(
  slug: string,
): Promise<WPTagWithPosts | null> {
  const data = await fetchGraphQL<{ tag: WPTagWithPosts | null }>(
    `
    query GetTagBySlug($slug: ID!) {
      tag(id: $slug, idType: SLUG) {
        id
        name
        slug
        description
        posts(first: 50) {
          nodes { ${POST_FIELDS} }
        }
      }
    }
  `,
    { slug },
  );
  return data.tag;
}
