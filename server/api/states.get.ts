import { getAllStates } from '../utils/db'

export default defineEventHandler(() => {
  return {
    states: getAllStates(),
  }
})
