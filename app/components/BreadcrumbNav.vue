<script setup lang="ts">
interface BreadcrumbItem {
  name: string
  path: string
}

const props = defineProps<{
  items: BreadcrumbItem[]
}>()

// Add Home at the start
const fullItems = computed(() => [
  { name: 'Home', path: '/' },
  ...props.items,
])

// Auto-register Schema.org BreadcrumbList
useSchemaOrg([
  defineBreadcrumb(
    fullItems.value.map(item => ({
      name: item.name,
      item: item.path,
    }))
  ),
])
</script>

<template>
  <nav aria-label="Breadcrumb" class="py-2.5 px-1 overflow-x-auto text-xs text-zinc-500 whitespace-nowrap">
    <ol class="inline-flex items-center space-x-1.5 md:space-x-2">
      <li v-for="(crumb, idx) in fullItems" :key="crumb.path" class="inline-flex items-center">
        <UIcon v-if="idx > 0" name="i-heroicons-chevron-right" class="w-3.5 h-3.5 text-zinc-400 mx-1 shrink-0" />
        <NuxtLink
          v-if="idx < fullItems.length - 1"
          :to="crumb.path"
          class="hover:text-sky-600 font-medium transition inline-flex items-center"
        >
          <UIcon v-if="idx === 0" name="i-heroicons-home" class="w-3.5 h-3.5 mr-1" />
          {{ crumb.name }}
        </NuxtLink>
        <span v-else class="text-zinc-900 font-semibold truncate max-w-[200px] sm:max-w-none" aria-current="page">
          {{ crumb.name }}
        </span>
      </li>
    </ol>
  </nav>
</template>
