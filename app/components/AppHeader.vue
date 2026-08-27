<script setup lang="ts">
const isMobileMenuOpen = ref(false)
</script>

<template>
  <header class="sticky top-0 z-40 w-full border-b border-zinc-200 bg-white/95 backdrop-blur-md">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center gap-2.5 group">
        <div class="w-9 h-9 rounded-lg bg-sky-600 flex items-center justify-center text-white shadow-sm group-hover:bg-sky-700 transition">
          <UIcon name="i-heroicons-map-pin" class="w-5 h-5" />
        </div>
        <div class="flex flex-col">
          <span class="text-lg font-bold tracking-tight text-zinc-900 leading-none flex items-center gap-1.5">
            Pin Directory
            <span class="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-sky-100 text-sky-800 tracking-wider">India</span>
          </span>
          <span class="text-[11px] text-zinc-500 font-medium">Postal Code Search</span>
        </div>
      </NuxtLink>

      <!-- Desktop Nav -->
      <nav class="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-600">
        <NuxtLink to="/" class="hover:text-sky-600 transition" active-class="text-sky-600 font-semibold">
          Home
        </NuxtLink>
        <NuxtLink to="/find-my-pincode" class="flex items-center gap-1.5 hover:text-sky-600 transition" active-class="text-sky-600 font-semibold">
          <UIcon name="i-heroicons-paper-airplane" class="w-4 h-4 text-sky-500" />
          Find My PIN
        </NuxtLink>
        <NuxtLink to="/states" class="hover:text-sky-600 transition" active-class="text-sky-600 font-semibold">
          States
        </NuxtLink>
        <NuxtLink to="/guides" class="hover:text-sky-600 transition" active-class="text-sky-600 font-semibold">
          Guides
        </NuxtLink>
      </nav>

      <!-- Action Button -->
      <div class="hidden md:flex items-center gap-3">
        <NuxtLink
          to="/find-my-pincode"
          class="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-sky-600 text-white hover:bg-sky-700 transition shadow-xs"
        >
          <UIcon name="i-heroicons-location-marker" class="w-4 h-4" />
          Use Location
        </NuxtLink>
      </div>

      <!-- Mobile Hamburger Button -->
      <div class="flex md:hidden">
        <button
          type="button"
          class="p-2 rounded-md text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
          aria-label="Toggle Navigation Menu"
          @click="isMobileMenuOpen = !isMobileMenuOpen"
        >
          <UIcon :name="isMobileMenuOpen ? 'i-heroicons-x-mark' : 'i-heroicons-bars-3'" class="w-6 h-6" />
        </button>
      </div>
    </div>

    <!-- Mobile Dropdown Menu -->
    <div v-if="isMobileMenuOpen" class="md:hidden border-b border-zinc-200 bg-white px-4 pt-2 pb-4 space-y-2">
      <NuxtLink
        to="/"
        class="block px-3 py-2 rounded-md text-base font-medium text-zinc-700 hover:bg-zinc-50"
        @click="isMobileMenuOpen = false"
      >
        Home
      </NuxtLink>
      <NuxtLink
        to="/find-my-pincode"
        class="block px-3 py-2 rounded-md text-base font-medium text-sky-600 hover:bg-sky-50"
        @click="isMobileMenuOpen = false"
      >
        📍 Find My PIN Code
      </NuxtLink>
      <NuxtLink
        to="/states"
        class="block px-3 py-2 rounded-md text-base font-medium text-zinc-700 hover:bg-zinc-50"
        @click="isMobileMenuOpen = false"
      >
        Browse States
      </NuxtLink>
      <NuxtLink
        to="/guides"
        class="block px-3 py-2 rounded-md text-base font-medium text-zinc-700 hover:bg-zinc-50"
        @click="isMobileMenuOpen = false"
      >
        Postal Guides
      </NuxtLink>
    </div>
  </header>
</template>
