<script setup lang="ts">
const config = useRuntimeConfig()

const title = 'About Pin Directory — Indian PIN Code & Postal Code Search Engine'
const description = 'Pin Directory is a fast, free Indian postal code directory. We index 19,500+ PIN codes and 165,000+ post offices across all 37 states of India using official India Post data.'

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description,
  ogType: 'website',
  ogUrl: `${config.public.siteUrl}/about`,
  twitterCard: 'summary',
  twitterTitle: title,
  twitterDescription: description,
})

useHead({
  link: [{ rel: 'canonical', href: `${config.public.siteUrl}/about` }],
})
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-6 bg-white border border-zinc-200 rounded-md p-6 sm:p-8 shadow-xs">
    <div class="border-b border-zinc-100 pb-4">
      <span class="text-xs font-semibold uppercase tracking-wider text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
        About Pin Directory
      </span>
      <h1 class="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight mt-2">
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

      <h2 class="text-lg font-bold text-zinc-900 pt-2">Comprehensive Postal Coverage</h2>
      <p>
        Pin Directory indexes over 19,500 active 6-digit postal index numbers and more than 165,000 post offices spanning all 37 states and union territories in India, offering comprehensive geographical and postal division mappings.
      </p>

      <h2 class="text-lg font-bold text-zinc-900 pt-2">Data Sources & Accuracy</h2>
      <p>
        Our postal data is sourced from the official <a href="https://www.indiapost.gov.in" target="_blank" rel="noopener noreferrer" class="text-sky-600 hover:underline">India Post (Department of Posts)</a> directory and the <a href="https://data.gov.in/resource/all-india-pincode-directory-till-last-month" target="_blank" rel="noopener noreferrer" class="text-sky-600 hover:underline">Government of India Open Data Portal (data.gov.in)</a>. We cross-reference multiple datasets to ensure accuracy.
      </p>
      <p>
        For the most authoritative and official PIN code lookup, you can also visit the <a href="http://www.indiapost.gov.in/VAS/Pages/FindPincode.aspx" target="_blank" rel="noopener noreferrer" class="text-sky-600 hover:underline">India Post PIN Code Search</a> directly.
      </p>

      <h2 class="text-lg font-bold text-zinc-900 pt-2">Features</h2>
      <ul class="list-disc list-inside space-y-1 text-sm text-zinc-700">
        <li>Instant PIN code lookup by area, city, or 6-digit code</li>
        <li>GPS-based <NuxtLink to="/find-my-pincode" class="text-sky-600 hover:underline">Find My PIN Code</NuxtLink> tool</li>
        <li>Complete state-wise and district-wise directories</li>
        <li>Post office delivery status and division information</li>
        <li>Nearby PIN codes for every postal area</li>
      </ul>

      <p class="text-xs text-zinc-500 bg-zinc-50 p-4 rounded-md border border-zinc-200">
        <em>Disclaimer:</em> Pin Directory is an independent informational directory and search platform created for convenience and educational purposes. Data is sourced from publicly available India Post records.
      </p>
    </div>
  </div>
</template>

