import saveJSON from "./saveJSON.mjs";

updateData("https://openholidaysapi.org/PublicHolidays?", "holidays-data.json");

updateData(
  "https://openholidaysapi.org/SchoolHolidays?",
  "school-holidays-data.json",
  (list) =>
    // Filter on school holidays for regio Noord
    list.filter((item) =>
      item.subdivisions.some((subdivision) => subdivision.code === "NL-NO"),
    ),
);

async function updateData(url, fileName, transform) {
  const validFrom = new Date().toISOString().split("T")[0];

  const date = new Date();
  date.setFullYear(date.getFullYear() + 2);
  const validTo = date.toISOString().split("T")[0];

  const country = "NL";

  const params = new URLSearchParams({
    validFrom,
    validTo,
    countryIsoCode: country,
    languageIsoCode: country,
  });

  const response = await fetch(url + params.toString());
  const list = await response.json();
  const transformedList = transform ? transform(list) : list;
  saveJSON(fileName, transformedList);
}
