<script setup lang="ts">
const route = useRoute()
const config = useRuntimeConfig()
const slug = computed(() => String(route.params.slug || ''))

const { data, error } = await useFetch(`/api/post-office/${slug.value}`)

if (error.value || !data.value) {
  throw createError({
    statusCode: 404,
    statusMessage: `Post office ${slug.value} was not found.`,
    fatal: true,
  })
}

const office = computed(() => data.value.office)
const siblingOffices = computed(() => data.value.siblingOffices)

// Canonical URL
const canonicalUrl = computed(() => `${config.public.siteUrl}/post-office/${slug.value}`)

// SEO Meta
const title = computed(() => `${office.value.officename} PIN Code: ${office.value.pincode} - Address & Branch Details`)
const description = computed(
  () => `${office.value.officename} is a ${office.value.officetype} post office in ${office.value.district}, ${office.value.statename}. PIN Code is ${office.value.pincode}. Delivery status: ${office.value.delivery}.`
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
  { name: office.value.statename, path: `/state/${office.value.state_slug}/pincodes` },
  { name: office.value.district, path: `/district/${office.value.district_slug}/pincodes` },
  { name: office.value.pincode, path: `/pincode/${office.value.pincode}` },
  { name: office.value.officename, path: `/post-office/${slug.value}` },
])

useSchemaOrg([
  definePlace({
    name: office.value.officename,
    address: {
      '@type': 'PostalAddress',
      streetAddress: office.value.officename,
      addressLocality: office.value.district,
      addressRegion: office.value.statename,
      postalCode: office.value.pincode,
      addressCountry: 'IN',
    },
    geo: office.value.latitude && office.value.longitude
      ? {
          '@type': 'GeoCoordinates',
          latitude: office.value.latitude,
          longitude: office.value.longitude,
        }
      : undefined,
  }),
])
</script>

<template>
  <div class="space-y-6">
    <BreadcrumbNav :items="breadcrumbs" />

    <AdSlot placement="header-leaderboard" />

    <!-- Hero Card -->
    <div class="bg-white border border-zinc-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-100 pb-6">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="text-xs font-semibold uppercase tracking-wider text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
              Post Office Branch
            </span>
            <span class="text-xs text-zinc-600">• {{ office.statename }}</span>
          </div>
          <h1 class="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
            {{ office.officename }}
          </h1>
          <p class="text-sm text-zinc-500 mt-1">
            PIN Code: <NuxtLink :to="`/pincode/${office.pincode}`" class="font-mono font-bold text-sky-600 hover:underline">{{ office.pincode }}</NuxtLink>
            • {{ office.district }} District, {{ office.statename }}
          </p>
        </div>

        <div class="flex items-center gap-2">
          <NuxtLink
            :to="`/pincode/${office.pincode}`"
            class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-sky-600 text-white hover:bg-sky-700 transition"
          >
            <UIcon name="i-heroicons-map-pin" class="w-4 h-4" />
            <span>View All in {{ office.pincode }}</span>
          </NuxtLink>
        </div>
      </div>

      <!-- Details Table Grid -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs sm:text-sm">
        <div class="p-3.5 rounded-xl bg-zinc-50 border border-zinc-100">
          <span class="text-zinc-600 block text-xs">Branch Type</span>
          <span class="font-bold text-zinc-900 font-mono">{{ office.officetype }} ({{ office.officetype === 'BO' ? 'Branch Office' : office.officetype === 'SO' ? 'Sub Office' : 'Head Office' }})</span>
        </div>

        <div class="p-3.5 rounded-xl bg-zinc-50 border border-zinc-100">
          <span class="text-zinc-600 block text-xs">Delivery Status</span>
          <span
            class="text-xs font-bold px-2 py-0.5 rounded-full inline-block mt-0.5"
            :class="office.delivery === 'Delivery' ? 'bg-emerald-100 text-emerald-800' : 'bg-zinc-200 text-zinc-700'"
          >
            {{ office.delivery }}
          </span>
        </div>

        <div class="p-3.5 rounded-xl bg-zinc-50 border border-zinc-100">
          <span class="text-zinc-600 block text-xs">Postal Division</span>
          <span class="font-bold text-zinc-900">{{ office.division || 'General' }}</span>
        </div>

        <div class="p-3.5 rounded-xl bg-zinc-50 border border-zinc-100">
          <span class="text-zinc-600 block text-xs">Postal Region</span>
          <span class="font-bold text-zinc-900">{{ office.region || 'India Post' }}</span>
        </div>
      </div>
    </div>

    <AdSlot placement="in-content" />

    <!-- Sibling Post Offices -->
    <div v-if="siblingOffices.length > 0" class="bg-white border border-zinc-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
      <h2 class="text-lg font-bold text-zinc-900 tracking-tight">
        Other Post Offices under PIN Code {{ office.pincode }}
      </h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        <NuxtLink
          v-for="sib in siblingOffices"
          :key="sib.id"
          :to="`/post-office/${sib.office_slug}`"
          class="p-3.5 rounded-xl border border-zinc-200 hover:border-sky-300 hover:bg-sky-50/30 transition flex items-center justify-between group"
        >
          <div>
            <div class="font-semibold text-xs sm:text-sm text-zinc-900 group-hover:text-sky-600 transition">
              {{ sib.officename }}
            </div>
            <div class="text-[11px] text-zinc-500 mt-0.5">
              {{ sib.officetype }} • {{ sib.delivery }}
            </div>
          </div>
          <UIcon name="i-heroicons-chevron-right" class="w-4 h-4 text-zinc-400 group-hover:text-sky-600 transition" />
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
