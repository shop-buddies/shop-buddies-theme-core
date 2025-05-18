type SectionInitializer = () => void

interface SectionHandlers {
  init: SectionInitializer
}

export const registerSection = (
  className: string,
  handlers: SectionHandlers
) => {
  document.addEventListener("shopify:section:load", (event) => {
    if (
      event.target instanceof HTMLElement &&
      event.target.classList.contains(className)
    ) {
      console.log("Loaded " + className)
      setTimeout(() => {
        handlers.init()
        console.log("Initialized " + className)
      }, 0)
    }
  })
}
