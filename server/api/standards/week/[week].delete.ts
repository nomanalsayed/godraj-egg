import { defineEventHandler } from 'h3'
import { deleteWeekStandard } from '#utils/db'

export default defineEventHandler(async (event) => {
  // await checkRole(event, ['Admin'])

  const weekParam = event.context.params?.week
  if (!weekParam) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Week parameter is required'
    })
  }
  const week = parseInt(weekParam, 10)
  if (isNaN(week)) {
      throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Invalid week number'
    })
  }

  // Check if record exists
  const existing = await getSingleWeekStandard(week)
  if (!existing) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Not Found',
      message: JSON.stringify({ code: "NOT_FOUND" })
    })
  }

  try {
    await deleteWeekStandard(week)
    return { success: true }
  } catch (error: any) {
    console.error(`Error deleting standard for week ${week}:`, error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: error.message || 'Failed to delete week standard'
    })
  }
})
