import { getStateDetails } from '../../utils/db'

export default defineEventHandler((event) => {
  const stateSlug = getRouterParam(event, 'state')
  if (!stateSlug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'State slug is required.',
    })
  }

  const details = getStateDetails(stateSlug)
  if (!details) {
    throw createError({
      statusCode: 404,
      statusMessage: `State ${stateSlug} not found.`,
    })
  }

  return details
})
