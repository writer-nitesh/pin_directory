<script setup lang="ts">
const config = useRuntimeConfig()

useHead({
  htmlAttrs: {
    lang: 'en',
  },
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'format-detection', content: 'telephone=no' },
  ],
  link: [
    { rel: 'icon', type: 'image/png', href: '/favicon.png' },
  ],
})

// Schema.org WebSite & Organization for Homepage / Root
useSchemaOrg([
  defineOrganization({
    name: 'Pin Directory',
    url: config.public.siteUrl as string,
    logo: `${config.public.siteUrl}/logo-512.png`,
  }),
  defineWebSite({
    name: 'Pin Directory',
    url: config.public.siteUrl as string,
    potentialAction: [
      {
        '@type': 'SearchAction',
        target: `${config.public.siteUrl}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    ],
  }),
])
</script>

<template>
  <div class="min-h-screen flex flex-col bg-zinc-50/50 text-zinc-900 selection:bg-sky-500 selection:text-white">
    <NuxtPwaManifest />
    <NuxtRouteAnnouncer />
    <AppHeader />
    <main class="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-8">
      <NuxtPage />
    </main>
    <AppFooter />
  </div>
</template>
