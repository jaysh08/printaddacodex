import { NextRequest, NextResponse } from "next/server";
import {
  deleteCategory,
  deleteOrder,
  deleteProduct,
  getStoreData,
  saveSettings,
  updateOrderStatus,
  upsertCategory,
  upsertProduct,
} from "@/lib/store";
import type { OrderStatus } from "@/lib/types";

function isAuthed(request: NextRequest) {
  const expected = process.env.ADMIN_PASSWORD || "printadda-admin";
  return request.headers.get("x-admin-password") === expected;
}

export async function GET(request: NextRequest) {
  if (!isAuthed(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(await getStoreData(true));
}

export async function POST(request: NextRequest) {
  if (!isAuthed(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  if (body.action === "saveSettings") {
    await saveSettings(body.settings);
  }
  if (body.action === "saveCategory") {
    await upsertCategory(body.category);
  }
  if (body.action === "deleteCategory") {
    await deleteCategory(Number(body.id));
  }
  if (body.action === "saveProduct") {
    await upsertProduct(body.product);
  }
  if (body.action === "deleteProduct") {
    await deleteProduct(Number(body.id));
  }
  if (body.action === "updateOrderStatus") {
    await updateOrderStatus(Number(body.id), body.status as OrderStatus);
  }
  if (body.action === "deleteOrder") {
    await deleteOrder(Number(body.id));
  }

  return NextResponse.json(await getStoreData(true));
}
