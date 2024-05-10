import path from "path";
import { promises as fs } from "fs";
import { fileURLToPath } from "url";

const DATA_FILE_NAME = "map-data.json";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataFilePath = path.join(__dirname, DATA_FILE_NAME);

const response = await fetch(
  "https://www.repaircafe.org/wp-json/v1/map?northeast=52.42972404904461,5.023339855477786&southwest=52.284119533864214,4.72238411160501",
);

const list = await response.json();

const jsonData = JSON.stringify(list, null, 2);

await fs.writeFile(dataFilePath, jsonData, "utf8");
console.log(`Updated map data from repaircafe.org`);
