import { defineEventHandler, readBody } from 'h3'
import { upsertWeekStandards as updateStandards, type APIStandardWeek } from '../utils/db'

export default defineEventHandler(async (event) => {
  const standards = await readBody(event)

  // Basic validation
  if (!Array.isArray(standards)) {
    return { error: 'Invalid input, expected an array of standards' }
  }

  const errors = validateStandards(standards)
  if (errors.length > 0) {
    return { errors }
  }

  try {
    await updateStandards(standards)
    return { success: true }
  } catch (error) {
    console.error('Error updating standards:', error)
    return { error: 'Failed to update standards' }
  }
})

function validateStandards (standards: APIStandardWeek[]) {
  const errors = []
  for (const standard of standards) {
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
