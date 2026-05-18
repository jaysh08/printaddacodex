import { ArrowRight, Clock3, MapPin, MessageCircle, Sparkles } from "lucide-react";
import { getStoreData } from "@/lib/store";
import { whatsappHref } from "@/lib/whatsapp";
import type { Product } from "@/lib/types";

export const dynamic = "force-dynamic";

function ProductImage({ product }: { product: Product }) {
  if (product.image) {
    return <img src={product.image} alt={product.name} className="h-full w-full object-cover" />;
  }

  return (
    <div className="product-art">
      <div className="tee-shape" />
      <span>{product.code}</span>
    </div>
  );
}

export default async function Home() {
  const { settings, categories, products } = await getStoreData(false);
  const featured = products.filter((product) => product.featured).slice(0, 3);
  const trending = products.filter((product) => product.trending).slice(0, 6);
  const blanks = products.filter((product) => product.type === "blank").slice(0, 3);
  const displayProducts = trending.length ? trending : products.slice(0, 6);

  return (
    <main className="min-h-screen bg-[#070707] text-stone-50">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#070707]/88 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <a href="#" className="group flex items-center gap-3">
            <span className="grid size-9 place-items-center bg-lime-300 text-sm font-black text-black">
              PA
            </span>
            <span>
              <span className="block text-lg font-black uppercase tracking-[0.08em]">
                {settings.brandName}
              </span>
              <span className="block text-[11px] uppercase tracking-[0.34em] text-stone-400">
                {settings.tagline}
              </span>
            </span>
          </a>
          <div className="hidden items-center gap-8 text-xs font-bold uppercase tracking-[0.24em] text-stone-400 md:flex">
            <a href="#catalogue" className="hover:text-white">Catalogue</a>
            <a href="#blank-tees" className="hover:text-white">Blank tees</a>
            <a href="#pickup" className="hover:text-white">Pickup</a>
          </div>
          <a href={whatsappHref(settings)} className="btn-green">
            <MessageCircle size={18} />
            WhatsApp
          </a>
        </nav>
      </header>

      <section className="relative overflow-hidden border-b border-white/10">
        <div className="hero-grid absolute inset-0 opacity-40" />
        <div className="mx-auto grid min-h-[calc(100vh-73px)] max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:px-8 lg:py-20">
          <div className="relative z-10 flex flex-col justify-center">
            <div className="mb-6 inline-flex w-fit items-center gap-2 border border-lime-300/30 bg-lime-300/10 px-3 py-2 text-xs font-black uppercase tracking-[0.18em] text-lime-200">
              <Sparkles size={15} />
              {settings.announcement}
            </div>
            <h1 className="max-w-4xl text-6xl font-black uppercase leading-[0.86] tracking-[-0.03em] text-white sm:text-7xl lg:text-8xl">
              {settings.heroTitle}
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-stone-300 sm:text-xl">
              {settings.heroCopy}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a href="#catalogue" className="btn-white">
                {settings.primaryCta}
                <ArrowRight size={18} />
              </a>
              <a href={whatsappHref(settings)} className="btn-outline">
                <MessageCircle size={18} />
                {settings.secondaryCta}
              </a>
            </div>
            <div className="mt-12 grid max-w-2xl grid-cols-3 border-y border-white/10">
              <div className="stat">
                <strong>{products.length}+</strong>
                <span>catalogue items</span>
              </div>
              <div className="stat">
                <strong>{categories.length}</strong>
                <span>categories</span>
              </div>
              <div className="stat">
                <strong>24h</strong>
                <span>pickup hold</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex items-center">
            <div className="hero-stage">
              <div className="hero-card hero-card-one">
                <span>Custom print</span>
                <strong>Front / back / quote</strong>
              </div>
              <div className="hero-card hero-card-two">
                <span>Local pickup</span>
                <strong>{settings.shopHours}</strong>
              </div>
              <div className="tee-poster">
                <div className="poster-glow" />
                <div className="poster-tee">
                  <div className="poster-print">ADDΛ</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="catalogue" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="section-heading">
          <div>
            <span>Choose your lane</span>
            <h2>Shop by category</h2>
          </div>
          <a href={whatsappHref(settings)}>Ask for a design <ArrowRight size={16} /></a>
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((category, index) => (
            <a key={category.id} href={`#${category.slug}`} className="category-tile">
              <span>0{index + 1}</span>
              <strong>{category.name}</strong>
              <p>{category.description}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="section-heading">
          <div>
            <span>Fresh rack</span>
            <h2>Prints people ask for</h2>
          </div>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {displayProducts.map((product) => (
            <article key={product.id} id={product.categoryName.toLowerCase().replaceAll(" ", "-")} className="product-card">
              <div className="product-image">
                {product.trending && <span className="badge-hot">Trending</span>}
                <span className="badge-code">{product.code}</span>
                <ProductImage product={product} />
              </div>
              <div className="product-body">
                <div>
                  <p>{product.categoryName}</p>
                  <h3>{product.name}</h3>
                </div>
                <strong>{settings.currency}{product.price}</strong>
              </div>
              <p className="product-copy">{product.description}</p>
              <div className="chips">
                {[...product.sizes.slice(0, 4), ...product.colors.slice(0, 2)].map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
              <a href={whatsappHref(settings, product)} className="reserve-link">
                Reserve this <MessageCircle size={17} />
              </a>
            </article>
          ))}
        </div>
      </section>

      <section id="blank-tees" className="border-y border-white/10 bg-stone-950">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <div>
            <span className="eyebrow">Blank tee base</span>
            <h2 className="mt-3 text-4xl font-black uppercase leading-none sm:text-6xl">
              Pick the fit. Then pick the print.
            </h2>
            <p className="mt-6 text-lg leading-8 text-stone-300">
              Blank stock can be reserved as-is or used as the base for a custom print. The owner can change sizes, colors, price and availability from admin.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {(blanks.length ? blanks : featured).map((product) => (
              <article key={product.id} className="blank-card">
                <span>{product.code}</span>
                <h3>{product.name}</h3>
                <p>{product.stockStatus}</p>
                <strong>{settings.currency}{product.price}</strong>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="pickup" className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="pickup-panel">
          <Clock3 size={28} />
          <span>Pickup window</span>
          <h2>{settings.shopHours}</h2>
          <p>{settings.pickupNote}</p>
        </div>
        <div className="pickup-panel accent">
          <MapPin size={28} />
          <span>Pickup area</span>
          <h2>{settings.pickupArea}</h2>
          <p>Message on WhatsApp with design code, size and color. We confirm stock before preparing the tee.</p>
        </div>
      </section>

      <footer className="border-t border-white/10 px-4 py-10 text-sm text-stone-400 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <strong className="block text-lg uppercase tracking-[0.18em] text-white">{settings.brandName}</strong>
            <span>{settings.tagline}</span>
          </div>
          <a href="/admin" className="text-stone-500 hover:text-white">Admin</a>
        </div>
      </footer>
    </main>
  );
}
