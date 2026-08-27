<script setup lang="ts">
const route = useRoute()
const stateSlug = route.params.state
// Redirect to canonical /state/:state/pincodes
await navigateTo(`/state/${stateSlug}/pincodes`, { redirectCode: 301 })
</script>

<template>
  <div class="py-12 text-center text-zinc-500 text-sm">
    Redirecting to state postal directory...
  </div>
</template>
