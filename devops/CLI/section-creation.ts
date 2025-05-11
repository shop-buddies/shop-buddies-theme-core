import fs from "fs/promises"
import path from "path"
import readline from "readline"
import { colors } from "../colors.js"
import { paths } from "../paths.js"


interface FileContent {
  name: string
  content: string
}

interface SectionConfig {
  name: string
  includeScripts: boolean
}

class SectionCreator {
  private rl: readline.Interface

  constructor() {
    this.rl = readline.createInterface({  
      input: process.stdin,
      output: process.stdout,
    })
  }

  private async question(query: string): Promise<string> {
    return new Promise((resolve) => {
      this.rl.question(`${colors.cyan}? ${query}${colors.reset}`, (answer) => {
        console.log(`${colors.magenta}✓ ${answer}${colors.reset}`)
        resolve(answer)
      })
    })
  }

  private generateLiquidTemplate(sectionName: string): string {
    const sectionNameWithSpaces = sectionName.replace(/-/g, " ")
    const sectionNameWithSpacesCapitalized = sectionNameWithSpaces.replace(
      /\b\w/g,
      (char) => char.toUpperCase()
    )
    return `
<div class="<%= styles.${sectionNameWithSpacesCapitalized.replace(/\s/g, '')} %>">
</div>

{% schema %}
{
  "name": "${sectionNameWithSpacesCapitalized}",
  "tag": "section",
  "class": "js-${sectionName.toLowerCase()}",
  "settings": [],
  "blocks": [],
  "presets": [
    {
      "name": "${sectionNameWithSpacesCapitalized}"
    }
  ]
}
{% endschema %}`
  }

  private generateScssModule(): string {
    return `
@use "../../core/scss/units" as u;
@use "../../core/scss/settings" as s;
@use "../../core/scss/colors" as c;
@use "../../core/scss/mq" as m;

// Your styles here
`
  }

  private generateTypeScript(sectionName: string): string {
    return `
const SECTION_CLASS = "js-${sectionName.toLowerCase()}"

const initializeSection = (wrapper: HTMLElement): void => {
  // Initialization code starts here
  // Add your logic here
  // Initialization code ends here
}

const sectionInit = (): void => {
  const sectionWrappers = document.querySelectorAll(\`.\${SECTION_CLASS}\`)
  sectionWrappers.forEach((wrapper) => {
    if (!wrapper.classList.contains("initialized") && wrapper instanceof HTMLElement) {
      initializeSection(wrapper)
      wrapper.classList.add("initialized")
    }
  })
}
sectionInit()

export const ${sectionName.toUpperCase().replace(/-/g, "_")}_SECTION_SETTINGS = {
  class: SECTION_CLASS,
  init: sectionInit,
}
// This is mandatory to register the section for the theme customizer. 
// Don't forget to add registerSection(...) in the core/theme-customizer/index.ts file.
/*  
  Example:

    import { ${sectionName.toUpperCase().replace(/-/g, "_")}_SECTION_SETTINGS } from "../../sections/${sectionName}"

    registerSection(${sectionName.toUpperCase().replace(/-/g, "_")}_SECTION_SETTINGS.class, {
      init: ${sectionName.toUpperCase().replace(/-/g, "_")}_SECTION_SETTINGS.init
    })
*/
    `
  }

  private async validateSectionName(sectionName: string): Promise<boolean> {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(sectionName)) {
      console.error(
        `${colors.red}Error: Section name must be in kebab-case format (e.g., my-new-section)`
      )
      return false
    }

    const sectionDir = path.join(paths.sections, sectionName)
    try {
      await fs.access(sectionDir)
      console.error(
        `${colors.red}Error: Section "${sectionName}" already exists`
      )
      return false
    } catch {
      return true
    }
  }

  private async createFiles(sectionName: string, config: SectionConfig): Promise<void> {
    const files: FileContent[] = [
      {
        name: "section.liquid",
        content: this.generateLiquidTemplate(sectionName),
      },
      {
        name: "style.module.scss",
        content: this.generateScssModule(),
      },
    ]

    if (config.includeScripts) {
      files.push({
        name: "index.ts",
        content: this.generateTypeScript(sectionName),
      })
    }

    await Promise.all(
      files.map((file) =>
        fs.writeFile(path.join(paths.sections, sectionName, file.name), file.content, "utf8")
      )
    )

    console.log(`${colors.green}Section "${sectionName}" created successfully!`)
    console.log(`${colors.blue}\nCreated files:`)
    files.forEach((file) => {
      console.log(`- src/sections/${sectionName}/${file.name}`)
    })
  }

  public async createSection(): Promise<void> {
    try {
      const sectionName = await this.question("Enter section name (in kebab-case): ")
      
      if (!(await this.validateSectionName(sectionName))) {
        this.rl.close()
        return
      }

      const includeScripts = (await this.question("Include TypeScript file? (y/n): ")).toLowerCase() === "y"
      await fs.mkdir(path.join(paths.sections, sectionName), { recursive: true })
      await this.createFiles(sectionName, { name: sectionName, includeScripts })
    } catch (error) {
      console.error(`${colors.red}Error creating section:`, error)
    } finally {
      this.rl.close()
    }
  }
}

new SectionCreator().createSection() 