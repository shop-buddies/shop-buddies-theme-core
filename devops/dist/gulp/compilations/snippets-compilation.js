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
import { dynamicClassesReplacing } from "../utils/dynamic-classes-replacing.js";
import { injectSnippetCode } from "../utils/snippets-code-injecting.js";
import { dest, src } from "gulp";
import rename from "gulp-rename";
import { errorLogger } from "../utils/error-logger.js";
var snippetsPath = path.join(process.cwd(), "src", "snippets");
var utils = {
    validateFolder: function (folderPath) {
        return fs.existsSync(folderPath) && fs.statSync(folderPath).isDirectory();
    },
    renameAndMoveToFolder: function (newName, fileSrc, pathToMove) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        src(fileSrc)
                            .pipe(rename(function (file) {
                            file.basename = newName;
                        }))
                            .pipe(dest(pathToMove))
                            .on("end", resolve)
                            .on("error", reject);
                    })];
            });
        });
    },
    loadStyleModule: function (styleModulesObjectFile) {
        return __awaiter(this, void 0, void 0, function () {
            var timestamp, module_1, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!fs.existsSync(styleModulesObjectFile)) return [3 /*break*/, 5];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        timestamp = Date.now();
                        return [4 /*yield*/, import("file://".concat(styleModulesObjectFile, "?t=").concat(timestamp))];
                    case 2:
                        module_1 = _a.sent();
                        return [2 /*return*/, module_1.style];
                    case 3:
                        error_1 = _a.sent();
                        console.error("Failed to load style module: ".concat(styleModulesObjectFile), error_1);
                        return [3 /*break*/, 4];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        console.warn("Style module file not found: ".concat(styleModulesObjectFile));
                        _a.label = 6;
                    case 6: return [2 /*return*/, null];
                }
            });
        });
    },
    processSnippetFolder: function (settings) {
        return __awaiter(this, void 0, void 0, function () {
            var styleModulesObject, techFolderPath, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!fs.existsSync(settings.liquidPath)) {
                            throw new Error("Snippet folder does not exist: ".concat(settings.liquidPath));
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 8, , 9]);
                        if (!fs.existsSync(settings.styleFile)) return [3 /*break*/, 5];
                        settings.injectStyles = true;
                        return [4 /*yield*/, injectSnippetCode(settings)];
                    case 2:
                        styleModulesObject = _a.sent();
                        if (!styleModulesObject) return [3 /*break*/, 4];
                        techFolderPath = path.join(settings.folderPath, "_tech-do-not-modify");
                        return [4 /*yield*/, dynamicClassesReplacing(path.join(techFolderPath, "sbc-".concat(settings.folderName, ".liquid")), styleModulesObject, "./snippets/")];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [3 /*break*/, 7];
                    case 5: return [4 /*yield*/, utils.renameAndMoveToFolder("sbc-".concat(settings.folderName), settings.liquidPath, "./snippets/")];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        error_2 = _a.sent();
                        console.error("Failed to process snippet folder ".concat(settings.folderName, ":"), error_2 instanceof Error ? error_2.message : String(error_2));
                        return [3 /*break*/, 9];
                    case 9: return [2 /*return*/];
                }
            });
        });
    },
};
export var snippetsCompilation = function (param) { return __awaiter(void 0, void 0, void 0, function () {
    var folderPath, settings, folders, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                if (!(typeof param === "string")) return [3 /*break*/, 2];
                folderPath = path.join(snippetsPath, param);
                settings = {
                    folderName: param,
                    folderPath: folderPath,
                    liquidPath: path.join(folderPath, "snippet.liquid"),
                    styleFile: path.join(folderPath, "style.module.scss"),
                    injectStyles: false,
                    styles: "",
                };
                return [4 /*yield*/, utils.processSnippetFolder(settings)];
            case 1:
                _a.sent();
                return [3 /*break*/, 4];
            case 2:
                folders = fs
                    .readdirSync(snippetsPath)
                    .filter(function (file) { return utils.validateFolder(path.join(snippetsPath, file)); });
                return [4 /*yield*/, Promise.all(folders.map(function (folder) { return __awaiter(void 0, void 0, void 0, function () {
                        var folderPath, settings;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    folderPath = path.join(snippetsPath, folder);
                                    settings = {
                                        folderName: folder,
                                        folderPath: folderPath,
                                        liquidPath: path.join(folderPath, "snippet.liquid"),
                                        styleFile: path.join(folderPath, "style.module.scss"),
                                        injectStyles: false,
                                        styles: "",
                                    };
                                    return [4 /*yield*/, utils.processSnippetFolder(settings)];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); }))];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                e_1 = _a.sent();
                console.error(errorLogger("An error occurred during snippetsCompilation process", e_1 instanceof Error ? e_1 : new Error(String(e_1)), __filename));
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
