<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const statusCode = computed(() => props.error?.statusCode || 404)
const is404 = computed(() => statusCode.value === 404)

// Crucial SEO: Never allow search engines to index error pages
useSeoMeta({
  title: is404.value ? '404 - Page Not Found | Pin Directory' : 'System Error | Pin Directory',
  robots: 'noindex, nofollow',
})

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <div class="min-h-screen flex flex-col bg-zinc-50/50 text-zinc-900 antialiased font-sans">
    <AppHeader />

    <main class="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20 w-full flex flex-col items-center justify-center text-center">
      <!-- Error Status Badge -->
      <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 mb-6">
        <UIcon name="i-heroicons-exclamation-triangle" class="w-4 h-4 text-amber-600" />
        <span>HTTP Error {{ statusCode }}</span>
      </div>

      <!-- Main Headline -->
      <h1 class="text-3xl sm:text-4xl md:text-5xl font-extrabold text-zinc-900 tracking-tight font-mono mb-4">
        {{ is404 ? '404 - Page Not Found' : 'Something Went Wrong' }}
      </h1>

      <p class="text-sm sm:text-base text-zinc-600 max-w-xl mx-auto mb-8">
        <template v-if="is404">
          The postal code, post office, or directory page you are looking for does not exist or may have been updated.
        </template>
        <template v-else>
          An unexpected error occurred while loading postal records. Please try again or return to the homepage.
        </template>
      </p>

      <!-- Recovery Search Bar -->
      <div class="w-full max-w-xl mb-10">
        <span class="text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-3">
          Search Postal Directory Directly:
        </span>
        <SearchBar />
      </div>

      <!-- Quick Action Buttons -->
      <div class="flex flex-wrap items-center justify-center gap-3 mb-12">
        <button
          type="button"
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-md font-semibold text-sm bg-sky-600 text-white hover:bg-sky-700 transition shadow-xs"
          @click="handleError"
        >
          <UIcon name="i-heroicons-home" class="w-4 h-4" />
          <span>Go to Homepage</span>
        </button>

        <NuxtLink
          to="/states"
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-md font-semibold text-sm bg-white border border-zinc-200 text-zinc-800 hover:border-sky-300 hover:text-sky-600 transition shadow-xs"
        >
          <UIcon name="i-heroicons-building-library" class="w-4 h-4 text-zinc-500" />
          <span>Browse All States</span>
        </NuxtLink>

        <NuxtLink
          to="/find-my-pincode"
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-md font-semibold text-sm bg-white border border-zinc-200 text-zinc-800 hover:border-sky-300 hover:text-sky-600 transition shadow-xs"
        >
          <UIcon name="i-heroicons-map-pin" class="w-4 h-4 text-sky-600" />
          <span>Find My PIN (GPS)</span>
        </NuxtLink>
      </div>

      <!-- Popular Shortcuts -->
      <div class="pt-6 border-t border-zinc-200 w-full max-w-lg text-xs text-zinc-500">
        <span class="font-medium text-zinc-700 block mb-2">Popular Metros & Cities:</span>
        <div class="flex flex-wrap justify-center gap-2">
          <NuxtLink to="/city/delhi/pincodes" class="hover:text-sky-600 underline">Delhi</NuxtLink> •
          <NuxtLink to="/city/mumbai/pincodes" class="hover:text-sky-600 underline">Mumbai</NuxtLink> •
          <NuxtLink to="/city/bangalore/pincodes" class="hover:text-sky-600 underline">Bangalore</NuxtLink> •
          <NuxtLink to="/city/hyderabad/pincodes" class="hover:text-sky-600 underline">Hyderabad</NuxtLink> •
          <NuxtLink to="/city/pune/pincodes" class="hover:text-sky-600 underline">Pune</NuxtLink> •
          <NuxtLink to="/city/chennai/pincodes" class="hover:text-sky-600 underline">Chennai</NuxtLink> •
          <NuxtLink to="/city/kolkata/pincodes" class="hover:text-sky-600 underline">Kolkata</NuxtLink>
        </div>
      </div>
    </main>

    <AppFooter />
  </div>
</template>
