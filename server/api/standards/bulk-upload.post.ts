import { defineEventHandler, readBody } from 'h3'
import { upsertWeekStandards } from '#utils/db'

// Define the structure of a single standard record, matching the database schema
interface StandardData {
  week: number;
  male: number;
  female: number;
  avg_fem: number;
  m_house_ps: number;
  select_he: number;
  hhhe_ps1: number;
  hhhe_ps2: number;
  depletion: number;
  cumm_depl: number;
  livability: number;
  hand_wk_he: number;
  he_w_b: number;
  hhhe_cumm: number;
}

function validateStandards (standards: StandardData[]) {
  const errors = []
  for (const standard of standards) {
    if (standard.week === undefined || isNaN(standard.week) || standard.week < 1 || standard.week > 71) {
      errors.push('Invalid week number')
    }
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
  }
  return errors
}

export default defineEventHandler(async (event) => {
  // await checkRole(event, ['Admin'])

  const body = await readBody<{ data: StandardData[] }>(event)

  if (!body.data || !Array.isArray(body.data)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Invalid request body. Expected { data: [...] }'
    })
  }

  const errors = validateStandards(body.data)
  if (errors.length > 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: errors.join(', ')
    })
  }

  try {
    await upsertWeekStandards(body.data)
    return { success: true, message: `${body.data.length} records processed.` }
  } catch (error: any) {
    console.error('Error during bulk upload:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: error.message || 'Failed to process CSV file.'
    })
  }
})
