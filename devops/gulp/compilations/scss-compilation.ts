import { dest, src } from "gulp";
import postcss  from "gulp-postcss";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import rename from "gulp-rename";
import gulpSass from "gulp-sass";
import * as sass from "sass";
import { getConsoleLogColors } from "../utils/getConsoleLogColors.js";

const scss = gulpSass(sass);

export const scssCompilation = async (distPath: string, newName: string | null = null): Promise<void> => {
  try {
    await new Promise<void>((resolve, reject) => {
      src(`${distPath}`)
        .pipe(
          scss().on("error", (e: Error) => { 
            console.error(getConsoleLogColors('error'), "SCSS Error:", e.message);
            // Instead of calling resolve, we'll reject to properly handle the error
            reject(e);
          })
        )
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(
          rename(function (path: { basename: string; dirname: string; extname: string }) {
            if (newName !== null) {
              path.basename = `${newName}`;
            }
            path.dirname = "";
            path.extname = ".min.css";
          })
        )
        .pipe(dest("assets/"))
        .on("end", resolve)
        .on("error", (e: Error) => {
          console.error(getConsoleLogColors('error'), "Pipeline Error:", e.message);
          reject(e);
        });
    });
  } catch (e) {
    console.error(getConsoleLogColors('error'), "SCSS compilation failed:", e instanceof Error ? e.message : String(e));
    // We'll resolve the promise even if there's an error to keep the watch running
    return Promise.resolve();
  }
}; 