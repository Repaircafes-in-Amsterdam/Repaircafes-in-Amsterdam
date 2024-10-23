import { GoogleSpreadsheet } from "google-spreadsheet";
import slugify from "slugify";
import saveJSON from "./saveJSON.mjs";
import getAuth from "./getAuth.mjs";

const DATA_FILE_NAME = "festivals.json";
const SPREADSHEET = "1LYn_GX0iwo5IaJCk8wada3FjbwI_gpUprs9prWp0pIQ";
const SHEET_ID = "585183766";

const MULTI_LINE_COLUMNS = ["dates"];

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
  // Add slugs, including the date for recurring festivals
  .map((row) => ({
    ...row,
    slug: `${slugify(row.name).toLowerCase()}-${row.dates[0]}`,
  }))

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

saveJSON(DATA_FILE_NAME, list);
console.log(`Updated data for ${list.length} festival`);
