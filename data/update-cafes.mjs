import { GoogleSpreadsheet } from "google-spreadsheet";
import slugify from "slugify";
import saveJSON from "./saveJSON.mjs";
import loadJSON from "./loadJSON.mjs";
import getAuth from "./getAuth.mjs";

const DATA_FILE_NAME = "cafes.json";
const MAP_DATA_FILE_NAME = "map-data.json";
const MANUAL_MAP_DATA_FILE_NAME = "manual-map-data.json";
const SPREADSHEET = "1LYn_GX0iwo5IaJCk8wada3FjbwI_gpUprs9prWp0pIQ";
const SHEET_ID = "1724498670";
const COLUMNS_TO_NEST = {
  links: ["website", "orgPage", "otherLinks"],
  socials: ["instagram", "facebook"],
};
const MULTI_LINE_COLUMNS = [
  "closedRanges",
  "exceptions",
  "rrule",
  "startTime",
  "endTime",
  "otherLinks",
];

// Prepare map data from repaircafe.org for reading by link
const mapData = await loadJSON(MAP_DATA_FILE_NAME);
const mapDataByLink = new Map();
for (const item of mapData) {
  mapDataByLink.set(item.link, item);
}

// Load manually looked up coordinates per address
const manualMapData = await loadJSON(MANUAL_MAP_DATA_FILE_NAME);

const doc = new GoogleSpreadsheet(SPREADSHEET, getAuth());
await doc.loadInfo(); // loads document properties and worksheets
const sheet = doc.sheetsById[SHEET_ID];
const rows = await sheet.getRows();
const list = rows
  .map((row) => row.toObject())
  // Trim all values
  .map((row) =>
    Object.fromEntries(
      Object.entries(row).map(([column, value]) => [column, value.trim()]),
    ),
  )
  // Split multi line items into an arrays
  .map((row) =>
    Object.fromEntries(
      Object.entries(row).map(([column, value]) =>
        MULTI_LINE_COLUMNS.includes(column)
          ? [column, value.split("\n").filter(Boolean)]
          : [column, value],
      ),
    ),
  )
  // Move the link and social columns into nested objects
  .map((row) =>
    Object.entries(row).reduce((acc, [column, value]) => {
      const nestedEntry = Object.entries(COLUMNS_TO_NEST).find(([, columns]) =>
        columns.includes(column),
      );
      if (nestedEntry) {
        if (
          value &&
          (!Array.isArray(value) || (Array.isArray(value) && value.length > 0))
        ) {
          const [key] = nestedEntry;
          acc[key] = { ...(acc[key] || {}), [column]: value };
        }
      } else {
        acc[column] = value;
      }

      return acc;
    }, {}),
  )
  // Add slugs
  .map((row) => ({ ...row, slug: slugify(row.name).toLowerCase() }))
  // Turn verified into boolean
  .map((row) => ({ ...row, verified: row.verified === "TRUE" }))
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
  })
  // Nest multilingual columns into objects under one field
  .map((item) => {
    const transformedItem = {};

    // Iterate through each key in the object
    for (const key in item) {
      if (!item.hasOwnProperty(key)) continue;
      const [locale, fieldName] = key.split(":");
      const value = item[key];

      // Check if the key is prefixed with a locale (like 'nl', 'en')
      if (fieldName) {
        // Initialize the field if it doesn't exist
        if (!transformedItem[fieldName]) {
          transformedItem[fieldName] = {};
        }
        // Set the locale translation
        transformedItem[fieldName][locale] = value;
      } else {
        // Copy the field as is if it's not locale-prefixed
        transformedItem[key] = value;
      }
    }

    return transformedItem;
  });

// Save updated manual map data
saveJSON(MANUAL_MAP_DATA_FILE_NAME, manualMapData);

const missingCoordinatesCount = Object.values(manualMapData).filter(
  (coordinates) => coordinates.length === 0,
).length;
console.log(`Missing coordinates for ${missingCoordinatesCount} addresses`);

saveJSON(DATA_FILE_NAME, list);
console.log(`Updated data for ${list.length} Repair Cafés`);
