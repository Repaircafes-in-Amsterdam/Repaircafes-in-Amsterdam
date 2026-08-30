import { NextResponse } from "next/server";
import data from "@/data/data/cafes.json";
import { RC } from "@/app/types";

export function GET() {
  return NextResponse.json(data as RC[]);
}
