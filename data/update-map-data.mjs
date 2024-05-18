import saveJSON from "./saveJSON.mjs";

const DATA_FILE_NAME = "map-data.json";

const response = await fetch(
  "https://www.repaircafe.org/wp-json/v1/map?northeast=52.42972404904461,5.023339855477786&southwest=52.284119533864214,4.72238411160501",
);

const list = await response.json();

saveJSON(DATA_FILE_NAME, list);
