import { defineEventHandler, readBody } from 'h3'
import { linkHousesToUnit } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const unitId = event.context.params?.id as string
  const body = await readBody(event)
  return linkHousesToUnit(unitId, body.house_ids)
})