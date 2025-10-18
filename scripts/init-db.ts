import { initDatabase } from '#utils/db'
import { existsSync } from 'fs'
import { join } from 'path'

async function main() {
  console.log('Starting database initialization...')
  
  try {
    // Verify CSV file exists
    const csvPath = join(process.cwd(), 'data', 'weekly-data.csv')
    if (!existsSync(csvPath)) {
      throw new Error(`CSV file not found at ${csvPath}`)
    }

    // Initialize database
    const db = await initDatabase()
    console.log('Database initialized successfully!')
    
    // Verify data insertion
    // Create standards table using raw SQL
    db.exec(`
      CREATE TABLE IF NOT EXISTS standards (
        week INTEGER PRIMARY KEY,
        male REAL,
        female REAL,
        avg_fem REAL,
        m_house_ps REAL,
        select_he REAL,
        lirm1 REAL,
        lirm2 REAL,
        lirm3 REAL,
        hhhe_ps1 REAL,
        hhhe_ps2 REAL,
        depletion REAL,
        cumm_depl REAL,
        livability REAL,
        hand_wk_he REAL,
        he_w_b REAL,
        hhhe_cumm REAL
      )
    `)

    const rowCount = db.prepare('SELECT COUNT(*) as count FROM parent_stock').get() as { count: number }
    console.log(`Inserted ${rowCount.count} parent stock records`)
    
    db.close()
  } catch (error) {
    console.error('Initialization failed with error:')
    console.error(error)
    if (error instanceof Error && error.stack) {
      console.error('Stack trace:')
      console.error(error.stack)
    }
    process.exit(1)
  } finally {
    process.exit(0)
  }
}

main()
