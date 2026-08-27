<script setup lang="ts">
const router = useRouter()
const query = ref('')
const results = ref<any[]>([])
const isLoading = ref(false)
const isOpen = ref(false)
const activeIndex = ref(-1)
const searchInput = ref<HTMLInputElement | null>(null)

let debounceTimer: any = null

const handleInput = () => {
  const q = query.value.trim()
  if (!q || q.length < 2) {
    results.value = []
    isOpen.value = false
    return
  }

  clearTimeout(debounceTimer)
  isLoading.value = true
  debounceTimer = setTimeout(async () => {
    try {
      const data = await $fetch<{ results: any[] }>(`/api/search?q=${encodeURIComponent(q)}`)
      results.value = data.results || []
      isOpen.value = results.value.length > 0
      activeIndex.value = -1
    } catch {
      results.value = []
    } finally {
      isLoading.value = false
    }
  }, 200)
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (!isOpen.value || results.value.length === 0) return

  if (e.key === 'ArrowDown') {
    e.preventDefault()
    activeIndex.value = (activeIndex.value + 1) % results.value.length
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    activeIndex.value = (activeIndex.value - 1 + results.value.length) % results.value.length
  } else if (e.key === 'Enter') {
    e.preventDefault()
    if (activeIndex.value >= 0 && results.value[activeIndex.value]) {
      selectResult(results.value[activeIndex.value])
    } else if (query.value.trim()) {
      // If 6 digit pincode typed, go directly to pincode page
      const q = query.value.trim()
      if (/^\d{6}$/.test(q)) {
        router.push(`/pincode/${q}`)
        isOpen.value = false
      }
    }
  } else if (e.key === 'Escape') {
    isOpen.value = false
  }
}

const selectResult = (item: any) => {
  isOpen.value = false
  query.value = ''
  if (item.pincode) {
    router.push(`/pincode/${item.pincode}`)
  }
}

// Close when clicking outside
const containerRef = ref<HTMLElement | null>(null)
onMounted(() => {
  const handleClickOutside = (e: MouseEvent) => {
    if (containerRef.value && !containerRef.value.contains(e.target as Node)) {
      isOpen.value = false
    }
  }
  document.addEventListener('click', handleClickOutside)
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })
})
</script>

<template>
  <div ref="containerRef" class="relative w-full max-w-2xl mx-auto">
    <div class="relative flex items-center">
      <!-- Search Icon -->
      <div class="absolute left-4 pointer-events-none text-zinc-600 flex items-center">
        <UIcon v-if="!isLoading" name="i-heroicons-magnifying-glass" class="w-5 h-5" />
        <UIcon v-else name="i-heroicons-arrow-path" class="w-5 h-5 animate-spin text-sky-600" />
      </div>

      <!-- Main Input -->
      <input
        ref="searchInput"
        v-model="query"
        type="text"
        placeholder="Enter PIN code, post office, or city (e.g. 110001, Connaught Place, Bangalore)..."
        class="w-full pl-12 pr-28 py-3.5 sm:py-4 text-sm sm:text-base rounded-2xl bg-white border border-zinc-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition text-zinc-900 placeholder:text-zinc-500"
        autocomplete="off"
        @input="handleInput"
        @keydown="handleKeyDown"
        @focus="isOpen = results.length > 0"
      />

      <!-- Clear / GPS Button -->
      <div class="absolute right-3 flex items-center gap-1.5">
        <button
          v-if="query"
          type="button"
          class="p-1 text-zinc-500 hover:text-zinc-700 rounded-full"
          aria-label="Clear Search"
          @click="query = ''; results = []; isOpen = false"
        >
          <UIcon name="i-heroicons-x-mark" class="w-4 h-4" />
        </button>
        <NuxtLink
          to="/find-my-pincode"
          class="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 transition"
          title="Detect my location"
        >
          <UIcon name="i-heroicons-map-pin" class="w-3.5 h-3.5 text-sky-600" />
          <span class="hidden sm:inline">GPS</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Autocomplete Dropdown -->
    <div
      v-if="isOpen && results.length > 0"
      class="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-zinc-200 overflow-hidden z-50 divide-y divide-zinc-100 animate-in fade-in slide-in-from-top-2 duration-150"
    >
      <div class="px-3 py-1.5 bg-zinc-50 flex items-center justify-between text-[11px] font-semibold text-zinc-600 uppercase tracking-wider">
        <span>Postal Search Results</span>
        <span>Press Enter to select</span>
      </div>

      <div class="max-h-80 overflow-y-auto py-1">
        <button
          v-for="(item, idx) in results"
          :key="idx"
          type="button"
          class="w-full px-4 py-2.5 text-left flex items-center justify-between hover:bg-sky-50/70 transition"
          :class="{ 'bg-sky-50': activeIndex === idx }"
          @click="selectResult(item)"
        >
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center shrink-0 text-zinc-600">
              <UIcon name="i-heroicons-map-pin" class="w-4 h-4 text-sky-600" />
            </div>
            <div class="min-w-0">
              <div class="text-sm font-semibold text-zinc-900 truncate">
                {{ item.officename ? item.officename : item.district }}
              </div>
              <div class="text-xs text-zinc-500 truncate">
                {{ item.district }}, {{ item.statename }}
              </div>
            </div>
          </div>

          <div class="flex items-center gap-2 shrink-0 ml-3">
            <span class="px-2.5 py-1 text-xs font-mono font-bold rounded-md bg-sky-100 text-sky-800">
              {{ item.pincode }}
            </span>
            <span v-if="item.delivery" class="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded" :class="item.delivery === 'Delivery' ? 'bg-emerald-100 text-emerald-800' : 'bg-zinc-100 text-zinc-600'">
              {{ item.delivery === 'Delivery' ? 'Delivery' : 'Non-Del' }}
            </span>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>
