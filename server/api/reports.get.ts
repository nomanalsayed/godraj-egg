import { defineEventHandler } from 'h3'
import { createError } from 'h3'
import { calculateReports } from '~~/server/utils/db'

export default defineEventHandler(async () => {
  try {
    const reportData = await calculateReports()
    return reportData
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to generate reports',
      data: error
    })
  }
})
