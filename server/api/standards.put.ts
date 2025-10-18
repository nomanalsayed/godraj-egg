import { defineEventHandler, readBody } from 'h3'
import { updateStandards, updateSingleWeekStandard } from '../utils/db'

export default defineEventHandler(async (event) => {
  try {
    const user = event.context.user
    if (!user?.roles?.includes('Admin')) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden',
        message: 'Insufficient privileges to update standards'
      })
    }

    const body = await readBody(event)
    if (body.week) {
      await updateSingleWeekStandard(body.week, body.data)
    } else {
      await updateStandards(body.data)
    }
    return { success: true }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
})
