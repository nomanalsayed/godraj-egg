import { defineEventHandler } from 'h3'
import { getStandards } from '../utils/db'

export default defineEventHandler(async (_event) => {
  try {
    const { data } = getStandards()
    return data
  } catch (error) {
    console.error('Error fetching standards:', error)
    return { error: 'Failed to fetch standards' }
  }
})
