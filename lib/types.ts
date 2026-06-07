export type Region = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parent_id: string | null;
  created_at?: string;
};

export type GalleryImage = {
  id: string;
  url: string;
  alt: string;
  caption: string | null;
  sort_order: number;
  created_at?: string;
};

export type Destination = {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  excerpt: string | null;
  visit_date: string | null;
  featured: boolean;
  featured_image_url: string | null;
  featured_image_alt: string;
  hero_image_url: string | null;
  latitude: number | null;
  longitude: number | null;
  document_url: string | null;
  region_id: string | null;
  region?: Region | null;
  created_at?: string;
};
