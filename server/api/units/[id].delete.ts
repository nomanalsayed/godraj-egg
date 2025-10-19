import { defineEventHandler } from 'h3'
import { deleteUnit } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const unitId = event.context.params?.id as string
  return deleteUnit(unitId)
})