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
    "nuxt-llms",
  ],

  devtools: { enabled: true },

  colorMode: {
    preference: "light",
    fallback: "light",
  },

  css: ["~/assets/css/main.css"],

  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || "https://pindirectory.in",
      siteName: "Pin Directory",
      siteDescription:
        "Find postal codes, post offices, and addresses across all states and districts in India.",
      showAds: process.env.NUXT_PUBLIC_SHOW_ADS === "true",
      adsEnabled: process.env.NUXT_PUBLIC_ADS_ENABLED !== "false",
      adsenseClient: process.env.NUXT_PUBLIC_ADSENSE_CLIENT || "",
    },
  },

  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      htmlAttrs: { lang: "en" },
      meta: [
        ...(process.env.NUXT_PUBLIC_ADSENSE_CLIENT
          ? [
              {
                name: "google-adsense-account",
                content: process.env.NUXT_PUBLIC_ADSENSE_CLIENT,
              },
            ]
          : []),
        {
          name: "robots",
          content:
            "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
        },
      ],
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
  },

  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL || "https://pindirectory.in",
    name: "Pin Directory",
    description:
      "Find postal codes, post offices, and addresses across all states and districts in India.",
    defaultLocale: "en",
    trailingSlash: false,
  },

  linkChecker: {
    enabled: false,
  },

  routeRules: {
    "/about": { prerender: true },
    "/privacy": { prerender: true },
    "/terms": { prerender: true },
    "/states": { prerender: true },
    "/find-my-pincode": { prerender: true },
    "/privacy-policy": { redirect: { to: "/privacy", statusCode: 301 } },
    "/search": { robots: "noindex, follow" },
    // Block internal Nuxt module endpoints from indexing
    "/_scripts/**": { robots: false },
    "/_studio/**": { robots: false },
    "/_nuxt/**": { robots: false },
  },

  icon: {
    fallbackToApi: false,
    clientBundle: {
      scan: true,
      includeCustomCollections: true,
    },
    serverBundle: false,
  },

  ogImage: {
    compatibility: {
      prerender: {
        browser: false,
      },
    },
    defaults: {
      width: 1200,
      height: 630,
    },
  },

  schemaOrg: {
    identity: {
      type: "Organization",
      name: "Pin Directory",
      url: process.env.NUXT_PUBLIC_SITE_URL || "https://pindirectory.in",
      logo: "/favicon.ico",
    },
  },

  sitemap: {
    sources: ["/api/sitemap-urls"],
    exclude: ["/search", "/_scripts/**", "/_studio/**"],
    defaults: { changefreq: "weekly", priority: 0.7 },
  },

  robots: {
    groups: [
      {
        userAgent: [
          "GPTBot",
          "OAI-SearchBot",
          "ChatGPT-User",
          "Google-Extended",
          "ClaudeBot",
          "anthropic-ai",
          "PerplexityBot",
          "CCBot",
          "Applebot-Extended",
          "YepBot",
        ],
        allow: ["/"],
      },
      {
        userAgent: ["*"],
        disallow: ["/search"],
      },
    ],
  },

  llms: {
    domain: process.env.NUXT_PUBLIC_SITE_URL || "https://pindirectory.in",
    title: "Pin Directory",
    description: "Indian Postal Code and Post Office Directory",
    contentRawMarkdown: {
      excludeCollections: [],
      rewriteLLMSTxt: false,
    },
  },

  nitro: {
    preset: "cloudflare-module",
    cloudflare: {
      deployConfig: true,
    },
    prerender: {
      autoSubfolderIndex: false,
    },
    externals: {
      external: ["better-sqlite3"],
    },
  },

  compatibilityDate: "2026-06-30",
});
