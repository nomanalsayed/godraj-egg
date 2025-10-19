import { defineEventHandler, readBody } from 'h3'
import { updateSingleWeekStandard, type APIStandardWeek } from '#utils/db'
import { checkRole } from '#utils/auth'

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

  const week = parseInt(weekParam)
  if (isNaN(week) || week < 1 || week > 71) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Invalid week number'
    })
  }

  const body = await readBody<APIStandardWeek>(event)

  // Check for week mismatch
  if (body.week !== undefined && body.week !== week) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: JSON.stringify({ code: "WEEK_MISMATCH" })
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

  // Basic validation
  const errors = validateStandard(body)
  if (errors.length > 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      data: { errors }
    })
  }

  try {
    await updateSingleWeekStandard(week, body)
    return { success: true }
  } catch (error) {
    console.error(`Error updating standard for week ${week}:`, error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'Failed to update standard'
    })
  }
})

function validateStandard (standard: APIStandardWeek) {
  const errors = []
  if (standard.male === undefined || isNaN(standard.male)) { errors.push('Male must be a number') }
  if (standard.female === undefined || isNaN(standard.female)) { errors.push('Female must be a number') }
  if (standard.depletion === undefined || isNaN(standard.depletion) || standard.depletion < 0 || standard.depletion > 10) {
    errors.push('Depletion must be between 0 and 10')
  }
  if (standard.livability === undefined || isNaN(standard.livability) || standard.livability < 0 || standard.livability > 100) {
    errors.push('Livability must be between 0 and 100')
  }
  if (standard.hand_wk_he === undefined || isNaN(standard.hand_wk_he)) { errors.push('Hand Wk HE must be a number') }
  if (standard.he_w_b === undefined || isNaN(standard.he_w_b) || standard.he_w_b < 0 || standard.he_w_b > 10) {
    errors.push('HE / W / B must be between 0 and 10')
  }
  if (standard.hhhe_cumm === undefined || isNaN(standard.hhhe_cumm)) { errors.push('HHHE Cumulative must be a number') }
  return errors
}
