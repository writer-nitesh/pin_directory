<script setup lang="ts">
const route = useRoute()
const config = useRuntimeConfig()
const stateSlug = computed(() => String(route.params.state || ''))

const { data, error } = await useFetch(`/api/state/${stateSlug.value}`)

if (error.value || !data.value) {
  throw createError({
    statusCode: 404,
    statusMessage: `State ${stateSlug.value} not found.`,
    fatal: true,
  })
}

const state = computed(() => data.value.state)
const districts = computed(() => data.value.districts)
const topPincodes = computed(() => data.value.topPincodes)

// Canonical URL
const canonicalUrl = computed(() => `${config.public.siteUrl}/state/${stateSlug.value}/pincodes`)

// SEO Meta
const title = computed(() => `${state.value.statename} PIN Code List - Districts & Postal Codes`)
const description = computed(
  () => `Comprehensive list of PIN codes and post offices in ${state.value.statename}. Browse ${state.value.district_count} districts, ${state.value.pincode_count} postal codes, and ${state.value.office_count} post offices.`
)

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description,
  ogType: 'article',
})

useHead({
  link: [{ rel: 'canonical', href: canonicalUrl }],
})

// Breadcrumbs
const breadcrumbs = computed(() => [
  { name: 'States', path: '/states' },
  { name: state.value.statename, path: `/state/${stateSlug.value}/pincodes` },
])

// Filter districts
const searchQuery = ref('')
const filteredDistricts = computed(() => {
  const q = searchQuery.value.toLowerCase().trim()
  if (!q) return districts.value
  return districts.value.filter((d: any) => d.district.toLowerCase().includes(q))
})
</script>

<template>
  <div class="space-y-6 sm:space-y-8">
    <BreadcrumbNav :items="breadcrumbs" />

    <AdSlot placement="header-leaderboard" />

    <!-- State Hero Banner -->
    <div class="bg-white border border-zinc-200 rounded-md p-6 sm:p-8 shadow-xs space-y-4">
      <div class="flex items-center gap-2 mb-1">
        <span class="text-xs font-semibold uppercase tracking-wider text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
          State Postal Directory
        </span>
      </div>
      <h1 class="text-2xl sm:text-3xl md:text-4xl font-extrabold text-zinc-900 tracking-tight">
        {{ state.statename }} PIN Codes
      </h1>
      <p class="text-sm sm:text-base text-zinc-600 max-w-3xl">
        Explore all postal districts, post offices, and 6-digit PIN codes across {{ state.statename }}.
      </p>

      <!-- Stats Grid -->
      <div class="grid grid-cols-3 gap-4 pt-2">
        <div class="p-3.5 rounded-md bg-zinc-50 border border-zinc-100 text-center">
          <span class="text-xs text-zinc-500 block">Districts</span>
          <span class="text-xl sm:text-2xl font-extrabold text-zinc-900 font-mono">{{ state.district_count }}</span>
        </div>
        <div class="p-3.5 rounded-md bg-zinc-50 border border-zinc-100 text-center">
          <span class="text-xs text-zinc-500 block">PIN Codes</span>
          <span class="text-xl sm:text-2xl font-extrabold text-sky-600 font-mono">{{ state.pincode_count }}</span>
        </div>
        <div class="p-3.5 rounded-md bg-zinc-50 border border-zinc-100 text-center">
          <span class="text-xs text-zinc-500 block">Post Offices</span>
          <span class="text-xl sm:text-2xl font-extrabold text-zinc-900 font-mono">{{ state.office_count }}</span>
        </div>
      </div>
    </div>

    <!-- Districts Section -->
    <div class="bg-white border border-zinc-200 rounded-md p-6 sm:p-8 shadow-xs space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 class="text-xl font-bold text-zinc-900 tracking-tight">Districts in {{ state.statename }}</h2>
          <p class="text-xs text-zinc-500">Select a district to view all constituent PIN codes and post offices</p>
        </div>

        <div class="w-full sm:w-64">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Filter districts..."
            class="w-full px-3.5 py-2 text-xs sm:text-sm rounded-md border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        <NuxtLink
          v-for="d in filteredDistricts"
          :key="d.district_slug"
          :to="`/district/${d.district_slug}/pincodes`"
          class="p-4 rounded-md border border-zinc-200 hover:border-sky-300 hover:bg-sky-50/20 transition flex items-center justify-between group"
        >
          <div>
            <div class="font-semibold text-zinc-900 group-hover:text-sky-600 transition text-sm">
              {{ d.district }}
            </div>
            <div class="text-xs text-zinc-500 mt-0.5">
              <span class="font-mono">{{ d.pincode_count }}</span> PINs • <span class="font-mono">{{ d.office_count }}</span> POs
            </div>
          </div>
          <UIcon name="i-heroicons-chevron-right" class="w-4 h-4 text-zinc-400 group-hover:text-sky-600 group-hover:translate-x-0.5 transition" />
        </NuxtLink>
      </div>
    </div>

    <AdSlot placement="in-content" />

    <!-- Sample Major PIN Codes -->
    <div v-if="topPincodes.length > 0" class="bg-white border border-zinc-200 rounded-md p-6 sm:p-8 shadow-xs space-y-4">
      <h2 class="text-lg font-bold text-zinc-900 tracking-tight">Major PIN Codes in {{ state.statename }}</h2>
      <div class="flex flex-wrap gap-2">
        <NuxtLink
          v-for="p in topPincodes"
          :key="p.pincode"
          :to="`/pincode/${p.pincode}`"
          class="px-3 py-1.5 rounded-md bg-zinc-50 border border-zinc-200 hover:border-sky-300 hover:bg-sky-50 text-xs font-mono font-semibold text-zinc-800 transition"
        >
          {{ p.pincode }} ({{ p.district }})
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
