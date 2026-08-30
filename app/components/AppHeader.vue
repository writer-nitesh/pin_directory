<script setup lang="ts">
const isMobileMenuOpen = ref(false)
const { $pwa } = useNuxtApp()
// alias so template works without $ prefix
const pwa = $pwa
</script>

<template>
  <header class="sticky top-0 z-40 w-full border-b border-zinc-200 bg-white/95 backdrop-blur-md">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
      <!-- Logo -->
      <NuxtLink to="/" class="focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded-md">
        <AppLogo size="lg" show-text show-tagline />
      </NuxtLink>

      <!-- Desktop Nav -->
      <nav class="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-600">
        <NuxtLink to="/" class="hover:text-sky-600 transition focus:outline-none focus-visible:text-sky-600"
          active-class="text-sky-600 font-semibold">
          Home
        </NuxtLink>
        <NuxtLink to="/find-my-pincode"
          class="flex items-center gap-1.5 hover:text-sky-600 transition focus:outline-none focus-visible:text-sky-600"
          active-class="text-sky-600 font-semibold">
          Find My PIN
          <UIcon name="i-heroicons-map-pin" class="w-4 h-4 text-sky-500" />
        </NuxtLink>
        <NuxtLink to="/states" class="hover:text-sky-600 transition focus:outline-none focus-visible:text-sky-600"
          active-class="text-sky-600 font-semibold">
          States
        </NuxtLink>
        <NuxtLink to="/guides" class="hover:text-sky-600 transition focus:outline-none focus-visible:text-sky-600"
          active-class="text-sky-600 font-semibold">
          Guides
        </NuxtLink>
      </nav>

      <!-- Action Button -->
      <div class="hidden md:flex items-center gap-3">
        <button v-if="pwa?.showInstallPrompt && !pwa?.isPWAInstalled" type="button"
          class="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-md bg-emerald-600 text-white hover:bg-emerald-700 transition shadow-xs"
          @click="pwa?.install()">
          <UIcon name="i-heroicons-arrow-down-tray" class="w-4 h-4" />
          Install App
        </button>
        <NuxtLink to="/find-my-pincode"
          class="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-md bg-sky-600 text-white hover:bg-sky-700 transition shadow-xs">
          <UIcon name="i-heroicons-map-pin" class="w-4 h-4" />
          Use Location
        </NuxtLink>
      </div>

      <!-- Mobile Hamburger Button -->
      <div class="flex md:hidden">
        <button type="button" class="p-2 rounded-md text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
          aria-label="Toggle Navigation Menu" @click="isMobileMenuOpen = !isMobileMenuOpen">
          <UIcon :name="isMobileMenuOpen ? 'i-heroicons-x-mark' : 'i-heroicons-bars-3'" class="w-6 h-6" />
        </button>
      </div>
    </div>

    <!-- Mobile Dropdown Menu -->
    <div v-if="isMobileMenuOpen" class="md:hidden border-b border-zinc-200 bg-white px-4 pt-2 pb-4 space-y-2">
      <NuxtLink to="/" class="block px-3 py-2 rounded-md text-base font-medium text-zinc-700 hover:bg-zinc-50"
        @click="isMobileMenuOpen = false">
        Home
      </NuxtLink>
      <NuxtLink to="/find-my-pincode"
        class="block px-3 py-2 rounded-md text-base font-medium text-sky-600 hover:bg-sky-50"
        @click="isMobileMenuOpen = false">
        📍 Find My PIN Code
      </NuxtLink>
      <NuxtLink to="/states" class="block px-3 py-2 rounded-md text-base font-medium text-zinc-700 hover:bg-zinc-50"
        @click="isMobileMenuOpen = false">
        Browse States
      </NuxtLink>
      <NuxtLink to="/guides" class="block px-3 py-2 rounded-md text-base font-medium text-zinc-700 hover:bg-zinc-50"
        @click="isMobileMenuOpen = false">
        Postal Guides
      </NuxtLink>
    </div>
  </header>
</template>
