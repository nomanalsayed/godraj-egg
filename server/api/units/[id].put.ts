
import { defineEventHandler, readBody } from 'h3'
import { updateUnit } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const unitId = event.context.params?.id as string
  const body = await readBody(event)
  return updateUnit(unitId, body)
})
