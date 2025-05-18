import { fileURLToPath } from "url"
import { scssCompilation } from "./scss-compilation.js"
import { errorLogger } from "../utils/error-logger.js"
import { scriptBundling } from "./script-bundling.js"

const __filename = fileURLToPath(import.meta.url)

export const coreCompilation = async function () {
    try {
      await scssCompilation("src/core/scss/main.scss", "sbc-global-styles");
      await scriptBundling({ filePath: "./src/core/index.ts", outputName: "sbc-global-script" });
      await scriptBundling({ filePath: "./src/core/theme-customizer/index.ts", outputName: "sbc-theme-customizer" });
    } catch (error) {
      console.error(
        errorLogger(
          "An error occurred during the core compilation process.",
          error instanceof Error ? error : new Error(String(error)),
          __filename
        )
      )
      throw error
    }
  }