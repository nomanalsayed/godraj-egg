import { defineEventHandler } from 'h3'
import { getUnit } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const unitId = event.context.params?.id as string
  return getUnit(unitId)
})