import { promises as fs } from "fs"
import { dest, src } from "gulp"
import tailwindcss from "tailwindcss"
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

export const tailwindStylesCompilation = async (): Promise<void> => {
  const targetFile = "assets/sbc-tailwind-core.min.css"

  try {
    await fs.unlink(targetFile).catch((err: NodeJS.ErrnoException) => {
      if (err.code !== "ENOENT") throw err
    })

    return new Promise((resolve, reject) => {
      src("src/styles/tailwind/tailwind-core.css")
        .on("error", (err: Error) => {
          console.error(
            errorLogger("Error in Tailwind Style Compilation", err, __filename)
          )
          reject(err)
        })
        .pipe(
          postcss([
            tailwindcss("./tailwind.config.js"),
            autoprefixer(),
            cssnano(),
          ])
        )
        .pipe(
          rename((path: RenamePath) => {
            path.dirname = ""
            path.basename = `sbc-tailwind-core`
            path.extname = ".min.css"
          })
        )
        .pipe(dest("assets/"))
        .on("end", resolve)
        .on("error", reject)
    })
  } catch (err) {
    console.error(
      errorLogger(
        "Error in Deleting Existing File",
        err instanceof Error ? err : new Error(String(err)),
        __filename
      )
    )
    throw err
  }
} 