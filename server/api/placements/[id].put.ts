import { defineEventHandler, readBody } from 'h3'
import { updatePlacement } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const placementId = event.context.params?.id as string
  const body = await readBody(event)
  return updatePlacement(placementId, body)
})