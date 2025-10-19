import type { Database as DatabaseType } from 'better-sqlite3'
import Database from 'better-sqlite3'
import { randomUUID } from 'crypto'
import { join } from 'path'

let db: DatabaseType | null = null

export function getDatabase () {
  if (!db) {
    const dbPath = join(process.cwd(), 'data', 'godrej-egg.db')
    db = new Database(dbPath)
  }
  return db
}

export function closeDatabase () {
  if (db) {
    db.close()
    db = null
  }
}

export function initDatabase () {
  const database = getDatabase()
  return database
}

//================================================================================
// Farm Units Functions
//================================================================================

export interface Unit {
  id: string;
  name: string;
  status: string;
}

export const getUnits = () => {
  try {
    const db = getDatabase()
    const result = db.prepare('SELECT * FROM farm_units').all() as Unit[]
    return { data: result }
  } catch (error) {
    console.error('Error getting units:', error)
    throw error
  }
}

export const getUnit = (id: string) => {
  const db = getDatabase()
  const result = db.prepare('SELECT * FROM farm_units WHERE id = ?').get(id) as Unit
  return { data: result }
}

export const createUnit = (unit: Omit<Unit, 'id'>): { data: Unit } => {
  try {
    const db = getDatabase()
    const id = randomUUID()
    const newUnit: Unit = { ...unit, id }

    const stmt = db.prepare(`
      INSERT INTO farm_units (id, name, status)
      VALUES (@id, @name, @status)
    `)
    
    stmt.run(newUnit)
    
    const createdUnit = db.prepare('SELECT * FROM farm_units WHERE id = ?').get(id) as Unit
    return { data: createdUnit }
  } catch (error) {
    console.error('Error creating unit:', error)
    throw error
  }
}

export const updateUnit = (id: string, unit: Partial<Omit<Unit, 'id'>>): { data: Unit } => {
  const db = getDatabase()
  
  const fields = Object.keys(unit).filter(k => k !== 'id')
  const setClause = fields.map(f => `${f} = @${f}`).join(', ')

  const stmt = db.prepare(`UPDATE farm_units SET ${setClause} WHERE id = @id`)
  stmt.run({ ...unit, id })

  const updatedUnit = db.prepare('SELECT * FROM farm_units WHERE id = ?').get(id) as Unit
  return { data: updatedUnit }
}

export const deleteUnit = (id: string) => {
  const db = getDatabase()
  db.prepare('DELETE FROM houses WHERE unit_id = ?').run(id)
  db.prepare('DELETE FROM farm_units WHERE id = ?').run(id)
  return { message: 'Unit deleted' }
}

//================================================================================
// Houses Functions
//================================================================================

export interface House {
  id: string;
  unit_id: string;
  label: string;
  capacity_ps: number;
  status: string;
}

export const getHouses = (options: { unit_id?: string }) => {
  const db = getDatabase()
  const { unit_id } = options

  let whereClauses: string[] = [];
  let params: (string | number)[] = [];

  if (unit_id) {
    whereClauses.push('unit_id = ?');
    params.push(unit_id);
  }

  const whereString = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
  
  const result = db.prepare(`SELECT * FROM houses ${whereString}`).all(params) as House[];

  return { data: result };
}

export const getHouse = (id: string) => {
  const db = getDatabase()
  const result = db.prepare('SELECT * FROM houses WHERE id = ?').get(id) as House
  return { data: result }
}

export const createHouse = (house: Omit<House, 'id'>): House => {
  const db = getDatabase()
  const id = randomUUID()
  const newHouse: House = { ...house, id }

  const stmt = db.prepare(`
    INSERT INTO houses (id, unit_id, label, capacity_ps, status)
    VALUES (@id, @unit_id, @label, @capacity_ps, @status)
  `)
  
  stmt.run(newHouse)
  
  return db.prepare('SELECT * FROM houses WHERE id = ?').get(id) as House
}

export const updateHouse = (id: string, house: Partial<Omit<House, 'id'>>): House => {
  const db = getDatabase()
  
  const fields = Object.keys(house).filter(k => k !== 'id' && k !== 'house_number')
  const setClause = fields.map(f => `${f} = @${f}`).join(', ')

  const stmt = db.prepare(`UPDATE houses SET ${setClause} WHERE id = @id`)
  stmt.run({ ...house, id })

  return db.prepare('SELECT * FROM houses WHERE id = ?').get(id) as House
}

export const deleteHouse = (id: string) => {
  const db = getDatabase()
  db.prepare('DELETE FROM houses WHERE id = ?').run(id)
  return { message: 'House deleted' }
}

export const linkHousesToUnit = (unitId: string, houseIds: string[]) => {
  const db = getDatabase()
  const stmt = db.prepare('UPDATE houses SET unit_id = ? WHERE id = ?')
  const transaction = db.transaction((ids: string[]) => {
    for (const id of ids) {
      stmt.run(unitId, id)
    }
  })
  transaction(houseIds)
  return { message: 'Houses linked' }
}

export const unlinkHouseFromUnit = (houseId: string) => {
  const db = getDatabase()
  db.prepare('UPDATE houses SET unit_id = NULL WHERE id = ?').run(houseId)
  return { message: 'House unlinked' }
}

//================================================================================
// Placements Functions
//================================================================================

export interface Placement {
  id: string;
  unit_id: string;
  house_id: string;
  ps_quantity_planned: number;
  ps_quantity_actual?: number | null;
  date_in: string;
  date_lay?: string | null;
  date_cull?: string | null;
  date_ready_next?: string | null;
  gap_weeks?: number | null;
  remarks?: string | null;
  origin?: string | null;
  status: string;
  fiscal_year: string;
}

export const getPlacements = (options: { 
    fy?: string, unit?: string, house?: string, status?: string, page?: number, pageSize?: number 
}) => {
    const db = getDatabase();
    const { fy, unit, house, status, page = 1, pageSize = 50 } = options;

    let whereClauses: string[] = [];
    let params: (string | number)[] = [];

    if (fy) {
        whereClauses.push('fiscal_year = ?');
        params.push(fy);
    }
    if (unit) {
        whereClauses.push('unit_id = ?');
        params.push(unit);
    }
    if (house) {
        whereClauses.push('house_id = ?');
        params.push(house);
    }
    if (status) {
        whereClauses.push('status = ?');
        params.push(status);
    }

    const whereString = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
    
    const countResult = db.prepare(`SELECT COUNT(*) as total FROM placements ${whereString}`).get(params) as { total: number };
    const total = countResult.total;

    const offset = (page - 1) * pageSize;
    let query = `SELECT * FROM placements ${whereString} ORDER BY date_in DESC LIMIT ? OFFSET ?`;
    params.push(pageSize, offset);

    let data = db.prepare(query).all(params) as Placement[];

    return {
        data,
        meta: {
            total,
            page,
            page_size: pageSize
        }
    };
}

export const createPlacement = (placement: Omit<Placement, 'id'>): Placement => {
    const db = getDatabase();
    const id = randomUUID();
    const newPlacement: Placement = { ...placement, id };

    const stmt = db.prepare(`
        INSERT INTO placements (id, unit_id, house_id, ps_quantity_planned, ps_quantity_actual, date_in, date_lay, date_cull, date_ready_next, remarks, origin, status, fiscal_year)
        VALUES (@id, @unit_id, @house_id, @ps_quantity_planned, @ps_quantity_actual, @date_in, @date_lay, @date_cull, @date_ready_next, @remarks, @origin, @status, @fiscal_year)
    `);
    
    stmt.run(newPlacement);
    
    return db.prepare('SELECT * FROM placements WHERE id = ?').get(id) as Placement;
}

export const updatePlacement = (id: string, placement: Partial<Omit<Placement, 'id'>>): Placement => {
    const db = getDatabase();
    
    const fields = Object.keys(placement).filter(k => k !== 'id');
    const setClause = fields.map(f => `${f} = @${f}`).join(', ');

    const stmt = db.prepare(`UPDATE placements SET ${setClause} WHERE id = @id`);
    stmt.run({ ...placement, id });

    return db.prepare('SELECT * FROM placements WHERE id = ?').get(id) as Placement;
}

export const deletePlacement = (id: string) => {
    const db = getDatabase();
    db.prepare('DELETE FROM placements WHERE id = ?').run(id);
    return { message: 'Placement deleted' };
}

export const upsertPlacements = (placements: Omit<Placement, 'id'>[]) => {
    const db = getDatabase();
    try {
        const insertStmt = db.prepare(`
            INSERT INTO placements (id, unit_id, house_id, ps_quantity_planned, ps_quantity_actual, date_in, date_lay, date_cull, date_ready_next, remarks, origin, status, fiscal_year)
            VALUES (@id, @unit_id, @house_id, @ps_quantity_planned, @ps_quantity_actual, @date_in, @date_lay, @date_cull, @date_ready_next, @remarks, @origin, @status, @fiscal_year)
        `);

        const upsertTransaction = db.transaction((items: Omit<Placement, 'id'>[]) => {
            for (const item of items) {
                const id = randomUUID();
                insertStmt.run({ ...item, id });
            }
        });

        upsertTransaction(placements);

        return { message: `${placements.length} records processed.` };
    } catch (error) {
        console.error("--- DATABASE ERROR in upsertPlacements ---", error);
        throw error;
    }
}

//================================================================================
// Standards Functions
//================================================================================

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

export const getSingleWeekStandard = (week: number): StandardWeek | undefined => {
  const db = getDatabase()
  const result = db.prepare('SELECT * FROM standards WHERE week = ?').get(week) as StandardWeek
  return result
}

export const createWeekStandard = (data: StandardWeek) => {
  const db = getDatabase()
  
  const stmt = db.prepare(`
    INSERT INTO standards (
      week, male, female, depletion, livability, 
      hand_wk_he, he_w_b, hhhe_cumm
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `)
  
  stmt.run(
    data.week,
    data.male,
    data.female,
    data.depletion,
    data.livability,
    data.hand_wk_he,
    data.he_w_b,
    data.hhhe_cumm
  )
  
  return data
}

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

export const upsertWeekStandards = (data: StandardData[]) => {
  const db = getDatabase()

  const stmt = db.prepare(`
    INSERT INTO standards (
      week, male, female, avg_fem, m_house_ps, select_he, hhhe_ps1, hhhe_ps2,
      depletion, cumm_depl, livability, hand_wk_he, he_w_b, hhhe_cumm
    ) VALUES (
      @week, @male, @female, @avg_fem, @m_house_ps, @select_he, @hhhe_ps1, @hhhe_ps2,
      @depletion, @cumm_depl, @livability, @hand_wk_he, @he_w_b, @hhhe_cumm
    ) ON CONFLICT(week) DO UPDATE SET
      male = excluded.male,
      female = excluded.female,
      avg_fem = excluded.avg_fem,
      m_house_ps = excluded.m_house_ps,
      select_he = excluded.select_he,
      hhhe_ps1 = excluded.hhhe_ps1,
      hhhe_ps2 = excluded.hhhe_ps2,
      depletion = excluded.depletion,
      cumm_depl = excluded.cumm_depl,
      livability = excluded.livability,
      hand_wk_he = excluded.hand_wk_he,
      he_w_b = excluded.he_w_b,
      hhhe_cumm = excluded.hhhe_cumm
  `)

  const transaction = db.transaction((items: StandardData[]) => {
    for (const item of items) {
      // Ensure all fields are present for the database
      const fullItem = {
        week: item.week || 0,
        male: item.male || 0,
        female: item.female || 0,
        avg_fem: item.avg_fem || 0,
        m_house_ps: item.m_house_ps || 0,
        select_he: item.select_he || 0,
        hhhe_ps1: item.hhhe_ps1 || 0,
        hhhe_ps2: item.hhhe_ps2 || 0,
        depletion: item.depletion || 0,
        cumm_depl: item.cumm_depl || 0,
        livability: item.livability || 0,
        hand_wk_he: item.hand_wk_he || 0,
        he_w_b: item.he_w_b || 0,
        hhhe_cumm: item.hhhe_cumm || 0,
      }
      stmt.run(fullItem)
    }
  })

  transaction(data)
}

export const getStandards = () => {
  const db = getDatabase()
  const result = db.prepare('SELECT * FROM standards ORDER BY week').all()
  return { data: result }
}

export const updateStandards = (data: Array<{
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
  const db = getDatabase()

  db.prepare('BEGIN TRANSACTION').run()
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
    `)

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
      )
    }

    db.prepare('COMMIT').run()
  } catch (error) {
    db.prepare('ROLLBACK').run()
    throw error
  }
}

export const calculateReports = () => {
  const db = getDatabase()

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
  `).all()

  return { data: reports }
}

export const updateSingleWeekStandard = (week: number, data: {
  male?: number;
  female?: number;
  depletion?: number;
  livability?: number;
  hand_wk_he?: number;
  he_w_b?: number;
  hhhe_cumm?: number;
}) => {
  const db = getDatabase()

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
  `)

  stmt.run(
    data.male,
    data.female,
    data.depletion,
    data.livability,
    data.hand_wk_he,
    data.he_w_b,
    data.hhhe_cumm,
    week
  )
}

export const deleteWeekStandard = (week: number) => {
  const db = getDatabase()
  const stmt = db.prepare('DELETE FROM standards WHERE week = ?')
  const result = stmt.run(week)
  if (result.changes === 0) {
    // We can choose to throw an error or not. For a DELETE operation,
    // if the record doesn't exist, it might not be a critical error.
    console.warn(`Attempted to delete non-existent record for week ${week}`)
  }
}