<script setup lang="ts">
const route = useRoute()
const city = route.params.city
await navigateTo(`/city/${city}/pincodes`, { redirectCode: 301 })
</script>

<template>
  <div class="py-12 text-center text-zinc-500 text-sm">
    Redirecting to city postal directory...
  </div>
</template>
