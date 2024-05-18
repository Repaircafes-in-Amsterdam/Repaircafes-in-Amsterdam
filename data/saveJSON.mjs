import path from "path";
import { fileURLToPath } from "url";
import { promises as fs } from "fs";

export default async function saveJSON(fileName, data) {
  const dataFolder = path.dirname(fileURLToPath(import.meta.url));
  const filePath = path.join(dataFolder, fileName);
  const jsonData = JSON.stringify(data, null, 2);
  await fs.writeFile(filePath, jsonData, "utf8");
}
