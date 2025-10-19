import { initDatabase } from '#utils/db'

async function main () {
  console.log('Starting database initialization...')

  try {
    // Initialize database
    const db = await initDatabase()
    console.log('Database initialized successfully!')

    // Create farm_units table
    db.exec(`
      CREATE TABLE IF NOT EXISTS farm_units (
        id TEXT PRIMARY KEY,
        name TEXT UNIQUE,
        status TEXT
      )
    `)

    // Create houses table
    db.exec(`
      CREATE TABLE IF NOT EXISTS houses (
        id TEXT PRIMARY KEY,
        unit_id TEXT,
        house_number INTEGER,
        label TEXT,
        capacity_ps INTEGER,
        status TEXT,
        FOREIGN KEY (unit_id) REFERENCES farm_units (id)
      )
    `)

    // Create placements table
    db.exec(`
      CREATE TABLE IF NOT EXISTS placements (
        id TEXT PRIMARY KEY,
        unit_id TEXT,
        house_id TEXT,
        ps_quantity_planned INTEGER,
        ps_quantity_actual INTEGER,
        date_in TEXT,
        date_lay TEXT,
        date_cull TEXT,
        date_ready_next TEXT,
        gap_weeks INTEGER,
        remarks TEXT,
        origin TEXT,
        status TEXT,
        fiscal_year TEXT,
        FOREIGN KEY (unit_id) REFERENCES farm_units (id),
        FOREIGN KEY (house_id) REFERENCES houses (id)
      )
    `)

    console.log('Tables created successfully!')

    db.close()
  } catch (error) {
    console.error('Initialization failed with error:')
    console.error(error)
    if (error instanceof Error && error.stack) {
      console.error('Stack trace:')
      console.error(error.stack)
    }
    process.exit(1)
  }
}

main()