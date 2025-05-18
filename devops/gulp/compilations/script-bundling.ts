import { src, dest } from "gulp"
import rename from "gulp-rename"
import esbuild from "gulp-esbuild"
import { errorLogger } from "../utils/error-logger.js"
import { fileURLToPath } from "url"
import { pipeline } from "stream/promises" 

const __filename = fileURLToPath(import.meta.url)

interface ScriptBundlingOptions {
  filePath: string;
  outputName: string;
}

export const scriptBundling = async ({ filePath, outputName }: ScriptBundlingOptions): Promise<void> => {
  try {
    await pipeline(
      src(filePath),
      esbuild({
        bundle: true,
        minify: true,
        platform: "browser",
        sourcemap: false,
        loader: {
          ".js": "js",
          ".jsx": "jsx",
          ".ts": "ts",
          ".tsx": "tsx",
        },
      }),
      rename((file) => {
        file.basename = outputName
        file.extname = ".min.js"
      }),
      dest("./assets")
    )
  } catch (error) {
    console.error(
      errorLogger(
        "An error occurred during the script bundling process.",
        error instanceof Error ? error : new Error(String(error)),
        __filename
      )
    )
    throw error
  }
}
