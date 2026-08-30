import { getDistrictDetails } from '../../utils/db'

export default defineEventHandler(async (event) => {
  const districtSlug = getRouterParam(event, 'district')
  if (!districtSlug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'District slug is required.',
    })
  }

  const details = await getDistrictDetails(districtSlug)
  if (!details) {
    throw createError({
      statusCode: 404,
      statusMessage: `District ${districtSlug} not found.`,
    })
  }

  return details
})
