import { defineEventHandler, getQuery } from 'h3'
import { getPlacements } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  return getPlacements(query)
})