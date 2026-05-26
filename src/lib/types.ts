export type SiteSettings = {
  brandName: string;
  tagline: string;
  whatsappNumber: string;
  pickupArea: string;
  shopHours: string;
  currency: string;
  heroTitle: string;
  heroCopy: string;
  heroImage: string;
  announcement: string;
  primaryCta: string;
  secondaryCta: string;
  pickupNote: string;
  instagram: string;
};

export type OrderStatus = "New" | "Confirmed" | "Ready" | "Picked Up" | "Cancelled";

export type OrderType = "catalogue" | "custom";

export type Order = {
  id: number;
  orderCode: string;
  orderType: OrderType;
  status: OrderStatus;
  productId: number | null;
  productName: string;
  productCode: string;
  categoryName: string;
  price: number;
  customerName: string;
  customerPhone: string;
  size: string;
  color: string;
  placement: string;
  shirtColor: string;
  artworkName: string;
  artworkPreview: string;
  printSize: number;
  cropZoom: number;
  positionX: number;
  positionY: number;
  notes: string;
  whatsappMessage: string;
  createdAt: string;
  updatedAt: string;
};

export type OrderInput = Partial<Omit<Order, "id" | "orderCode" | "status" | "createdAt" | "updatedAt">> & {
  orderType: OrderType;
  productId?: number | null;
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
  orders?: Order[];
};
