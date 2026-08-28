import Database from 'better-sqlite3'
import { resolve } from 'path'

const dbPath = resolve(process.cwd(), 'server/data/pincodes.db')
console.log('Connecting to:', dbPath)
const db = new Database(dbPath)

const suffixRegex = /\s+(?:b\.?o\.?|s\.?o\.?|h\.?o\.?|g\.?p\.?o\.?|p\.?o\.?)$/i

function cleanName(name) {
  if (!name) return ''
  return name.replace(suffixRegex, '').trim()
}

console.log('Fetching post offices...')
const offices = db.prepare('SELECT id, officename FROM post_offices').all()

const updateOffice = db.prepare('UPDATE post_offices SET officename = ? WHERE id = ?')

const updateOfficesTx = db.transaction((rows) => {
  let updated = 0
  for (const row of rows) {
    const cleaned = cleanName(row.officename)
    if (cleaned !== row.officename) {
      updateOffice.run(cleaned, row.id)
      updated++
    }
  }
  return updated
})

console.time('Clean post_offices')
const updatedOfficesCount = updateOfficesTx(offices)
console.timeEnd('Clean post_offices')
console.log(`Updated ${updatedOfficesCount} post office names in post_offices table.`)

console.log('Fetching pincodes_summary...')
const summaries = db.prepare('SELECT pincode, primary_offices FROM pincodes_summary WHERE primary_offices IS NOT NULL').all()
const updateSummary = db.prepare('UPDATE pincodes_summary SET primary_offices = ? WHERE pincode = ?')

const updateSummariesTx = db.transaction((rows) => {
  let updated = 0
  for (const row of rows) {
    try {
      const parsed = JSON.parse(row.primary_offices)
      if (Array.isArray(parsed)) {
        const cleanedArr = parsed.map(cleanName)
        const newJson = JSON.stringify(cleanedArr)
        if (newJson !== row.primary_offices) {
          updateSummary.run(newJson, row.pincode)
          updated++
        }
      }
    } catch {
      // Ignore JSON parse errors
    }
  }
  return updated
})

console.time('Clean pincodes_summary')
const updatedSummariesCount = updateSummariesTx(summaries)
console.timeEnd('Clean pincodes_summary')
console.log(`Updated ${updatedSummariesCount} pincode summary records.`)

// Verify sample
const sample = db.prepare('SELECT officename FROM post_offices WHERE pincode = ? LIMIT 10').all('263139')
console.log('Sample for PIN 263139:', sample)

db.close()
console.log('All done successfully!')
