import { src, dest } from "gulp";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import rename from "gulp-rename";
import postcss from "gulp-postcss";
import { errorLogger } from "../utils/error-logger.js";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
export var regularStylesMinification = function () {
    try {
        return new Promise(function (resolve, reject) {
            src("src/styles/plain-css-minification/**/*.css")
                .on("error", function (err) {
                reject(err);
            })
                .pipe(postcss([autoprefixer(), cssnano()]))
                .pipe(rename(function (path) {
                path.dirname = "";
                path.extname = ".min.css";
            }))
                .pipe(dest("assets/"))
                .on("end", resolve)
                .on("error", reject);
        });
    }
    catch (e) {
        console.error(errorLogger("An error occurred during the regular styles minification process.", e instanceof Error ? e : new Error(String(e)), __filename));
        throw e;
    }
};
