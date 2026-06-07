export type Region = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
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

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  post_count?: number;
  created_at?: string;
};

export type Tag = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  post_count?: number;
  created_at?: string;
};

export type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  date: string;
  featured: boolean;
  read_time: string | null;
  featured_image_url: string | null;
  featured_image_alt: string;
  hero_image_url: string | null;
  categories?: Category[];
  tags?: Tag[];
  created_at?: string;
};
