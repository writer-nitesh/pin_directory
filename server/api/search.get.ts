import { searchPincodes } from '../utils/db'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const q = String(query.q || '').trim()

  if (!q) {
    return { results: [] }
  }

  const results = await searchPincodes(q, 10)
  return { results }
})
