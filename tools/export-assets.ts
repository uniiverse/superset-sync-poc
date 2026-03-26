import jszip from "jszip";

import fs from "fs";
import path from "path";

import { replaceQuotedHandlebarTemplatesInFile } from "../src/common/import-export-helpers";
import { SupersetClient } from "../src/common/superset-client";
import log from "../src/config/logging";

const supersetClient = new SupersetClient();

// Only match certain dashboards.
const INCLUDED_DASHBOARD_NAMES = [
  "Account_Dashboard_template_14",
  "Mobile_Dashboard_template_27",
  "Onsite_Dashboard_template_44",
];

const TMP_PATH = "tmp-exports";
const ASSETS_PATH = `${TMP_PATH}/assets.zip`;

// Include charts, dashboards, databases, and datasets (not queries, or other superset objects).
const ASSETS_REGEX = new RegExp(
  "(?:/(charts|dashboards|databases|datasets)/(.*))",
  "i",
);

const extractTemplateDashboards = async () => {
  const fileContent = fs.readFileSync(ASSETS_PATH);

  const res = await jszip.loadAsync(fileContent);
  const keys = Object.keys(res.files);

  let assetsExportPath = "";

  for (const key of keys) {
    log.debug(key);

    if (ASSETS_REGEX.test(key) && !res.files[key].dir) {
      const item = res.files[key];

      const isDashboard = item.name.includes("dashboards");
      const itemPath = `${TMP_PATH}/${item.name}`;

      // item.name includes a root path, like "assets_export_20231128T183328", keep track of this.
      assetsExportPath = item.name.split("/")[0];

      // Skip any non-included dashboards.
      if (isDashboard) {
        if (
          !INCLUDED_DASHBOARD_NAMES.some((name) => item.name.includes(name))
        ) {
          log.debug(`Skipping ${item.name}`);
          continue;
        } else {
          log.debug(`Including ${item.name}`);
        }
      }

      if (!fs.existsSync(path.dirname(itemPath))) {
        fs.mkdirSync(path.dirname(itemPath), { recursive: true });
      }

      fs.writeFileSync(itemPath, Buffer.from(await item.async("arraybuffer")));

      if (isDashboard) {
        // Replace quoted handlebar templates when writing dashboards.
        replaceQuotedHandlebarTemplatesInFile(itemPath, itemPath);
      }
    }
  }

  const rootAssetsExportPath = `${TMP_PATH}/${assetsExportPath}`;

  // Once all of the assets have been written, copy the assets from the export folder to the dashboards/template folder.
  fs.cpSync(rootAssetsExportPath, "dashboards/template", {
    recursive: true,
  });
};

if (!fs.existsSync(TMP_PATH)) {
  fs.mkdirSync(TMP_PATH, { recursive: true });
}

supersetClient.exportAssets(ASSETS_PATH).then(async () => {
  // TODO: Edit the metadata.xml file so that "type: assets" is set. Otherwise it can't be imported as assets.
  log.info("Exported assets.");

  await extractTemplateDashboards();
  log.info("Extracted template dashboard.");

  fs.rmSync(TMP_PATH, { recursive: true, force: true });
  log.info("Cleaned up temp files.");
});
