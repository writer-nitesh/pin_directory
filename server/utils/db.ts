import Database from 'better-sqlite3'
import { resolve } from 'pathe'

let dbInstance: Database.Database | null = null

export function getDb(): Database.Database {
  if (!dbInstance) {
    const dbPath = resolve(process.cwd(), 'server/data/pincodes.db')
    dbInstance = new Database(dbPath, {
      readonly: true,
      fileMustExist: true,
    })
    dbInstance.pragma('journal_mode = WAL')
  }
  return dbInstance
}

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

export function getPincodeDetails(code: string) {
  const db = getDb()
  const summary = db.prepare<[string], PincodeSummary>(
    'SELECT * FROM pincodes_summary WHERE pincode = ?'
  ).get(code)

  if (!summary) return null

  const offices = db.prepare<[string], PostOffice>(
    'SELECT * FROM post_offices WHERE pincode = ? ORDER BY delivery DESC, officename ASC'
  ).all(code)

  // Find nearby/sibling pincodes in same district
  const nearby = db.prepare<[string, string], { pincode: string }>(
    'SELECT DISTINCT pincode FROM post_offices WHERE district_slug = ? AND pincode != ? LIMIT 12'
  ).all(summary.district_slug, code)

  return {
    summary,
    offices,
    nearby: nearby.map(n => n.pincode),
  }
}

export function searchPincodes(query: string, limit = 8) {
  const db = getDb()
  const cleanQ = query.trim()
  if (!cleanQ) return []

  // If query is numeric, search pincode prefix
  if (/^\d+$/.test(cleanQ)) {
    return db.prepare<[string, number], any>(
      `SELECT pincode, district, statename, office_count, primary_offices
       FROM pincodes_summary
       WHERE pincode LIKE ?
       ORDER BY pincode ASC
       LIMIT ?`
    ).all(`${cleanQ}%`, limit)
  }

  // Otherwise search office names, districts, or states
  const wildcard = `%${cleanQ}%`
  return db.prepare<[string, string, string, number], any>(
    `SELECT DISTINCT pincode, officename, district, statename, officetype, delivery
     FROM post_offices
     WHERE officename LIKE ? OR district LIKE ? OR statename LIKE ?
     LIMIT ?`
  ).all(wildcard, wildcard, wildcard, limit)
}

export function getAllStates() {
  const db = getDb()
  return db.prepare<[], StateInfo>(
    'SELECT * FROM states ORDER BY statename ASC'
  ).all()
}

export function getStateDetails(stateSlug: string) {
  const db = getDb()
  const state = db.prepare<[string], StateInfo>(
    'SELECT * FROM states WHERE state_slug = ?'
  ).get(stateSlug)

  if (!state) return null

  const districts = db.prepare<[string], DistrictInfo>(
    'SELECT * FROM districts WHERE state_slug = ? ORDER BY district ASC'
  ).all(stateSlug)

  const topPincodes = db.prepare<[string], { pincode: string; district: string }>(
    'SELECT pincode, district FROM pincodes_summary WHERE state_slug = ? LIMIT 24'
  ).all(stateSlug)

  return {
    state,
    districts,
    topPincodes,
  }
}

export function getDistrictDetails(districtSlug: string) {
  const db = getDb()
  const district = db.prepare<[string], DistrictInfo>(
    'SELECT * FROM districts WHERE district_slug = ?'
  ).get(districtSlug)

  if (!district) return null

  const pincodes = db.prepare<[string], PincodeSummary>(
    'SELECT * FROM pincodes_summary WHERE district_slug = ? ORDER BY pincode ASC'
  ).all(districtSlug)

  const offices = db.prepare<[string], PostOffice>(
    'SELECT * FROM post_offices WHERE district_slug = ? ORDER BY officename ASC'
  ).all(districtSlug)

  return {
    district,
    pincodes,
    offices,
  }
}

export function getPostOfficeDetails(officeSlug: string) {
  const db = getDb()
  const office = db.prepare<[string], PostOffice>(
    'SELECT * FROM post_offices WHERE office_slug = ? LIMIT 1'
  ).get(officeSlug)

  if (!office) return null

  const siblingOffices = db.prepare<[string, string], PostOffice>(
    'SELECT * FROM post_offices WHERE pincode = ? AND office_slug != ? LIMIT 10'
  ).all(office.pincode, officeSlug)

  return {
    office,
    siblingOffices,
  }
}

export function getClosestPincode(lat: number, lng: number) {
  const db = getDb()
  // Select pincodes with coordinates within +/- 0.5 degrees bounding box, then sort by haversine distance
  const candidates = db.prepare<[number, number, number, number], any>(
    `SELECT pincode, district, statename, latitude, longitude
     FROM pincodes_summary
     WHERE latitude IS NOT NULL
       AND longitude IS NOT NULL
       AND latitude BETWEEN ? AND ?
       AND longitude BETWEEN ? AND ?
     LIMIT 50`
  ).all(lat - 0.5, lat + 0.5, lng - 0.5, lng + 0.5)

  if (candidates.length === 0) {
    // Fallback: wider bounding box
    const wider = db.prepare<[number, number, number, number], any>(
      `SELECT pincode, district, statename, latitude, longitude
       FROM pincodes_summary
       WHERE latitude IS NOT NULL
         AND longitude IS NOT NULL
         AND latitude BETWEEN ? AND ?
         AND longitude BETWEEN ? AND ?
       LIMIT 50`
    ).all(lat - 2.0, lat + 2.0, lng - 2.0, lng + 2.0)
    if (wider.length === 0) return null
    return calculateNearest(wider, lat, lng)
  }

  return calculateNearest(candidates, lat, lng)
}

function calculateNearest(list: any[], userLat: number, userLng: number) {
  let closest = null
  let minDistance = Infinity

  for (const item of list) {
    const d = getDistanceFromLatLonInKm(userLat, userLng, item.latitude, item.longitude)
    if (d < minDistance) {
      minDistance = d
      closest = { ...item, distanceKm: Math.round(d * 10) / 10 }
    }
  }

  return closest
}

function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371 // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1)
  const dLon = deg2rad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180)
}
