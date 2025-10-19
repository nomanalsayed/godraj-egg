
import { defineEventHandler } from 'h3'
import { unlinkHouseFromUnit } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const houseId = event.context.params?.id as string
  return unlinkHouseFromUnit(houseId)
})
