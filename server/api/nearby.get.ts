import { getClosestPincode } from '../utils/db'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const lat = parseFloat(String(query.lat || ''))
  const lng = parseFloat(String(query.lng || ''))

  if (isNaN(lat) || isNaN(lng)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Valid lat and lng numeric parameters are required.',
    })
  }

  const nearest = getClosestPincode(lat, lng)
  if (!nearest) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Could not find a matching PIN code near the specified coordinates.',
    })
  }

  return { nearest }
})
