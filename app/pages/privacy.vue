<script setup lang="ts">
useSeoMeta({
  title: 'Privacy Policy - Pin Directory',
  description: 'Privacy policy and data protection practices for Pin Directory.',
})
</script>

<template>
  <div class="max-w-3xl mx-auto space-y-6 bg-white border border-zinc-200 rounded-2xl p-6 sm:p-10 shadow-xs">
    <div class="border-b border-zinc-100 pb-4">
      <span class="text-xs font-semibold uppercase tracking-wider text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
        Legal & Compliance
      </span>
      <h1 class="text-3xl font-extrabold text-zinc-900 tracking-tight mt-2">
        Privacy Policy
      </h1>
    </div>

    <div class="prose prose-zinc max-w-none text-zinc-700 text-sm sm:text-base leading-relaxed space-y-4">
      <p>
        At <strong>Pin Directory</strong>, reachable at <NuxtLink to="/" class="text-sky-600 underline">pindirectory.in</NuxtLink>, the privacy of our visitors is of paramount importance. This Privacy Policy document outlines the types of information collected and recorded by Pin Directory and how we use it.
      </p>

      <h2 class="text-lg font-bold text-zinc-900 pt-2">Geolocation Information</h2>
      <p>
        When you choose to use our "Find My PIN Code" tool, we request permission to access your device's geographical location (latitude and longitude) through your browser's standard Geolocation API.
      </p>
      <p>
        <strong>We do not save, track, or share your GPS coordinates on our servers.</strong> The coordinates are processed ephemerally solely to calculate the nearest Indian postal code and deliver the result to your screen.
      </p>

      <h2 class="text-lg font-bold text-zinc-900 pt-2">Log Files & Analytics</h2>
      <p>
        Pin Directory follows standard web analytics procedures. These files log visitors when they visit websites. The information collected includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and number of clicks.
      </p>

      <h2 class="text-lg font-bold text-zinc-900 pt-2">Advertising Partners & Cookies</h2>
      <p>
        Third-party ad servers or ad networks (such as Google AdSense) may use technologies like cookies, JavaScript, or Web Beacons in their respective advertisements and links that appear on Pin Directory. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize advertising content.
      </p>
    </div>
  </div>
</template>
