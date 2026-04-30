/// <reference types="vite/client" />

interface ViteEnv {
  VITE_SHOPIFY_STORE_DOMAIN?: string
  VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN?: string
  VITE_USE_SHOPIFY_BUY_SDK?: string
}

declare global {
  interface ImportMetaEnv extends ViteEnv {}
  var import.meta: ImportMeta
}