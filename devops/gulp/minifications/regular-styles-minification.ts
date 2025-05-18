import { src, dest } from "gulp"
import autoprefixer from "autoprefixer"
import cssnano from "cssnano"
import rename from "gulp-rename"
import postcss from "gulp-postcss"
import { errorLogger } from "../utils/error-logger.js"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)

interface RenamePath {
  dirname: string
  basename: string
  extname: string
}

export const regularStylesMinification = (): Promise<void> => {
  try {
    return new Promise((resolve, reject) => {
      src("src/styles/plain-css-minification/**/*.css")
        .on("error", (err: Error) => {
          reject(err)
        })
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(
          rename((path: RenamePath) => {
            path.dirname = ""
            path.extname = ".min.css"
          })
        )
        .pipe(dest("assets/"))
        .on("end", resolve)
        .on("error", reject)
    })
  } catch (e) {
    console.error(
      errorLogger(
        "An error occurred during the regular styles minification process.",
        e instanceof Error ? e : new Error(String(e)),
        __filename
      )
    )
    throw e
  }
} 