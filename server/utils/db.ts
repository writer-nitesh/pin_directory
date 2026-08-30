import { db } from '@nuxthub/db'
import { sql } from 'drizzle-orm'

export interface PostOffice {
  id: number
  pincode: string
  officename: string
  office_slug: string
  officetype: string
  delivery: string
  district: string
  district_slug: string
  statename: string
  state_slug: string
  circle: string
  region: string
  division: string
  latitude: number | null
  longitude: number | null
}

export interface PincodeSummary {
  pincode: string
  district: string
  district_slug: string
  statename: string
  state_slug: string
  circle: string
  region: string
  division: string
  office_count: number
  primary_offices: string
  latitude: number | null
  longitude: number | null
}

export interface StateInfo {
  state_slug: string
  statename: string
  district_count: number
  pincode_count: number
  office_count: number
}

export interface DistrictInfo {
  district_slug: string
  district: string
  statename: string
  state_slug: string
  pincode_count: number
  office_count: number
}

export async function getPincodeDetails(code: string) {
  const summary = await db.get<PincodeSummary>(sql`SELECT * FROM pincodes_summary WHERE pincode = ${code}`)
  if (!summary) return null

  const offices = await db.all<PostOffice>(sql`
    SELECT * FROM post_offices WHERE pincode = ${code}
    ORDER BY CASE WHEN delivery = 'Delivery' THEN 0 ELSE 1 END, officename ASC
  `)
  const nearby = await db.all<{ pincode: string }>(sql`
    SELECT DISTINCT pincode FROM post_offices
    WHERE district_slug = ${summary.district_slug} AND pincode != ${code}
    LIMIT 12
  `)

  return { summary, offices, nearby: nearby.map((n) => n.pincode) }
}

export async function searchPincodes(query: string, limit = 10) {
  const cleanQ = query.trim()
  if (!cleanQ) return []

  if (/^\d+$/.test(cleanQ)) {
    const pincodes = await db.all<any>(sql`
      SELECT pincode, district, statename, office_count, primary_offices
      FROM pincodes_summary WHERE pincode LIKE ${cleanQ + '%'}
      ORDER BY pincode ASC LIMIT ${limit}
    `)
    return pincodes.map((p) => ({
      type: 'pincode',
      title: p.pincode,
      subtitle: `${p.district}, ${p.statename} • ${p.office_count} Office${p.office_count > 1 ? 's' : ''}`,
      path: `/pincode/${p.pincode}`,
      pincode: p.pincode, district: p.district, statename: p.statename,
    }))
  }

  const wildcard = `%${cleanQ}%`
  const prefix = `${cleanQ}%`

  const states = await db.all<any>(sql`
    SELECT state_slug, statename, district_count, pincode_count FROM states
    WHERE statename LIKE ${wildcard}
    ORDER BY CASE WHEN statename LIKE ${prefix} THEN 1 ELSE 2 END, statename ASC LIMIT 3
  `)
  const stateResults = states.map((s) => ({
    type: 'state', title: s.statename,
    subtitle: `State • ${s.district_count} Districts, ${s.pincode_count} PIN Codes`,
    path: `/state/${s.state_slug}/pincodes`, statename: s.statename, slug: s.state_slug,
  }))

  const districts = await db.all<any>(sql`
    SELECT district_slug, district, statename, state_slug, pincode_count FROM districts
    WHERE district LIKE ${wildcard}
    ORDER BY CASE WHEN district LIKE ${prefix} THEN 1 ELSE 2 END, district ASC LIMIT 4
  `)
  const districtResults = districts.map((d) => ({
    type: 'district', title: d.district,
    subtitle: `District in ${d.statename} • ${d.pincode_count} PIN Codes`,
    path: `/district/${d.district_slug}/pincodes`, district: d.district, statename: d.statename, slug: d.district_slug,
  }))

  const remainingLimit = Math.max(limit - stateResults.length - districtResults.length, 5)
  const offices = await db.all<any>(sql`
    SELECT DISTINCT pincode, officename, office_slug, district, statename, officetype, delivery
    FROM post_offices WHERE officename LIKE ${wildcard} OR district LIKE ${wildcard}
    ORDER BY CASE WHEN officename LIKE ${prefix} THEN 1 ELSE 2 END, officename ASC LIMIT ${remainingLimit}
  `)
  const officeResults = offices.map((o) => ({
    type: 'office', title: o.officename,
    subtitle: `${o.pincode} • ${o.district}, ${o.statename}`,
    path: `/pincode/${o.pincode}`,
    officename: o.officename, office_slug: o.office_slug, pincode: o.pincode,
    district: o.district, statename: o.statename, delivery: o.delivery, officetype: o.officetype,
  }))

  return [...stateResults, ...districtResults, ...officeResults]
}

export async function getAllStates() {
  return db.all<StateInfo>(sql`SELECT * FROM states ORDER BY statename ASC`)
}

export async function getStateDetails(stateSlug: string) {
  const state = await db.get<StateInfo>(sql`SELECT * FROM states WHERE state_slug = ${stateSlug}`)
  if (!state) return null

  const districts = await db.all<DistrictInfo>(sql`SELECT * FROM districts WHERE state_slug = ${stateSlug} ORDER BY district ASC`)
  const topPincodes = await db.all<{ pincode: string; district: string }>(sql`SELECT pincode, district FROM pincodes_summary WHERE state_slug = ${stateSlug} LIMIT 24`)

  return { state, districts, topPincodes }
}

export async function getDistrictDetails(districtSlug: string) {
  const district = await db.get<DistrictInfo>(sql`SELECT * FROM districts WHERE district_slug = ${districtSlug}`)
  if (!district) return null

  const pincodes = await db.all<PincodeSummary>(sql`SELECT * FROM pincodes_summary WHERE district_slug = ${districtSlug} ORDER BY pincode ASC`)
  const offices = await db.all<PostOffice>(sql`SELECT * FROM post_offices WHERE district_slug = ${districtSlug} ORDER BY officename ASC`)

  return { district, pincodes, offices }
}

export async function getPostOfficeDetails(officeSlug: string) {
  const office = await db.get<PostOffice>(sql`SELECT * FROM post_offices WHERE office_slug = ${officeSlug} LIMIT 1`)
  if (!office) return null

  const siblingOffices = await db.all<PostOffice>(sql`
    SELECT * FROM post_offices WHERE pincode = ${office.pincode} AND office_slug != ${officeSlug} LIMIT 10
  `)
  return { office, siblingOffices }
}

export async function getClosestPincode(lat: number, lng: number) {
  type Candidate = { pincode: string; district: string; statename: string; latitude: number; longitude: number }

  let candidates = await db.all<Candidate>(sql`
    SELECT pincode, district, statename, latitude, longitude
    FROM pincodes_summary
    WHERE latitude IS NOT NULL AND longitude IS NOT NULL
      AND latitude BETWEEN ${lat - 0.5} AND ${lat + 0.5}
      AND longitude BETWEEN ${lng - 0.5} AND ${lng + 0.5}
    LIMIT 50
  `)

  if (candidates.length === 0) {
    candidates = await db.all<Candidate>(sql`
      SELECT pincode, district, statename, latitude, longitude
      FROM pincodes_summary
      WHERE latitude IS NOT NULL AND longitude IS NOT NULL
        AND latitude BETWEEN ${lat - 2.0} AND ${lat + 2.0}
        AND longitude BETWEEN ${lng - 2.0} AND ${lng + 2.0}
      LIMIT 50
    `)
    if (candidates.length === 0) return null
  }

  return calculateNearest(candidates, lat, lng)
}

function calculateNearest(list: any[], userLat: number, userLng: number) {
  let closest = null
  let minDistance = Infinity
  for (const item of list) {
    const d = getDistanceKm(userLat, userLng, Number(item.latitude), Number(item.longitude))
    if (d < minDistance) {
      minDistance = d
      closest = { ...item, distanceKm: Math.round(d * 10) / 10 }
    }
  }
  return closest
}

function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371
  const dLat = deg2rad(lat2 - lat1)
  const dLon = deg2rad(lon2 - lon1)
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180)
}
