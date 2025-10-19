import { defineEventHandler } from 'h3'
import { deletePlacement } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const placementId = event.context.params?.id as string
  return deletePlacement(placementId)
})