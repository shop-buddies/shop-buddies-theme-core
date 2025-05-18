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
import fs from "fs/promises";
import path from "path";
import readline from "readline";
import { colors } from "../colors.js";
import { paths } from "../paths.js";
var SectionCreator = /** @class */ (function () {
    function SectionCreator() {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
    }
    SectionCreator.prototype.question = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) {
                        _this.rl.question("".concat(colors.cyan, "? ").concat(query).concat(colors.reset), function (answer) {
                            console.log("".concat(colors.magenta, "\u2713 ").concat(answer).concat(colors.reset));
                            resolve(answer);
                        });
                    })];
            });
        });
    };
    SectionCreator.prototype.generateLiquidTemplate = function (sectionName) {
        var sectionNameWithSpaces = sectionName.replace(/-/g, " ");
        var sectionNameWithSpacesCapitalized = sectionNameWithSpaces.replace(/\b\w/g, function (char) { return char.toUpperCase(); });
        return "\n<div class=\"<%= styles.".concat(sectionNameWithSpacesCapitalized.replace(/\s/g, ''), " %>\">\n</div>\n\n{% schema %}\n{\n  \"name\": \"").concat(sectionNameWithSpacesCapitalized, "\",\n  \"tag\": \"section\",\n  \"class\": \"js-").concat(sectionName.toLowerCase(), "\",\n  \"settings\": [],\n  \"blocks\": [],\n  \"presets\": [\n    {\n      \"name\": \"").concat(sectionNameWithSpacesCapitalized, "\"\n    }\n  ]\n}\n{% endschema %}");
    };
    SectionCreator.prototype.generateScssModule = function () {
        return "\n@use \"../../core/scss/units\" as u;\n@use \"../../core/scss/settings\" as s;\n@use \"../../core/scss/colors\" as c;\n@use \"../../core/scss/mq\" as m;\n\n// Your styles here\n";
    };
    SectionCreator.prototype.generateTypeScript = function (sectionName) {
        return "\nconst SECTION_CLASS = \"js-".concat(sectionName.toLowerCase(), "\"\n\nconst initializeSection = (wrapper: HTMLElement): void => {\n  // Initialization code starts here\n  // Add your logic here\n  // Initialization code ends here\n}\n\nconst sectionInit = (): void => {\n  const sectionWrappers = document.querySelectorAll(`.${SECTION_CLASS}`)\n  sectionWrappers.forEach((wrapper) => {\n    if (!wrapper.classList.contains(\"initialized\") && wrapper instanceof HTMLElement) {\n      initializeSection(wrapper)\n      wrapper.classList.add(\"initialized\")\n    }\n  })\n}\nsectionInit()\n\nexport const ").concat(sectionName.toUpperCase().replace(/-/g, "_"), "_SECTION_SETTINGS = {\n  class: SECTION_CLASS,\n  init: sectionInit,\n}\n// This is mandatory to register the section for the theme customizer. \n// Don't forget to add registerSection(...) in the core/theme-customizer/index.ts file.\n/*  \n  Example:\n\n    import { ").concat(sectionName.toUpperCase().replace(/-/g, "_"), "_SECTION_SETTINGS } from \"../../sections/").concat(sectionName, "\"\n\n    registerSection(").concat(sectionName.toUpperCase().replace(/-/g, "_"), "_SECTION_SETTINGS.class, {\n      init: ").concat(sectionName.toUpperCase().replace(/-/g, "_"), "_SECTION_SETTINGS.init\n    })\n*/\n    ");
    };
    SectionCreator.prototype.validateSectionName = function (sectionName) {
        return __awaiter(this, void 0, void 0, function () {
            var sectionDir, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(sectionName)) {
                            console.error("".concat(colors.red, "Error: Section name must be in kebab-case format (e.g., my-new-section)"));
                            return [2 /*return*/, false];
                        }
                        sectionDir = path.join(paths.sections, sectionName);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, fs.access(sectionDir)];
                    case 2:
                        _b.sent();
                        console.error("".concat(colors.red, "Error: Section \"").concat(sectionName, "\" already exists"));
                        return [2 /*return*/, false];
                    case 3:
                        _a = _b.sent();
                        return [2 /*return*/, true];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SectionCreator.prototype.createFiles = function (sectionName, config) {
        return __awaiter(this, void 0, void 0, function () {
            var files;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        files = [
                            {
                                name: "section.liquid",
                                content: this.generateLiquidTemplate(sectionName),
                            },
                            {
                                name: "style.module.scss",
                                content: this.generateScssModule(),
                            },
                        ];
                        if (config.includeScripts) {
                            files.push({
                                name: "index.ts",
                                content: this.generateTypeScript(sectionName),
                            });
                        }
                        return [4 /*yield*/, Promise.all(files.map(function (file) {
                                return fs.writeFile(path.join(paths.sections, sectionName, file.name), file.content, "utf8");
                            }))];
                    case 1:
                        _a.sent();
                        console.log("".concat(colors.green, "Section \"").concat(sectionName, "\" created successfully!"));
                        console.log("".concat(colors.blue, "\nCreated files:"));
                        files.forEach(function (file) {
                            console.log("- src/sections/".concat(sectionName, "/").concat(file.name));
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    SectionCreator.prototype.createSection = function () {
        return __awaiter(this, void 0, void 0, function () {
            var sectionName, includeScripts, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, 7, 8]);
                        return [4 /*yield*/, this.question("Enter section name (in kebab-case): ")];
                    case 1:
                        sectionName = _a.sent();
                        return [4 /*yield*/, this.validateSectionName(sectionName)];
                    case 2:
                        if (!(_a.sent())) {
                            this.rl.close();
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.question("Include TypeScript file? (y/n): ")];
                    case 3:
                        includeScripts = (_a.sent()).toLowerCase() === "y";
                        return [4 /*yield*/, fs.mkdir(path.join(paths.sections, sectionName), { recursive: true })];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.createFiles(sectionName, { name: sectionName, includeScripts: includeScripts })];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 8];
                    case 6:
                        error_1 = _a.sent();
                        console.error("".concat(colors.red, "Error creating section:"), error_1);
                        return [3 /*break*/, 8];
                    case 7:
                        this.rl.close();
                        return [7 /*endfinally*/];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    return SectionCreator;
}());
new SectionCreator().createSection();
