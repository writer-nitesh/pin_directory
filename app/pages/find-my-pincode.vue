<script setup lang="ts">
const config = useRuntimeConfig()

// SEO Meta — targets "find my pincode" (480/mo), "nearest post office" (9.9K/mo), "post office near me" (673K/mo)
const title = 'Find My PIN Code by GPS — Nearest Post Office & Pincode Finder India'
const description = 'Detect your current 6-digit PIN code instantly using GPS geolocation. Find your nearest post office, area pincode, and district address anywhere in India. Free tool — no signup required.'

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description,
  ogType: 'website',
  ogUrl: `${config.public.siteUrl}/find-my-pincode`,
  twitterCard: 'summary_large_image',
  twitterTitle: title,
  twitterDescription: description,
})

useHead({
  link: [{ rel: 'canonical', href: `${config.public.siteUrl}/find-my-pincode` }],
})

// WebApplication schema — helps Google understand this is an interactive tool
useSchemaOrg([
  {
    '@type': 'WebApplication',
    name: 'Find My PIN Code — GPS Pincode Detector',
    url: `${config.public.siteUrl}/find-my-pincode`,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'All',
    description: 'GPS-based tool to detect the current 6-digit postal PIN code and nearest post office in India.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Pin Directory',
      url: config.public.siteUrl,
    },
  },
])

// Geolocation state
const isLocating = ref(false)
const geoError = ref<string | null>(null)
const result = ref<any | null>(null)

const detectLocation = () => {
  if (!('geolocation' in navigator)) {
    geoError.value = 'Geolocation is not supported by your browser.'
    return
  }

  isLocating.value = true
  geoError.value = null
  result.value = null

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      try {
        const lat = position.coords.latitude
        const lng = position.coords.longitude

        const res = await $fetch<{ nearest: any }>(`/api/nearby?lat=${lat}&lng=${lng}`)
        if (res.nearest) {
          result.value = res.nearest
        } else {
          geoError.value = 'No matching Indian PIN code found near these coordinates.'
        }
      } catch (err: any) {
        geoError.value = err.data?.statusMessage || 'Could not identify your postal code. Please try manual search.'
      } finally {
        isLocating.value = false
      }
    },
    (error) => {
      isLocating.value = false
      if (error.code === error.PERMISSION_DENIED) {
        geoError.value = 'Location permission was denied. Please allow location access or search your area above.'
      } else {
        geoError.value = 'Unable to retrieve location coordinates. Please try again or use the search bar.'
      }
    },
    { timeout: 10000, enableHighAccuracy: true }
  )
}

const isCopied = ref(false)
const copyPin = async () => {
  if (!result.value) return
  await navigator.clipboard.writeText(result.value.pincode)
  isCopied.value = true
  setTimeout(() => {
    isCopied.value = false
  }, 2000)
}

// FAQs for this page — targets "post office near me", "find my pincode", "nearest post office"
const locationFaqs = [
  {
    question: 'How do I find my current PIN code using GPS?',
    answer: 'Click the "Use My Current Location" button and allow browser location access. Our tool uses your GPS coordinates to match the nearest India Post postal code and post office delivery area.',
  },
  {
    question: 'How do I find the nearest post office to my location?',
    answer: 'Our GPS detector automatically shows you the nearest post office name, PIN code, district, and state. You can also search by entering your city, area, or any 6-digit PIN code in the search box.',
  },
  {
    question: 'Does Pin Directory store my location data?',
    answer: 'No. Your GPS coordinates are only used momentarily to look up the nearest postal code. We do not store, log, or share your location. The lookup happens on our server without any personal data retention.',
  },
  {
    question: 'Why is my detected PIN code showing a nearby area?',
    answer: 'GPS accuracy varies by device and environment. The detected code is the nearest matching delivery post office, which may serve a radius of several kilometres. If you need a specific address PIN code, use the manual search.',
  },
  {
    question: 'What if the GPS location tool does not work?',
    answer: 'If GPS detection fails, you can search manually using the search bar. Enter your city name, area, locality, or any 6-digit PIN code to find exact postal details.',
  },
]

// Popular city links for internal linking
const popularCityLinks = [
  { name: 'Delhi', slug: 'delhi' },
  { name: 'Mumbai', slug: 'mumbai' },
  { name: 'Bangalore', slug: 'bangalore' },
  { name: 'Hyderabad', slug: 'hyderabad' },
  { name: 'Chennai', slug: 'chennai' },
  { name: 'Kolkata', slug: 'kolkata' },
]
</script>


<template>
  <div class="space-y-6 sm:space-y-8">
    <!-- Header -->
    <div class="text-center space-y-3 pt-2">
      <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
        <UIcon name="i-heroicons-map-pin" class="w-3.5 h-3.5 text-sky-600" />
        <span>Instant GPS Postal Detection</span>
      </div>
      <h1 class="text-2xl sm:text-3xl md:text-4xl font-extrabold text-zinc-900 tracking-tight">
        Find My PIN Code
      </h1>
      <p class="text-sm sm:text-base text-zinc-600 max-w-xl mx-auto">
        Detect the 6-digit postal PIN code of your current physical location in India using your mobile or desktop browser GPS.
      </p>
    </div>

    <AdSlot placement="header-leaderboard" />

    <!-- Action Card -->
    <div class="max-w-2xl mx-auto bg-white border border-zinc-200 rounded-md p-6 sm:p-10 shadow-xs text-center space-y-6">
      <div class="w-16 h-16 rounded-md bg-sky-50 text-sky-600 flex items-center justify-center mx-auto shadow-inner">
        <UIcon name="i-heroicons-globe-asia-australia" class="w-8 h-8" />
      </div>

      <div class="space-y-2 max-w-md mx-auto">
        <h2 class="text-xl font-bold text-zinc-900">What is my PIN code right now?</h2>
        <p class="text-xs sm:text-sm text-zinc-500">
          Click below to allow location access. We do not store or track your exact coordinates; they are used only to find the nearest postal delivery area.
        </p>
      </div>

      <div>
        <button
          type="button"
          class="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-md font-bold text-base bg-sky-600 text-white hover:bg-sky-700 transition shadow-md hover:shadow-lg disabled:opacity-50"
          :disabled="isLocating"
          @click="detectLocation"
        >
          <UIcon v-if="!isLocating" name="i-heroicons-map-pin" class="w-5 h-5" />
          <UIcon v-else name="i-heroicons-arrow-path" class="w-5 h-5 animate-spin" />
          <span>{{ isLocating ? 'Detecting Location Coordinates...' : 'Use My Current Location' }}</span>
        </button>
      </div>

      <!-- Error State -->
      <div v-if="geoError" class="p-4 rounded-md bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm text-left flex items-start gap-2.5">
        <UIcon name="i-heroicons-exclamation-triangle" class="w-5 h-5 shrink-0 mt-0.5" />
        <div>
          <span class="font-bold block">Location Detection Notice:</span>
          <span>{{ geoError }}</span>
        </div>
      </div>

      <!-- Success Result -->
      <div v-if="result" class="p-6 rounded-md bg-sky-50/60 border-2 border-sky-200 text-left space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold uppercase tracking-wider text-sky-800">
            Nearest Postal Code Found
          </span>
          <span v-if="result.distanceKm" class="text-xs text-zinc-500 font-mono">
            ~{{ result.distanceKm }} km away
          </span>
        </div>

        <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <div class="text-5xl sm:text-6xl md:text-7xl font-extrabold text-zinc-900 font-mono tracking-tight leading-none">
              {{ result.pincode }}
            </div>
            <div class="text-sm sm:text-base font-semibold text-zinc-700 mt-2">
              {{ result.district }}, {{ result.statename }}
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <button
              type="button"
              class="px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-bold rounded-lg transition"
              :class="isCopied ? 'bg-emerald-600 text-white' : 'bg-white border border-zinc-300 text-zinc-800 hover:border-zinc-400'"
              @click="copyPin"
            >
              {{ isCopied ? '✓ Copied' : 'Copy PIN' }}
            </button>
            <NuxtLink
              :to="`/pincode/${result.pincode}`"
              class="px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-bold rounded-lg bg-sky-600 text-white hover:bg-sky-700 transition"
            >
              View Details →
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Fallback Search -->
      <div class="pt-6 border-t border-zinc-100">
        <span class="text-xs text-zinc-600 block mb-3">Or search manually by area or address:</span>
        <SearchBar />
      </div>
    </div>


    <AdSlot placement="in-content" />

    <!-- FAQ Section -->
    <FaqSection :faqs="locationFaqs" title="Frequently Asked Questions — Find My PIN Code & Nearest Post Office" />

    <!-- Popular City Internal Links -->
    <div class="bg-white border border-zinc-200 rounded-md p-6 shadow-xs space-y-4">
      <h2 class="text-base font-bold text-zinc-900 tracking-tight">Browse PIN Codes by Major City</h2>
      <div class="flex flex-wrap gap-2">
        <NuxtLink
          v-for="city in popularCityLinks"
          :key="city.slug"
          :to="`/city/${city.slug}/pincodes`"
          class="px-3 py-1.5 rounded-md bg-zinc-50 border border-zinc-200 hover:border-sky-300 hover:bg-sky-50 text-xs font-semibold text-zinc-800 transition"
        >
          {{ city.name }} PIN Codes
        </NuxtLink>
        <NuxtLink to="/states" class="px-3 py-1.5 rounded-md bg-sky-50 border border-sky-200 hover:border-sky-400 text-xs font-semibold text-sky-700 transition">
          All States →
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

