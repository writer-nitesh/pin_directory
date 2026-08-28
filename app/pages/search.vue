<script setup lang="ts">
import { useRecentSearchesStore } from '~/stores/recentSearches'

const route = useRoute()
const router = useRouter()
const recentSearchesStore = useRecentSearchesStore()
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
    recentSearchesStore.addSearch({
      title: newQ,
      subtitle: 'PIN Code',
      path: `/pincode/${newQ}`,
      type: 'pincode',
    })
    router.replace(`/pincode/${newQ}`)
  }
}, { immediate: true })

const handleClickItem = (item: any) => {
  recentSearchesStore.addSearch({
    title: item.title || item.officename || item.pincode,
    subtitle: item.subtitle || `${item.district || ''}, ${item.statename || ''}`.trim().replace(/^,\s*|,\s*$/g, ''),
    path: item.path || `/pincode/${item.pincode}`,
    type: item.type || 'pincode',
  })
}
</script>

<template>
  <div class="space-y-6 sm:space-y-8">
    <div class="bg-white border border-zinc-200 rounded-md p-6 sm:p-8 shadow-xs space-y-4">
      <h1 class="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
        Search Results for "{{ q }}"
      </h1>
      <SearchBar />
    </div>

    <AdSlot placement="header-leaderboard" />

    <div v-if="status === 'pending'" class="py-12 text-center text-zinc-500">
      Searching postal directory...
    </div>

    <div v-else-if="results.length === 0" class="bg-white border border-zinc-200 rounded-md p-8 text-center space-y-3">
      <UIcon name="i-heroicons-face-frown" class="w-8 h-8 text-zinc-400 mx-auto" />
      <h2 class="text-lg font-bold text-zinc-900">No Postal Matches Found</h2>
      <p class="text-xs sm:text-sm text-zinc-500 max-w-md mx-auto">
        We couldn't find any states, districts, post offices, or PIN codes matching "{{ q }}". Please check spelling or enter a 6-digit PIN.
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
        :to="item.path || `/pincode/${item.pincode}`"
        class="block p-4 rounded-md bg-white border border-zinc-200 hover:border-sky-300 hover:shadow-xs transition"
        @click="handleClickItem(item)"
      >
        <div class="flex items-center justify-between gap-4">
          <div class="flex items-center gap-3 min-w-0">
            <div
              class="w-10 h-10 rounded-md flex items-center justify-center shrink-0"
              :class="{
                'bg-indigo-50 text-indigo-600': item.type === 'state',
                'bg-amber-50 text-amber-600': item.type === 'district',
                'bg-sky-50 text-sky-600': item.type === 'pincode' || item.type === 'office',
              }"
            >
              <UIcon
                :name="
                  item.type === 'state'
                    ? 'i-heroicons-building-library'
                    : item.type === 'district'
                    ? 'i-heroicons-building-office-2'
                    : 'i-heroicons-map-pin'
                "
                class="w-5 h-5"
              />
            </div>

            <div class="min-w-0">
              <div class="font-bold text-sm sm:text-base text-zinc-900 truncate">
                {{ item.title || item.officename || item.district }}
              </div>
              <div class="text-xs text-zinc-500 mt-0.5 truncate">
                {{ item.subtitle || `${item.district || ''}, ${item.statename || ''}` }}
              </div>
            </div>
          </div>

          <div class="flex items-center gap-2 shrink-0">
            <span
              v-if="item.type === 'state'"
              class="px-2.5 py-1 text-xs font-bold uppercase rounded-lg bg-indigo-100 text-indigo-800"
            >
              State
            </span>
            <span
              v-else-if="item.type === 'district'"
              class="px-2.5 py-1 text-xs font-bold uppercase rounded-lg bg-amber-100 text-amber-800"
            >
              District
            </span>
            <span
              v-else-if="item.pincode"
              class="px-3 py-1 font-mono font-bold text-sm bg-sky-100 text-sky-800 rounded-lg"
            >
              {{ item.pincode }}
            </span>
          </div>
        </div>
      </NuxtLink>
    </div>

    <AdSlot placement="in-content" />
  </div>
</template>
