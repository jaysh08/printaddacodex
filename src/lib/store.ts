import { neon, type NeonQueryFunction } from "@neondatabase/serverless";
import type { Category, Order, OrderInput, OrderStatus, Product, SiteSettings, StoreData } from "./types";

let sqlClient: NeonQueryFunction<false, false> | null = null;

function getSql(): NeonQueryFunction<false, false> {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is missing");
  }
  if (!sqlClient) {
    sqlClient = neon(process.env.DATABASE_URL);
  }
  return sqlClient;
}

const defaultSettings: SiteSettings = {
  brandName: "The Print Adda",
  tagline: "print your style",
  whatsappNumber: "+917039514368",
  pickupArea: "Shastri Nagar, Vashi Naka",
  shopHours: "6:00 PM - 10:30 PM",
  currency: "₹",
  heroTitle: "Your tee should talk before you do.",
  heroCopy:
    "Choose a blank fit, pick a print, or reserve a ready design. We confirm on WhatsApp and keep it ready for 24-hour local pickup.",
  heroImage: "",
  announcement: "New drops, blank tees, custom prints",
  primaryCta: "Explore catalogue",
  secondaryCta: "Reserve on WhatsApp",
  pickupNote: "No delivery. Reserve on WhatsApp and collect within 24 hours.",
  instagram: "https://www.instagram.com/theprintadda2k26",
};

const seedCategories = [
  ["Anime", "anime", "Sharp graphics, character energy, loud street fits"],
  ["Street", "street", "Oversized everyday drops and bold local edits"],
  ["Gaming", "gaming", "Console, arcade, esports, and dark-mode graphics"],
  ["Typography", "typography", "Quotes, wordmarks, and minimal statement prints"],
  ["Blank Tees", "blank-tees", "Plain tees ready for custom printing"],
];

const seedProducts = [
  {
    name: "Crimson Samurai",
    code: "TPA-023",
    category: "Anime",
    type: "print",
    price: 599,
    colors: ["Black", "White"],
    sizes: ["S", "M", "L", "XL"],
    description: "High-contrast samurai print on a heavyweight cotton tee.",
    printOptions: "Front print",
    stockStatus: "In stock",
    featured: true,
    trending: true,
  },
  {
    name: "Midnight Blank",
    code: "BLK-101",
    category: "Blank Tees",
    type: "blank",
    price: 349,
    colors: ["Black", "Navy", "White"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "Plain cotton tee ready for your chosen print.",
    printOptions: "Blank or custom front/back print",
    stockStatus: "Limited sizes",
    featured: true,
    trending: false,
  },
  {
    name: "Arcade Skull",
    code: "GM-069",
    category: "Gaming",
    type: "print",
    price: 649,
    colors: ["Black"],
    sizes: ["M", "L", "XL"],
    description: "Dark gaming-inspired artwork with a glossy skull mark.",
    printOptions: "Front print",
    stockStatus: "In stock",
    featured: false,
    trending: true,
  },
  {
    name: "Custom Quote Tee",
    code: "CUS-001",
    category: "Typography",
    type: "custom",
    price: 499,
    colors: ["Black", "White", "Grey"],
    sizes: ["S", "M", "L", "XL"],
    description: "Send your text or artwork and we will confirm print placement.",
    printOptions: "Custom text, front/back print",
    stockStatus: "Made on request",
    featured: true,
    trending: false,
  },
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function rowToSettings(row: Record<string, string>): SiteSettings {
  return {
    brandName: row.brand_name,
    tagline: row.tagline,
    whatsappNumber: row.whatsapp_number,
    pickupArea: row.pickup_area,
    shopHours: row.shop_hours,
    currency: row.currency,
    heroTitle: row.hero_title,
    heroCopy: row.hero_copy,
    heroImage: row.hero_image ?? "",
    announcement: row.announcement,
    primaryCta: row.primary_cta,
    secondaryCta: row.secondary_cta,
    pickupNote: row.pickup_note,
    instagram: row.instagram,
  };
}

function rowToCategory(row: Record<string, unknown>): Category {
  return {
    id: Number(row.id),
    name: String(row.name),
    slug: String(row.slug),
    description: String(row.description ?? ""),
    sortOrder: Number(row.sort_order ?? 0),
    active: Boolean(row.active),
  };
}

function rowToProduct(row: Record<string, unknown>): Product {
  return {
    id: Number(row.id),
    name: String(row.name),
    code: String(row.code),
    categoryId: row.category_id === null ? null : Number(row.category_id),
    categoryName: String(row.category_name ?? "Uncategorized"),
    type: String(row.type) as Product["type"],
    price: Number(row.price),
    image: String(row.image ?? ""),
    colors: Array.isArray(row.colors) ? (row.colors as string[]) : [],
    sizes: Array.isArray(row.sizes) ? (row.sizes as string[]) : [],
    description: String(row.description ?? ""),
    printOptions: String(row.print_options ?? ""),
    stockStatus: String(row.stock_status ?? ""),
    featured: Boolean(row.featured),
    trending: Boolean(row.trending),
    active: Boolean(row.active),
    sortOrder: Number(row.sort_order ?? 0),
  };
}

function rowToOrder(row: Record<string, unknown>): Order {
  return {
    id: Number(row.id),
    orderCode: String(row.order_code),
    orderType: String(row.order_type) as Order["orderType"],
    status: String(row.status) as OrderStatus,
    productId: row.product_id === null ? null : Number(row.product_id),
    productName: String(row.product_name ?? ""),
    productCode: String(row.product_code ?? ""),
    categoryName: String(row.category_name ?? ""),
    price: Number(row.price ?? 0),
    customerName: String(row.customer_name ?? ""),
    customerPhone: String(row.customer_phone ?? ""),
    size: String(row.size ?? ""),
    color: String(row.color ?? ""),
    placement: String(row.placement ?? ""),
    shirtColor: String(row.shirt_color ?? ""),
    artworkName: String(row.artwork_name ?? ""),
    artworkPreview: String(row.artwork_preview ?? ""),
    printSize: Number(row.print_size ?? 0),
    cropZoom: Number(row.crop_zoom ?? 0),
    positionX: Number(row.position_x ?? 0),
    positionY: Number(row.position_y ?? 0),
    notes: String(row.notes ?? ""),
    whatsappMessage: String(row.whatsapp_message ?? ""),
    createdAt: String(row.created_at ?? ""),
    updatedAt: String(row.updated_at ?? ""),
  };
}

function makeOrderCode() {
  return `TPA-${Date.now().toString(36).toUpperCase().slice(-6)}-${Math.random()
    .toString(36)
    .slice(2, 5)
    .toUpperCase()}`;
}

export async function ensureStore() {
  const sql = getSql();

  await sql`
    CREATE TABLE IF NOT EXISTS site_settings (
      id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
      brand_name text NOT NULL,
      tagline text NOT NULL,
      whatsapp_number text NOT NULL,
      pickup_area text NOT NULL,
      shop_hours text NOT NULL,
      currency text NOT NULL,
      hero_title text NOT NULL,
      hero_copy text NOT NULL,
      hero_image text NOT NULL DEFAULT '',
      announcement text NOT NULL,
      primary_cta text NOT NULL,
      secondary_cta text NOT NULL,
      pickup_note text NOT NULL,
      instagram text NOT NULL DEFAULT '',
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `;

  await sql`
    ALTER TABLE site_settings
    ADD COLUMN IF NOT EXISTS hero_image text NOT NULL DEFAULT ''
  `;

  await sql`
    ALTER TABLE site_settings
    ADD COLUMN IF NOT EXISTS instagram text NOT NULL DEFAULT ''
  `;

  await sql`
    UPDATE site_settings
    SET instagram = ${defaultSettings.instagram}
    WHERE id = 1 AND instagram = ''
  `;

  await sql`
    UPDATE site_settings
    SET currency = '₹'
    WHERE id = 1 AND currency LIKE 'â%'
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS categories (
      id serial PRIMARY KEY,
      name text NOT NULL,
      slug text NOT NULL UNIQUE,
      description text NOT NULL DEFAULT '',
      sort_order integer NOT NULL DEFAULT 0,
      active boolean NOT NULL DEFAULT true,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id serial PRIMARY KEY,
      name text NOT NULL,
      code text NOT NULL UNIQUE,
      category_id integer REFERENCES categories(id) ON DELETE SET NULL,
      type text NOT NULL DEFAULT 'print',
      price integer NOT NULL DEFAULT 0,
      image text NOT NULL DEFAULT '',
      colors jsonb NOT NULL DEFAULT '[]'::jsonb,
      sizes jsonb NOT NULL DEFAULT '[]'::jsonb,
      description text NOT NULL DEFAULT '',
      print_options text NOT NULL DEFAULT '',
      stock_status text NOT NULL DEFAULT 'In stock',
      featured boolean NOT NULL DEFAULT false,
      trending boolean NOT NULL DEFAULT false,
      active boolean NOT NULL DEFAULT true,
      sort_order integer NOT NULL DEFAULT 0,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS orders (
      id serial PRIMARY KEY,
      order_code text NOT NULL UNIQUE,
      order_type text NOT NULL DEFAULT 'catalogue',
      status text NOT NULL DEFAULT 'New',
      product_id integer REFERENCES products(id) ON DELETE SET NULL,
      product_name text NOT NULL DEFAULT '',
      product_code text NOT NULL DEFAULT '',
      category_name text NOT NULL DEFAULT '',
      price integer NOT NULL DEFAULT 0,
      customer_name text NOT NULL DEFAULT '',
      customer_phone text NOT NULL DEFAULT '',
      size text NOT NULL DEFAULT '',
      color text NOT NULL DEFAULT '',
      placement text NOT NULL DEFAULT '',
      shirt_color text NOT NULL DEFAULT '',
      artwork_name text NOT NULL DEFAULT '',
      artwork_preview text NOT NULL DEFAULT '',
      print_size integer NOT NULL DEFAULT 0,
      crop_zoom integer NOT NULL DEFAULT 0,
      position_x integer NOT NULL DEFAULT 0,
      position_y integer NOT NULL DEFAULT 0,
      notes text NOT NULL DEFAULT '',
      whatsapp_message text NOT NULL DEFAULT '',
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `;

  const settingsRows = await sql`SELECT id FROM site_settings WHERE id = 1`;
  if (settingsRows.length === 0) {
    await sql`
      INSERT INTO site_settings (
        id, brand_name, tagline, whatsapp_number, pickup_area, shop_hours,
        currency, hero_title, hero_copy, hero_image, announcement, primary_cta,
        secondary_cta, pickup_note, instagram
      )
      VALUES (
        1, ${defaultSettings.brandName}, ${defaultSettings.tagline},
        ${defaultSettings.whatsappNumber}, ${defaultSettings.pickupArea},
        ${defaultSettings.shopHours}, ${"₹"},
        ${defaultSettings.heroTitle}, ${defaultSettings.heroCopy},
        ${defaultSettings.heroImage},
        ${defaultSettings.announcement}, ${defaultSettings.primaryCta},
        ${defaultSettings.secondaryCta}, ${defaultSettings.pickupNote},
        ${defaultSettings.instagram}
      )
    `;
  }

  const categoryCount = await sql`SELECT count(*)::int AS count FROM categories`;
  if (Number(categoryCount[0].count) === 0) {
    for (let i = 0; i < seedCategories.length; i += 1) {
      const [name, slug, description] = seedCategories[i];
      await sql`
        INSERT INTO categories (name, slug, description, sort_order)
        VALUES (${name}, ${slug}, ${description}, ${i})
      `;
    }
  }

  const productCount = await sql`SELECT count(*)::int AS count FROM products`;
  if (Number(productCount[0].count) === 0) {
    for (let i = 0; i < seedProducts.length; i += 1) {
      const product = seedProducts[i];
      const category = await sql`SELECT id FROM categories WHERE name = ${product.category} LIMIT 1`;
      await sql`
        INSERT INTO products (
          name, code, category_id, type, price, colors, sizes, description,
          print_options, stock_status, featured, trending, sort_order
        )
        VALUES (
          ${product.name}, ${product.code}, ${Number(category[0]?.id ?? 0) || null},
          ${product.type}, ${product.price}, ${JSON.stringify(product.colors)}::jsonb,
          ${JSON.stringify(product.sizes)}::jsonb, ${product.description},
          ${product.printOptions}, ${product.stockStatus}, ${product.featured},
          ${product.trending}, ${i}
        )
      `;
    }
  }
}

export async function getStoreData(includeInactive = false): Promise<StoreData> {
  await ensureStore();
  const sql = getSql();
  const settingsRows = await sql`SELECT * FROM site_settings WHERE id = 1`;
  const categoriesRows = includeInactive
    ? await sql`SELECT * FROM categories ORDER BY sort_order, name`
    : await sql`SELECT * FROM categories WHERE active = true ORDER BY sort_order, name`;
  const productRows = includeInactive
    ? await sql`
        SELECT p.*, c.name AS category_name
        FROM products p
        LEFT JOIN categories c ON c.id = p.category_id
        ORDER BY p.sort_order, p.created_at DESC
      `
    : await sql`
        SELECT p.*, c.name AS category_name
        FROM products p
        LEFT JOIN categories c ON c.id = p.category_id
        WHERE p.active = true
        ORDER BY p.sort_order, p.created_at DESC
      `;

  const data: StoreData = {
    settings: rowToSettings(settingsRows[0] as Record<string, string>),
    categories: categoriesRows.map((row) => rowToCategory(row as Record<string, unknown>)),
    products: productRows.map((row) => rowToProduct(row as Record<string, unknown>)),
  };

  if (includeInactive) {
    const orderRows = await sql`SELECT * FROM orders ORDER BY created_at DESC, id DESC`;
    data.orders = orderRows.map((row) => rowToOrder(row as Record<string, unknown>));
  }

  return data;
}

export async function saveSettings(settings: SiteSettings) {
  await ensureStore();
  const sql = getSql();
  await sql`
    UPDATE site_settings SET
      brand_name = ${settings.brandName},
      tagline = ${settings.tagline},
      whatsapp_number = ${settings.whatsappNumber},
      pickup_area = ${settings.pickupArea},
      shop_hours = ${settings.shopHours},
      currency = ${settings.currency},
      hero_title = ${settings.heroTitle},
      hero_copy = ${settings.heroCopy},
      hero_image = ${settings.heroImage ?? ""},
      announcement = ${settings.announcement},
      primary_cta = ${settings.primaryCta},
      secondary_cta = ${settings.secondaryCta},
      pickup_note = ${settings.pickupNote},
      instagram = ${settings.instagram},
      updated_at = now()
    WHERE id = 1
  `;
}

export async function upsertCategory(category: Partial<Category>) {
  await ensureStore();
  const sql = getSql();
  const slug = category.slug || slugify(category.name ?? "category");
  if (category.id) {
    await sql`
      UPDATE categories SET
        name = ${category.name ?? ""},
        slug = ${slug},
        description = ${category.description ?? ""},
        sort_order = ${category.sortOrder ?? 0},
        active = ${category.active ?? true},
        updated_at = now()
      WHERE id = ${category.id}
    `;
    return;
  }
  await sql`
    INSERT INTO categories (name, slug, description, sort_order, active)
    VALUES (${category.name ?? ""}, ${slug}, ${category.description ?? ""},
      ${category.sortOrder ?? 0}, ${category.active ?? true})
  `;
}

export async function deleteCategory(id: number) {
  await ensureStore();
  const sql = getSql();
  await sql`DELETE FROM categories WHERE id = ${id}`;
}

export async function upsertProduct(product: Partial<Product>) {
  await ensureStore();
  const sql = getSql();
  const code = product.code || `TPA-${Date.now().toString().slice(-5)}`;
  if (product.id) {
    await sql`
      UPDATE products SET
        name = ${product.name ?? ""},
        code = ${code},
        category_id = ${product.categoryId ?? null},
        type = ${product.type ?? "print"},
        price = ${product.price ?? 0},
        image = ${product.image ?? ""},
        colors = ${JSON.stringify(product.colors ?? [])}::jsonb,
        sizes = ${JSON.stringify(product.sizes ?? [])}::jsonb,
        description = ${product.description ?? ""},
        print_options = ${product.printOptions ?? ""},
        stock_status = ${product.stockStatus ?? ""},
        featured = ${product.featured ?? false},
        trending = ${product.trending ?? false},
        active = ${product.active ?? true},
        sort_order = ${product.sortOrder ?? 0},
        updated_at = now()
      WHERE id = ${product.id}
    `;
    return;
  }
  await sql`
    INSERT INTO products (
      name, code, category_id, type, price, image, colors, sizes,
      description, print_options, stock_status, featured, trending,
      active, sort_order
    )
    VALUES (
      ${product.name ?? ""}, ${code}, ${product.categoryId ?? null},
      ${product.type ?? "print"}, ${product.price ?? 0}, ${product.image ?? ""},
      ${JSON.stringify(product.colors ?? [])}::jsonb,
      ${JSON.stringify(product.sizes ?? [])}::jsonb,
      ${product.description ?? ""}, ${product.printOptions ?? ""},
      ${product.stockStatus ?? ""}, ${product.featured ?? false},
      ${product.trending ?? false}, ${product.active ?? true},
      ${product.sortOrder ?? 0}
    )
  `;
}

export async function deleteProduct(id: number) {
  await ensureStore();
  const sql = getSql();
  await sql`DELETE FROM products WHERE id = ${id}`;
}

export async function createOrder(input: OrderInput) {
  await ensureStore();
  const sql = getSql();
  const orderCode = makeOrderCode();
  const whatsappMessage = (input.whatsappMessage ?? "").replaceAll("{{ORDER_CODE}}", orderCode);
  const rows = await sql`
    INSERT INTO orders (
      order_code, order_type, product_id, product_name, product_code,
      category_name, price, customer_name, customer_phone, size, color,
      placement, shirt_color, artwork_name, artwork_preview, print_size,
      crop_zoom, position_x, position_y, notes, whatsapp_message
    )
    VALUES (
      ${orderCode}, ${input.orderType}, ${input.productId ?? null},
      ${input.productName ?? ""}, ${input.productCode ?? ""},
      ${input.categoryName ?? ""}, ${input.price ?? 0},
      ${input.customerName ?? ""}, ${input.customerPhone ?? ""},
      ${input.size ?? ""}, ${input.color ?? ""}, ${input.placement ?? ""},
      ${input.shirtColor ?? ""}, ${input.artworkName ?? ""},
      ${input.artworkPreview ?? ""}, ${input.printSize ?? 0},
      ${input.cropZoom ?? 0}, ${input.positionX ?? 0},
      ${input.positionY ?? 0}, ${input.notes ?? ""},
      ${whatsappMessage}
    )
    RETURNING *
  `;

  return rowToOrder(rows[0] as Record<string, unknown>);
}

export async function updateOrderStatus(id: number, status: OrderStatus) {
  await ensureStore();
  const sql = getSql();
  await sql`UPDATE orders SET status = ${status}, updated_at = now() WHERE id = ${id}`;
}

export async function deleteOrder(id: number) {
  await ensureStore();
  const sql = getSql();
  await sql`DELETE FROM orders WHERE id = ${id}`;
}
