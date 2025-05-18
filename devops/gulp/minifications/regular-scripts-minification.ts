import { src, dest } from "gulp"
import rename from "gulp-rename"
import { fileURLToPath } from "url"
import terser from "gulp-terser"
import { errorLogger } from "../utils/error-logger.js"

const __filename = fileURLToPath(import.meta.url)

interface RenamePath {
  dirname: string
  basename: string
  extname: string
}

export const regularScriptsMinification = (): Promise<void> => {
  try {
    return new Promise((resolve, reject) => {
      src(`src/scripts/vanilla-js-minification/**/*.js`)
        .pipe(terser({}))
        .on("error", (err: Error) => {
          reject(err)
        })
        .pipe(
          rename((path: RenamePath) => {
            path.dirname = ""
            path.extname = ".min.js"
          })
        )
        .pipe(dest("assets/"))
        .on("end", resolve)
        .on("error", reject)
    })
  } catch (e) {
    console.error(
      errorLogger(
        "An error occurred during the regular scripts minification process",
        e instanceof Error ? e : new Error(String(e)),
        __filename
      )
    )
    throw e
  }
} 