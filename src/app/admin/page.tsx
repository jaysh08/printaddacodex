"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import {
  Eye,
  ImagePlus,
  Loader2,
  LogOut,
  Plus,
  Save,
  Settings,
  Shirt,
  Tags,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import type { Category, Product, SiteSettings, StoreData } from "@/lib/types";

const blankSettings: SiteSettings = {
  brandName: "",
  tagline: "",
  whatsappNumber: "",
  pickupArea: "",
  shopHours: "",
  currency: "₹",
  heroTitle: "",
  heroCopy: "",
  announcement: "",
  primaryCta: "",
  secondaryCta: "",
  pickupNote: "",
  instagram: "",
};

const newProduct: Product = {
  id: 0,
  name: "",
  code: "",
  categoryId: null,
  categoryName: "",
  type: "print",
  price: 0,
  image: "",
  colors: [],
  sizes: [],
  description: "",
  printOptions: "",
  stockStatus: "In stock",
  featured: false,
  trending: false,
  active: true,
  sortOrder: 0,
};

function splitList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function joinList(value: string[]) {
  return value.join(", ");
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [savedPassword, setSavedPassword] = useState("");
  const [data, setData] = useState<StoreData | null>(null);
  const [activeProduct, setActiveProduct] = useState<Product>(newProduct);
  const [activeCategory, setActiveCategory] = useState<Partial<Category>>({
    name: "",
    slug: "",
    description: "",
    sortOrder: 0,
    active: true,
  });
  const [status, setStatus] = useState("Enter admin password to manage the store.");
  const [loading, setLoading] = useState(false);

  const authed = Boolean(savedPassword);
  const settings = data?.settings ?? blankSettings;

  useEffect(() => {
    const stored = sessionStorage.getItem("print-adda-admin");
    if (stored) {
      setTimeout(() => {
        setSavedPassword(stored);
        void load(stored);
      }, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function load(pass = savedPassword) {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/store", {
        headers: { "x-admin-password": pass },
        cache: "no-store",
      });
      if (!response.ok) {
        throw new Error("Wrong password or admin session expired.");
      }
      const nextData = (await response.json()) as StoreData;
      setData(nextData);
      setStatus("Loaded latest catalogue.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to load admin.");
      setSavedPassword("");
      sessionStorage.removeItem("print-adda-admin");
    } finally {
      setLoading(false);
    }
  }

  async function mutate(payload: Record<string, unknown>, success: string) {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/store", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-admin-password": savedPassword,
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error("Could not save. Check admin password.");
      }
      setData((await response.json()) as StoreData);
      setStatus(success);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Save failed.");
    } finally {
      setLoading(false);
    }
  }

  function login() {
    sessionStorage.setItem("print-adda-admin", password);
    setSavedPassword(password);
    void load(password);
  }

  function updateSettings<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    if (!data) return;
    setData({ ...data, settings: { ...data.settings, [key]: value } });
  }

  const categoryOptions = useMemo(() => data?.categories ?? [], [data]);

  async function handleImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setActiveProduct((product) => ({ ...product, image: String(reader.result) }));
    };
    reader.readAsDataURL(file);
  }

  if (!authed) {
    return (
      <main className="admin-shell grid place-items-center px-4">
        <section className="w-full max-w-md border border-stone-300 bg-[#fffaf0] p-6 shadow-2xl">
          <div className="mb-8 flex items-center gap-3">
            <span className="grid size-10 place-items-center bg-black text-sm font-black text-lime-300">
              PA
            </span>
            <div>
              <h1 className="text-2xl font-black uppercase">The Print Adda Admin</h1>
              <p className="text-sm text-stone-600">Edit the storefront without code.</p>
            </div>
          </div>
          <label className="admin-label">
            Admin password
            <input
              className="admin-input"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && login()}
              placeholder="Ask Codex or set ADMIN_PASSWORD"
            />
          </label>
          <button onClick={login} className="mt-4 flex h-12 w-full items-center justify-center gap-2 bg-black font-black uppercase tracking-[0.14em] text-white">
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Settings size={18} />}
            Login
          </button>
          <p className="mt-4 text-sm text-stone-600">{status}</p>
        </section>
      </main>
    );
  }

  return (
    <main className="admin-shell">
      <header className="sticky top-0 z-20 border-b border-stone-300 bg-[#f3f1eb]/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-stone-500">Store control room</p>
            <h1 className="text-3xl font-black uppercase">The Print Adda Admin</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/" className="inline-flex h-11 items-center gap-2 border border-black px-4 text-xs font-black uppercase tracking-[0.14em]">
              <Eye size={17} /> View site
            </Link>
            <button
              onClick={() => {
                sessionStorage.removeItem("print-adda-admin");
                setSavedPassword("");
              }}
              className="inline-flex h-11 items-center gap-2 bg-black px-4 text-xs font-black uppercase tracking-[0.14em] text-white"
            >
              <LogOut size={17} /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <section className="space-y-6">
          <Panel title="Business + Homepage" icon={<Settings size={20} />}>
            <div className="grid gap-4">
              <label className="admin-label">Brand name<input className="admin-input" value={settings.brandName} onChange={(e) => updateSettings("brandName", e.target.value)} /></label>
              <label className="admin-label">Tagline<input className="admin-input" value={settings.tagline} onChange={(e) => updateSettings("tagline", e.target.value)} /></label>
              <label className="admin-label">WhatsApp number<input className="admin-input" value={settings.whatsappNumber} onChange={(e) => updateSettings("whatsappNumber", e.target.value)} /></label>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="admin-label">Pickup area<input className="admin-input" value={settings.pickupArea} onChange={(e) => updateSettings("pickupArea", e.target.value)} /></label>
                <label className="admin-label">Shop hours<input className="admin-input" value={settings.shopHours} onChange={(e) => updateSettings("shopHours", e.target.value)} /></label>
              </div>
              <label className="admin-label">Hero title<textarea className="admin-input min-h-24" value={settings.heroTitle} onChange={(e) => updateSettings("heroTitle", e.target.value)} /></label>
              <label className="admin-label">Hero copy<textarea className="admin-input min-h-24" value={settings.heroCopy} onChange={(e) => updateSettings("heroCopy", e.target.value)} /></label>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="admin-label">Announcement<input className="admin-input" value={settings.announcement} onChange={(e) => updateSettings("announcement", e.target.value)} /></label>
                <label className="admin-label">Currency<input className="admin-input" value={settings.currency} onChange={(e) => updateSettings("currency", e.target.value)} /></label>
              </div>
              <label className="admin-label">Pickup note<textarea className="admin-input min-h-20" value={settings.pickupNote} onChange={(e) => updateSettings("pickupNote", e.target.value)} /></label>
              <button onClick={() => mutate({ action: "saveSettings", settings }, "Business info saved.")} className="admin-save">
                <Save size={18} /> Save business info
              </button>
            </div>
          </Panel>

          <Panel title="Categories" icon={<Tags size={20} />}>
            <div className="grid gap-3">
              {data?.categories.map((category) => (
                <button key={category.id} onClick={() => setActiveCategory(category)} className="flex items-center justify-between border border-stone-300 bg-white/60 p-3 text-left">
                  <span>
                    <strong className="block">{category.name}</strong>
                    <span className="text-sm text-stone-600">{category.description}</span>
                  </span>
                  <span className="text-xs font-black uppercase">{category.active ? "Live" : "Hidden"}</span>
                </button>
              ))}
            </div>
            <div className="mt-5 grid gap-3 border-t border-stone-300 pt-5">
              <label className="admin-label">Name<input className="admin-input" value={activeCategory.name ?? ""} onChange={(e) => setActiveCategory({ ...activeCategory, name: e.target.value })} /></label>
              <label className="admin-label">Slug<input className="admin-input" value={activeCategory.slug ?? ""} onChange={(e) => setActiveCategory({ ...activeCategory, slug: e.target.value })} /></label>
              <label className="admin-label">Description<textarea className="admin-input" value={activeCategory.description ?? ""} onChange={(e) => setActiveCategory({ ...activeCategory, description: e.target.value })} /></label>
              <label className="flex items-center gap-2 text-sm font-bold">
                <input type="checkbox" checked={activeCategory.active ?? true} onChange={(e) => setActiveCategory({ ...activeCategory, active: e.target.checked })} /> Show category
              </label>
              <div className="flex gap-2">
                <button onClick={() => mutate({ action: "saveCategory", category: activeCategory }, "Category saved.")} className="admin-save flex-1">
                  <Save size={18} /> Save
                </button>
                <button onClick={() => setActiveCategory({ name: "", slug: "", description: "", sortOrder: 0, active: true })} className="admin-secondary">
                  <Plus size={18} />
                </button>
                {activeCategory.id ? (
                  <button onClick={() => mutate({ action: "deleteCategory", id: activeCategory.id }, "Category deleted.")} className="admin-danger">
                    <Trash2 size={18} />
                  </button>
                ) : null}
              </div>
            </div>
          </Panel>
        </section>

        <section>
          <Panel title="Products" icon={<Shirt size={20} />}>
            <div className="mb-5 grid gap-3 md:grid-cols-2">
              {data?.products.map((product) => (
                <button key={product.id} onClick={() => setActiveProduct(product)} className="flex gap-3 border border-stone-300 bg-white/60 p-3 text-left">
                  <div className="grid size-16 shrink-0 place-items-center overflow-hidden bg-black text-xs font-black text-lime-300">
                    {product.image ? <img src={product.image} alt="" className="h-full w-full object-cover" /> : product.code}
                  </div>
                  <span>
                    <strong className="block">{product.name}</strong>
                    <span className="block text-sm text-stone-600">{product.code} · {settings.currency}{product.price}</span>
                    <span className="block text-xs font-black uppercase text-stone-500">{product.active ? "Live" : "Hidden"}</span>
                  </span>
                </button>
              ))}
            </div>

            <div className="grid gap-4 border-t border-stone-300 pt-5">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="admin-label">Product name<input className="admin-input" value={activeProduct.name} onChange={(e) => setActiveProduct({ ...activeProduct, name: e.target.value })} /></label>
                <label className="admin-label">Design code<input className="admin-input" value={activeProduct.code} onChange={(e) => setActiveProduct({ ...activeProduct, code: e.target.value })} /></label>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <label className="admin-label">Category
                  <select className="admin-input" value={activeProduct.categoryId ?? ""} onChange={(e) => setActiveProduct({ ...activeProduct, categoryId: e.target.value ? Number(e.target.value) : null })}>
                    <option value="">Uncategorized</option>
                    {categoryOptions.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                  </select>
                </label>
                <label className="admin-label">Type
                  <select className="admin-input" value={activeProduct.type} onChange={(e) => setActiveProduct({ ...activeProduct, type: e.target.value as Product["type"] })}>
                    <option value="print">Print</option>
                    <option value="blank">Blank tee</option>
                    <option value="custom">Custom</option>
                  </select>
                </label>
                <label className="admin-label">Price<input className="admin-input" type="number" value={activeProduct.price} onChange={(e) => setActiveProduct({ ...activeProduct, price: Number(e.target.value) })} /></label>
              </div>
              <label className="admin-label">Description<textarea className="admin-input min-h-20" value={activeProduct.description} onChange={(e) => setActiveProduct({ ...activeProduct, description: e.target.value })} /></label>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="admin-label">Sizes, comma separated<input className="admin-input" value={joinList(activeProduct.sizes)} onChange={(e) => setActiveProduct({ ...activeProduct, sizes: splitList(e.target.value) })} /></label>
                <label className="admin-label">Colors, comma separated<input className="admin-input" value={joinList(activeProduct.colors)} onChange={(e) => setActiveProduct({ ...activeProduct, colors: splitList(e.target.value) })} /></label>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="admin-label">Print options<input className="admin-input" value={activeProduct.printOptions} onChange={(e) => setActiveProduct({ ...activeProduct, printOptions: e.target.value })} /></label>
                <label className="admin-label">Stock status<input className="admin-input" value={activeProduct.stockStatus} onChange={(e) => setActiveProduct({ ...activeProduct, stockStatus: e.target.value })} /></label>
              </div>
              <label className="admin-label">Image URL or uploaded image<textarea className="admin-input min-h-20" value={activeProduct.image} onChange={(e) => setActiveProduct({ ...activeProduct, image: e.target.value })} /></label>
              <label className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 border border-dashed border-black text-xs font-black uppercase tracking-[0.14em]">
                <ImagePlus size={18} /> Upload product image
                <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
              </label>
              <div className="grid gap-3 sm:grid-cols-4">
                <label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={activeProduct.featured} onChange={(e) => setActiveProduct({ ...activeProduct, featured: e.target.checked })} /> Featured</label>
                <label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={activeProduct.trending} onChange={(e) => setActiveProduct({ ...activeProduct, trending: e.target.checked })} /> Trending</label>
                <label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={activeProduct.active} onChange={(e) => setActiveProduct({ ...activeProduct, active: e.target.checked })} /> Show</label>
                <label className="admin-label">Sort<input className="admin-input" type="number" value={activeProduct.sortOrder} onChange={(e) => setActiveProduct({ ...activeProduct, sortOrder: Number(e.target.value) })} /></label>
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => mutate({ action: "saveProduct", product: activeProduct }, "Product saved.")} className="admin-save">
                  <Save size={18} /> Save product
                </button>
                <button onClick={() => setActiveProduct(newProduct)} className="admin-secondary">
                  <Plus size={18} /> New product
                </button>
                {activeProduct.id ? (
                  <button onClick={() => mutate({ action: "deleteProduct", id: activeProduct.id }, "Product deleted.")} className="admin-danger">
                    <Trash2 size={18} /> Delete
                  </button>
                ) : null}
              </div>
            </div>
          </Panel>
        </section>
      </div>

      <div className="fixed bottom-4 left-1/2 z-30 -translate-x-1/2 border border-black bg-[#fffaf0] px-4 py-3 text-sm font-bold shadow-xl">
        {loading ? "Working..." : status}
      </div>

      <style jsx global>{`
        .admin-save,
        .admin-secondary,
        .admin-danger {
          display: inline-flex;
          min-height: 44px;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border: 1px solid #181714;
          padding: 0 14px;
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .admin-save {
          background: #181714;
          color: #fffaf0;
        }

        .admin-secondary {
          background: #fffaf0;
          color: #181714;
        }

        .admin-danger {
          border-color: #d92323;
          background: #d92323;
          color: white;
        }
      `}</style>
    </main>
  );
}

function Panel({
  children,
  icon,
  title,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <section className="border border-stone-300 bg-[#fffaf0] p-4 shadow-sm sm:p-5">
      <div className="mb-5 flex items-center gap-3 border-b border-stone-300 pb-4">
        <span className="grid size-10 place-items-center bg-black text-lime-300">{icon}</span>
        <h2 className="text-xl font-black uppercase">{title}</h2>
      </div>
      {children}
    </section>
  );
}
