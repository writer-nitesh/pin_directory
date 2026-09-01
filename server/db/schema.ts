import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core'

export const pincodesSummary = sqliteTable('pincodes_summary', {
  pincode: text('pincode').primaryKey(),
  district: text('district').notNull(),
  district_slug: text('district_slug').notNull(),
  statename: text('statename').notNull(),
  state_slug: text('state_slug').notNull(),
  circle: text('circle').notNull(),
  region: text('region').notNull(),
  division: text('division').notNull(),
  office_count: integer('office_count').notNull(),
  primary_offices: text('primary_offices').notNull(),
  latitude: real('latitude'),
  longitude: real('longitude')
})

export const postOffices = sqliteTable('post_offices', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  pincode: text('pincode').notNull(),
  officename: text('officename').notNull(),
  office_slug: text('office_slug').notNull(),
  officetype: text('officetype').notNull(),
  delivery: text('delivery').notNull(),
  district: text('district').notNull(),
  district_slug: text('district_slug').notNull(),
  statename: text('statename').notNull(),
  state_slug: text('state_slug').notNull(),
  circle: text('circle').notNull(),
  region: text('region').notNull(),
  division: text('division').notNull(),
  latitude: real('latitude'),
  longitude: real('longitude')
})

export const states = sqliteTable('states', {
  state_slug: text('state_slug').primaryKey(),
  statename: text('statename').notNull(),
  district_count: integer('district_count').notNull(),
  pincode_count: integer('pincode_count').notNull(),
  office_count: integer('office_count').notNull()
})

export const districts = sqliteTable('districts', {
  district_slug: text('district_slug').primaryKey(),
  district: text('district').notNull(),
  statename: text('statename').notNull(),
  state_slug: text('state_slug').notNull(),
  pincode_count: integer('pincode_count').notNull(),
  office_count: integer('office_count').notNull()
})
