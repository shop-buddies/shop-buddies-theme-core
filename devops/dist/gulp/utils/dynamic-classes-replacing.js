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
import ejs from "gulp-ejs";
import fs from "fs/promises";
import path from "path";
var waitForFileSystem = function (ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
};
export var dynamicClassesReplacing = function (pathToFile, stylesObject, destPath) { return __awaiter(void 0, void 0, void 0, function () {
    var result, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!pathToFile || typeof pathToFile !== 'string') {
                    console.error('Invalid pathToFile: Must be a non-empty string');
                    return [2 /*return*/];
                }
                if (!stylesObject || typeof stylesObject !== 'object' || Array.isArray(stylesObject)) {
                    console.error('Invalid stylesObject: Must be a non-null object');
                    return [2 /*return*/];
                }
                if (!destPath || typeof destPath !== 'string') {
                    console.error('Invalid destPath: Must be a non-empty string');
                    return [2 /*return*/];
                }
                result = path.join(destPath, path.basename(pathToFile));
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, fs.unlink(result).catch(function (err) {
                        if (err.code !== "ENOENT")
                            throw err;
                    })];
            case 2:
                _a.sent();
                return [4 /*yield*/, waitForFileSystem(500)];
            case 3:
                _a.sent();
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var stream = src(pathToFile)
                            .pipe(ejs({ styles: stylesObject, ext: '.liquid' }).on("error", function (err) {
                            console.error("EJS Rendering Error:", err.message);
                            reject(err);
                        }))
                            .pipe(dest(destPath))
                            .on('finish', function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, waitForFileSystem(500)];
                                    case 1:
                                        _a.sent();
                                        resolve();
                                        return [2 /*return*/];
                                }
                            });
                        }); })
                            .on('error', reject);
                    })];
            case 4:
                err_1 = _a.sent();
                console.error("Error in dynamicClassesReplacing: ".concat(err_1 instanceof Error ? err_1.message : String(err_1)));
                throw err_1;
            case 5: return [2 /*return*/];
        }
    });
}); };
