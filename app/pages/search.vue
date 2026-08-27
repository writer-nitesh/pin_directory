<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const q = computed(() => String(route.query.q || '').trim())

// Strict noindex on search result query URLs as per Google guidelines
useSeoMeta({
  title: `Search results for "${q.value}" - Pin Directory`,
  robots: 'noindex, follow',
})

const { data, status } = await useFetch(() => `/api/search?q=${encodeURIComponent(q.value)}`, {
  watch: [q],
})

const results = computed(() => data.value?.results || [])

// If exact 6-digit PIN code searched, redirect directly
watch(q, (newQ) => {
  if (/^\d{6}$/.test(newQ)) {
    router.replace(`/pincode/${newQ}`)
  }
}, { immediate: true })
</script>

<template>
  <div class="space-y-6 max-w-3xl mx-auto">
    <div class="bg-white border border-zinc-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
      <h1 class="text-2xl font-bold text-zinc-900 tracking-tight">
        Search Results for "{{ q }}"
      </h1>
      <SearchBar />
    </div>

    <AdSlot placement="header-leaderboard" />

    <div v-if="status === 'pending'" class="py-12 text-center text-zinc-500">
      Searching postal directory...
    </div>

    <div v-else-if="results.length === 0" class="bg-white border border-zinc-200 rounded-2xl p-8 text-center space-y-3">
      <UIcon name="i-heroicons-face-frown" class="w-8 h-8 text-zinc-400 mx-auto" />
      <h2 class="text-lg font-bold text-zinc-900">No Postal Matches Found</h2>
      <p class="text-xs sm:text-sm text-zinc-500 max-w-md mx-auto">
        We couldn't find any post offices, PIN codes, or districts matching "{{ q }}". Please try searching with a 6-digit numeric PIN or check spelling.
      </p>
      <div class="pt-2">
        <NuxtLink to="/find-my-pincode" class="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-600 hover:underline">
          <span>📍 Try GPS Location Finder</span>
        </NuxtLink>
      </div>
    </div>

    <div v-else class="space-y-3">
      <NuxtLink
        v-for="(item, idx) in results"
        :key="idx"
        :to="`/pincode/${item.pincode}`"
        class="block p-4 rounded-xl bg-white border border-zinc-200 hover:border-sky-300 hover:shadow-xs transition"
      >
        <div class="flex items-center justify-between">
          <div>
            <div class="font-bold text-sm sm:text-base text-zinc-900">
              {{ item.officename || item.district }}
            </div>
            <div class="text-xs text-zinc-500 mt-0.5">
              {{ item.district }}, {{ item.statename }}
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span class="px-3 py-1 font-mono font-bold text-sm bg-sky-100 text-sky-800 rounded-lg">
              {{ item.pincode }}
            </span>
          </div>
        </div>
      </NuxtLink>
    </div>

    <AdSlot placement="in-content" />
  </div>
</template>
