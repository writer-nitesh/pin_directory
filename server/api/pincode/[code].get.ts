import { getPincodeDetails } from '../../utils/db'

export default defineEventHandler(async (event) => {
  const code = getRouterParam(event, 'code')
  if (!code || !/^\d{6}$/.test(code)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Valid 6-digit PIN code is required',
    })
  }

  const details = await getPincodeDetails(code)
  if (!details) {
    throw createError({
      statusCode: 404,
      statusMessage: `PIN Code ${code} not found in directory.`,
    })
  }

  return details
})
