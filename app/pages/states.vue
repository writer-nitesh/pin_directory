<script setup lang="ts">
const config = useRuntimeConfig()

// SEO Meta — targets "all india pin codes by state", "postal code india", "pin code list"
const title = 'All India PIN Codes by State — 37 States & Union Territories Directory'
const description = 'Browse complete Indian postal PIN code lists across all 37 states and union territories. Explore 750+ districts, 19,500+ postal codes, and 165,000+ post offices. Find any India Post pin code by state or district.'

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description,
  ogType: 'website',
  ogUrl: `${config.public.siteUrl}/states`,
  twitterCard: 'summary_large_image',
  twitterTitle: title,
  twitterDescription: description,
})

useHead({
  link: [{ rel: 'canonical', href: `${config.public.siteUrl}/states` }],
})

// CollectionPage + BreadcrumbList schema
useSchemaOrg([
  {
    '@type': 'CollectionPage',
    name: 'All India PIN Codes by State',
    url: `${config.public.siteUrl}/states`,
    description: 'Directory of Indian PIN codes organised by state and union territory.',
    publisher: {
      '@type': 'Organization',
      name: 'Pin Directory',
      url: config.public.siteUrl,
    },
  },
])

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

// FAQs for states page
const stateFaqs = [
  {
    question: 'How many states and union territories have PIN codes in India?',
    answer: 'All 37 states and union territories in India have postal PIN codes assigned by India Post. This includes 28 states and 9 union territories, each divided into postal circles and districts.',
  },
  {
    question: 'How many total PIN codes are there in India across all states?',
    answer: 'There are over 19,500 active 6-digit postal PIN codes in India, covering all states and union territories, and serving more than 165,000 post offices nationwide.',
  },
  {
    question: 'Which Indian state has the most PIN codes?',
    answer: 'Uttar Pradesh has the highest number of PIN codes among all Indian states, followed by Maharashtra and Rajasthan. Large states with dense populations tend to have more postal delivery offices and corresponding PIN codes.',
  },
  {
    question: 'What is the PIN code format for Delhi?',
    answer: 'Delhi PIN codes start with "11" — the first digit "1" indicates the Northern postal zone, and the second digit "1" specifies the National Capital Territory. Delhi PIN codes range from 110001 (New Delhi GPO) up to 110096.',
  },
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

    <!-- FAQ Section -->
    <FaqSection :faqs="stateFaqs" title="Frequently Asked Questions about India PIN Codes by State" />
  </div>
</template>

