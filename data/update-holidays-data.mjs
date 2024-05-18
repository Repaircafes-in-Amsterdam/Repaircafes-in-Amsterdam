import saveJSON from "./saveJSON.mjs";

const DATA_FILE_NAME = "holidays-data.json";

const validFrom = new Date().toISOString().split("T")[0];

const date = new Date();
date.setFullYear(date.getFullYear() + 1);
const validTo = date.toISOString().split("T")[0];

const country = "NL";

const params = new URLSearchParams({
  validFrom,
  validTo,
  countryIsoCode: country,
  languageIsoCode: country,
});

const response = await fetch(
  "https://openholidaysapi.org/PublicHolidays?" + params.toString(),
);

const list = await response.json();

saveJSON(DATA_FILE_NAME, list);
