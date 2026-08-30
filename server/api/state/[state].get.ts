import { getStateDetails } from '../../utils/db'

export default defineEventHandler(async (event) => {
  const stateSlug = getRouterParam(event, 'state')
  if (!stateSlug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'State slug is required.',
    })
  }

  const details = await getStateDetails(stateSlug)
  if (!details) {
    throw createError({
      statusCode: 404,
      statusMessage: `State ${stateSlug} not found.`,
    })
  }

  return details
})
