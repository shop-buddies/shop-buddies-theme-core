import z from "zod"

export const sectionDataSchema = z.object({
  sectionName: z.string(),
  sectionID: z.string(),
  pathHelper: z.string(),
})
export type SectionData = z.infer<typeof sectionDataSchema>

export const sectionsAssetLoader = function (): string {
  const assets = document.querySelectorAll(`.json-section-asset`)
  const scriptsList: string[] = []
  let assetsPath: string = ""
  assets.forEach((asset) => {
    if (asset instanceof HTMLElement) {
      const dataResult = sectionDataSchema.safeParse(
        JSON.parse(asset.innerHTML)
      )
      if (dataResult.success && asset.parentElement) {
        const fileName = `sbc-${dataResult.data.sectionName}.min.js`
        if (assetsPath === "") {
          assetsPath = dataResult.data.pathHelper.split(`path-helper`)[0]
        }
        if (!scriptsList.includes(fileName) && assetsPath) {
          const scriptElement = document.createElement("script")
          scriptElement.src = `${assetsPath}${fileName}`
          asset.parentElement.appendChild(scriptElement)
          scriptsList.push(fileName)
        }
      }
    }
  })
  return assetsPath
}
