import { series, watch, parallel } from "gulp";
import { tailwindStylesCompilation } from "./devops/dist/gulp/compilations/tailwind-compilation.js";
import { regularStylesMinification } from "./devops/dist/gulp/minifications/regular-styles-minification.js";
import { regularScriptsMinification } from "./devops/dist/gulp/minifications/regular-scripts-minification.js";
import { coreCompilation } from "./devops/dist/gulp/compilations/core-compilation.js";
import { folderBasedScssCompilation } from "./devops/dist/gulp/compilations/folder-based-scss-compilation.js";
import { sectionsCompilation } from "./devops/dist/gulp/compilations/sections-compilation.js";
import { snippetsCompilation } from "./devops/dist/gulp/compilations/snippets-compilation.js";
import path from "path"
import { getConsoleLogColors } from "./devops/dist/gulp/utils/getConsoleLogColors.js"  
 

const tasks = [
    regularStylesMinification,
    regularScriptsMinification,
    coreCompilation,
    folderBasedScssCompilation,
    sectionsCompilation,
    snippetsCompilation
];


const watchFiles = function () {
    watch("src/styles/plain-css-minification/*.css", regularStylesMinification);
    watch("src/scripts/vanilla-js-minification/*.js", regularScriptsMinification);
    watch("src/core/**/*.*", coreCompilation);
    watch("src/styles/scss-compilation/**/*.scss", folderBasedScssCompilation);
    const sectionsWatcher = watch(
      [
          "src/sections/**/*.{ts,tsx,liquid,scss}",
          "!src/sections/**/_tech-do-not-modify/**",
      ]
    );

    sectionsWatcher.on("change", async (changedFilePath) => {
        const folderName = path.basename(path.dirname(changedFilePath));
        console.log(getConsoleLogColors('info'), `File changed: ${changedFilePath}`);
        console.log(getConsoleLogColors('warn'), `Compiling section for folder: ${folderName}`);
        try {
            await sectionsCompilation(folderName);
            console.log(getConsoleLogColors('success'), `Successfully compiled section for folder: ${folderName}`);
        } catch (error) {
            console.error(`Error during sections compilation for folder: ${path.basename(path.dirname(changedFilePath))}`);
            console.error(error);
        }
    });
    const snippetsWatcher = watch(
        [
            "src/snippets/**/*.{liquid,scss}",
            "!src/snippets/**/_tech-do-not-modify/**",
        ]
    );
    snippetsWatcher.on("change", async (changedFilePath) => {
        const folderName = path.basename(path.dirname(changedFilePath));
        console.log(getConsoleLogColors('info'), `File changed: ${changedFilePath}`);
        console.log(getConsoleLogColors('warn'), `Compiling snippet for folder: ${folderName}`);
        try {
            await snippetsCompilation(folderName);
            console.log(getConsoleLogColors('success'), `Successfully compiled snippet for folder: ${folderName}`);
        } catch (error) {
            console.error(`Error during snippet compilation for folder: ${path.basename(path.dirname(changedFilePath))}`);
            console.error(error);
        }
    })
};

export const tBuild = tailwindStylesCompilation

export const watching = series(watchFiles);

export default parallel(...tasks);