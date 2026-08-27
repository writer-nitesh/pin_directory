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
  <div class="max-w-3xl mx-auto space-y-6">
    <BreadcrumbNav :items="breadcrumbs" />

    <AdSlot placement="header-leaderboard" />

    <article class="bg-white border border-zinc-200 rounded-2xl p-6 sm:p-10 shadow-xs space-y-6">
      <div class="space-y-2 border-b border-zinc-100 pb-6">
        <span class="text-xs font-semibold uppercase tracking-wider text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
          Postal Guide
        </span>
        <h1 class="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
          {{ page.title }}
        </h1>
        <p v-if="page.description" class="text-sm sm:text-base text-zinc-600">
          {{ page.description }}
        </p>
      </div>

      <div class="prose prose-zinc max-w-none text-zinc-700 text-sm sm:text-base leading-relaxed space-y-4">
        <ContentRenderer :value="page" />
      </div>
    </article>

    <AdSlot placement="in-content" />
  </div>
</template>
