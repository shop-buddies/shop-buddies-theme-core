import fs from "fs"
import path from "path"
import { scriptBundling } from "./script-bundling.js"
import { injectSectionCode } from "../utils/section-code-injecting.js"
import { dynamicClassesReplacing } from "../utils/dynamic-classes-replacing.js"
import { errorLogger } from "../utils/error-logger.js"
import { fileURLToPath } from "url"

interface SectionSettings {
  folderName: string
  scriptFile: string
  liquidPath: string
  styleFile: string
  injectScriptCode: boolean
  scriptCode: string
  injectStyles: boolean
  styles: string
  folderPath: string
}

interface StyleModule {
  style: Record<string, string>
}

const __filename = fileURLToPath(import.meta.url)
const sectionsPath = path.join(process.cwd(), "src", "sections")

const utils = {
  async getStyleModules(filePath: string): Promise<StyleModule['style'] | undefined> {
    try {
      const timestamp = Date.now()
      const module = await import(`file://${filePath}?t=${timestamp}`) as StyleModule
      return module.style
    } catch (error) {
      console.error(`Failed to load style module: ${filePath}`, error)
    }
  },

  async processFolder(folder: string): Promise<void> {
    const folderPath = path.join(sectionsPath, folder)
    const scriptTsFile = path.join(folderPath, "index.ts")
    const scriptTsxFile = path.join(folderPath, "index.tsx")
    
    const settings: SectionSettings = {
      folderName: folder,
      scriptFile: fs.existsSync(scriptTsFile)
        ? scriptTsFile
        : fs.existsSync(scriptTsxFile)
          ? scriptTsxFile
          : "",
      liquidPath: path.join(folderPath, "section.liquid"),
      styleFile: path.join(folderPath, "style.module.scss"),
      injectScriptCode: false,
      scriptCode: `<script class="json-section-asset" type="application/json">{"sectionName":"${folder}", "sectionID":"{{ section.id }}", "pathHelper":"{{ 'path-helper.dummy' | asset_url }}"}</script>`,
      injectStyles: false,
      styles: "",
      folderPath,
    }

    if (!fs.existsSync(settings.liquidPath)) {
      return
    }

    try {
      if (fs.existsSync(settings.scriptFile)) {
        await scriptBundling({ filePath: settings.scriptFile, outputName: `sbc-${folder}` })
        settings.injectScriptCode = true
      }

      if (fs.existsSync(settings.styleFile)) {
        settings.injectStyles = true
      }

      const result = await injectSectionCode(settings)

      if (settings.injectStyles && result) {
        const styleModulesObjectFile = path.join(folderPath, "style.module.js")
        const styleModulesObject = await this.getStyleModules(styleModulesObjectFile)
        
        if (styleModulesObject) {
          await dynamicClassesReplacing(
            path.join(
              folderPath,
              "_tech-do-not-modify",
              `sbc-${settings.folderName}.liquid`
            ),
            styleModulesObject,
            "./sections/"
          )
        }
      }
    } catch (error) {
      throw error
    }
  },
}

export const sectionsCompilation = async (param?: string): Promise<void> => {
  try {
    if (typeof param === "string") {
      await utils.processFolder(param).catch((error: Error) => {
        console.error(`Error processing folder ${param}:`, error.message)
      })
    } else {
      const folders = fs
        .readdirSync(sectionsPath)
        .filter((file) =>
          fs.statSync(path.join(sectionsPath, file)).isDirectory()
        )

      await Promise.all(folders.map((folder) => {
        utils.processFolder(folder).catch((error: Error) => {
          console.error(`Error processing folder ${folder}:`, error.message)
        })
      }))
    }
  } catch (e) {
    console.error(
      errorLogger(
        "An error occurred during the section compilation process.",
        e instanceof Error ? e : new Error(String(e)),
        __filename
      )
    )
  }
} 