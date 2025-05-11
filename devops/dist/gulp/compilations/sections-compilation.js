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
import fs from "fs";
import path from "path";
import { scriptBundling } from "./script-bundling.js";
import { injectSectionCode } from "../utils/section-code-injecting.js";
import { dynamicClassesReplacing } from "../utils/dynamic-classes-replacing.js";
import { errorLogger } from "../utils/error-logger.js";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var sectionsPath = path.join(process.cwd(), "src", "sections");
var utils = {
    getStyleModules: function (filePath) {
        return __awaiter(this, void 0, void 0, function () {
            var timestamp, module_1, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        timestamp = Date.now();
                        return [4 /*yield*/, import("file://".concat(filePath, "?t=").concat(timestamp))];
                    case 1:
                        module_1 = _a.sent();
                        return [2 /*return*/, module_1.style];
                    case 2:
                        error_1 = _a.sent();
                        console.error("Failed to load style module: ".concat(filePath), error_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    processFolder: function (folder) {
        return __awaiter(this, void 0, void 0, function () {
            var folderPath, scriptTsFile, scriptTsxFile, settings, result, styleModulesObjectFile, styleModulesObject, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        folderPath = path.join(sectionsPath, folder);
                        scriptTsFile = path.join(folderPath, "index.ts");
                        scriptTsxFile = path.join(folderPath, "index.tsx");
                        settings = {
                            folderName: folder,
                            scriptFile: fs.existsSync(scriptTsFile)
                                ? scriptTsFile
                                : fs.existsSync(scriptTsxFile)
                                    ? scriptTsxFile
                                    : "",
                            liquidPath: path.join(folderPath, "section.liquid"),
                            styleFile: path.join(folderPath, "style.module.scss"),
                            injectScriptCode: false,
                            scriptCode: "<script class=\"json-section-asset\" type=\"application/json\">{\"sectionName\":\"".concat(folder, "\", \"sectionID\":\"{{ section.id }}\", \"pathHelper\":\"{{ 'path-helper.dummy' | asset_url }}\"}</script>"),
                            injectStyles: false,
                            styles: "",
                            folderPath: folderPath,
                        };
                        if (!fs.existsSync(settings.liquidPath)) {
                            return [2 /*return*/];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 8, , 9]);
                        if (!fs.existsSync(settings.scriptFile)) return [3 /*break*/, 3];
                        return [4 /*yield*/, scriptBundling({ filePath: settings.scriptFile, outputName: "sbc-".concat(folder) })];
                    case 2:
                        _a.sent();
                        settings.injectScriptCode = true;
                        _a.label = 3;
                    case 3:
                        if (fs.existsSync(settings.styleFile)) {
                            settings.injectStyles = true;
                        }
                        return [4 /*yield*/, injectSectionCode(settings)];
                    case 4:
                        result = _a.sent();
                        if (!(settings.injectStyles && result)) return [3 /*break*/, 7];
                        styleModulesObjectFile = path.join(folderPath, "style.module.js");
                        return [4 /*yield*/, this.getStyleModules(styleModulesObjectFile)];
                    case 5:
                        styleModulesObject = _a.sent();
                        if (!styleModulesObject) return [3 /*break*/, 7];
                        return [4 /*yield*/, dynamicClassesReplacing(path.join(folderPath, "_tech-do-not-modify", "sbc-".concat(settings.folderName, ".liquid")), styleModulesObject, "./sections/")];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        error_2 = _a.sent();
                        throw error_2;
                    case 9: return [2 /*return*/];
                }
            });
        });
    },
};
export var sectionsCompilation = function (param) { return __awaiter(void 0, void 0, void 0, function () {
    var folders, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                if (!(typeof param === "string")) return [3 /*break*/, 2];
                return [4 /*yield*/, utils.processFolder(param).catch(function (error) {
                        console.error("Error processing folder ".concat(param, ":"), error.message);
                    })];
            case 1:
                _a.sent();
                return [3 /*break*/, 4];
            case 2:
                folders = fs
                    .readdirSync(sectionsPath)
                    .filter(function (file) {
                    return fs.statSync(path.join(sectionsPath, file)).isDirectory();
                });
                return [4 /*yield*/, Promise.all(folders.map(function (folder) {
                        utils.processFolder(folder).catch(function (error) {
                            console.error("Error processing folder ".concat(folder, ":"), error.message);
                        });
                    }))];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                e_1 = _a.sent();
                console.error(errorLogger("An error occurred during the section compilation process.", e_1 instanceof Error ? e_1 : new Error(String(e_1)), __filename));
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
