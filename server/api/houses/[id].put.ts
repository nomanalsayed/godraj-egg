import { defineEventHandler, readBody } from 'h3'
import { updateHouse } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const houseId = event.context.params?.id as string
  const body = await readBody(event)
  return updateHouse(houseId, body)
})