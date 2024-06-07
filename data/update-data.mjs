import nextEnv from "@next/env";
const { loadEnvConfig } = nextEnv;
import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import path from "path";
import { promises as fs } from "fs";
import { fileURLToPath } from "url";
import slugify from "slugify";
import saveJSON from "./saveJSON.mjs";

const DATA_FILE_NAME = "data.json";
const MAP_DATA_FILE_NAME = "map-data.json";
const MANUAL_MAP_DATA_FILE_NAME = "manual-map-data.json";
const SPREADSHEET = "1LYn_GX0iwo5IaJCk8wada3FjbwI_gpUprs9prWp0pIQ";
const SHEET_ID = "1724498670";
const LINK_COLUMNS = ["orgPage", "website", "facebook", "instagram"];
const MULTI_LINE_COLUMNS = [
  "closedRanges",
  "exceptions",
  "rrule",
  "startTime",
  "endTime",
];

// Prepare map data from repaircafe.org for reading by link
const mapData = await loadJSON(MAP_DATA_FILE_NAME);
const mapDataByLink = new Map();
for (const item of mapData) {
  mapDataByLink.set(item.link, item);
}

// Load manually looked up coordinates per address
const manualMapData = await loadJSON(MANUAL_MAP_DATA_FILE_NAME);

// Authenticate with google
const projectDir = process.cwd();
loadEnvConfig(projectDir);
const { GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY } = process.env;
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
      const cleanedValue = value?.trim();
      if (LINK_COLUMNS.includes(column)) {
        if (cleanedValue) links[column] = cleanedValue;
      } else {
        filtered[column] = cleanedValue;
      }
    }
    if (Object.keys(links).length > 0) filtered.links = links;
    return filtered;
  })
  // Add slugs
  .map((row) => ({ ...row, slug: slugify(row.name).toLowerCase() }))
  // Turn verified into boolean
  .map((row) => ({ ...row, verified: row.verified === "TRUE" }))
  // Split multi line items into an arrays
  // split values of keys in MULTI_LINE_COLUMNS from multiple lines into array
  // .map((row) => {
  //   const filtered = {};
  //   for (const [column, value] of Object.entries(row)) {
  //     if (MULTI_LINE_COLUMNS.includes(column)) {
  //       if (value) {
  //         filtered[column] = value.split("\n").filter(Boolean);
  //       }
  //     } else {
  //       filtered[column] = value;
  //     }
  //   }
  //   return filtered;
  // }
  // split values of keys in MULTI_LINE_COLUMNS from multiple lines into array using Object.entries
  // .map((row) => (
  //   Object.entries(row).reduce((acc, [column, value]) => {
  //     if (MULTI_LINE_COLUMNS.includes(column)) {
  //       if (value) {
  //         acc[column] = value.split("\n").filter(Boolean);
  //       }
  //     } else {
  //       acc[column] = value;
  //     }
  //     return acc;
  //   }, {})
  // ))
  // split values of keys in MULTI_LINE_COLUMNS from multiple lines into array using Object.entries and Object.fromEntries
  // .map((row) => (
  //   Object.fromEntries(
  //     Object.entries(row).map(([column, value]) => {
  //       if (MULTI_LINE_COLUMNS.includes(column)) {
  //         if (value) {
  //           return [column, value.split("\n").filter(Boolean)];
  //         }
  //       }
  //       return [column, value];
  //     })
  //   )
  // ))
  .map((row) =>
    Object.fromEntries(
      Object.entries(row).map(([column, value]) =>
        MULTI_LINE_COLUMNS.includes(column)
          ? [column, value.split("\n").filter(Boolean)]
          : [column, value],
      ),
    ),
  )
  // .map((row) => ({
  //   ...row,
  //   closedRanges: row.closedRanges?.split("\n").filter(Boolean),
  //   exceptions: row.exceptions?.split("\n").filter(Boolean),
  // }))
  // Pull in coordinates from our manual map data or repaircafe.org map data
  // Save addresses without coordinates to manual map data
  .map((row) => {
    const orgPage = row.links?.orgPage;
    let coordinate = manualMapData[row.address];

    if (!coordinate) {
      if (orgPage) {
        // Remove trailing /
        const orgPageCleaned = orgPage.replace(/\/$/, "");
        const item = mapDataByLink.get(orgPageCleaned);
        if (item) {
          coordinate = item.coordinate?.split(",")?.map(Number);
        }
      }

      if (!coordinate) {
        manualMapData[row.address] = [];
      }
    }

    return {
      ...row,
      ...(coordinate ? { coordinate } : {}),
    };
  });

// Save updated manual map data
saveJSON(MANUAL_MAP_DATA_FILE_NAME, manualMapData);

const missingCoordinatesCount = Object.values(manualMapData).filter(
  (coordinates) => coordinates.length === 0,
).length;
console.log(`Missing coordinates for ${missingCoordinatesCount} addresses`);

saveJSON(DATA_FILE_NAME, list);
console.log(`Updated data for ${list.length} Repair Cafés`);

async function loadJSON(fileName) {
  const dataFolder = path.dirname(fileURLToPath(import.meta.url));
  const filePath = path.join(dataFolder, fileName);
  const rawData = await fs.readFile(filePath, "utf8");
  return JSON.parse(rawData);
}
