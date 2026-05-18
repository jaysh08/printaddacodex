import { NextResponse } from "next/server";
import { getStoreData } from "@/lib/store";

export async function GET() {
  const data = await getStoreData(false);
  return NextResponse.json(data);
}
