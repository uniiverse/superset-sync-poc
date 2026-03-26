function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _async_to_generator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
function _ts_generator(thisArg, body) {
    var f, y, t, g, _ = {
        label: 0,
        sent: function() {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    };
    return g = {
        next: verb(0),
        "throw": verb(1),
        "return": verb(2)
    }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
    }), g;
    function verb(n) {
        return function(v) {
            return step([
                n,
                v
            ]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(_)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
}
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
var passwords = Config.CLICKHOUSE_PASSWORD ? '{"databases/ClickHouse.yaml": "'.concat(Config.CLICKHOUSE_PASSWORD, '"}') : null;
var dashboardsConfigMap = new DashboardsConfigMap();
var supersetClient = new SupersetClient();
export function importAssets(directoryPath) {
    return _importAssets.apply(this, arguments);
}
function _importAssets() {
    _importAssets = _async_to_generator(function(directoryPath) {
        var dirName, zipFilePath;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    dirName = path.parse(directoryPath).name;
                    zipFilePath = "/tmp/reports-".concat(dirName, ".zip");
                    log.info("Zipping: ".concat(directoryPath, "."));
                    return [
                        4,
                        zipDirectory(directoryPath, zipFilePath)
                    ];
                case 1:
                    _state.sent();
                    log.info(passwords);
                    // Import the populated assets.
                    return [
                        4,
                        supersetClient.importAssets(zipFilePath, passwords)
                    ];
                case 2:
                    _state.sent();
                    log.info("Imported assets: ".concat(dirName, "."));
                    return [
                        2
                    ];
            }
        });
    });
    return _importAssets.apply(this, arguments);
}
// Zips the input directory path into the output file path.
export function zipDirectory(inputDirPath, outputFilePath) {
    return _zipDirectory.apply(this, arguments);
}
function _zipDirectory() {
    _zipDirectory = _async_to_generator(function(inputDirPath, outputFilePath) {
        var output, archive;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    output = fs.createWriteStream(outputFilePath);
                    archive = archiver("zip");
                    output.on("close", function() {
                        log.debug("Archiver has been finalized and the output file descriptor has closed.");
                    });
                    // Treat warnings as errors.
                    archive.on("warning", function(err) {
                        if (err.code === "ENOENT") {
                            log.error(err);
                        } else {
                            throw err;
                        }
                    });
                    // Good practice to catch this error explicitly.
                    archive.on("error", function(err) {
                        throw err;
                    });
                    // Pipe archive data to the file.
                    archive.pipe(output);
                    // Add the whole target directory.
                    archive.directory(inputDirPath, "dashboards");
                    return [
                        4,
                        archive.finalize()
                    ];
                case 1:
                    _state.sent();
                    return [
                        2
                    ];
            }
        });
    });
    return _zipDirectory.apply(this, arguments);
}
export function transformYaml(pathFormat, stringsJson, locale) {
    var inputPath = util.format(pathFormat, "template");
    var yamlFiles = fs.readdirSync(inputPath);
    yamlFiles.forEach(function(yamlFile) {
        var outputPath = util.format(pathFormat, locale);
        var inputFile = "".concat(inputPath, "/").concat(yamlFile);
        var outputFile = "".concat(outputPath, "/").concat(yamlFile);
        try {
            var templateString = fs.readFileSync(inputFile).toString();
            var translations = getTranslations(locale);
            // If this is a dashboard, get the config and replace it.
            var dashboardConfig = dashboardsConfigMap.getDashboardLocaleConfig(yamlFile, locale, false);
            if (yamlFile == "Mobile_Dashboard_template_27.yaml" || yamlFile == "Onsite_Dashboard_template_44.yaml") {
                if (!dashboardConfig) {
                    throw new Error("yamlFile is empty");
                }
            }
            // Replace the dashboard UUID with a new one.
            if (dashboardConfig) {
                translations.dashboard_uuid = dashboardConfig === null || dashboardConfig === void 0 ? void 0 : dashboardConfig.stableUUID;
                translations.dashboard_title = "".concat(dashboardConfig === null || dashboardConfig === void 0 ? void 0 : dashboardConfig.title, " (").concat(locale, ")");
                translations.clickhouse_url = Config.CLICKHOUSE_URL;
            }
            var template = Handlebars.compile(templateString);
            var contents = template(translations);
            fs.mkdir(path.dirname(outputFile), {
                recursive: true
            }, function(err) {
                if (err) {
                    log.error("Error creating directory ".concat(path.dirname(outputFile)));
                }
                fs.writeFile(outputFile, contents, function(err) {
                    if (err) {
                        log.error("Error writing to file ".concat(outputFile));
                    }
                });
            });
        } catch (error) {
            log.error("An error occured while processing translations: ".concat(error));
        }
        // Make the output path if it doesn't exist.
        fs.mkdirSync(outputPath, {
            recursive: true
        });
        // TODO: Write the substituted YAML file to the output directory.
        fs.copyFileSync(inputFile, outputFile);
        log.info("".concat(inputFile, " was copied for ").concat(locale, "}"));
    });
}
export function replaceQuotedHandlebarTemplatesInFile(inFilePath, outFilePath) {
    var data = fs.readFileSync(inFilePath, "utf8");
    // Could improve on this, but this a script.
    var result = data.replace(/'{{{\[([^\]]*)\]}}}'/g, "{{{[$1]}}}");
    result = result.replace(/(uuid: .*\n)/, "uuid: {{{[dashboard_uuid]}}}\n");
    result = result.replace(/(dashboard_title: .*\n)/, "dashboard_title: {{{[dashboard_title]}}}\n");
    fs.writeFileSync(outFilePath, result, "utf8");
}
