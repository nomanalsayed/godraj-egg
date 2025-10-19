import { defineEventHandler, readBody } from 'h3'
import { createPlacement } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  return createPlacement(body)
})