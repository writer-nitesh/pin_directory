import { getDb } from '../../utils/db'

// City aliases and normalization map
const CITY_MAP: Record<string, string[]> = {
  bangalore: ['bengaluru-urban', 'bangalore-urban', 'bengaluru-rural', 'bangalore'],
  bengaluru: ['bengaluru-urban', 'bangalore-urban', 'bengaluru-rural', 'bangalore'],
  delhi: ['new-delhi', 'central-delhi', 'south-delhi', 'north-delhi', 'east-delhi', 'west-delhi'],
  mumbai: ['mumbai', 'mumbai-suburban'],
  hyderabad: ['hyderabad', 'rangareddy', 'medchal-malkajgiri'],
  pune: ['pune'],
  chennai: ['chennai'],
  kolkata: ['kolkata'],
  ahmedabad: ['ahmedabad'],
  jaipur: ['jaipur'],
  lucknow: ['lucknow'],
  indore: ['indore'],
  bhopal: ['bhopal'],
  surat: ['surat'],
  patna: ['patna'],
  nagpur: ['nagpur'],
  chandigarh: ['chandigarh'],
  noida: ['gautam-buddha-nagar'],
  gurgaon: ['gurugram'],
  gurugram: ['gurugram'],
}

export default defineEventHandler((event) => {
  const citySlug = getRouterParam(event, 'city')?.toLowerCase().trim()
  if (!citySlug) {
    throw createError({ statusCode: 400, statusMessage: 'City slug is required.' })
  }

  const db = getDb()
  const candidateSlugs = CITY_MAP[citySlug] || [citySlug]

  // Find districts matching
  const placeholders = candidateSlugs.map(() => '?').join(',')
  const districts = db.prepare<string[], any>(
    `SELECT * FROM districts WHERE district_slug IN (${placeholders}) OR district_slug LIKE ?`
  ).all(...candidateSlugs, `%${citySlug}%`)

  let matchedDistrictSlugs = districts.map(d => d.district_slug)
  let statename = districts[0]?.statename || 'India'

  // If no district matched directly, try matching by district name or office name
  if (matchedDistrictSlugs.length === 0) {
    const fromOffices = db.prepare<[string], any>(
      'SELECT DISTINCT district_slug, district, statename FROM post_offices WHERE officename LIKE ? OR district LIKE ? LIMIT 5'
    ).all(`%${citySlug}%`, `%${citySlug}%`)

    if (fromOffices.length > 0) {
      matchedDistrictSlugs = fromOffices.map(o => o.district_slug)
      statename = fromOffices[0].statename
    }
  }

  if (matchedDistrictSlugs.length === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: `City ${citySlug} was not found in postal records.`,
    })
  }

  // Fetch all pincodes across the matched districts
  const pinPlaceholders = matchedDistrictSlugs.map(() => '?').join(',')
  const pincodes = db.prepare<string[], any>(
    `SELECT * FROM pincodes_summary WHERE district_slug IN (${pinPlaceholders}) ORDER BY pincode ASC`
  ).all(...matchedDistrictSlugs)

  // Fetch post offices sample
  const offices = db.prepare<string[], any>(
    `SELECT * FROM post_offices WHERE district_slug IN (${pinPlaceholders}) ORDER BY delivery DESC, officename ASC LIMIT 60`
  ).all(...matchedDistrictSlugs)

  const cityName = citySlug.charAt(0).toUpperCase() + citySlug.slice(1)

  return {
    cityName,
    citySlug,
    statename,
    matchedDistricts: districts,
    pincodes,
    offices,
  }
})
