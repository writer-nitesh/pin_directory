<script setup lang="ts">
const config = useRuntimeConfig()

// SEO Meta
const title = 'All India PIN Codes by State - 37 States & Union Territories'
const description = 'Browse Indian postal PIN codes across all 37 states and union territories. Explore 750+ districts and 165,000+ post offices in India.'

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description,
  ogType: 'website',
})

useHead({
  link: [{ rel: 'canonical', href: `${config.public.siteUrl}/states` }],
})

const { data } = await useFetch('/api/states')
const states = computed(() => data.value?.states || [])

const searchQuery = ref('')
const filteredStates = computed(() => {
  const q = searchQuery.value.toLowerCase().trim()
  if (!q) return states.value
  return states.value.filter((s: any) => s.statename.toLowerCase().includes(q))
})

const breadcrumbs = [
  { name: 'States', path: '/states' },
]
</script>

<template>
  <div class="space-y-6 sm:space-y-8">
    <BreadcrumbNav :items="breadcrumbs" />

    <AdSlot placement="header-leaderboard" />

    <!-- Hero -->
    <div class="bg-white border border-zinc-200 rounded-md p-6 sm:p-8 shadow-xs space-y-4">
      <div class="flex items-center gap-2 mb-1">
        <span class="text-xs font-semibold uppercase tracking-wider text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
          National Directory
        </span>
      </div>

      <h1 class="text-2xl sm:text-3xl md:text-4xl font-extrabold text-zinc-900 tracking-tight">
        Indian States & Union Territories
      </h1>
      <p class="text-sm sm:text-base text-zinc-600 max-w-3xl">
        Select any Indian state or union territory to explore its districts, postal divisions, post offices, and active 6-digit PIN codes.
      </p>

      <div class="pt-2 max-w-md">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Filter states (e.g. Maharashtra, Delhi, Karnataka)..."
          class="w-full px-4 py-2.5 text-sm rounded-md border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
      </div>
    </div>

    <!-- States Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <NuxtLink
        v-for="s in filteredStates"
        :key="s.state_slug"
        :to="`/state/${s.state_slug}/pincodes`"
        class="p-5 rounded-md bg-white border border-zinc-200 hover:border-sky-300 hover:shadow-md transition group flex flex-col justify-between"
      >
        <div class="flex items-center justify-between mb-2">
          <h2 class="font-bold text-base text-zinc-900 group-hover:text-sky-600 transition">
            {{ s.statename }}
          </h2>
          <UIcon name="i-heroicons-arrow-right" class="w-4 h-4 text-zinc-400 group-hover:text-sky-600 group-hover:translate-x-1 transition" />
        </div>

        <div class="grid grid-cols-3 gap-2 pt-2 border-t border-zinc-100 text-center text-xs">
          <div>
            <span class="text-zinc-600 block text-[11px]">Districts</span>
            <span class="font-bold text-zinc-900 font-mono">{{ s.district_count }}</span>
          </div>
          <div>
            <span class="text-zinc-600 block text-[11px]">PINs</span>
            <span class="font-bold text-sky-600 font-mono">{{ s.pincode_count }}</span>
          </div>
          <div>
            <span class="text-zinc-600 block text-[11px]">Offices</span>
            <span class="font-bold text-zinc-900 font-mono">{{ s.office_count }}</span>
          </div>
        </div>
      </NuxtLink>
    </div>

    <AdSlot placement="in-content" />
  </div>
</template>
