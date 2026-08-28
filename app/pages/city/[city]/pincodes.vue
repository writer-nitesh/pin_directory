<script setup lang="ts">
const route = useRoute()
const config = useRuntimeConfig()
const cityParam = computed(() => String(route.params.city || '').toLowerCase().trim())

const { data, error } = await useFetch(() => `/api/city/${cityParam.value}`, {
  key: `city-${cityParam.value}`,
})

if (error.value || !data.value) {
  throw createError({
    statusCode: 404,
    statusMessage: `City ${cityParam.value} not found.`,
    fatal: true,
  })
}

const cityName = computed(() => data.value?.cityName || '')
const statename = computed(() => data.value?.statename || '')
const pincodes = computed(() => data.value?.pincodes || [])
const offices = computed(() => data.value?.offices || [])
const deliveryOfficesCount = computed(() => data.value?.deliveryOfficesCount || offices.value?.filter((o: any) => o.delivery === 'Delivery').length || 0)

// Canonical URL
const canonicalUrl = computed(() => `${config.public.siteUrl}/city/${cityParam.value}/pincodes`)

// SEO Meta
const title = computed(() => cityName.value ? `${cityName.value} PIN Code List: All Postal Codes in ${cityName.value}` : '')
const description = computed(
  () => cityName.value ? `Comprehensive list of ${pincodes.value.length} PIN codes and post offices in ${cityName.value}, ${statename.value}. Find postal addresses, delivery post offices, and area PINs.` : ''
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
const breadcrumbs = computed(() => cityName.value ? [
  { name: cityName.value, path: `/city/${cityParam.value}/pincodes` },
] : [])

useSchemaOrg([
  definePlace({
    name: computed(() => cityName.value ? `${cityName.value} City` : ''),
    address: {
      '@type': 'PostalAddress',
      addressLocality: computed(() => cityName.value),
      addressRegion: computed(() => statename.value),
      addressCountry: 'IN',
    },
  }),
])

const filterQuery = ref('')
const filteredPincodes = computed(() => {
  const q = filterQuery.value.trim()
  if (!q) return pincodes.value
  return pincodes.value.filter((p: any) => p.pincode.includes(q) || p.district.toLowerCase().includes(q.toLowerCase()))
})
</script>

<template>
  <div v-if="data" class="space-y-6 sm:space-y-8">
    <BreadcrumbNav :items="breadcrumbs" />

    <AdSlot placement="header-leaderboard" />

    <!-- City Hero -->
    <div class="bg-white border border-zinc-200 rounded-md p-6 sm:p-8 shadow-xs space-y-4">
      <div class="flex items-center gap-2 mb-1">
        <span class="text-xs font-semibold uppercase tracking-wider text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
          City Postal Directory
        </span>
        <span class="text-xs text-zinc-600">• {{ statename }}</span>
      </div>

      <h1 class="text-2xl sm:text-3xl md:text-4xl font-extrabold text-zinc-900 tracking-tight">
        {{ cityName }} PIN Codes
      </h1>
      <p class="text-sm sm:text-base text-zinc-600 max-w-3xl">
        Complete list of postal index numbers, post offices, and delivery areas serving {{ cityName }}, {{ statename }}.
      </p>

      <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
        <div class="p-3.5 rounded-md bg-zinc-50 border border-zinc-100 text-center">
          <span class="text-xs text-zinc-500 block">Total PIN Codes</span>
          <span class="text-xl sm:text-2xl font-extrabold text-sky-600 font-mono">{{ pincodes.length }}</span>
        </div>
        <div class="p-3.5 rounded-md bg-zinc-50 border border-zinc-100 text-center">
          <span class="text-xs text-zinc-500 block">State</span>
          <span class="text-base sm:text-lg font-bold text-zinc-900 truncate block">{{ statename }}</span>
        </div>
        <div class="p-3.5 rounded-md bg-zinc-50 border border-zinc-100 text-center col-span-2 sm:col-span-1">
          <span class="text-xs text-zinc-500 block">Delivery Post Offices</span>
          <span class="text-base sm:text-lg font-bold text-emerald-600 font-mono">{{ deliveryOfficesCount }}
            Available</span>
        </div>
      </div>
    </div>

    <!-- PIN Grid -->
    <div class="bg-white border border-zinc-200 rounded-md p-6 sm:p-8 shadow-xs space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 class="text-xl font-bold text-zinc-900 tracking-tight">PIN Codes in {{ cityName }}</h2>
          <p class="text-xs text-zinc-500">Select any postal code to view localities, areas, and post office details</p>
        </div>

        <div class="w-full sm:w-64">
          <input v-model="filterQuery" type="text" placeholder="Filter PIN codes..."
            class="w-full px-3.5 py-2 text-xs sm:text-sm rounded-md border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-sky-500" />
        </div>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <NuxtLink v-for="pin in filteredPincodes" :key="pin.pincode" :to="`/pincode/${pin.pincode}`"
          class="p-3 rounded-md bg-zinc-50 border border-zinc-200 hover:border-sky-400 hover:bg-sky-50 transition text-center group">
          <div class="text-base font-extrabold font-mono text-zinc-900 group-hover:text-sky-600">
            {{ pin.pincode }}
          </div>
          <div class="text-[10px] text-zinc-500 mt-0.5 truncate">
            {{ pin.district }}
          </div>
        </NuxtLink>
      </div>
    </div>

    <AdSlot placement="in-content" />

    <!-- Popular Post Offices in City -->
    <div class="bg-white border border-zinc-200 rounded-md p-6 sm:p-8 shadow-xs space-y-4">
      <h2 class="text-xl font-bold text-zinc-900 tracking-tight">Key Post Offices in {{ cityName }}</h2>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs sm:text-sm">
          <thead class="bg-zinc-50 text-zinc-600 uppercase text-[11px] font-semibold border-y border-zinc-200">
            <tr>
              <th class="py-3 px-4">Post Office</th>
              <th class="py-3 px-4">PIN Code</th>
              <th class="py-3 px-4">Delivery</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-zinc-100">
            <tr v-for="po in offices" :key="po.id" class="hover:bg-zinc-50/70 transition">
              <td class="py-3 px-4 font-semibold text-zinc-900">
                <NuxtLink :to="`/post-office/${po.office_slug}`" class="hover:text-sky-600 transition">
                  {{ po.officename }}
                </NuxtLink>
              </td>
              <td class="py-3 px-4 font-mono font-bold text-sky-600">
                <NuxtLink :to="`/pincode/${po.pincode}`" class="hover:underline">
                  {{ po.pincode }}
                </NuxtLink>
              </td>
              <td class="py-3 px-4">
                <span class="text-[11px] font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1"
                  :class="po.delivery === 'Delivery' ? 'bg-emerald-100 text-emerald-800' : 'bg-zinc-100 text-zinc-600'">
                  <span class="w-1.5 h-1.5 rounded-full"
                    :class="po.delivery === 'Delivery' ? 'bg-emerald-600' : 'bg-zinc-400'" />
                  {{ po.delivery }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
