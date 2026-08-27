<script setup lang="ts">
const config = useRuntimeConfig()

useSeoMeta({
  title: 'Indian Postal Guides - How PIN Codes, Zones & Delivery Systems Work',
  description: 'Learn about Indian postal index numbers (PIN codes), postal zones, delivery post office structures, and how to find correct addresses.',
})

useHead({
  link: [{ rel: 'canonical', href: `${config.public.siteUrl}/guides` }],
})

const guides = [
  {
    title: 'What is a PIN Code in India?',
    slug: 'what-is-a-pincode',
    summary: 'A detailed introduction to the 6-digit Postal Index Number system introduced by India Post in 1972.',
    readTime: '4 min read',
  },
  {
    title: 'How India PIN Codes Work (Digits Breakdown)',
    slug: 'how-india-pincodes-work',
    summary: 'Understanding the anatomy of a PIN code: from geographical zones and sub-regions down to individual delivery post offices.',
    readTime: '5 min read',
  },
  {
    title: 'Indian Postal Zones & Regional Divisions',
    slug: 'pincode-format-zones',
    summary: 'Complete breakdown of all 9 Indian postal zones covering 28 states, 8 union territories, and the Army Postal Service (APS).',
    readTime: '6 min read',
  },
]
</script>

<template>
  <div class="space-y-6">
    <BreadcrumbNav :items="[{ name: 'Guides', path: '/guides' }]" />

    <AdSlot placement="header-leaderboard" />

    <div class="bg-white border border-zinc-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
      <div class="flex items-center gap-2 mb-1">
        <span class="text-xs font-semibold uppercase tracking-wider text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
          Educational Resources
        </span>
      </div>

      <h1 class="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
        Indian Postal System Guides
      </h1>
      <p class="text-sm sm:text-base text-zinc-600 max-w-3xl">
        Authoritative guides explaining the architecture, history, and mechanics of the Indian Postal Index Number (PIN) system.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <NuxtLink
        v-for="g in guides"
        :key="g.slug"
        :to="`/guides/${g.slug}`"
        class="p-6 rounded-2xl bg-white border border-zinc-200 hover:border-sky-300 hover:shadow-md transition flex flex-col justify-between group space-y-4"
      >
        <div class="space-y-2">
          <span class="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider font-mono">{{ g.readTime }}</span>
          <h2 class="text-lg font-bold text-zinc-900 group-hover:text-sky-600 transition">
            {{ g.title }}
          </h2>
          <p class="text-xs text-zinc-600 leading-relaxed">
            {{ g.summary }}
          </p>
        </div>

        <div class="pt-2 flex items-center text-xs font-semibold text-sky-600">
          <span>Read Full Guide</span>
          <UIcon name="i-heroicons-arrow-right" class="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition" />
        </div>
      </NuxtLink>
    </div>

    <AdSlot placement="in-content" />
  </div>
</template>
