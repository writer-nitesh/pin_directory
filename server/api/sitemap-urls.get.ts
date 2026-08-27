import { getDb } from '../utils/db'

export default defineEventHandler(() => {
  const db = getDb()

  const urls: { loc: string; changefreq?: string; priority?: number }[] = [
    { loc: '/', changefreq: 'daily', priority: 1.0 },
    { loc: '/find-my-pincode', changefreq: 'weekly', priority: 0.9 },
  ]

  // All States
  const states = db.prepare('SELECT state_slug FROM states').all() as { state_slug: string }[]
  for (const s of states) {
    urls.push({
      loc: `/state/${s.state_slug}/pincodes`,
      changefreq: 'weekly',
      priority: 0.8,
    })
  }

  // All Districts
  const districts = db.prepare('SELECT district_slug FROM districts').all() as { district_slug: string }[]
  for (const d of districts) {
    urls.push({
      loc: `/district/${d.district_slug}/pincodes`,
      changefreq: 'weekly',
      priority: 0.7,
    })
  }

  // All Pincodes (limit for sitemap index or all 19.5k)
  const pincodes = db.prepare('SELECT pincode FROM pincodes_summary').all() as { pincode: string }[]
  for (const p of pincodes) {
    urls.push({
      loc: `/pincode/${p.pincode}`,
      changefreq: 'monthly',
      priority: 0.9,
    })
  }

  return urls
})
