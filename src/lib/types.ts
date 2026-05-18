export type SiteSettings = {
  brandName: string;
  tagline: string;
  whatsappNumber: string;
  pickupArea: string;
  shopHours: string;
  currency: string;
  heroTitle: string;
  heroCopy: string;
  announcement: string;
  primaryCta: string;
  secondaryCta: string;
  pickupNote: string;
  instagram: string;
};

export type Category = {
  id: number;
  name: string;
  slug: string;
  description: string;
  sortOrder: number;
  active: boolean;
};

export type Product = {
  id: number;
  name: string;
  code: string;
  categoryId: number | null;
  categoryName: string;
  type: "print" | "blank" | "custom";
  price: number;
  image: string;
  colors: string[];
  sizes: string[];
  description: string;
  printOptions: string;
  stockStatus: string;
  featured: boolean;
  trending: boolean;
  active: boolean;
  sortOrder: number;
};

export type StoreData = {
  settings: SiteSettings;
  categories: Category[];
  products: Product[];
};
