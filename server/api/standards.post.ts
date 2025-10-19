import { defineEventHandler, readBody, createError } from 'h3'
import { upsertWeekStandards, Standard } from '#utils/db'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // Validate required fields
  const requiredFields = [
    'week', 'male', 'female', 'avg_fem', 'm_house_ps',
    'select_he', 'lirm1', 'lirm2', 'lirm3',
    'hhhe_ps1', 'hhhe_ps2', 'depletion',
    'cumm_depl', 'livability', 'hand_wk_he', 'he_w_b', 'hhhe_cumm'
  ]

  for (const field of requiredFields) {
    if (body[field] === undefined || body[field] === null) {
      throw createError({
        statusCode: 400,
        statusMessage: `${field} is required`
      })
    }
  }

  try {
    // Convert single record to array format expected by updateStandards
    await upsertWeekStandards([{
      week: Number(body.week),
      male: Number(body.male),
      female: Number(body.female),
      avg_fem: Number(body.avg_fem),
      m_house_ps: Number(body.m_house_ps),
      select_he: Number(body.select_he),
      lirm1: Number(body.lirm1),
      lirm2: Number(body.lirm2),
      lirm3: Number(body.lirm3),
      hhhe_ps1: Number(body.hhhe_ps1),
      hhhe_ps2: Number(body.hhhe_ps2),
      depletion: Number(body.depletion),
      cumm_depl: Number(body.cumm_depl),
      livability: Number(body.livability),
      hand_wk_he: Number(body.hand_wk_he),
      he_w_b: Number(body.he_w_b),
      hhhe_cumm: Number(body.hhhe_cumm)
    } as Standard]) // Explicitly cast to Standard type

    return { status: 'success' }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to save standards data',
      data: error
    })
  }
})
