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
import { promises as fs } from "fs";
import { dest, src } from "gulp";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import rename from "gulp-rename";
import postcss from "gulp-postcss";
import { errorLogger } from "../utils/error-logger.js";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
export var tailwindStylesCompilation = function () { return __awaiter(void 0, void 0, void 0, function () {
    var targetFile, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                targetFile = "assets/sbc-tailwind-core.min.css";
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, fs.unlink(targetFile).catch(function (err) {
                        if (err.code !== "ENOENT")
                            throw err;
                    })];
            case 2:
                _a.sent();
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        src("src/styles/tailwind/tailwind-core.css")
                            .on("error", function (err) {
                            console.error(errorLogger("Error in Tailwind Style Compilation", err, __filename));
                            reject(err);
                        })
                            .pipe(postcss([
                            tailwindcss("./tailwind.config.js"),
                            autoprefixer(),
                            cssnano(),
                        ]))
                            .pipe(rename(function (path) {
                            path.dirname = "";
                            path.basename = "sbc-tailwind-core";
                            path.extname = ".min.css";
                        }))
                            .pipe(dest("assets/"))
                            .on("end", resolve)
                            .on("error", reject);
                    })];
            case 3:
                err_1 = _a.sent();
                console.error(errorLogger("Error in Deleting Existing File", err_1 instanceof Error ? err_1 : new Error(String(err_1)), __filename));
                throw err_1;
            case 4: return [2 /*return*/];
        }
    });
}); };
