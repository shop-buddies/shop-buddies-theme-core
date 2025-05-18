export {}

declare global {
  interface DocumentEventMap {
    showToast: CustomEvent<{ message: string }>
  }
  interface Shopify {
    designMode: boolean
  }
  var Shopify: Shopify
}
