import fs from "fs";
import path from "path";

import { transformYaml } from "../src/common/import-export-helpers";
import log, { debugLogConfig } from "../src/config/logging";

const datasetsFormat = "dashboards/%s/datasets/ClickHouse";
const dashboardsFormat = "dashboards/%s/dashboards";
const databasesFormat = "dashboards/%s/databases";
const chartsFormat = "dashboards/%s/charts";
const localesPath = "src/translations/locales";

debugLogConfig(log);

const stringsFiles = fs.readdirSync(localesPath);
log.info(`Processing locales for string files:
  ${stringsFiles}.`);

// Build each localized dashboard from the base (en) dashboard.
stringsFiles.forEach((stringsFile) => {
  const locale = path.parse(stringsFile).name;

  // Read the JSON file into an object.
  const stringsJsonText = fs.readFileSync(
    `${localesPath}/${stringsFile}`,
    "utf8",
  );
  const stringsJson = JSON.parse(stringsJsonText);

  // Substitute each string in each template chart, dashboard, dataset, and database.
  transformYaml(dashboardsFormat, stringsJson, locale);
  transformYaml(databasesFormat, stringsJson, locale);
  transformYaml(datasetsFormat, stringsJson, locale);
  transformYaml(chartsFormat, stringsJson, locale);

  // Copy the metadata file.
  fs.copyFileSync(
    "dashboards/template/metadata.yaml",
    `dashboards/${locale}/metadata.yaml`,
  );

  log.info(`Processed ${stringsFile}.`);
});
