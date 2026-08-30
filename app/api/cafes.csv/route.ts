import { NextRequest, NextResponse } from "next/server";
import data from "@/data/data/cafes.json";
import { RC } from "@/app/types";
import { cafesToCsv } from "@/app/utils/cafesToCsv";

export function GET(request: NextRequest) {
  const lang = request.nextUrl.searchParams.get("lang");
  const csv = cafesToCsv(data as RC[], { lang });
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="cafes.csv"',
    },
  });
}
