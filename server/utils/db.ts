import Database from 'better-sqlite3';
import Papa from 'papaparse';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

let db: Database.Database | null = null;

export function getDatabase() {
  if (!db) {
    const dbPath = join(process.cwd(), 'data', 'godrej-egg.db');
    db = new Database(dbPath);
    initializeDatabase();
  }
  return db;
}

function initializeDatabase() {
  if (!db) return;

  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS parent_stock (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      age INTEGER NOT NULL,
      week_date TEXT NOT NULL,
      birds INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS production_data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      age INTEGER NOT NULL,
      week_date TEXT NOT NULL,
      production_type TEXT NOT NULL,
      value REAL NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_parent_stock_age ON parent_stock(age);
    CREATE INDEX IF NOT EXISTS idx_parent_stock_week ON parent_stock(week_date);
    CREATE INDEX IF NOT EXISTS idx_production_age ON production_data(age);
    CREATE INDEX IF NOT EXISTS idx_production_week ON production_data(week_date);
    
    CREATE TABLE IF NOT EXISTS standards (
      week INTEGER PRIMARY KEY,
      male REAL,
      female REAL,
      avg_fem REAL,
      m_house_ps REAL,
      select_he REAL,
      hhhe_ps1 REAL,
      hhhe_ps2 REAL,
      depletion REAL,
      cumm_depl REAL,
      livability REAL,
      hand_wk_he REAL,
      he_w_b REAL,
      hhhe_cumm REAL
    );
  `);

  // Check if data already exists
  const count = db.prepare('SELECT COUNT(*) as count FROM parent_stock').get() as { count: number };
  
  if (count.count === 0) {
    console.log('Importing CSV data...');
    importCSVData();
  }
}

function importCSVData() {
  if (!db) return;

  try {
    const csvPath = join(process.cwd(), 'data/weekly-data.csv');
    const csvContent = readFileSync(csvPath, 'utf-8');
    
    const { data } = Papa.parse(csvContent, {
      header: false,
      skipEmptyLines: true
    });

    // Find the header row (contains "AGE")
    let headerRowIndex = -1;
    let weekHeaders: string[] = [];
    
    for (let i = 0; i < data.length; i++) {
      const row = data[i] as string[];
      if (row[1] === 'AGE') {
        headerRowIndex = i;
        weekHeaders = row.slice(2); // Get all week dates
        break;
      }
    }

    if (headerRowIndex === -1) {
      console.error('Could not find header row');
      return;
    }

    // Process parent stock data (rows after header until we hit production data)
    const insertStock = db.prepare(`
      INSERT INTO parent_stock (age, week_date, birds)
      VALUES (?, ?, ?)
    `);

    const insertProduction = db.prepare(`
      INSERT INTO production_data (age, week_date, production_type, value)
      VALUES (?, ?, ?, ?)
    `);

    const transaction = db.transaction(() => {
      // Process rows after header
      for (let i = headerRowIndex + 1; i < data.length; i++) {
        const row = data[i] as string[];
        const ageValue = row[1];
        if (typeof ageValue !== 'string') continue;
        const age = parseInt(ageValue);
        
        if (isNaN(age)) continue; // Skip non-numeric age rows
        
        // Process each week's data
        for (let j = 2; j < row.length && j - 2 < weekHeaders.length; j++) {
          const value = row[j];
          const weekDate = weekHeaders[j - 2];
          
          if (value && value.trim() !== '' && weekDate) {
            const numValue = parseFloat(value.replace(/,/g, ''));
            
            if (!isNaN(numValue) && numValue > 0) {
              // Determine if this is stock data or production data based on age
              if (age <= 64) {
                // Parent stock data
                insertStock.run(age, weekDate, numValue);
              } else {
                // Production data (HE Production section)
                insertProduction.run(age - 64, weekDate, 'HE_PRODUCTION', numValue);
              }
            }
          }
        }
      }
    });

    transaction();
    console.log('CSV data imported successfully');
  } catch (error) {
    console.error('Error importing CSV data:', error);
  }
}

export function closeDatabase() {
  if (db) {
    db.close();
    db = null;
  }
}

export async function initDatabase() {
  const database = getDatabase();
  return database;
}

export const getStandards = async () => {
  const db = getDatabase();
  const result = db.prepare('SELECT * FROM standards ORDER BY week').all();
  return { data: result };
}

export const calculateReports = async () => {
  const db = getDatabase();
  
  const reports = db.prepare(`
    SELECT 
      ps.week_date,
      ps.age,
      ps.birds AS stock_count,
      pd.value AS production_value,
      std.*,
      (ps.birds * std.hhhe_ps1) AS weekly_production,
      (pd.value * std.livability) AS adjusted_production,
      (ps.birds * std.depletion) AS weekly_depletion,
      (ps.birds * std.cumm_depl) AS cumulative_depletion
    FROM parent_stock ps
    LEFT JOIN production_data pd 
      ON ps.week_date = pd.week_date 
      AND pd.production_type = 'HE_PRODUCTION'
    LEFT JOIN standards std 
      ON ps.age = std.week
    ORDER BY ps.week_date DESC
  `).all();

  return { data: reports };
}

export const updateStandards = async (data: Array<{
  week: number;
  male?: number;
  female?: number;
  avg_fem?: number;
  m_house_ps?: number;
  select_he?: number;
  lirm1?: number;
  lirm2?: number;
  lirm3?: number;
  hhhe_ps1?: number;
  hhhe_ps2?: number;
  depletion?: number;
  cumm_depl?: number;
  livability?: number;
  hand_wk_he?: number;
  he_w_b?: number;
  hhhe_cumm?: number;
}>) => {
  const db = getDatabase();
  
  db.prepare('BEGIN TRANSACTION').run();
  try {
    const stmt = db.prepare(`
      UPDATE standards SET
        male = ?,
        female = ?,
        avg_fem = ?,
        m_house_ps = ?,
        select_he = ?,
        lirm1 = ?,
        lirm2 = ?,
        lirm3 = ?,
        hhhe_ps1 = ?,
        hhhe_ps2 = ?,
        depletion = ?,
        cumm_depl = ?,
        livability = ?,
        hand_wk_he = ?,
        he_w_b = ?,
        hhhe_cumm = ?
      WHERE week = ?
    `);

    for (const item of data) {
      stmt.run(
        item.male,
        item.female,
        item.avg_fem,
        item.m_house_ps,
        item.select_he,
        item.lirm1 ?? 0,
        item.lirm2 ?? 0,
        item.lirm3 ?? 0,
        item.hhhe_ps1,
        item.hhhe_ps2,
        item.depletion,
        item.cumm_depl,
        item.livability,
        item.hand_wk_he,
        item.he_w_b,
        item.hhhe_cumm ?? 0,
        item.week
      );
    }
    
    db.prepare('COMMIT').run();
  } catch (error) {
    db.prepare('ROLLBACK').run();
    throw error;
  }
}

export interface StandardWeek {
  week: number;
  male?: number;
  female?: number;
  depletion?: number;
  livability?: number;
  hand_wk_he?: number;
  he_w_b?: number;
  hhhe_cumm?: number;
}

// Export type for API consumption
export type APIStandardWeek = StandardWeek;

export const getSingleWeekStandard = async (week: number): Promise<StandardWeek | undefined> => {
  const db = getDatabase();
  const result = db.prepare('SELECT * FROM standards WHERE week = ?').get(week) as StandardWeek;
  return result;
}

export const updateSingleWeekStandard = async (week: number, data: {
  male?: number;
  female?: number;
  depletion?: number;
  livability?: number;
  hand_wk_he?: number;
  he_w_b?: number;
  hhhe_cumm?: number;
}) => {
  const db = getDatabase();
  
  const stmt = db.prepare(`
    UPDATE standards SET
      male = COALESCE(?, male),
      female = COALESCE(?, female),
      depletion = COALESCE(?, depletion),
      livability = COALESCE(?, livability),
      hand_wk_he = COALESCE(?, hand_wk_he),
      he_w_b = COALESCE(?, he_w_b),
      hhhe_cumm = COALESCE(?, hhhe_cumm)
    WHERE week = ?
  `);

  stmt.run(
    data.male,
    data.female,
    data.depletion,
    data.livability,
    data.hand_wk_he,
    data.he_w_b,
    data.hhhe_cumm,
    week
  );
}
