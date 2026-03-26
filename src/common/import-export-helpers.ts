import archiver from "archiver";
import Handlebars from "handlebars";

import fs from "fs";
import path from "path";
import util from "util";

import { SupersetClient } from "./superset-client.js";

import { getTranslations } from "../common/localizations.js";
import { DashboardsConfigMap } from "../config/dashboards-config-map.js";
import Config from "../config/index.js";
import log from "../config/logging.js";

// NOTE: This file is only used by the scripts in the tools/ directory.

const passwords = Config.CLICKHOUSE_PASSWORD
  ? `{"databases/ClickHouse.yaml": "${Config.CLICKHOUSE_PASSWORD}"}`
  : null;
const dashboardsConfigMap = new DashboardsConfigMap();
const supersetClient = new SupersetClient();

export async function importAssets(directoryPath: string) {
  const dirName = path.parse(directoryPath).name;
  const zipFilePath = `/tmp/reports-${dirName}.zip`;

  log.info(`Zipping: ${directoryPath}.`);
  await zipDirectory(directoryPath, zipFilePath);

  log.info(passwords);

  // Import the populated assets.
  await supersetClient.importAssets(zipFilePath, passwords);
  log.info(`Imported assets: ${dirName}.`);
}

// Zips the input directory path into the output file path.
export async function zipDirectory(
  inputDirPath: string,
  outputFilePath: string,
) {
  const output = fs.createWriteStream(outputFilePath);
  const archive = archiver("zip");

  output.on("close", function () {
    log.debug(
      "Archiver has been finalized and the output file descriptor has closed.",
    );
  });

  // Treat warnings as errors.
  archive.on("warning", function (err: any) {
    if (err.code === "ENOENT") {
      log.error(err);
    } else {
      throw err;
    }
  });

  // Good practice to catch this error explicitly.
  archive.on("error", function (err: any) {
    throw err;
  });

  // Pipe archive data to the file.
  archive.pipe(output);

  // Add the whole target directory.
  archive.directory(inputDirPath, "dashboards");
  await archive.finalize();
}

export function transformYaml(
  pathFormat: string,
  stringsJson: any,
  locale: string,
) {
  const inputPath = util.format(pathFormat, "template");
  const yamlFiles = fs.readdirSync(inputPath);

  yamlFiles.forEach((yamlFile) => {
    const outputPath = util.format(pathFormat, locale);
    const inputFile = `${inputPath}/${yamlFile}`;
    const outputFile = `${outputPath}/${yamlFile}`;

    try {
      const templateString = fs.readFileSync(inputFile).toString();
      const translations = getTranslations(locale);

      // If this is a dashboard, get the config and replace it.
      const dashboardConfig = dashboardsConfigMap.getDashboardLocaleConfig(
        yamlFile,
        locale,
        false,
      );

      if (
        yamlFile == "Mobile_Dashboard_template_27.yaml" ||
        yamlFile == "Onsite_Dashboard_template_44.yaml"
      ) {
        if (!dashboardConfig) {
          throw new Error("yamlFile is empty");
        }
      }

      // Replace the dashboard UUID with a new one.
      if (dashboardConfig) {
        translations.dashboard_uuid = dashboardConfig?.stableUUID;
        translations.dashboard_title = `${dashboardConfig?.title} (${locale})`;
        translations.clickhouse_url = Config.CLICKHOUSE_URL;
      }

      const template = Handlebars.compile(templateString);
      const contents = template(translations);

      fs.mkdir(path.dirname(outputFile), { recursive: true }, function (err) {
        if (err) {
          log.error(`Error creating directory ${path.dirname(outputFile)}`);
        }

        fs.writeFile(outputFile, contents, (err) => {
          if (err) {
            log.error(`Error writing to file ${outputFile}`);
          }
        });
      });
    } catch (error) {
      log.error(`An error occured while processing translations: ${error}`);
    }

    // Make the output path if it doesn't exist.
    fs.mkdirSync(outputPath, { recursive: true });

    // TODO: Write the substituted YAML file to the output directory.
    fs.copyFileSync(inputFile, outputFile);

    log.info(`${inputFile} was copied for ${locale}}`);
  });
}

export function replaceQuotedHandlebarTemplatesInFile(
  inFilePath: string,
  outFilePath: string,
) {
  const data = fs.readFileSync(inFilePath, "utf8");

  // Could improve on this, but this a script.
  let result = data.replace(/'{{{\[([^\]]*)\]}}}'/g, "{{{[$1]}}}");
  result = result.replace(/(uuid: .*\n)/, "uuid: {{{[dashboard_uuid]}}}\n");
  result = result.replace(
    /(dashboard_title: .*\n)/,
    "dashboard_title: {{{[dashboard_title]}}}\n",
  );

  fs.writeFileSync(outFilePath, result, "utf8");
}
