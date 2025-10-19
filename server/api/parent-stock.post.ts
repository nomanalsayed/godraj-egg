import { H3Event, createError, readBody } from 'h3'
import { getDatabase } from '~/server/utils/db'
import { validateParentStockInput } from '~/server/utils/validation'

export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody<{
    type: string
    age: number
    week_date: string
    value: number
  }>(event)
  const db = getDatabase()

  const errors = validateParentStockInput(body)
  if (errors.length > 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      data: { errors }
    })
  }

  try {
    if (body.type === 'parent_stock') {
      db.prepare(`
        INSERT INTO parent_stock (age, week_date, birds)
        VALUES (?, ?, ?)
      `).run(body.age, body.week_date, body.value)
    } else {
      db.prepare(`
        INSERT INTO production_data (age, week_date, production_type, value)
        VALUES (?, ?, 'MANUAL_ENTRY', ?)
      `).run(body.age, body.week_date, body.value)
    }

    return { success: true }
  } catch (err) {
    const error = err as Error
    throw createError({
      statusCode: 500,
      statusMessage: 'Database insertion failed: ' + error.message
    })
  }
})