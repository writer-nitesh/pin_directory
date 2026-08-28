<script setup lang="ts">
const route = useRoute()
const config = useRuntimeConfig()
const districtSlug = computed(() => String(route.params.district || ''))

const { data, error } = await useFetch(`/api/district/${districtSlug.value}`)

if (error.value || !data.value) {
  throw createError({
    statusCode: 404,
    statusMessage: `District ${districtSlug.value} not found.`,
    fatal: true,
  })
}

const district = computed(() => data.value.district)
const pincodes = computed(() => data.value.pincodes)
const offices = computed(() => data.value.offices)

// Canonical URL
const canonicalUrl = computed(() => `${config.public.siteUrl}/district/${districtSlug.value}/pincodes`)

// SEO Meta
const title = computed(() => `${district.value.district} District PIN Codes: Postal Codes & Post Offices`)
const description = computed(
  () => `All PIN codes and post offices in ${district.value.district} district, ${district.value.statename}. View ${pincodes.value.length} PIN codes and delivery post offices.`
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
  { name: district.value.statename, path: `/state/${district.value.state_slug}/pincodes` },
  { name: district.value.district, path: `/district/${districtSlug.value}/pincodes` },
])

useSchemaOrg([
  definePlace({
    name: `${district.value.district} District`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: district.value.district,
      addressRegion: district.value.statename,
      addressCountry: 'IN',
    },
  }),
])

const officeQuery = ref('')
const filteredOffices = computed(() => {
  const q = officeQuery.value.toLowerCase().trim()
  if (!q) return offices.value
  return offices.value.filter(
    (o: any) => o.officename.toLowerCase().includes(q) || o.pincode.includes(q)
  )
})
</script>

<template>
  <div class="space-y-6 sm:space-y-8">
    <BreadcrumbNav :items="breadcrumbs" />

    <AdSlot placement="header-leaderboard" />

    <!-- District Header -->
    <div class="bg-white border border-zinc-200 rounded-md p-6 sm:p-8 shadow-xs space-y-4">
      <div class="flex items-center gap-2 mb-1">
        <span class="text-xs font-semibold uppercase tracking-wider text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
          District Directory
        </span>
        <NuxtLink :to="`/state/${district.state_slug}/pincodes`" class="text-xs text-zinc-600 hover:text-sky-600">
          • {{ district.statename }}
        </NuxtLink>
      </div>

      <h1 class="text-2xl sm:text-3xl md:text-4xl font-extrabold text-zinc-900 tracking-tight">
        {{ district.district }} PIN Codes
      </h1>
      <p class="text-sm sm:text-base text-zinc-600 max-w-3xl">
        Postal codes, post office branches, and delivery information for {{ district.district }} district in {{
          district.statename }}, India.
      </p>

      <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
        <div class="p-3.5 rounded-md bg-zinc-50 border border-zinc-100 text-center">
          <span class="text-xs text-zinc-500 block">Total PIN Codes</span>
          <span class="text-xl sm:text-2xl font-extrabold text-sky-600 font-mono">{{ pincodes.length }}</span>
        </div>
        <div class="p-3.5 rounded-md bg-zinc-50 border border-zinc-100 text-center">
          <span class="text-xs text-zinc-500 block">Post Offices</span>
          <span class="text-xl sm:text-2xl font-extrabold text-zinc-900 font-mono">{{ offices.length }}</span>
        </div>
        <div class="p-3.5 rounded-md bg-zinc-50 border border-zinc-100 text-center col-span-2 sm:col-span-1">
          <span class="text-xs text-zinc-500 block">State</span>
          <span class="text-base sm:text-lg font-bold text-zinc-900 truncate block">{{ district.statename }}</span>
        </div>
      </div>
    </div>



    <AdSlot placement="in-content" />
    <!-- PIN Codes Grid -->
    <div class="bg-white border border-zinc-200 rounded-md p-6 sm:p-8 shadow-xs space-y-4">
      <h2 class="text-xl font-bold text-zinc-900 tracking-tight">
        PIN Codes in {{ district.district }}
      </h2>
      <p class="text-xs text-zinc-500">Click any 6-digit postal code to view all associated post office branches and
        locations</p>

      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 pt-2">
        <NuxtLink v-for="pin in pincodes" :key="pin.pincode" :to="`/pincode/${pin.pincode}`"
          class="p-3 rounded-md bg-zinc-50 border border-zinc-200 hover:border-sky-400 hover:bg-sky-50 transition text-center group">
          <div class="text-base font-extrabold font-mono text-zinc-900 group-hover:text-sky-600">
            {{ pin.pincode }}
          </div>
          <div class="text-[10px] text-zinc-500 mt-0.5">
            {{ pin.office_count }} Post Office{{ pin.office_count > 1 ? 's' : '' }}
          </div>
        </NuxtLink>
      </div>
    </div>

    <!-- Post Offices Table -->
    <div class="bg-white border border-zinc-200 rounded-md p-6 sm:p-8 shadow-xs space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 class="text-xl font-bold text-zinc-900 tracking-tight">
            All Post Offices in {{ district.district }}
          </h2>
          <p class="text-xs text-zinc-500">Search and filter post offices by name or PIN</p>
        </div>

        <div class="w-full sm:w-64">
          <input v-model="officeQuery" type="text" placeholder="Search post offices or PIN..."
            class="w-full px-3.5 py-2 text-xs sm:text-sm rounded-md border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-sky-500" />
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs sm:text-sm">
          <thead class="bg-zinc-50 text-zinc-600 uppercase text-[11px] font-semibold border-y border-zinc-200">
            <tr>
              <th class="py-3 px-4">Post Office</th>
              <th class="py-3 px-4">PIN Code</th>
              <th class="py-3 px-4">Delivery Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-zinc-100">
            <tr v-for="office in filteredOffices" :key="office.id" class="hover:bg-zinc-50/70 transition">
              <td class="py-3 px-4 font-semibold text-zinc-900">
                <NuxtLink :to="`/post-office/${office.office_slug}`" class="hover:text-sky-600 transition">
                  {{ office.officename }}
                </NuxtLink>
              </td>
              <td class="py-3 px-4 font-mono font-bold text-sky-600">
                <NuxtLink :to="`/pincode/${office.pincode}`" class="hover:underline">
                  {{ office.pincode }}
                </NuxtLink>
              </td>
              <td class="py-3 px-4">
                <span class="text-[11px] font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1"
                  :class="office.delivery === 'Delivery' ? 'bg-emerald-100 text-emerald-800' : 'bg-zinc-100 text-zinc-600'">
                  <span class="w-1.5 h-1.5 rounded-full"
                    :class="office.delivery === 'Delivery' ? 'bg-emerald-600' : 'bg-zinc-400'" />
                  {{ office.delivery }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
