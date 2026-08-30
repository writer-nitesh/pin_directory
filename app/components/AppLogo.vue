<script setup lang="ts">
withDefaults(defineProps<{
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  showTagline?: boolean
}>(), {
  size: 'md',
  showText: true,
  showTagline: false,
})

// logo.png has large padding built in — we render it bigger and clip
// so the visible icon matches the target size
const wrapSize = computed(() => ({
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-11 h-11',
}))

const imgSize = computed(() => ({
  sm: 'w-10 h-10',   // render bigger than wrap → cropped to show just icon
  md: 'w-13 h-13',
  lg: 'w-18 h-18',
}))

const textSize = computed(() => ({
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
}))
</script>

<template>
  <div class="flex items-center gap-2">
    <!-- Overflow-hidden wrapper clips the logo's built-in whitespace -->
    <div :class="[wrapSize[size], 'overflow-hidden flex-shrink-0 flex items-center justify-center']">
      <img src="/logo.png" alt="Pin Directory Logo" :class="[imgSize[size], 'object-contain']" loading="eager"
        decoding="async" />
    </div>
    <div v-if="showText" class="flex flex-col leading-none">
      <span :class="[textSize[size], 'font-bold tracking-tight text-zinc-900 flex items-center gap-1.5']">
        Pin Directory
        <span
          class="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-sky-100 text-sky-800 tracking-wider leading-none">
          India
        </span>
      </span>
      <span v-if="showTagline" class="text-[11px] text-zinc-500 font-medium mt-0.5">
        Postal Code Search
      </span>
    </div>
  </div>
</template>
