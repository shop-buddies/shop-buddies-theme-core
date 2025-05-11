import fs from "fs"
import path from "path"
import { dynamicClassesReplacing } from "../utils/dynamic-classes-replacing.js"
import { injectSnippetCode } from "../utils/snippets-code-injecting.js"
import { dest, src } from "gulp"
import rename from "gulp-rename" 
import { errorLogger } from "../utils/error-logger.js"

interface SnippetSettings {
  folderName: string
  folderPath: string
  liquidPath: string
  styleFile: string
  injectStyles: boolean 
  styles: string
}

interface StyleModule {
  style: Record<string, string>
}

const snippetsPath = path.join(process.cwd(), "src", "snippets")

const utils = {
  validateFolder(folderPath: string): boolean {
    return fs.existsSync(folderPath) && fs.statSync(folderPath).isDirectory()
  },

  async renameAndMoveToFolder(newName: string, fileSrc: string, pathToMove: string): Promise<void> {
    return new Promise((resolve, reject) => {
      src(fileSrc)
        .pipe(
          rename((file) => {
            file.basename = newName
          })
        )
        .pipe(dest(pathToMove))
        .on("end", resolve)
        .on("error", reject)
    })
  },

  async loadStyleModule(styleModulesObjectFile: string): Promise<StyleModule | null> {
    if (fs.existsSync(styleModulesObjectFile)) {
      try {
        const timestamp = Date.now()
        const module = await import(`file://${styleModulesObjectFile}?t=${timestamp}`)
        return module.style
      } catch (error) {
        console.error(
          `Failed to load style module: ${styleModulesObjectFile}`,
          error
        )
      }
    } else {
      console.warn(`Style module file not found: ${styleModulesObjectFile}`)
    }
    return null
  },

  async processSnippetFolder(settings: SnippetSettings): Promise<void> {
    if (!fs.existsSync(settings.liquidPath)) {
      throw new Error(`Snippet folder does not exist: ${settings.liquidPath}`)
    }

    try {
      if (fs.existsSync(settings.styleFile)) {
        settings.injectStyles = true
        const styleModulesObject = await injectSnippetCode(settings)

        if (styleModulesObject) {
          const techFolderPath = path.join(
            settings.folderPath,
            "_tech-do-not-modify"
          )
          await dynamicClassesReplacing(
            path.join(techFolderPath, `sbc-${settings.folderName}.liquid`),
            styleModulesObject,
            "./snippets/"
          )
        }
      } else {
        await utils.renameAndMoveToFolder(
          `sbc-${settings.folderName}`,
          settings.liquidPath,
          "./snippets/"
        )
      }
    } catch (error) {
      console.error(
        `Failed to process snippet folder ${settings.folderName}:`,
        error instanceof Error ? error.message : String(error)
      )
    }
  },
}

export const snippetsCompilation = async (param?: string): Promise<void> => {
  try {
    if (typeof param === "string") {
      const folderPath = path.join(snippetsPath, param)

      const settings: SnippetSettings = {
        folderName: param,
        folderPath,
        liquidPath: path.join(folderPath, "snippet.liquid"),
        styleFile: path.join(folderPath, "style.module.scss"),
        injectStyles: false,
        styles: "",
      }
      await utils.processSnippetFolder(settings)
    } else {
      const folders = fs
        .readdirSync(snippetsPath)
        .filter((file) => utils.validateFolder(path.join(snippetsPath, file)))

      await Promise.all(
        folders.map(async (folder) => {
          const folderPath = path.join(snippetsPath, folder)

          const settings: SnippetSettings = {
            folderName: folder,
            folderPath,
            liquidPath: path.join(folderPath, "snippet.liquid"),
            styleFile: path.join(folderPath, "style.module.scss"),
            injectStyles: false,
            styles: "",
          }

          await utils.processSnippetFolder(settings)
        })
      )
    }
  } catch (e) {
    console.error(
      errorLogger(
        "An error occurred during snippetsCompilation process",
        e instanceof Error ? e : new Error(String(e)),
        __filename
      )
    )
  }
} 