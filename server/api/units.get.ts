import { defineEventHandler } from 'h3'
import { getUnits } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  return getUnits()
})