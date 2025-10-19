import { randomUUID } from 'crypto'
import { join } from 'path'
import Database from 'better-sqlite3'
import type { Database as DatabaseType } from 'better-sqlite3'

let db: DatabaseType | null = null

function getDatabase () {
  if (!db) {
    const dbPath = join(process.cwd(), 'data', 'godrej-egg.db')
    db = new Database(dbPath)
  }
  return db
}

async function main () {
  console.log('Adding new unit to the database...')

  try {
    const db = getDatabase()

    const id = randomUUID()
    const newUnit = {
      id,
      name: 'Unit from script',
      status: 'active'
    }

    const stmt = db.prepare(`
      INSERT INTO farm_units (id, name, status)
      VALUES (@id, @name, @status)
    `)
    
    stmt.run(newUnit)

    console.log('New unit added successfully!')

    db.close()
  } catch (error) {
    console.error('Failed to add new unit:', error)
    process.exit(1)
  }
}

main()