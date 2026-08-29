<template>
  <footer class="mt-auto border-t border-zinc-200 bg-white text-zinc-600 text-sm">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <!-- Brand / Intro -->
        <div class="space-y-3 md:col-span-1">
          <div class="flex items-center gap-2">
            <div class="w-7 h-7 rounded-md bg-sky-600 flex items-center justify-center text-white text-xs font-bold">
              PIN
            </div>
            <span class="font-bold text-zinc-900">Pin Directory</span>
          </div>
          <p class="text-xs text-zinc-500 leading-relaxed">
            Fast, clean, and modern Indian postal code directory. Search 19,500+ PIN codes and 165,000+ post offices
            across India.
          </p>
          <div class="pt-2 space-y-1.5">
            <NuxtLink to="/find-my-pincode"
              class="inline-flex items-center gap-1.5 text-xs text-sky-600 font-semibold hover:underline">
              <span>📍 Use GPS Location Tool</span>
            </NuxtLink>
          </div>
          <!-- External Data Source Attribution -->
          <div class="pt-1 space-y-1">
            <p class="text-[10px] text-zinc-400 font-medium uppercase tracking-wider">Data Sources</p>
            <a href="https://www.indiapost.gov.in" target="_blank" rel="noopener noreferrer"
              class="block text-[11px] text-zinc-500 hover:text-sky-600 transition">
              India Post (Department of Posts)
            </a>
            <a href="https://data.gov.in/resource/all-india-pincode-directory-till-last-month" target="_blank"
              rel="noopener noreferrer" class="block text-[11px] text-zinc-500 hover:text-sky-600 transition">
              data.gov.in — Open Data Portal
            </a>
            <a href="https://en.wikipedia.org/wiki/Postal_Index_Number" target="_blank" rel="noopener noreferrer"
              class="block text-[11px] text-zinc-500 hover:text-sky-600 transition">
              Wikipedia — Postal Index Number
            </a>
          </div>
        </div>

        <!-- Major Cities -->
        <div>
          <h3 class="font-semibold text-zinc-900 text-xs uppercase tracking-wider mb-3">Popular Cities</h3>
          <ul class="space-y-2 text-xs">
            <li>
              <NuxtLink to="/city/delhi/pincodes" class="hover:text-sky-600 transition">Delhi PIN Codes</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/city/bangalore/pincodes" class="hover:text-sky-600 transition">Bangalore PIN Codes
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/city/mumbai/pincodes" class="hover:text-sky-600 transition">Mumbai PIN Codes</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/city/hyderabad/pincodes" class="hover:text-sky-600 transition">Hyderabad PIN Codes
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/city/pune/pincodes" class="hover:text-sky-600 transition">Pune PIN Codes</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/city/chennai/pincodes" class="hover:text-sky-600 transition">Chennai PIN Codes</NuxtLink>
            </li>
          </ul>
        </div>

        <!-- States & Regions -->
        <div>
          <h3 class="font-semibold text-zinc-900 text-xs uppercase tracking-wider mb-3">Browse States</h3>
          <ul class="space-y-2 text-xs">
            <li>
              <NuxtLink to="/state/maharashtra/pincodes" class="hover:text-sky-600 transition">Maharashtra</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/state/uttar-pradesh/pincodes" class="hover:text-sky-600 transition">Uttar Pradesh
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/state/karnataka/pincodes" class="hover:text-sky-600 transition">Karnataka</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/state/tamil-nadu/pincodes" class="hover:text-sky-600 transition">Tamil Nadu</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/state/west-bengal/pincodes" class="hover:text-sky-600 transition">West Bengal</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/states" class="text-sky-600 font-medium hover:underline">All 37 States & UTs →</NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Postal Resources & Guides -->
        <div>
          <h3 class="font-semibold text-zinc-900 text-xs uppercase tracking-wider mb-3">Postal Guides</h3>
          <ul class="space-y-2 text-xs">
            <li>
              <NuxtLink to="/guides/what-is-a-pincode" class="hover:text-sky-600 transition">What is a PIN Code?
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/guides/how-india-pincodes-work" class="hover:text-sky-600 transition">How PIN Codes Work
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/guides/pincode-format-zones" class="hover:text-sky-600 transition">Postal Zones Explained
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/guides/find-pincode-by-address" class="hover:text-sky-600 transition">Find Pincode by
                Address</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/guides/post-office-near-me" class="hover:text-sky-600 transition">Nearest Post Office Guide
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/find-my-pincode" class="hover:text-sky-600 transition">📍 Find My PIN Code (GPS)</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/sitemap.xml" class="hover:text-sky-600 transition" external target="_blank">XML Sitemap
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom Disclaimer & Attribution -->
      <div
        class="pt-8 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-600">
        <p>© {{ new Date().getFullYear() }} PinDirectory.in — All rights reserved.</p>
        <div class="flex items-center gap-4 text-zinc-600">
          <NuxtLink to="/about" class="hover:underline">About</NuxtLink>
          <NuxtLink to="/privacy" class="hover:underline">Privacy</NuxtLink>
          <NuxtLink to="/terms" class="hover:underline">Terms</NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>