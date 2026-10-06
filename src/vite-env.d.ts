/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MAPTILER_API_KEY?: string;
  readonly VITE_TAMILNADU_MAP_API_KEY?: string;
  readonly VITE_MAP_API_KEY?: string;
  readonly VITE_MAPMYINDIA_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
