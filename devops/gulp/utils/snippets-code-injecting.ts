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

const scss = gulpSass(sass);
const __filename = fileURLToPath(import.meta.url);

interface ModuleClasses {
  [key: string]: string;
}

interface SnippetSettings {
  liquidPath: string;
  styleFile: string;
  folderName: string;
  folderPath: string;
  injectStyles?: boolean;
}

const streamToPromise = (stream: NodeJS.ReadWriteStream): Promise<void> => {
  return new Promise((resolve) => {
    stream.on("end", resolve).on("error", (error: Error) => {
      console.error("Stream error:", error.message);
      resolve();
    });
  });
};

export const injectSnippetCode = async function (settings: SnippetSettings): Promise<ModuleClasses | null> {
  const moduleClasses: ModuleClasses = {};

  try {
    const missingFields = ["liquidPath", "styleFile", "folderName"]
      .filter((field) => !settings[field as keyof SnippetSettings])
      .join(", ");
    if (missingFields) {
      console.error(
        getConsoleLogColors("error"),
        `Missing required settings: ${missingFields}`
      );
    }

    if (settings.injectStyles) {
      if (!fs.existsSync(settings.styleFile)) {
        console.warn(`Styles file not found: ${settings.styleFile}`);
      } else {
        try {
          await pipeline(
            src(settings.styleFile),
            scss().on('error', (err: Error) => {  
              return Promise.resolve();
            }),
            postcss([
              autoprefixer(),
              cssnano(),
              prefixSelector({
                transform(prefix: string | null, selector: string) {
                  return transformSelector(prefix, selector, moduleClasses, settings.folderName);
                },
              }),
            ]),
            through2.obj((file: any, enc: BufferEncoding, callback: (error: Error | null, data?: any) => void) => {
              if (file.isBuffer()) {
                file.contents = Buffer.from(
                  `<style>${file.contents.toString(enc)}</style>`
                );
              }
              callback(null, file);
            }),
            rename((file) => {
              file.basename = `sbc-${settings.folderName}-stylesheet`;
              file.extname = ".liquid";
            }),
            dest("./snippets/")
          );
        } catch (pipelineError) {
          console.error(
            `Pipeline error while processing styles: ${pipelineError instanceof Error ? pipelineError.message : String(pipelineError)}`
          );
        }
      }
    }

    if (!fs.existsSync(settings.liquidPath)) {
      console.warn(`Snippet file not found: ${settings.liquidPath}. Skipping.`);
      return null;
    }

    const stream = src(settings.liquidPath).pipe(
      rename((file) => {
        file.basename = `sbc-${settings.folderName}`;
      })
    );

    try {
      await streamToPromise(
        stream.pipe(dest(path.join(settings.folderPath, "_tech-do-not-modify")))
      );
    } catch (e) {
      console.error(
        getConsoleLogColors("error"),
        "Error while processing snippet file:",
        e instanceof Error ? e.message : String(e)
      );
    }

    if (settings.injectStyles) {
      const styleModulePath = path.join(settings.folderPath, "style.module.js");
      const styleModuleContent = `export const style = ${JSON.stringify(
        moduleClasses,
        null,
        2
      )};`;
      try {
        await fsPromises.writeFile(styleModulePath, styleModuleContent, "utf8");
      } catch (writeError) {
        console.error(
          `Failed to write style module file: ${writeError instanceof Error ? writeError.message : String(writeError)}`
        );
      }
    }
  } catch (error) {
    console.error(
      errorLogger(
        "An error occurred during the injectSnippetCode process.",
        error instanceof Error ? error : new Error(String(error)),
        __filename
      )
    );
    return null;
  }
  return moduleClasses;
}; 