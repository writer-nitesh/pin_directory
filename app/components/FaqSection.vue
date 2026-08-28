<script setup lang="ts">
interface FaqItem {
  question: string
  answer: string
}

const props = defineProps<{
  faqs: FaqItem[]
  title?: string
}>()

// Register Schema.org FAQPage for Google Rich Results
useSchemaOrg([
  {
    '@type': 'FAQPage',
    mainEntity: props.faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  },
])

const openIndex = ref<number | null>(0)

const toggle = (idx: number) => {
  openIndex.value = openIndex.value === idx ? null : idx
}
</script>

<template>
  <div class="w-full my-8">
    <h2 class="text-xl font-bold text-zinc-900 tracking-tight mb-4 flex items-center gap-2">
      <UIcon name="i-heroicons-question-mark-circle" class="w-5 h-5 text-sky-600" />
      {{ title || 'Frequently Asked Questions' }}
    </h2>

    <div class="divide-y divide-zinc-200 border border-zinc-200 rounded-md bg-white overflow-hidden shadow-xs">
      <div v-for="(faq, idx) in faqs" :key="idx" class="transition-colors">
        <button
          type="button"
          class="w-full px-5 py-4 text-left flex items-center justify-between gap-4 hover:bg-zinc-50 transition"
          :aria-expanded="openIndex === idx"
          @click="toggle(idx)"
        >
          <span class="text-sm sm:text-base font-semibold text-zinc-900 leading-snug">
            {{ faq.question }}
          </span>
          <UIcon
            name="i-heroicons-chevron-down"
            class="w-4 h-4 text-zinc-500 shrink-0 transition-transform duration-200"
            :class="{ 'rotate-180 text-sky-600': openIndex === idx }"
          />
        </button>

        <div v-show="openIndex === idx" class="px-5 pb-4 pt-1 text-sm text-zinc-600 leading-relaxed bg-zinc-50/40">
          <p>{{ faq.answer }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
