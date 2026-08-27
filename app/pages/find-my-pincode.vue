<script setup lang="ts">
const config = useRuntimeConfig()

// SEO Meta
const title = 'Find My PIN Code - Detect Pincode of Current Location'
const description = 'Find your current 6-digit postal PIN code instantly using GPS geolocation. Detect your area pincode, post office, and district address in India.'

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description,
  ogType: 'website',
})

useHead({
  link: [{ rel: 'canonical', href: `${config.public.siteUrl}/find-my-pincode` }],
})

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
</script>

<template>
  <div class="max-w-3xl mx-auto space-y-8 py-4">
    <!-- Header -->
    <div class="text-center space-y-3">
      <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
        <UIcon name="i-heroicons-map-pin" class="w-3.5 h-3.5 text-sky-600" />
        <span>Instant GPS Postal Detection</span>
      </div>
      <h1 class="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
        Find My PIN Code
      </h1>
      <p class="text-sm sm:text-base text-zinc-600 max-w-xl mx-auto">
        Detect the 6-digit postal PIN code of your current physical location in India using your mobile or desktop browser GPS.
      </p>
    </div>

    <AdSlot placement="header-leaderboard" />

    <!-- Action Card -->
    <div class="bg-white border border-zinc-200 rounded-2xl p-6 sm:p-10 shadow-xs text-center space-y-6">
      <div class="w-16 h-16 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto shadow-inner">
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
          class="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-base bg-sky-600 text-white hover:bg-sky-700 transition shadow-md hover:shadow-lg disabled:opacity-50"
          :disabled="isLocating"
          @click="detectLocation"
        >
          <UIcon v-if="!isLocating" name="i-heroicons-location-marker" class="w-5 h-5" />
          <UIcon v-else name="i-heroicons-arrow-path" class="w-5 h-5 animate-spin" />
          <span>{{ isLocating ? 'Detecting Location Coordinates...' : 'Use My Current Location' }}</span>
        </button>
      </div>

      <!-- Error State -->
      <div v-if="geoError" class="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm text-left flex items-start gap-2.5">
        <UIcon name="i-heroicons-exclamation-triangle" class="w-5 h-5 shrink-0 mt-0.5" />
        <div>
          <span class="font-bold block">Location Detection Notice:</span>
          <span>{{ geoError }}</span>
        </div>
      </div>

      <!-- Success Result -->
      <div v-if="result" class="p-6 rounded-2xl bg-sky-50/60 border-2 border-sky-200 text-left space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold uppercase tracking-wider text-sky-800">
            Nearest Postal Code Found
          </span>
          <span v-if="result.distanceKm" class="text-xs text-zinc-500 font-mono">
            ~{{ result.distanceKm }} km away
          </span>
        </div>

        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div class="text-4xl font-extrabold text-zinc-900 font-mono tracking-tight">
              {{ result.pincode }}
            </div>
            <div class="text-sm font-semibold text-zinc-700 mt-1">
              {{ result.district }}, {{ result.statename }}
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button
              type="button"
              class="px-4 py-2 text-xs font-bold rounded-lg transition"
              :class="isCopied ? 'bg-emerald-600 text-white' : 'bg-white border border-zinc-300 text-zinc-800 hover:border-zinc-400'"
              @click="copyPin"
            >
              {{ isCopied ? '✓ Copied' : 'Copy PIN' }}
            </button>
            <NuxtLink
              :to="`/pincode/${result.pincode}`"
              class="px-4 py-2 text-xs font-bold rounded-lg bg-sky-600 text-white hover:bg-sky-700 transition"
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
  </div>
</template>
