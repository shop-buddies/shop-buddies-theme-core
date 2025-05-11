import { scssCompilation } from "./scss-compilation.js"
import { errorLogger } from "../utils/error-logger.js"
import { fileURLToPath } from "url"

const __filename: string = fileURLToPath(import.meta.url)

export const folderBasedScssCompilation = async (): Promise<void> => {
  try {
    return await scssCompilation("src/styles/scss-compilation/**/*.scss")
  } catch (e: unknown) {
    const error = e instanceof Error ? e : new Error(String(e))
    console.error(
      errorLogger(
        "An error occurred during the folder-based scss compilation process.",
        error,
        __filename
      )
    )
    throw e
  }
} 