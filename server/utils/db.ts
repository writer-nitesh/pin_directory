import { db } from '@nuxthub/db'
import { eq, like, and, or, sql, asc, between, ne } from 'drizzle-orm'
import * as tables from '../db/schema'

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
  const summaryList = await db.select().from(tables.pincodesSummary).where(eq(tables.pincodesSummary.pincode, code)).limit(1)
  const summary = summaryList[0]
  if (!summary) return null

  const offices = await db.select().from(tables.postOffices)
    .where(eq(tables.postOffices.pincode, code))
    .orderBy(sql`CASE WHEN ${tables.postOffices.delivery} = 'Delivery' THEN 0 ELSE 1 END`, asc(tables.postOffices.officename))

  const nearbyRes = await db.selectDistinct({ pincode: tables.postOffices.pincode }).from(tables.postOffices)
    .where(and(
      eq(tables.postOffices.district_slug, summary.district_slug),
      ne(tables.postOffices.pincode, code)
    ))
    .limit(12)

  return { summary, offices, nearby: nearbyRes.map((n) => n.pincode) }
}

export async function searchPincodes(query: string, limit = 10) {
  const cleanQ = query.trim()
  if (!cleanQ) return []

  if (/^\d+$/.test(cleanQ)) {
    const pincodes = await db.select({
      pincode: tables.pincodesSummary.pincode,
      district: tables.pincodesSummary.district,
      statename: tables.pincodesSummary.statename,
      office_count: tables.pincodesSummary.office_count,
      primary_offices: tables.pincodesSummary.primary_offices
    }).from(tables.pincodesSummary)
      .where(like(tables.pincodesSummary.pincode, `${cleanQ}%`))
      .orderBy(asc(tables.pincodesSummary.pincode))
      .limit(limit)

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

  const statesRes = await db.select({
    state_slug: tables.states.state_slug,
    statename: tables.states.statename,
    district_count: tables.states.district_count,
    pincode_count: tables.states.pincode_count
  }).from(tables.states)
    .where(like(tables.states.statename, wildcard))
    .orderBy(sql`CASE WHEN ${tables.states.statename} LIKE ${prefix} THEN 1 ELSE 2 END`, asc(tables.states.statename))
    .limit(3)

  const stateResults = statesRes.map((s) => ({
    type: 'state', title: s.statename,
    subtitle: `State • ${s.district_count} Districts, ${s.pincode_count} PIN Codes`,
    path: `/state/${s.state_slug}/pincodes`, statename: s.statename, slug: s.state_slug,
  }))

  const districtsRes = await db.select({
    district_slug: tables.districts.district_slug,
    district: tables.districts.district,
    statename: tables.districts.statename,
    state_slug: tables.districts.state_slug,
    pincode_count: tables.districts.pincode_count
  }).from(tables.districts)
    .where(like(tables.districts.district, wildcard))
    .orderBy(sql`CASE WHEN ${tables.districts.district} LIKE ${prefix} THEN 1 ELSE 2 END`, asc(tables.districts.district))
    .limit(4)

  const districtResults = districtsRes.map((d) => ({
    type: 'district', title: d.district,
    subtitle: `District in ${d.statename} • ${d.pincode_count} PIN Codes`,
    path: `/district/${d.district_slug}/pincodes`, district: d.district, statename: d.statename, slug: d.district_slug,
  }))

  const remainingLimit = Math.max(limit - stateResults.length - districtResults.length, 5)
  const officesRes = await db.selectDistinct({
    pincode: tables.postOffices.pincode,
    officename: tables.postOffices.officename,
    office_slug: tables.postOffices.office_slug,
    district: tables.postOffices.district,
    statename: tables.postOffices.statename,
    officetype: tables.postOffices.officetype,
    delivery: tables.postOffices.delivery
  }).from(tables.postOffices)
    .where(or(
      like(tables.postOffices.officename, wildcard),
      like(tables.postOffices.district, wildcard)
    ))
    .orderBy(sql`CASE WHEN ${tables.postOffices.officename} LIKE ${prefix} THEN 1 ELSE 2 END`, asc(tables.postOffices.officename))
    .limit(remainingLimit)

  const officeResults = officesRes.map((o) => ({
    type: 'office', title: o.officename,
    subtitle: `${o.pincode} • ${o.district}, ${o.statename}`,
    path: `/pincode/${o.pincode}`,
    officename: o.officename, office_slug: o.office_slug, pincode: o.pincode,
    district: o.district, statename: o.statename, delivery: o.delivery, officetype: o.officetype,
  }))

  return [...stateResults, ...districtResults, ...officeResults]
}

export async function getAllStates() {
  return db.select().from(tables.states).orderBy(asc(tables.states.statename))
}

export async function getStateDetails(stateSlug: string) {
  const stateList = await db.select().from(tables.states).where(eq(tables.states.state_slug, stateSlug)).limit(1)
  const state = stateList[0]
  if (!state) return null

  const districts = await db.select().from(tables.districts).where(eq(tables.districts.state_slug, stateSlug)).orderBy(asc(tables.districts.district))
  const topPincodes = await db.select({ pincode: tables.pincodesSummary.pincode, district: tables.pincodesSummary.district })
    .from(tables.pincodesSummary)
    .where(eq(tables.pincodesSummary.state_slug, stateSlug))
    .limit(24)

  return { state, districts, topPincodes }
}

export async function getDistrictDetails(districtSlug: string) {
  const districtList = await db.select().from(tables.districts).where(eq(tables.districts.district_slug, districtSlug)).limit(1)
  const district = districtList[0]
  if (!district) return null

  const pincodes = await db.select().from(tables.pincodesSummary).where(eq(tables.pincodesSummary.district_slug, districtSlug)).orderBy(asc(tables.pincodesSummary.pincode))
  const offices = await db.select().from(tables.postOffices).where(eq(tables.postOffices.district_slug, districtSlug)).orderBy(asc(tables.postOffices.officename))

  return { district, pincodes, offices }
}

export async function getPostOfficeDetails(officeSlug: string) {
  const officeList = await db.select().from(tables.postOffices).where(eq(tables.postOffices.office_slug, officeSlug)).limit(1)
  const office = officeList[0]
  if (!office) return null

  const siblingOffices = await db.select().from(tables.postOffices)
    .where(and(
      eq(tables.postOffices.pincode, office.pincode),
      ne(tables.postOffices.office_slug, officeSlug)
    ))
    .limit(10)
  return { office, siblingOffices }
}

export async function getClosestPincode(lat: number, lng: number) {
  type Candidate = { pincode: string; district: string; statename: string; latitude: number | null; longitude: number | null }

  let candidates = await db.select({
    pincode: tables.pincodesSummary.pincode,
    district: tables.pincodesSummary.district,
    statename: tables.pincodesSummary.statename,
    latitude: tables.pincodesSummary.latitude,
    longitude: tables.pincodesSummary.longitude
  }).from(tables.pincodesSummary)
    .where(and(
      sql`${tables.pincodesSummary.latitude} IS NOT NULL`,
      sql`${tables.pincodesSummary.longitude} IS NOT NULL`,
      between(tables.pincodesSummary.latitude, lat - 0.5, lat + 0.5),
      between(tables.pincodesSummary.longitude, lng - 0.5, lng + 0.5)
    ))
    .limit(50)

  if (candidates.length === 0) {
    candidates = await db.select({
      pincode: tables.pincodesSummary.pincode,
      district: tables.pincodesSummary.district,
      statename: tables.pincodesSummary.statename,
      latitude: tables.pincodesSummary.latitude,
      longitude: tables.pincodesSummary.longitude
    }).from(tables.pincodesSummary)
      .where(and(
        sql`${tables.pincodesSummary.latitude} IS NOT NULL`,
        sql`${tables.pincodesSummary.longitude} IS NOT NULL`,
        between(tables.pincodesSummary.latitude, lat - 2.0, lat + 2.0),
        between(tables.pincodesSummary.longitude, lng - 2.0, lng + 2.0)
      ))
      .limit(50)
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
