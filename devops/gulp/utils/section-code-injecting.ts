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

const scss = gulpSass(sass);
const __filename = fileURLToPath(import.meta.url);

interface ModuleClasses {
  [key: string]: string;
}

interface SectionSettings {
  liquidPath: string;
  folderName: string;
  styleFile: string;
  folderPath: string;
  injectStyles?: boolean;
  injectScriptCode?: boolean;
  scriptCode?: string;
}

interface Utils {
  validateSettings(settings: SectionSettings): void;
  processStyles(settings: SectionSettings, moduleClasses: ModuleClasses): Promise<string>;
  handleSassError(error: Error): void;
  injectScriptCode(stream: NodeJS.ReadWriteStream, scriptCode: string): NodeJS.ReadWriteStream;
  injectInlineStyles(stream: NodeJS.ReadWriteStream, inlineStyles: string): NodeJS.ReadWriteStream;
  generateStyleModule(settings: SectionSettings, moduleClasses: ModuleClasses): Promise<void>;
  renameOutput(stream: NodeJS.ReadWriteStream, folderName: string): NodeJS.ReadWriteStream;
  writeToDestination(stream: NodeJS.ReadWriteStream, folderPath: string): Promise<void>;
}

const utils: Utils = {
  validateSettings(settings: SectionSettings): void {
    const missingFields = ["liquidPath", "folderName", "styleFile"]
      .filter((field) => !settings[field as keyof SectionSettings])
      .join(", ");
    if (missingFields) {
      throw new Error(`Missing required settings: ${missingFields}`);
    }
  },

  async processStyles(settings: SectionSettings, moduleClasses: ModuleClasses): Promise<string> {
    if (!settings.injectStyles) {
      return "";
    }

    let inlineStyles = "";
    try {
      await pipeline(
        src(settings.styleFile),
        scss().on("error", (error: Error) => {
          return Promise.resolve();
        }),
        postcss([
          autoprefixer(),
          cssnano(),
          prefixSelector({
            prefix: `#shopify-section-{{ section.id }}`,
            transform: (prefix: string | null, selector: string) =>
              transformSelector(prefix, selector, moduleClasses, settings.folderName)
          }),
        ]),
        through2.obj((file: any, enc: BufferEncoding, callback: (error: Error | null, data?: any) => void) => {
          if (file.isBuffer()) {
            inlineStyles = `<style>${file.contents.toString(enc)}</style>\n`;
          }
          callback(null, file);
        })
      );
    } catch (error) {
      console.error(
        getConsoleLogColors("error"),
        "Style processing error:",
        error instanceof Error ? error.message : String(error)
      );
      return "";
    }
    return inlineStyles;
  },

  handleSassError(error: Error): void {
    console.error("Sass compilation error:", error.message);
  },

  injectScriptCode(stream: NodeJS.ReadWriteStream, scriptCode: string): NodeJS.ReadWriteStream {
    try {
      return stream.pipe(replace(/$/, `\n${scriptCode}`));
    } catch (e) {
      throw e;
    }
  },

  injectInlineStyles(stream: NodeJS.ReadWriteStream, inlineStyles: string): NodeJS.ReadWriteStream {
    try {
      return stream.pipe(
        through2.obj((file, enc, callback) => {
          file.contents = Buffer.from(
            `${inlineStyles}\n${file.contents.toString(enc)}`
          );
          callback(null, file);
        })
      );
    } catch (e) {
      console.error(
        getConsoleLogColors("error"),
        "Script injection error:",
        e instanceof Error ? e.message : String(e)
      );
      return stream;
    }
  },

  async generateStyleModule(settings: SectionSettings, moduleClasses: ModuleClasses): Promise<void> {
    try {
      const filePath = path.join(settings.folderPath, "style.module.js");
      const content = `export const style = ${JSON.stringify(moduleClasses, null, 2)};`;

      await fsPromises.writeFile(filePath, content, "utf8");
    } catch (e) {
      throw e;
    }
  },

  renameOutput(stream: NodeJS.ReadWriteStream, folderName: string): NodeJS.ReadWriteStream {
    return stream.pipe(
      rename((file) => {
        file.basename = `sbc-${folderName}`;
      })
    );
  },

  async writeToDestination(stream: NodeJS.ReadWriteStream, folderPath: string): Promise<void> {
    try {
      const destination = path.join(folderPath, "_tech-do-not-modify");
      await new Promise<void>((resolvePromise, reject) => {
        stream.pipe(dest(destination)).on("end", resolvePromise).on("error", reject);
      });
    } catch (e) {
      console.error(
        getConsoleLogColors("error"),
        "Stream error:",
        e instanceof Error ? e.message : String(e)
      );
      return;
    }
  },
};

export const injectSectionCode = async (settings: SectionSettings): Promise<boolean> => {
  let result = false;
  try {
    utils.validateSettings(settings);

    const moduleClasses: ModuleClasses = {};
    const inlineStyles = await utils.processStyles(settings, moduleClasses);

    let stream = src(settings.liquidPath);

    if (settings.injectScriptCode) {
      stream = utils.injectScriptCode(stream, settings.scriptCode || "");
    }

    if (settings.injectStyles) {
      stream = utils.injectInlineStyles(stream, inlineStyles);
      await utils.generateStyleModule(settings, moduleClasses);
    }

    stream = utils.renameOutput(stream, settings.folderName);
    await utils.writeToDestination(stream, settings.folderPath);
    result = true;
  } catch (e) {
    console.error(
      errorLogger(
        "An error occurred during injectSectionCode process",
        e instanceof Error ? e : new Error(String(e)),
        __filename
      )
    );
  }
  return result;
}; 