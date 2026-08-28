<script setup lang="ts">
const props = defineProps<{
  placement: 'header-leaderboard' | 'in-content' | 'sidebar' | 'bottom-banner'
  slotId?: string
}>()

const config = useRuntimeConfig()
const showAds = computed(() => Boolean(config.public.showAds))

// Height and aspect ratio constraints to avoid Cumulative Layout Shift (CLS)
const slotClasses = computed(() => {
  switch (props.placement) {
    case 'header-leaderboard':
      return 'w-full min-h-[90px] md:min-h-[90px] my-4'
    case 'in-content':
      return 'w-full max-w-3xl min-h-[250px] md:min-h-[280px] my-6'
    case 'sidebar':
      return 'w-full min-h-[300px] md:min-h-[600px] my-4'
    case 'bottom-banner':
      return 'w-full min-h-[60px] md:min-h-[90px] mt-8 mb-4'
    default:
      return 'min-h-[100px] my-4'
  }
})
</script>

<template>
  <div v-if="showAds" class="flex flex-col items-center justify-center mx-auto transition-all" :class="slotClasses">
    <div class="w-full flex justify-between items-center px-2 py-0.5 text-[10px] text-zinc-600 uppercase tracking-widest border-b border-zinc-200">
      <span>Advertisement</span>
      <span class="text-[9px] text-zinc-500">Sponsored</span>
    </div>
    <div class="w-full h-full flex items-center justify-center bg-zinc-50/80 border border-zinc-200/80 rounded-b-md p-4 text-center">
      <!-- If Google AdSense client ID is configured, real ad unit is inserted here -->
      <ins
        v-if="config.public.adsenseClient"
        class="adsbygoogle block w-full h-full"
        :data-ad-client="config.public.adsenseClient"
        :data-ad-slot="slotId || '1234567890'"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
      <!-- Minimalist fallback preview container when ads=true but adsenseClient not yet configured -->
      <div v-else class="flex flex-col items-center justify-center text-zinc-600 text-xs py-4 space-y-1">
        <UIcon name="i-heroicons-megaphone" class="w-5 h-5 text-zinc-500" />
        <span class="font-medium text-zinc-700">Responsive Ad Space ({{ placement }})</span>
        <span class="text-[11px] text-zinc-500">Environment Ads Enabled (NUXT_PUBLIC_SHOW_ADS=true)</span>
      </div>
    </div>
  </div>
</template>
