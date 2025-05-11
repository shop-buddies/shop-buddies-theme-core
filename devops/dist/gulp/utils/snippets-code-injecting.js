var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { dest, src } from "gulp";
import rename from "gulp-rename";
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import gulpSass from "gulp-sass";
import * as sass from "sass";
import { pipeline } from "stream/promises";
import prefixSelector from "postcss-prefix-selector";
import { promises as fsPromises } from "fs";
import path from "path";
import through2 from "through2";
import fs from "fs";
import { errorLogger } from "./error-logger.js";
import { fileURLToPath } from "url";
import { getConsoleLogColors } from "./getConsoleLogColors.js";
import transformSelector from "./scss-selectors-transformer.js";
var scss = gulpSass(sass);
var __filename = fileURLToPath(import.meta.url);
var streamToPromise = function (stream) {
    return new Promise(function (resolve) {
        stream.on("end", resolve).on("error", function (error) {
            console.error("Stream error:", error.message);
            resolve();
        });
    });
};
export var injectSnippetCode = function (settings) {
    return __awaiter(this, void 0, void 0, function () {
        var moduleClasses, missingFields, pipelineError_1, stream, e_1, styleModulePath, styleModuleContent, writeError_1, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    moduleClasses = {};
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 14, , 15]);
                    missingFields = ["liquidPath", "styleFile", "folderName"]
                        .filter(function (field) { return !settings[field]; })
                        .join(", ");
                    if (missingFields) {
                        console.error(getConsoleLogColors("error"), "Missing required settings: ".concat(missingFields));
                    }
                    if (!settings.injectStyles) return [3 /*break*/, 5];
                    if (!!fs.existsSync(settings.styleFile)) return [3 /*break*/, 2];
                    console.warn("Styles file not found: ".concat(settings.styleFile));
                    return [3 /*break*/, 5];
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, pipeline(src(settings.styleFile), scss().on('error', function (err) {
                            return Promise.resolve();
                        }), postcss([
                            autoprefixer(),
                            cssnano(),
                            prefixSelector({
                                transform: function (prefix, selector) {
                                    return transformSelector(prefix, selector, moduleClasses, settings.folderName);
                                },
                            }),
                        ]), through2.obj(function (file, enc, callback) {
                            if (file.isBuffer()) {
                                file.contents = Buffer.from("<style>".concat(file.contents.toString(enc), "</style>"));
                            }
                            callback(null, file);
                        }), rename(function (file) {
                            file.basename = "sbc-".concat(settings.folderName, "-stylesheet");
                            file.extname = ".liquid";
                        }), dest("./snippets/"))];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    pipelineError_1 = _a.sent();
                    console.error("Pipeline error while processing styles: ".concat(pipelineError_1 instanceof Error ? pipelineError_1.message : String(pipelineError_1)));
                    return [3 /*break*/, 5];
                case 5:
                    if (!fs.existsSync(settings.liquidPath)) {
                        console.warn("Snippet file not found: ".concat(settings.liquidPath, ". Skipping."));
                        return [2 /*return*/, null];
                    }
                    stream = src(settings.liquidPath).pipe(rename(function (file) {
                        file.basename = "sbc-".concat(settings.folderName);
                    }));
                    _a.label = 6;
                case 6:
                    _a.trys.push([6, 8, , 9]);
                    return [4 /*yield*/, streamToPromise(stream.pipe(dest(path.join(settings.folderPath, "_tech-do-not-modify"))))];
                case 7:
                    _a.sent();
                    return [3 /*break*/, 9];
                case 8:
                    e_1 = _a.sent();
                    console.error(getConsoleLogColors("error"), "Error while processing snippet file:", e_1 instanceof Error ? e_1.message : String(e_1));
                    return [3 /*break*/, 9];
                case 9:
                    if (!settings.injectStyles) return [3 /*break*/, 13];
                    styleModulePath = path.join(settings.folderPath, "style.module.js");
                    styleModuleContent = "export const style = ".concat(JSON.stringify(moduleClasses, null, 2), ";");
                    _a.label = 10;
                case 10:
                    _a.trys.push([10, 12, , 13]);
                    return [4 /*yield*/, fsPromises.writeFile(styleModulePath, styleModuleContent, "utf8")];
                case 11:
                    _a.sent();
                    return [3 /*break*/, 13];
                case 12:
                    writeError_1 = _a.sent();
                    console.error("Failed to write style module file: ".concat(writeError_1 instanceof Error ? writeError_1.message : String(writeError_1)));
                    return [3 /*break*/, 13];
                case 13: return [3 /*break*/, 15];
                case 14:
                    error_1 = _a.sent();
                    console.error(errorLogger("An error occurred during the injectSnippetCode process.", error_1 instanceof Error ? error_1 : new Error(String(error_1)), __filename));
                    return [2 /*return*/, null];
                case 15: return [2 /*return*/, moduleClasses];
            }
        });
    });
};
