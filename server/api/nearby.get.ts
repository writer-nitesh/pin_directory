import { getClosestPincode } from '../utils/db'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const lat = parseFloat(String(query.lat || ''))
  const lng = parseFloat(String(query.lng || ''))

  if (isNaN(lat) || isNaN(lng)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Valid lat and lng numeric parameters are required.',
    })
  }

  // Validate coordinates are within India's approximate bounding box
  if (lat < 6.0 || lat > 37.5 || lng < 68.0 || lng > 97.5) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Coordinates appear to be outside India. Please ensure location access is working correctly.',
    })
  }

  try {
    const nearest = getClosestPincode(lat, lng)
    if (!nearest) {
      throw createError({
        statusCode: 404,
        statusMessage: 'No PIN code found near your location. Try the manual search above.',
      })
    }
    return { nearest }
  } catch (err: any) {
    // Re-throw H3 errors as-is
    if (err.statusCode) throw err
    // Wrap unexpected errors with a friendly message
    throw createError({
      statusCode: 500,
      statusMessage: 'Could not look up PIN code for your location. Please try the manual search.',
    })
  }
})

