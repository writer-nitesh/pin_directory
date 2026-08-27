<script setup lang="ts">
useSeoMeta({
  title: 'About Us - Pin Directory India',
  description: 'Learn about Pin Directory, the modern programmatic search engine for Indian postal index numbers and post offices.',
})
</script>

<template>
  <div class="max-w-3xl mx-auto space-y-6 bg-white border border-zinc-200 rounded-2xl p-6 sm:p-10 shadow-xs">
    <div class="border-b border-zinc-100 pb-4">
      <span class="text-xs font-semibold uppercase tracking-wider text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
        About Pin Directory
      </span>
      <h1 class="text-3xl font-extrabold text-zinc-900 tracking-tight mt-2">
        About Pin Directory
      </h1>
    </div>

    <div class="prose prose-zinc max-w-none text-zinc-700 text-sm sm:text-base leading-relaxed space-y-4">
      <p>
        <strong>Pin Directory</strong> is an independent, high-performance postal location directory created to make finding Indian postal codes (PIN codes), delivery branches, and regional post offices effortless and instantaneous.
      </p>

      <h2 class="text-lg font-bold text-zinc-900 pt-2">Our Mission</h2>
      <p>
        Finding accurate postal addresses in India has historically required navigating slow, cluttered government portals or ad-stuffed directories. Our goal is to provide a clean, minimalist, lightning-fast search engine that answers your query directly without unnecessary friction.
      </p>

      <h2 class="text-lg font-bold text-zinc-900 pt-2">Data Source & Attribution</h2>
      <p>
        The postal data displayed across Pin Directory is derived from official open government records provided by the <strong>Department of Posts, Ministry of Communications, Government of India</strong> via the <strong>Open Government Data (OGD) Platform India (<a href="https://data.gov.in" target="_blank" rel="noopener" class="text-sky-600 underline">data.gov.in</a>)</strong>.
      </p>
      <p class="text-xs text-zinc-500 bg-zinc-50 p-4 rounded-xl border border-zinc-200">
        <em>Disclaimer:</em> Pin Directory is an independent educational and informational service and is not affiliated, endorsed by, or directly associated with India Post or the Government of India.
      </p>
    </div>
  </div>
</template>
