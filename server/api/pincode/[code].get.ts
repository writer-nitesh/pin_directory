import { getPincodeDetails } from '../../utils/db'

export default defineEventHandler((event) => {
  const code = getRouterParam(event, 'code')
  if (!code || !/^\d{6}$/.test(code)) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Invalid or missing PIN Code. PIN code must be 6 digits.',
    })
  }

  const details = getPincodeDetails(code)
  if (!details) {
    throw createError({
      statusCode: 404,
      statusMessage: `PIN Code ${code} not found in directory.`,
    })
  }

  return details
})
