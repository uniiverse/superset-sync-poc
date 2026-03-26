import fs from "fs";
import path from "path";

import { importAssets } from "../src/common/import-export-helpers";
import Config from "../src/config";
import log, { debugLogConfig } from "../src/config/logging";

debugLogConfig(log);

if (!Config.CLICKHOUSE_PASSWORD) {
  log.error("CLICKHOUSE_PASSWORD must be set.");
  process.exit(1);
}

const localesPath = "src/translations/locales";
const stringsFiles = fs.readdirSync(localesPath);

for (const stringsFile of stringsFiles) {
  const locale = path.parse(stringsFile).name;
  log.info(`Importing assets for locale: ${locale}.`);
  await importAssets(`dashboards/${locale}`);
}
