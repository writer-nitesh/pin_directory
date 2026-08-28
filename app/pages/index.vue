<script setup lang="ts">
import { useRecentSearchesStore } from '~/stores/recentSearches'

const config = useRuntimeConfig()
const recentSearchesStore = useRecentSearchesStore()
const isClientMounted = ref(false)

onMounted(() => {
  isClientMounted.value = true
  recentSearchesStore.loadFromStorage()
})

const recentSearches = computed(() => recentSearchesStore.history)

// Fetch States for directory grid
const { data: statesData } = await useFetch('/api/states')
const states = computed(() => statesData.value?.states || [])

const popularCities = [
  { name: 'Delhi', slug: 'delhi', count: '90+ PIN Codes' },
  { name: 'Bangalore', slug: 'bangalore', count: '120+ PIN Codes' },
  { name: 'Mumbai', slug: 'mumbai', count: '110+ PIN Codes' },
  { name: 'Hyderabad', slug: 'hyderabad', count: '95+ PIN Codes' },
  { name: 'Pune', slug: 'pune', count: '85+ PIN Codes' },
  { name: 'Chennai', slug: 'chennai', count: '90+ PIN Codes' },
  { name: 'Kolkata', slug: 'kolkata', count: '80+ PIN Codes' },
  { name: 'Ahmedabad', slug: 'ahmedabad', count: '75+ PIN Codes' },
  { name: 'Jaipur', slug: 'jaipur', count: '60+ PIN Codes' },
  { name: 'Lucknow', slug: 'lucknow', count: '55+ PIN Codes' },
  { name: 'Noida', slug: 'gautam-buddha-nagar', count: '40+ PIN Codes' },
  { name: 'Indore', slug: 'indore', count: '45+ PIN Codes' },
]

const homeFaqs = [
  {
    question: 'How do I find the PIN code of my current location?',
    answer: 'You can use our Find My PIN Code tool with your device GPS. Click "Use Location" on the top right or click the Find My PIN button to immediately detect the closest Indian postal code and post office.',
  },
  {
    question: 'What does a 6-digit Indian PIN code stand for?',
    answer: 'PIN stands for Postal Index Number. The 1st digit indicates the postal zone in India, the 2nd digit indicates the sub-zone, the 3rd digit indicates the sorting district, and the last 3 digits represent the specific delivery post office.',
  },
  {
    question: 'How many PIN codes are there in India?',
    answer: 'There are over 19,500 active PIN codes serving more than 165,000 post offices across 37 states and union territories in India.',
  },
]
</script>

<template>
  <div class="space-y-8 sm:space-y-10">
    <!-- Hero Section -->
    <section class="text-center py-4 sm:py-8 space-y-3">
      <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200/60 mb-1">
        <UIcon name="i-heroicons-sparkles" class="w-3.5 h-3.5 text-sky-600" />
        <span>165,000+ Post Offices • Updated Postal Directory</span>
      </div>

      <h1 class="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-900 leading-tight">
        Indian PIN Code & Address Search
      </h1>

      <p class="max-w-2xl mx-auto text-sm sm:text-base text-zinc-600">
        Lookup postal codes, post office addresses, delivery status, and districts across India with instant search and GPS detection.
      </p>

      <!-- Search Bar -->
      <div class="pt-4">
        <SearchBar />
      </div>

      <!-- Dynamic Recent Searches from Pinia / Fallback Popular Shortcuts -->
      <div class="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs text-zinc-500">
        <template v-if="isClientMounted && recentSearches.length > 0">
          <span class="font-medium text-zinc-700 flex items-center gap-1">
            <UIcon name="i-heroicons-clock" class="w-3.5 h-3.5 text-sky-600" />
            Recent Searches:
          </span>
          <NuxtLink
            v-for="(item, idx) in recentSearches"
            :key="idx"
            :to="item.path"
            class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white border border-zinc-200 hover:border-sky-300 hover:text-sky-600 transition text-zinc-800"
          >
            <UIcon
              :name="
                item.type === 'state'
                  ? 'i-heroicons-building-library'
                  : item.type === 'district'
                  ? 'i-heroicons-building-office-2'
                  : 'i-heroicons-map-pin'
              "
              class="w-3 h-3 text-zinc-400"
            />
            <span class="font-medium">{{ item.title }}</span>
          </NuxtLink>
          <button
            type="button"
            class="text-[11px] text-zinc-400 hover:text-red-500 underline ml-1"
            title="Clear search history"
            @click="recentSearchesStore.clearHistory()"
          >
            Clear
          </button>
        </template>
        <template v-else>
          <span class="font-medium text-zinc-700">Quick Searches:</span>
          <NuxtLink to="/pincode/110001" class="px-2.5 py-1 rounded-md bg-white border border-zinc-200 hover:border-sky-300 hover:text-sky-600 transition font-mono">110001 (New Delhi)</NuxtLink>
          <NuxtLink to="/pincode/400001" class="px-2.5 py-1 rounded-md bg-white border border-zinc-200 hover:border-sky-300 hover:text-sky-600 transition font-mono">400001 (Mumbai)</NuxtLink>
          <NuxtLink to="/pincode/560001" class="px-2.5 py-1 rounded-md bg-white border border-zinc-200 hover:border-sky-300 hover:text-sky-600 transition font-mono">560001 (Bangalore)</NuxtLink>
          <NuxtLink to="/pincode/500001" class="px-2.5 py-1 rounded-md bg-white border border-zinc-200 hover:border-sky-300 hover:text-sky-600 transition font-mono">500001 (Hyderabad)</NuxtLink>
        </template>
      </div>
    </section>

    <!-- Top Leaderboard Ad Slot -->
    <AdSlot placement="header-leaderboard" />

    <!-- Popular Cities Section -->
    <section class="space-y-4">
      <div class="flex items-center justify-between border-b border-zinc-200 pb-3">
        <div>
          <h2 class="text-xl font-bold text-zinc-900 tracking-tight">Popular Cities & Metro Areas</h2>
          <p class="text-xs text-zinc-500">Fast access to pincodes in major commercial hubs</p>
        </div>
        <NuxtLink to="/states" class="text-xs font-semibold text-sky-600 hover:underline flex items-center gap-1">
          <span>All States</span>
          <UIcon name="i-heroicons-arrow-right" class="w-3.5 h-3.5" />
        </NuxtLink>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
        <NuxtLink
          v-for="city in popularCities"
          :key="city.slug"
          :to="`/city/${city.slug}/pincodes`"
          class="p-4 rounded-md bg-white border border-zinc-200 hover:border-sky-400 hover:shadow-md transition group"
        >
          <div class="flex items-center justify-between mb-1">
            <span class="font-semibold text-zinc-900 group-hover:text-sky-600 transition text-sm sm:text-base">
              {{ city.name }}
            </span>
            <UIcon name="i-heroicons-chevron-right" class="w-4 h-4 text-zinc-400 group-hover:text-sky-600 group-hover:translate-x-0.5 transition" />
          </div>
          <span class="text-xs text-zinc-500 font-mono">{{ city.count }}</span>
        </NuxtLink>
      </div>
    </section>

    <!-- Browse States Directory -->
    <section class="space-y-4">
      <div class="border-b border-zinc-200 pb-3">
        <h2 class="text-xl font-bold text-zinc-900 tracking-tight">Browse PIN Codes by State & UT</h2>
        <p class="text-xs text-zinc-500">Explore districts, circles, and postal divisions across all 37 Indian regions</p>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        <NuxtLink
          v-for="state in states"
          :key="state.state_slug"
          :to="`/state/${state.state_slug}/pincodes`"
          class="p-3.5 rounded-md bg-white border border-zinc-200 hover:border-sky-300 hover:bg-sky-50/30 transition text-left"
        >
          <div class="font-semibold text-xs sm:text-sm text-zinc-900 truncate">
            {{ state.statename }}
          </div>
          <div class="text-[11px] text-zinc-500 mt-1 flex items-center gap-2">
            <span>{{ state.district_count }} Districts</span>
            <span>•</span>
            <span class="font-mono">{{ state.pincode_count }} PINs</span>
          </div>
        </NuxtLink>
      </div>
    </section>

    <!-- In-Content Ad Slot -->
    <AdSlot placement="in-content" />

    <!-- Explainer / Educational Section -->
    <section class="bg-white rounded-md border border-zinc-200 p-6 sm:p-8 space-y-6">
      <div class="max-w-2xl">
        <h2 class="text-lg sm:text-xl font-bold text-zinc-900 tracking-tight mb-2">
          How India's 6-Digit PIN System Works
        </h2>
        <p class="text-sm text-zinc-600 leading-relaxed">
          Introduced on August 15, 1972, by Shriram Bhikaji Velankar, the Postal Index Number simplifies the sorting and delivery of mail across diverse geographic regions.
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div class="p-4 rounded-md bg-zinc-50 border border-zinc-100 space-y-1.5">
          <span class="font-bold text-sky-700 text-sm font-mono">1st Digit: Zone</span>
          <p class="text-zinc-600">Identifies one of the 9 postal regions (8 geographic regions covering civilian zones + 1 functional region for the Army Postal Service).</p>
        </div>
        <div class="p-4 rounded-md bg-zinc-50 border border-zinc-100 space-y-1.5">
          <span class="font-bold text-sky-700 text-sm font-mono">2nd & 3rd Digit: Sub-Zone</span>
          <p class="text-zinc-600">Combined with the 1st digit, narrows down the sorting district and revenue division within the designated state.</p>
        </div>
        <div class="p-4 rounded-md bg-zinc-50 border border-zinc-100 space-y-1.5">
          <span class="font-bold text-sky-700 text-sm font-mono">Last 3 Digits: Post Office</span>
          <p class="text-zinc-600">Specifies the individual destination delivery post office (Head Post Office HO, Sub Post Office SO, or Branch Office BO).</p>
        </div>
      </div>
    </section>

    <!-- FAQs Section -->
    <FaqSection :faqs="homeFaqs" title="Frequently Asked Questions about Indian Postal Codes" />
  </div>
</template>
