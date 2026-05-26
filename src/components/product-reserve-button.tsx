"use client";

import { useState } from "react";
import { Loader2, MessageCircle, X } from "lucide-react";
import type { Product, SiteSettings } from "@/lib/types";

type ProductReserveButtonProps = {
  product: Product;
  settings: SiteSettings;
};

export function ProductReserveButton({ product, settings }: ProductReserveButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    size: product.sizes[0] ?? "",
    color: product.colors[0] ?? "",
    notes: "",
  });

  async function reserve() {
    setLoading(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          orderType: "catalogue",
          productId: product.id,
          productName: product.name,
          productCode: product.code,
          categoryName: product.categoryName,
          price: product.price,
          ...form,
        }),
      });
      if (!response.ok) {
        throw new Error("Could not save order.");
      }
      const result = (await response.json()) as { whatsappUrl: string };
      window.open(result.whatsappUrl, "_blank", "noopener,noreferrer");
      setOpen(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="reserve-link w-[calc(100%-36px)]">
        Reserve this <MessageCircle size={17} />
      </button>

      {open ? (
        <div className="reserve-modal-backdrop" role="dialog" aria-modal="true">
          <div className="reserve-modal">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-stone-500">Save order first</p>
                <h3 className="mt-1 text-2xl font-black uppercase text-black">{product.name}</h3>
                <p className="mt-1 text-sm text-stone-600">
                  {product.code} · {settings.currency}
                  {product.price}
                </p>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="grid size-9 place-items-center border border-stone-300 text-black">
                <X size={18} />
              </button>
            </div>

            <div className="mt-5 grid gap-3">
              <label className="reserve-field">
                Name
                <input value={form.customerName} onChange={(event) => setForm({ ...form, customerName: event.target.value })} placeholder="Customer name" />
              </label>
              <label className="reserve-field">
                Phone
                <input value={form.customerPhone} onChange={(event) => setForm({ ...form, customerPhone: event.target.value })} placeholder="Optional phone number" />
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="reserve-field">
                  Size
                  <select value={form.size} onChange={(event) => setForm({ ...form, size: event.target.value })}>
                    <option value="">Select later</option>
                    {product.sizes.map((size) => (
                      <option key={size}>{size}</option>
                    ))}
                  </select>
                </label>
                <label className="reserve-field">
                  Color
                  <select value={form.color} onChange={(event) => setForm({ ...form, color: event.target.value })}>
                    <option value="">Select later</option>
                    {product.colors.map((color) => (
                      <option key={color}>{color}</option>
                    ))}
                  </select>
                </label>
              </div>
              <label className="reserve-field">
                Notes
                <textarea value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} placeholder="Any pickup or print notes" />
              </label>
            </div>

            <button type="button" onClick={reserve} disabled={loading} className="mt-5 flex h-12 w-full items-center justify-center gap-2 bg-black text-xs font-black uppercase tracking-[0.14em] text-white disabled:opacity-60">
              {loading ? <Loader2 className="animate-spin" size={18} /> : <MessageCircle size={18} />}
              Save order and open WhatsApp
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
