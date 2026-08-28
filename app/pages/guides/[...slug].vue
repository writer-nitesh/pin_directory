<script setup lang="ts">
const route = useRoute()
const config = useRuntimeConfig()
const slug = computed(() => {
  const s = route.params.slug
  return Array.isArray(s) ? s.join('/') : s || ''
})

const { data: page, error } = await useAsyncData(`guide-${slug.value}`, () => {
  return queryCollection('content').path(`/guides/${slug.value}`).first()
})

if (error.value || !page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Guide article not found.',
    fatal: true,
  })
}

const canonicalUrl = computed(() => `${config.public.siteUrl}/guides/${slug.value}`)

useSeoMeta({
  title: `${page.value.title} - Pin Directory`,
  ogTitle: `${page.value.title} - Pin Directory`,
  description: page.value.description,
  ogDescription: page.value.description,
  ogType: 'article',
})

useHead({
  link: [{ rel: 'canonical', href: canonicalUrl }],
})

const breadcrumbs = computed(() => [
  { name: 'Guides', path: '/guides' },
  { name: page.value?.title || 'Article', path: `/guides/${slug.value}` },
])

useSchemaOrg([
  defineArticle({
    headline: page.value.title,
    description: page.value.description,
  }),
])
</script>

<template>
  <div class="space-y-6 sm:space-y-8">
    <BreadcrumbNav :items="breadcrumbs" />

    <AdSlot placement="header-leaderboard" />

    <!-- Editorial Article: Centered readable column matching site layout -->
    <article class="max-w-3xl mx-auto py-2">
      <header class="space-y-3 border-b border-zinc-200 pb-6 mb-8">
        <div class="flex items-center gap-2">
          <span class="text-xs font-semibold uppercase tracking-wider text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md">
            Postal Guide
          </span>
        </div>

        <h1 class="text-2xl sm:text-3xl md:text-4xl font-extrabold text-zinc-900 tracking-tight leading-tight">
          {{ page.title }}
        </h1>

        <p v-if="page.description" class="text-sm sm:text-base text-zinc-600 leading-relaxed font-normal">
          {{ page.description }}
        </p>

        <!-- Minimal Author & Metadata Bar -->
        <div class="flex flex-wrap items-center gap-3 pt-2 text-xs text-zinc-500">
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-[10px]">
              PD
            </div>
            <span class="font-medium text-zinc-800">Pin Directory Editorial</span>
          </div>
          <span>•</span>
          <span>Updated for 2026</span>
          <span>•</span>
          <span class="font-mono">5 min read</span>
        </div>
      </header>

      <!-- Minimal Prose Content -->
      <div class="prose prose-zinc sm:prose-lg max-w-none text-zinc-800 leading-relaxed space-y-6">
        <ContentRenderer :value="page" />
      </div>

      <!-- Post-Article Actions -->
      <div class="mt-12 pt-8 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <NuxtLink
          to="/guides"
          class="inline-flex items-center gap-2 text-sm font-semibold text-sky-600 hover:text-sky-700"
        >
          <UIcon name="i-heroicons-arrow-left" class="w-4 h-4" />
          <span>Back to All Guides</span>
        </NuxtLink>

        <NuxtLink
          to="/"
          class="inline-flex items-center gap-2 text-sm font-semibold text-zinc-600 hover:text-zinc-900"
        >
          <span>Search PIN Codes</span>
          <UIcon name="i-heroicons-arrow-right" class="w-4 h-4" />
        </NuxtLink>
      </div>
    </article>

    <AdSlot placement="in-content" />
  </div>
</template>
