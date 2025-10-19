
import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
  const houseId = event.context.params?.id

  console.log(`Deleting house ${houseId}`)

  // In a real application, you would delete the house from the database here.

  return { success: true }
})
