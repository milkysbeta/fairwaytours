/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Optional. When set, the calendar sources its live forecast from OpenWeather
   * instead of Open-Meteo. OpenWeather's free tier reaches 5 days; Open-Meteo
   * reaches 16 and needs no key, so leaving this unset is the better default.
   */
  readonly VITE_OPENWEATHER_KEY?: string
  /** Set by the client-preview packer so routing works without a server. */
  readonly VITE_HASH_ROUTER?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
