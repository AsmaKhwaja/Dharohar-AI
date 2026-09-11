/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WATSONX_API_KEY: string
  readonly VITE_WATSONX_PROJECT_ID: string
  readonly VITE_WATSONX_API_URL: string
  readonly VITE_GRANITE_MODEL: string
  readonly VITE_DEMO_MODE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
