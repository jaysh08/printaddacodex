import { NextRequest, NextResponse } from "next/server";
import { createOrder, getStoreData } from "@/lib/store";
import type { OrderInput } from "@/lib/types";

function cleanPhone(value: string) {
  return value.replace(/[^\d]/g, "");
}

function trimText(value: unknown, max = 500) {
  return String(value ?? "").trim().slice(0, max);
}

function limitPreview(value: unknown) {
  const preview = trimText(value, 1_200_000);
  return preview.startsWith("data:image/") ? preview : "";
}

function buildMessage(brandName: string, pickupArea: string, input: OrderInput, orderCode: string) {
  if (input.orderType === "custom") {
    return [
      `Hi ${brandName}, I want to reserve a custom print.`,
      `Order code: ${orderCode}`,
      `Artwork name: ${input.artworkName || "not named yet"}`,
      `Placement: ${input.placement || "Front"}`,
      `T-shirt color: ${input.shirtColor || "Not selected"}`,
      `Print size: ${input.printSize || 0}%`,
      `Crop zoom: ${input.cropZoom || 0}%`,
      `Position: X ${input.positionX || 0}, Y ${input.positionY || 0}`,
      input.customerName ? `Name: ${input.customerName}` : "",
      input.customerPhone ? `Phone: ${input.customerPhone}` : "",
      input.notes ? `Notes: ${input.notes}` : "",
      `Pickup from ${pickupArea}.`,
      "I will send the original artwork image in this chat.",
    ]
      .filter(Boolean)
      .join("\n");
  }

  return [
    `Hi ${brandName}, I want to reserve this item.`,
    `Order code: ${orderCode}`,
    `Product: ${input.productName || "Catalogue item"} (${input.productCode || "No code"})`,
    input.size ? `Size: ${input.size}` : "Size: __",
    input.color ? `Color: ${input.color}` : "Color: __",
    input.customerName ? `Name: ${input.customerName}` : "",
    input.customerPhone ? `Phone: ${input.customerPhone}` : "",
    input.notes ? `Notes: ${input.notes}` : "",
    `Pickup from ${pickupArea}.`,
  ]
    .filter(Boolean)
    .join("\n");
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { settings } = await getStoreData(false);

  const input: OrderInput = {
    orderType: body.orderType === "custom" ? "custom" : "catalogue",
    productId: body.productId ? Number(body.productId) : null,
    productName: trimText(body.productName, 160),
    productCode: trimText(body.productCode, 80),
    categoryName: trimText(body.categoryName, 120),
    price: Number(body.price ?? 0),
    customerName: trimText(body.customerName, 120),
    customerPhone: trimText(body.customerPhone, 40),
    size: trimText(body.size, 40),
    color: trimText(body.color, 80),
    placement: trimText(body.placement, 80),
    shirtColor: trimText(body.shirtColor, 80),
    artworkName: trimText(body.artworkName, 160),
    artworkPreview: limitPreview(body.artworkPreview),
    printSize: Number(body.printSize ?? 0),
    cropZoom: Number(body.cropZoom ?? 0),
    positionX: Number(body.positionX ?? 0),
    positionY: Number(body.positionY ?? 0),
    notes: trimText(body.notes, 600),
  };

  const whatsappMessage = buildMessage(
    settings.brandName,
    settings.pickupArea,
    input,
    "{{ORDER_CODE}}",
  );

  const order = await createOrder({
    ...input,
    productId: input.productId ?? null,
    whatsappMessage,
  });
  const whatsappUrl = `https://wa.me/${cleanPhone(settings.whatsappNumber)}?text=${encodeURIComponent(
    order.whatsappMessage,
  )}`;

  return NextResponse.json({ order, whatsappUrl });
}
