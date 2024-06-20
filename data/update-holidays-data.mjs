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
  const cleanedList = transformedList.map((item) => {
    // Add a day to the end date to make it include the end date
    const endDate = new Date(item.endDate);
    endDate.setDate(endDate.getDate() + 1);

    const name = item.name[0].text;
    if (name === "Koningsdag" && item.startDate === "2025-04-27") {
      item.startDate = item.endDate = "2025-04-26";
    }

    return {
      name,
      startDate: item.startDate,
      endDate: item.endDate,
      startTime: new Date(item.startDate).getTime(),
      endTime: endDate.getTime(),
    };
  });
  saveJSON(fileName, cleanedList);
}
