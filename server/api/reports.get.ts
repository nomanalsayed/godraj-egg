import { defineEventHandler, createError } from 'h3'
import { calculateReports } from '~/server/utils/db'

export default defineEventHandler(async () => {
  try {
    if (typeof calculateReports !== 'function') {
      throw createError({
        statusCode: 501,
        statusMessage: 'Not Implemented',
        data: 'calculateReports is not a function'
      })
    }
    return calculateReports()
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to calculate reports',
      data: error.message
    })
  }
})