import { defineEventHandler, getQuery } from 'h3'
import { getHouses } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  return getHouses(query)
})