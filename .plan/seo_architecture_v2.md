# Pin Directory — SEO Architecture v2
Last updated: 2026-08-30

---

## PROBLEMS (Current)

1. Sitemap only has /district/{slug}/pincodes - cities are COMPLETELY MISSING
2. /pincode/{code} prefix is dead weight - /400001/ is cleaner and Google-preferred
3. State pages split: /state/{slug}/ + /state/{slug}/pincodes - confused intent
4. No /cities/ layer exists - biggest miss (110K/month for 'pincode pune')
5. No /areas/ layer - long-tail goldmine untapped
6. Single sitemap.xml - should be sitemap index with split files
7. Homepage is just a search box - should be an SEO hub

---

## TARGET URL ARCHITECTURE

pindirectory.in/
  states/
    maharashtra/
    delhi/
    karnataka/
  cities/                   <- NEW, HIGHEST PRIORITY
    mumbai/
    pune/
    bangalore/
  districts/
    pune/
    mumbai-suburban/
  areas/                    <- NEW
    andheri-east/
    bandra-west/
    kothrud/
  post-offices/
    pune-head-office/
    andheri-east/
  110001/                   <- PIN pages, NO /pincode/ prefix
  400001/
  411001/

---

## PAGE TEMPLATES

### Template A - State: /states/{state-slug}/
Currently: /state/{slug}/ + /state/{slug}/pincodes (split)
Change: Merge into single /states/{slug}/ canonical

Content:
- H1: {State} PIN Codes - All Post Offices & Postal Codes
- District list (linked to /districts/)
- City list (linked to /cities/)
- Total PINs + total post offices count
- FAQ block: "What is the PIN code of {state}?"
Keywords: maharashtra pincode, pincode in maharashtra, maharashtra postal code

---

### Template B - City: /cities/{city-slug}/  [NEW - HIGHEST PRIORITY]
Currently: DOES NOT EXIST
Add: app/pages/cities/[city].vue

Content:
- H1: {City} PIN Code - {City} City PIN Codes & Post Offices
- PIN table: PIN | Area/Locality | Post Office Name
- District + State links
- Total PINs, total post offices
- Areas/localities list (linked to /areas/)
- FAQ block
- Breadcrumb: India -> {State} -> {City}

Keywords (HIGH VOLUME, LOW KD):
  pincode bangalore    135K/month
  pincode delhi        135K/month
  pincode hyderabad    110K/month
  pincode pune         110K/month
  pincode mumbai       90.5K/month
  pincode indore       90.5K/month
  pincode jaipur       74K/month
  pincode lucknow      74K/month
  pincode noida        60.5K/month

---

### Template C - District: /districts/{district-slug}/
Currently: /district/{slug}/ + /district/{slug}/pincodes (split)
Change: Merge into /districts/{slug}/ canonical

Content:
- H1: {District} District PIN Code - Post Offices & Postal Codes
- Cities in district (linked to /cities/)
- Areas in district (linked to /areas/)
- PIN code table
- State link + breadcrumb
Keywords: pune district pincode, pincode in pune district

---

### Template D - Area: /areas/{area-slug}/  [NEW]
Currently: DOES NOT EXIST
Add: app/pages/areas/[area].vue

Content:
- H1: {Area} PIN Code, {City} - Post Office & Postal Details
- PIN code(s) covering this area (prominently displayed)
- Post offices serving this area
- City -> District -> State breadcrumb
- Nearby areas (linked)
- FAQ: "What is the PIN code of {area}?"

Keywords (long-tail, very low KD):
  andheri pincode
  andheri east pincode
  bandra west pincode
  kothrud pincode

---

### Template E - PIN: /{pincode}/  [URL CHANGE]
Currently: /pincode/{code}
Change: app/pages/[pincode].vue + 301 redirect from /pincode/*

Content:
- H1: {PIN} PIN Code - {City/Area}, {State}
- Large bold PIN display
- Location: City | District | State | Division | Region | Circle
- Areas covered
- Post offices table (name, type, delivery type)
- Nearby PIN codes (linked)
- Breadcrumb: India -> {State} -> {District} -> {City} -> {PIN}

---

### Template F - Post Office: /post-offices/{slug}/
Currently: /post-office/{slug} (singular, wrong)
Change: /post-offices/{slug}/ (plural) + 301 redirect

Content:
- H1: {Post Office} Post Office - PIN Code & Postal Details
- PIN code (prominent)
- Address, Office Type, Delivery Type, Division, Region, Circle
- City -> District -> State links
- Other post offices in same PIN

---

## SITEMAP ARCHITECTURE

Current: Single sitemap.xml with everything
Target: Sitemap Index + 6 split files

/sitemap.xml  <- INDEX only, lists sub-sitemaps
  /sitemap-states.xml        (~37 URLs)
  /sitemap-cities.xml        (~500-2000 URLs)
  /sitemap-districts.xml     (~700+ URLs)
  /sitemap-areas.xml         (~50K+ URLs)
  /sitemap-post-offices.xml  (~165K URLs)
  /sitemap-pins.xml          (~19.5K URLs)

Sitemap Rules:
  YES: canonical, 200-status, indexable URLs
  NO: /search, filter URLs, /pincodes subpages, redirects, 404s
  NO: /pincode/{code} after migration (use /{code})
  NO: /state/{slug}/pincodes (not canonical entity)

---

## INTERNAL LINKING GRAPH

HOME
  -> all states (grid)
  -> popular cities (Mumbai, Delhi, Bangalore, Pune, Hyderabad...)
  -> all states alphabetically

/states/maharashtra/
  -> all cities in Maharashtra
  -> all districts in Maharashtra

/cities/pune/
  -> parent district /districts/pune/
  -> parent state /states/maharashtra/
  -> all areas in Pune
  -> all post offices in Pune
  -> all PINs in Pune

/areas/kothrud/
  -> its PIN /411038/
  -> post offices in kothrud
  -> parent city /cities/pune/

/411038/
  -> /states/maharashtra/
  -> /districts/pune/
  -> /cities/pune/
  -> related areas
  -> post offices using 411038
  -> nearby PINs: 411037, 411039, 411041...

---

## SEO TITLE TEMPLATES

City:        {City} PIN Code - {City} City PIN Codes & Post Offices | Pin Directory
State:       {State} PIN Code - All PIN Codes & Post Offices | Pin Directory
District:    {District} District PIN Code - PIN Codes & Post Offices | Pin Directory
Area:        {Area} PIN Code, {City} - Post Office & Postal Details | Pin Directory
PIN:         {PIN} PIN Code - {City}, {State} | Pin Directory
Post Office: {Post Office} Post Office - PIN Code & Postal Details | Pin Directory

---

## FILES TO CREATE / MODIFY

### New Files:
  app/pages/cities/[city].vue           <- Template B (City) - FIRST
  app/pages/areas/[area].vue            <- Template D (Area)
  app/pages/[pincode].vue               <- Template E (PIN, replaces /pincode/[code])
  server/api/sitemap-index.get.ts       <- returns sitemap index XML
  server/api/sitemap-cities.get.ts      <- city URLs
  server/api/sitemap-areas.get.ts       <- area URLs
  server/api/sitemap-pins.get.ts        <- pin URLs (clean /{code})
  server/api/city/[city].get.ts         <- city data API
  server/api/areas/[area].get.ts        <- area data API

### Modified Files:
  app/pages/state/[state]/index.vue     -> merge pincodes subpage, enrich
  app/pages/district/[district]/index.vue -> merge, enrich
  app/pages/post-office/[slug].vue      -> fix URL to plural, enrich
  app/pages/index.vue                   -> add popular cities hub, state grid
  server/api/sitemap-urls.get.ts        -> add cities, fix URLs
  nuxt.config.ts                        -> sitemap sources, add redirects

### Redirects to add in nuxt.config.ts routeRules:
  '/pincode/:code':   { redirect: { to: '/:code', statusCode: 301 } }
  '/state/:slug':     { redirect: { to: '/states/:slug', statusCode: 301 } }
  '/district/:slug':  { redirect: { to: '/districts/:slug', statusCode: 301 } }
  '/post-office/:slug': { redirect: { to: '/post-offices/:slug', statusCode: 301 } }

---

## WHAT NOT TO INDEX

/search              -> noindex (utility)
/search?*            -> noindex
/state/*/pincodes    -> 301 redirect to /states/*/
/district/*/pincodes -> 301 redirect to /districts/*/
/pincode/*           -> 301 redirect to /{code}/

---

## PRIORITY ORDER

1. /cities/[city].vue          - highest volume, zero coverage currently
2. Sitemap split               - add cities/areas to sitemap
3. Fix PIN URLs                - /pincode/{code} -> /{code} with 301
4. /areas/[area].vue           - long-tail goldmine
5. Enrich State/District pages - merge subpages, add city grids
6. Homepage SEO hub            - popular cities, state grid
7. Post Office plural fix      - /post-offices/

---

## IMMEDIATE QUICK WIN (do today)

In server/api/sitemap-urls.get.ts add:

  // Cities - currently MISSING from sitemap
  const cities = db.prepare('SELECT city_slug FROM cities').all()
  for (const c of cities) {
    urls.push({ loc: '/cities/' + c.city_slug, changefreq: 'weekly', priority: 0.9 })
  }

This alone gets city pages into Google discovery queue immediately.

---

## EXPECTED SEO IMPACT

Layer            | Est. URLs | Avg Volume/page | Impact
City pages       | ~500-2000 | 50K-135K/month  | MASSIVE
State pages      | 37        | 10K-50K/month   | High
District pages   | 700+      | 1K-10K/month    | High
Area pages       | 50K+      | 200-2K/month    | HUGE (long-tail)
PIN pages        | 19.5K     | 100-5K/month    | High
Post Office      | 165K      | 50-500/month    | Medium
