import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { parseAsync } from "json2csv";
import { RC } from "@/app/types";

let cachedData: RC[] = [];
let lastModified: number = 0;

const fields: (keyof RC)[] = [
  "name",
  "slug",
  "rrule",
  "startTime",
  "endTime",
  "address",
  "district",
  "email",
  "socials",
];

export async function GET() {
  // Path to the JSON file
  const filePath = path.join(process.cwd(), "data", "data", "cafes.json");

  try {
    const stats = await fs.stat(filePath);

    if (!cachedData || stats.mtimeMs > lastModified) {
      const fileContents = await fs.readFile(filePath, "utf8");
      cachedData = JSON.parse(fileContents);
      lastModified = stats.mtimeMs;
    }
    const csv = await parseAsync(cachedData, { fields });

    const headers = {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=cafes.csv",
    };

    // Return the CSV data as a response
    return new NextResponse(csv, { headers });
  } catch (error) {
    console.error("Error reading cafes.json:", error);
    return NextResponse.json(
      { error: "Failed to load cafe data" },
      { status: 500 },
    );
  }
}
