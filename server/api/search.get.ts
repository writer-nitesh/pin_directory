import { searchPincodes } from '../utils/db'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const q = String(query.q || '').trim()

  if (!q || q.length < 2) {
    return { results: [] }
  }

  const results = searchPincodes(q, 10)
  return { results }
})
