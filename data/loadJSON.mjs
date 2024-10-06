import path from "path";
import { promises as fs } from "fs";
import { dataFolder } from "./constants.mjs";

export default async function loadJSON(fileName) {
  const filePath = path.join(dataFolder, fileName);
  const rawData = await fs.readFile(filePath, "utf8");
  return JSON.parse(rawData);
}
