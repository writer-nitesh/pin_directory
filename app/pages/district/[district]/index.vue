<script setup lang="ts">
const route = useRoute()
const districtSlug = route.params.district
await navigateTo(`/district/${districtSlug}/pincodes`, { redirectCode: 301 })
</script>

<template>
  <div class="py-12 text-center text-zinc-500 text-sm">
    Redirecting to district postal directory...
  </div>
</template>
