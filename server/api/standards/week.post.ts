import { defineEventHandler, readBody, createError } from 'h3'
import { upsertWeekStandards, getSingleWeekStandard, type APIStandardWeek } from '~~/server/utils/db'
import { checkRole } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
  // await checkRole(event, ['Admin'])


  const body = await readBody<APIStandardWeek>(event)

  // Validate week number
  if (body.week === undefined || body.week < 1 || body.week > 71) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Invalid week number'
    })
  }

  try {
    // Check if week already exists
    const existing = await getSingleWeekStandard(body.week)
    if (existing) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Conflict',
        message: JSON.stringify({ code: "ALREADY_EXISTS" })
      })
    }
    
    // Create new week
    const created = await createWeekStandard(body)
    return { success: true, data: created }
  } catch (error: any) {
    if (error.statusCode === 409) {
      throw error
    }
    
    console.error(`Error creating standard for week ${body.week}:`, error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'Failed to create week standard'
    })
  }
})
