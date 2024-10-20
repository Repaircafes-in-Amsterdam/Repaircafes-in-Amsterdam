import path from "path";
import { promises as fs } from "fs";
import { dataFolder } from "./constants.mjs";

export default async function saveJSON(fileName, data) {
  const filePath = path.join(dataFolder, fileName);
  const jsonData = JSON.stringify(data, null, 2);
  await fs.writeFile(filePath, jsonData, "utf8");
}
