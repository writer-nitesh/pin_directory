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

export interface CityApiResponse {
  cityName: string
  citySlug: string
  statename: string
  matchedDistricts: any[]
  pincodes: any[]
  offices: any[]
  totalOffices: number
  deliveryOfficesCount: number
}

export default defineEventHandler(async (event): Promise<CityApiResponse> => {
  const citySlug = getRouterParam(event, 'city')?.toLowerCase().trim()
  if (!citySlug) {
    throw createError({ statusCode: 400, statusMessage: 'City slug is required.' })
  }

  const db = hubDatabase()
  const candidateSlugs = CITY_MAP[citySlug] || [citySlug]

  // Find districts matching
  const placeholders = candidateSlugs.map(() => '?').join(',')
  const { results: districts } = await db.prepare(
    `SELECT * FROM districts WHERE district_slug IN (${placeholders}) OR district_slug LIKE ?`
  ).bind(...candidateSlugs, `%${citySlug}%`).all<any>()

  let matchedDistrictSlugs = districts.map(d => d.district_slug)
  let statename = districts[0]?.statename || 'India'

  // If no district matched directly, try matching by district name or office name
  if (matchedDistrictSlugs.length === 0) {
    const { results: fromOffices } = await db.prepare(
      'SELECT DISTINCT district_slug, district, statename FROM post_offices WHERE officename LIKE ? OR district LIKE ? LIMIT 5'
    ).bind(`%${citySlug}%`, `%${citySlug}%`).all<any>()

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
  const { results: pincodes } = await db.prepare(
    `SELECT * FROM pincodes_summary WHERE district_slug IN (${pinPlaceholders}) ORDER BY pincode ASC`
  ).bind(...matchedDistrictSlugs).all<any>()

  // Fetch post offices prioritizing delivery offices
  const { results: offices } = await db.prepare(
    `SELECT * FROM post_offices WHERE district_slug IN (${pinPlaceholders}) ORDER BY CASE WHEN delivery = 'Delivery' THEN 0 ELSE 1 END, officename ASC LIMIT 60`
  ).bind(...matchedDistrictSlugs).all<any>()

  // Compute accurate delivery stats
  const totalOfficesRow = await db.prepare(
    `SELECT count(*) as count FROM post_offices WHERE district_slug IN (${pinPlaceholders})`
  ).bind(...matchedDistrictSlugs).first<{ count: number }>()
  const totalOffices = totalOfficesRow?.count || offices.length

  const deliveryOfficesRow = await db.prepare(
    `SELECT count(*) as count FROM post_offices WHERE district_slug IN (${pinPlaceholders}) AND delivery = 'Delivery'`
  ).bind(...matchedDistrictSlugs).first<{ count: number }>()
  const deliveryOfficesCount = deliveryOfficesRow?.count || 0

  const cityName = citySlug.charAt(0).toUpperCase() + citySlug.slice(1)

  return {
    cityName,
    citySlug,
    statename,
    matchedDistricts: districts,
    pincodes,
    offices,
    totalOffices,
    deliveryOfficesCount,
  }
})
