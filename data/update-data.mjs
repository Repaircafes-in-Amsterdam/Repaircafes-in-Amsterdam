import nextEnv from "@next/env";
const { loadEnvConfig } = nextEnv;
import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import path from "path";
import { promises as fs } from "fs";
import { fileURLToPath } from "url";
import slugify from "slugify";

const DATA_FILE_NAME = "data.json";
const SPREADSHEET = "1LYn_GX0iwo5IaJCk8wada3FjbwI_gpUprs9prWp0pIQ";
const SHEET_ID = "1724498670";
const LINK_COLUMNS = ["orgPage", "website", "facebook", "instagram"];

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataFilePath = path.join(__dirname, DATA_FILE_NAME);
const projectDir = process.cwd();

loadEnvConfig(projectDir);
const { GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY } = process.env;

// Initialize auth
// See https://theoephraim.github.io/node-google-spreadsheet/#/guides/authentication
const serviceAccountAuth = new JWT({
  email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: GOOGLE_PRIVATE_KEY,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const doc = new GoogleSpreadsheet(SPREADSHEET, serviceAccountAuth);
await doc.loadInfo(); // loads document properties and worksheets
const sheet = doc.sheetsById[SHEET_ID];
const rows = await sheet.getRows();
const list = rows
  .map((row) => row.toObject())
  // Move the link columns into a links object
  .map((row) => {
    const filtered = {};
    const links = {};
    for (const [column, value] of Object.entries(row)) {
      if (LINK_COLUMNS.includes(column)) {
        if (value) links[column] = value;
      } else {
        filtered[column] = value;
      }
    }
    if (Object.keys(links).length > 0) filtered.links = links;
    return filtered;
  })
  // Add slugs
  .map((row) => ({ ...row, slug: slugify(row.name).toLowerCase() }));
console.log("list: ", list);
const jsonData = JSON.stringify(list, null, 2);
await fs.writeFile(dataFilePath, jsonData, "utf8");
console.log("Data saved successfully.");
