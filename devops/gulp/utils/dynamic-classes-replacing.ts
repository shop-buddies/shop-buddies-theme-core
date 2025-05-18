import { dest, src } from "gulp"
import ejs from "gulp-ejs"
import fs from "fs/promises"
import path from "path"

interface StylesObject {
  [key: string]: string
}

const waitForFileSystem = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms))

export const dynamicClassesReplacing = async (
  pathToFile: string,
  stylesObject: StylesObject,
  destPath: string
): Promise<void> => {
  if (!pathToFile || typeof pathToFile !== 'string') {
    console.error('Invalid pathToFile: Must be a non-empty string')
    return
  }
  if (!stylesObject || typeof stylesObject !== 'object' || Array.isArray(stylesObject)) {
    console.error('Invalid stylesObject: Must be a non-null object')
    return
  }
  if (!destPath || typeof destPath !== 'string') {
    console.error('Invalid destPath: Must be a non-empty string')
    return
  }

  const result = path.join(destPath, path.basename(pathToFile))
  try {
    await fs.unlink(result).catch((err: NodeJS.ErrnoException) => {
      if (err.code !== "ENOENT") throw err
    })
    await waitForFileSystem(500)

    return new Promise((resolve, reject) => {
      const stream = src(pathToFile)
        .pipe(
          ejs({ styles: stylesObject, ext: '.liquid' }).on("error", (err: Error) => {
            console.error("EJS Rendering Error:", err.message)
            reject(err)
          })
        )
        .pipe(dest(destPath))
        .on('finish', async () => {
          await waitForFileSystem(500)
          resolve()
        })
        .on('error', reject)
    })
  } catch (err) {
    console.error(
      `Error in dynamicClassesReplacing: ${err instanceof Error ? err.message : String(err)}`
    )
    throw err
  }
} 