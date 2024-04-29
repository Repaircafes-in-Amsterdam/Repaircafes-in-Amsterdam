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
  .map(({ orgPage, website, facebook, instagram, ...other }) => ({
    ...other,
    slug: slugify(other.name).toLowerCase(),
    links: {
      orgPage,
      website,
      facebook,
      instagram,
    },
  }));

const jsonData = JSON.stringify(list, null, 2);
await fs.writeFile(dataFilePath, jsonData, "utf8");
console.log("Data saved successfully.");
