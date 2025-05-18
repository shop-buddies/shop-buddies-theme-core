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
import replace from "gulp-replace";
import rename from "gulp-rename";
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import gulpSass from "gulp-sass";
import * as sass from "sass";
import through2 from "through2";
import { pipeline } from "stream/promises";
import prefixSelector from "postcss-prefix-selector";
import { promises as fsPromises } from "fs";
import path from "path";
import { errorLogger } from "./error-logger.js";
import { fileURLToPath } from "url";
import { getConsoleLogColors } from "./getConsoleLogColors.js";
import transformSelector from "./scss-selectors-transformer.js";
var scss = gulpSass(sass);
var __filename = fileURLToPath(import.meta.url);
var utils = {
    validateSettings: function (settings) {
        var missingFields = ["liquidPath", "folderName", "styleFile"]
            .filter(function (field) { return !settings[field]; })
            .join(", ");
        if (missingFields) {
            throw new Error("Missing required settings: ".concat(missingFields));
        }
    },
    processStyles: function (settings, moduleClasses) {
        return __awaiter(this, void 0, void 0, function () {
            var inlineStyles, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!settings.injectStyles) {
                            return [2 /*return*/, ""];
                        }
                        inlineStyles = "";
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, pipeline(src(settings.styleFile), scss().on("error", function (error) {
                                return Promise.resolve();
                            }), postcss([
                                autoprefixer(),
                                cssnano(),
                                prefixSelector({
                                    prefix: "#shopify-section-{{ section.id }}",
                                    transform: function (prefix, selector) {
                                        return transformSelector(prefix, selector, moduleClasses, settings.folderName);
                                    }
                                }),
                            ]), through2.obj(function (file, enc, callback) {
                                if (file.isBuffer()) {
                                    inlineStyles = "<style>".concat(file.contents.toString(enc), "</style>\n");
                                }
                                callback(null, file);
                            }))];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        console.error(getConsoleLogColors("error"), "Style processing error:", error_1 instanceof Error ? error_1.message : String(error_1));
                        return [2 /*return*/, ""];
                    case 4: return [2 /*return*/, inlineStyles];
                }
            });
        });
    },
    handleSassError: function (error) {
        console.error("Sass compilation error:", error.message);
    },
    injectScriptCode: function (stream, scriptCode) {
        try {
            return stream.pipe(replace(/$/, "\n".concat(scriptCode)));
        }
        catch (e) {
            throw e;
        }
    },
    injectInlineStyles: function (stream, inlineStyles) {
        try {
            return stream.pipe(through2.obj(function (file, enc, callback) {
                file.contents = Buffer.from("".concat(inlineStyles, "\n").concat(file.contents.toString(enc)));
                callback(null, file);
            }));
        }
        catch (e) {
            console.error(getConsoleLogColors("error"), "Script injection error:", e instanceof Error ? e.message : String(e));
            return stream;
        }
    },
    generateStyleModule: function (settings, moduleClasses) {
        return __awaiter(this, void 0, void 0, function () {
            var filePath, content, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        filePath = path.join(settings.folderPath, "style.module.js");
                        content = "export const style = ".concat(JSON.stringify(moduleClasses, null, 2), ";");
                        return [4 /*yield*/, fsPromises.writeFile(filePath, content, "utf8")];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _a.sent();
                        throw e_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    renameOutput: function (stream, folderName) {
        return stream.pipe(rename(function (file) {
            file.basename = "sbc-".concat(folderName);
        }));
    },
    writeToDestination: function (stream, folderPath) {
        return __awaiter(this, void 0, void 0, function () {
            var destination_1, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        destination_1 = path.join(folderPath, "_tech-do-not-modify");
                        return [4 /*yield*/, new Promise(function (resolvePromise, reject) {
                                stream.pipe(dest(destination_1)).on("end", resolvePromise).on("error", reject);
                            })];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        e_2 = _a.sent();
                        console.error(getConsoleLogColors("error"), "Stream error:", e_2 instanceof Error ? e_2.message : String(e_2));
                        return [2 /*return*/];
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
};
export var injectSectionCode = function (settings) { return __awaiter(void 0, void 0, void 0, function () {
    var result, moduleClasses, inlineStyles, stream, e_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                result = false;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 6, , 7]);
                utils.validateSettings(settings);
                moduleClasses = {};
                return [4 /*yield*/, utils.processStyles(settings, moduleClasses)];
            case 2:
                inlineStyles = _a.sent();
                stream = src(settings.liquidPath);
                if (settings.injectScriptCode) {
                    stream = utils.injectScriptCode(stream, settings.scriptCode || "");
                }
                if (!settings.injectStyles) return [3 /*break*/, 4];
                stream = utils.injectInlineStyles(stream, inlineStyles);
                return [4 /*yield*/, utils.generateStyleModule(settings, moduleClasses)];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4:
                stream = utils.renameOutput(stream, settings.folderName);
                return [4 /*yield*/, utils.writeToDestination(stream, settings.folderPath)];
            case 5:
                _a.sent();
                result = true;
                return [3 /*break*/, 7];
            case 6:
                e_3 = _a.sent();
                console.error(errorLogger("An error occurred during injectSectionCode process", e_3 instanceof Error ? e_3 : new Error(String(e_3)), __filename));
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/, result];
        }
    });
}); };
