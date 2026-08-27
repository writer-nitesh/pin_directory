import { getPostOfficeDetails } from '../../utils/db'

export default defineEventHandler((event) => {
  const slug = getRouterParam(event, 'slug')
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Post office slug is required.' })
  }

  const details = getPostOfficeDetails(slug)
  if (!details) {
    throw createError({
      statusCode: 404,
      statusMessage: `Post office ${slug} was not found.`,
    })
  }

  return details
})
