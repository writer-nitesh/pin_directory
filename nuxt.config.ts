// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,

  modules: [
    "@pinia/nuxt",
    "@nuxt/ui",
    "@nuxtjs/seo",
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxt/content",
  ],

  devtools: { enabled: true },

  colorMode: {
    preference: 'light',
    fallback: 'light',
  },

  css: ["~/assets/css/main.css"],

  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || "https://pindirectory.in",
      siteName: "Pin Directory",
      siteDescription:
        "Find postal codes, post offices, and addresses across all states and districts in India.",
      showAds: process.env.NUXT_PUBLIC_SHOW_ADS === "true",
      adsenseClient: process.env.NUXT_PUBLIC_ADSENSE_CLIENT || "",
    },
  },

  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL || "https://pindirectory.in",
    name: "Pin Directory",
    description: "Find postal codes, post offices, and addresses across India.",
    defaultLocale: "en",
  },

  robots: {
    disallow: ['/search'],
  },

  sitemap: {
    sources: [
      '/api/sitemap-urls',
    ],
  },

  nitro: {
    externals: {
      external: ['better-sqlite3'],
    },
  },

  compatibilityDate: "2024-04-03",
});
