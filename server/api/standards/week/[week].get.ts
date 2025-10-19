import { defineEventHandler } from 'h3'
import { getSingleWeekStandard } from '#utils/db'
import { checkRole } from '#utils/auth'

export default defineEventHandler(async (event) => {
  // const user = event.context.user
  // if (!user) {
  //   throw createError({
  //     statusCode: 401,
  //     statusMessage: 'Unauthorized',
  //     message: 'Authentication required'
  //   })
  // }

  // await checkRole(event, ['Admin', 'Planner', 'Viewer'])


  const weekParam = event.context.params?.week
  if (!weekParam) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Week parameter is required'
    })
  }

  const week = parseInt(weekParam)
  if (isNaN(week) || week < 1 || week > 71) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Invalid week number'
    })
  }

  try {
    const data = await getSingleWeekStandard(week)
    if (!data) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Not Found',
        message: 'Week data not found'
      })
    }
    return { success: true, data }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to retrieve week data'
    }
  }
})
