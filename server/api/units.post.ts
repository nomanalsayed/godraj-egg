import { defineEventHandler, readBody } from 'h3'
import { createUnit } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  console.log('request body:', body)
  return createUnit(body)
})