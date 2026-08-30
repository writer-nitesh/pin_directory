import { getAllStates } from '../utils/db'

export default defineEventHandler(async () => {
  return {
    states: await getAllStates(),
  }
})
