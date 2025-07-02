import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { RC } from "../../../types";

let cachedData: RC[] = [];
let lastModified: number = 0;

export async function GET() {
  const filePath = path.join(process.cwd(), "data", "data", "cafes.json");

  try {
    const stats = await fs.stat(filePath);

    if (!cachedData || stats.mtimeMs > lastModified) {
      const fileContents = await fs.readFile(filePath, "utf8");
      cachedData = JSON.parse(fileContents);
      lastModified = stats.mtimeMs;
    }

    return NextResponse.json(cachedData);
  } catch (error) {
    console.error("Error reading cafes.json:", error);
    return NextResponse.json(
      { error: "Failed to load cafe data" },
      { status: 500 },
    );
  }
}
