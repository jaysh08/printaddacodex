import type { Product, SiteSettings } from "./types";

export function whatsappHref(settings: SiteSettings, product?: Product) {
  const phone = settings.whatsappNumber.replace(/[^\d]/g, "");
  const message = product
    ? `Hi ${settings.brandName}, I want to reserve ${product.name} (${product.code}). Size: __, Color: __. Pickup from ${settings.pickupArea}.`
    : `Hi ${settings.brandName}, I want to reserve a tee/custom print. Pickup from ${settings.pickupArea}.`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
