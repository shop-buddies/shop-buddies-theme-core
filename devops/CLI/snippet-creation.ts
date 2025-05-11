import fs from "fs/promises"
import path from "path"
import readline from "readline"
import { colors } from "../colors.js"
import { paths } from "../paths.js"

interface FileContent {
  name: string
  content: string
}

interface SnippetConfig {
  name: string
  includeStyles: boolean
}

class SnippetCreator {
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

  private generateLiquidSnippet(snippetName: string, hasStyles: boolean): string {
    const snippetNameWithSpaces = snippetName.replace(/-/g, " ")
    const snippetNameWithSpacesCapitalized = snippetNameWithSpaces.replace(
      /\b\w/g,
      (char) => char.toUpperCase()
    )
    
    return hasStyles 
      ? `{% comment %}
    Snippet: ${snippetNameWithSpacesCapitalized}
    Usage:
    { % render 'sbc-${snippetName}' %}
{% endcomment %}

<div class="<%= styles.${snippetNameWithSpacesCapitalized.replace(/\s/g, '')} %>">
</div>`
      : `{% comment %}
    Snippet: ${snippetNameWithSpacesCapitalized}
    Usage:
    {% render '${snippetName}' %}
{% endcomment %}

<div>
</div>`
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

  private async validateSnippetName(snippetName: string): Promise<boolean> {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(snippetName)) {
      console.error(
        `${colors.red}Error: Snippet name must be in kebab-case format (e.g., my-new-snippet)`
      )
      return false
    }

    const snippetDir = path.join(paths.snippets, snippetName)
    try {
      await fs.access(path.join(snippetDir, "snippet.liquid"))
      console.error(
        `${colors.red}Error: Snippet "${snippetName}" already exists`
      )
      return false
    } catch {
      return true
    }
  }

  private async createFiles(snippetName: string, config: SnippetConfig): Promise<void> {
    const files: FileContent[] = [
      {
        name: "snippet.liquid",
        content: this.generateLiquidSnippet(snippetName, config.includeStyles),
      }
    ]

    if (config.includeStyles) {
      files.push({
        name: "style.module.scss",
        content: this.generateScssModule(),
      })
    }

    await Promise.all(
      files.map((file) =>
        fs.writeFile(path.join(paths.snippets, snippetName, file.name), file.content, "utf8")
      )
    )

    console.log(`${colors.green}Snippet "${snippetName}" created successfully!`)
    console.log(`${colors.blue}\nCreated files:`)
    files.forEach((file) => {
      console.log(`- src/snippets/${snippetName}/${file.name}`)
    })
  }

  public async createSnippet(): Promise<void> {
    try {
      const snippetName = await this.question("Enter snippet name (in kebab-case): ")
      
      if (!(await this.validateSnippetName(snippetName))) {
        this.rl.close()
        return
      }

      const includeStyles = (await this.question("Do you need styles for this snippet? (y/n): ")).toLowerCase() === "y"
      await fs.mkdir(path.join(paths.snippets, snippetName), { recursive: true })
      await this.createFiles(snippetName, { name: snippetName, includeStyles })
    } catch (error) {
      console.error(`${colors.red}Error creating snippet:`, error)
    } finally {
      this.rl.close()
    }
  }
}

new SnippetCreator().createSnippet() 