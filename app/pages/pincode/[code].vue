<script setup lang="ts">
const route = useRoute()
const config = useRuntimeConfig()
const code = computed(() => String(route.params.code || ''))

// Fetch PIN Code details from Nitro API
const { data, error } = await useFetch(`/api/pincode/${code.value}`)

if (error.value || !data.value) {
  throw createError({
    statusCode: 404,
    statusMessage: `PIN Code ${code.value} was not found in the India Pincode Directory.`,
    fatal: true,
  })
}

const summary = computed(() => data.value.summary)
const offices = computed(() => data.value.offices)
const nearby = computed(() => data.value.nearby)

// Canonical URL
const canonicalUrl = computed(() => `${config.public.siteUrl}/pincode/${code.value}`)

// SEO Meta Tags
const pageTitle = computed(() => `${code.value} PIN Code: Address, Post Offices & ${summary.value.district} Details`)
const pageDescription = computed(
  () => `Get PIN code ${code.value} address details in ${summary.value.district}, ${summary.value.statename}. View all ${offices.value.length} post offices, delivery status, and nearby PIN codes.`
)

useSeoMeta({
  title: pageTitle,
  ogTitle: pageTitle,
  description: pageDescription,
  ogDescription: pageDescription,
  ogType: 'article',
})

// Canonical Link Tag
useHead({
  link: [
    { rel: 'canonical', href: canonicalUrl },
  ],
})

// Breadcrumbs
const breadcrumbs = computed(() => [
  { name: summary.value.statename, path: `/state/${summary.value.state_slug}/pincodes` },
  { name: summary.value.district, path: `/district/${summary.value.district_slug}/pincodes` },
  { name: code.value, path: `/pincode/${code.value}` },
])

// Structured Data / Schema Markup: Place & PostalAddress
useSchemaOrg([
  definePlace({
    name: `PIN Code ${code.value}`,
    address: {
      '@type': 'PostalAddress',
      postalCode: code.value,
      addressLocality: summary.value.district,
      addressRegion: summary.value.statename,
      addressCountry: 'IN',
    },
    geo: summary.value.latitude && summary.value.longitude
      ? {
          '@type': 'GeoCoordinates',
          latitude: summary.value.latitude,
          longitude: summary.value.longitude,
        }
      : undefined,
  }),
])

// Copy to Clipboard Feedback
const isCopied = ref(false)
const copyPin = async () => {
  try {
    await navigator.clipboard.writeText(code.value)
    isCopied.value = true
    setTimeout(() => {
      isCopied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy', err)
  }
}

// Data-backed FAQs for this exact entity
const faqs = computed(() => [
  {
    question: `What is the postal address and location for PIN code ${code.value}?`,
    answer: `PIN code ${code.value} is located in ${summary.value.district} district, ${summary.value.statename}, India. It falls under the ${summary.value.circle || summary.value.statename} postal circle and ${summary.value.division || summary.value.district} postal division.`,
  },
  {
    question: `How many post offices operate under PIN code ${code.value}?`,
    answer: `There are ${offices.value.length} post office(s) registered under PIN code ${code.value}: ${offices.value.map(o => o.officename).slice(0, 5).join(', ')}${offices.value.length > 5 ? ' and more.' : '.'}`,
  },
  {
    question: `Is postal delivery available in PIN code ${code.value}?`,
    answer: `Yes, post offices under ${code.value} such as ${offices.value.find(o => o.delivery === 'Delivery')?.officename || offices.value[0]?.officename} provide postal delivery services.`,
  },
  {
    question: `Which district and state does PIN ${code.value} belong to?`,
    answer: `${code.value} belongs to ${summary.value.district} district in the state of ${summary.value.statename}, India.`,
  },
])
</script>

<template>
  <div class="space-y-6 sm:space-y-8">
    <!-- Breadcrumb Navigation with Schema.org -->
    <BreadcrumbNav :items="breadcrumbs" />

    <!-- Top Leaderboard Ad Slot -->
    <AdSlot placement="header-leaderboard" />

    <!-- Main PIN Hero Card -->
    <div class="bg-white border border-zinc-200 rounded-md p-6 sm:p-8 shadow-xs space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-100 pb-6">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="text-xs font-semibold uppercase tracking-wider text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
              Postal Index Number
            </span>
            <span class="text-xs text-zinc-600">• {{ summary.statename }}</span>
          </div>
          <h1 class="text-2xl sm:text-3xl md:text-4xl font-extrabold text-zinc-900 tracking-tight font-mono">
            {{ code }}
          </h1>
          <p class="text-sm text-zinc-500 mt-1">
            Postal code for areas in {{ summary.district }} district, {{ summary.statename }}
          </p>
        </div>

        <!-- Copy PIN Action Button -->
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="inline-flex items-center gap-2 px-4 py-2.5 rounded-md font-semibold text-sm transition shadow-xs"
            :class="isCopied ? 'bg-emerald-600 text-white' : 'bg-sky-600 text-white hover:bg-sky-700'"
            @click="copyPin"
          >
            <UIcon :name="isCopied ? 'i-heroicons-check' : 'i-heroicons-clipboard-document'" class="w-4 h-4" />
            <span>{{ isCopied ? 'Copied to Clipboard!' : 'Copy PIN Code' }}</span>
          </button>
        </div>
      </div>

      <!-- Key Metadata Grid -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs sm:text-sm">
        <div class="p-3.5 rounded-md bg-zinc-50 border border-zinc-100">
          <span class="text-zinc-600 block text-xs">District</span>
          <NuxtLink :to="`/district/${summary.district_slug}/pincodes`" class="font-bold text-zinc-900 hover:text-sky-600 transition">
            {{ summary.district }}
          </NuxtLink>
        </div>

        <div class="p-3.5 rounded-md bg-zinc-50 border border-zinc-100">
          <span class="text-zinc-600 block text-xs">State</span>
          <NuxtLink :to="`/state/${summary.state_slug}/pincodes`" class="font-bold text-zinc-900 hover:text-sky-600 transition">
            {{ summary.statename }}
          </NuxtLink>
        </div>

        <div class="p-3.5 rounded-md bg-zinc-50 border border-zinc-100">
          <span class="text-zinc-600 block text-xs">Postal Circle</span>
          <span class="font-bold text-zinc-900">{{ summary.circle || 'India Post' }}</span>
        </div>

        <div class="p-3.5 rounded-md bg-zinc-50 border border-zinc-100">
          <span class="text-zinc-600 block text-xs">Post Offices</span>
          <span class="font-bold text-zinc-900 font-mono">{{ offices.length }} Registered</span>
        </div>
      </div>
    </div>

    <!-- Post Offices Table Section -->
    <div class="bg-white border border-zinc-200 rounded-md p-6 sm:p-8 shadow-xs space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-lg sm:text-xl font-bold text-zinc-900 tracking-tight">
            Post Offices Serving PIN Code {{ code }}
          </h2>
          <p class="text-xs text-zinc-500">Post offices and delivery status under this PIN code</p>
        </div>
        <span class="text-xs font-mono font-semibold px-2.5 py-1 rounded bg-zinc-100 text-zinc-700">
          {{ offices.length }} Branches
        </span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs sm:text-sm">
          <thead class="bg-zinc-50 text-zinc-600 uppercase text-[11px] font-semibold border-y border-zinc-200">
            <tr>
              <th class="py-3 px-4">Post Office Name</th>
              <th class="py-3 px-4">Delivery Status</th>
              <th class="py-3 px-4 hidden sm:table-cell">Division</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-zinc-100">
            <tr v-for="office in offices" :key="office.id" class="hover:bg-zinc-50/70 transition">
              <td class="py-3 px-4 font-semibold text-zinc-900">
                <NuxtLink :to="`/post-office/${office.office_slug}`" class="hover:text-sky-600 transition flex items-center gap-1.5">
                  <UIcon name="i-heroicons-building-library" class="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                  {{ office.officename }}
                </NuxtLink>
              </td>
              <td class="py-3 px-4">
                <span
                  class="text-[11px] font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1"
                  :class="office.delivery === 'Delivery' ? 'bg-emerald-100 text-emerald-800' : 'bg-zinc-100 text-zinc-600'"
                >
                  <span class="w-1.5 h-1.5 rounded-full" :class="office.delivery === 'Delivery' ? 'bg-emerald-600' : 'bg-zinc-400'" />
                  {{ office.delivery }}
                </span>
              </td>
              <td class="py-3 px-4 text-zinc-600 hidden sm:table-cell">
                {{ office.division || '-' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Mid-Content Ad Slot -->
    <AdSlot placement="in-content" />

    <!-- Sibling & Nearby PIN Codes in District -->
    <div v-if="nearby.length > 0" class="bg-white border border-zinc-200 rounded-md p-6 sm:p-8 shadow-xs space-y-4">
      <h2 class="text-lg font-bold text-zinc-900 tracking-tight">
        Nearby PIN Codes in {{ summary.district }} District
      </h2>
      <p class="text-xs text-zinc-500">Related postal codes in the same administrative area</p>

      <div class="flex flex-wrap gap-2 pt-1">
        <NuxtLink
          v-for="nearPin in nearby"
          :key="nearPin"
          :to="`/pincode/${nearPin}`"
          class="px-3 py-1.5 rounded-lg bg-zinc-50 border border-zinc-200 hover:border-sky-300 hover:bg-sky-50 text-xs font-mono font-semibold text-zinc-800 transition flex items-center gap-1.5"
        >
          <UIcon name="i-heroicons-map-pin" class="w-3 h-3 text-sky-600" />
          {{ nearPin }}
        </NuxtLink>
      </div>
    </div>

    <!-- Data-Driven FAQs Section with FAQPage Schema -->
    <FaqSection :faqs="faqs" :title="`Frequently Asked Questions about PIN Code ${code}`" />

    <!-- Bottom Ad Slot -->
    <AdSlot placement="bottom-banner" />
  </div>
</template>
