import { getDatabase } from '../utils/db';

export default defineEventHandler((event) => {
  const db = getDatabase();
  
  const query = getQuery(event);
  const age = query.age ? parseInt(query.age as string) : null;
  const weekDate = query.weekDate as string;
  
  let sql = 'SELECT * FROM parent_stock WHERE 1=1';
  const params: any[] = [];
  
  if (age !== null) {
    sql += ' AND age = ?';
    params.push(age);
  }
  
  if (weekDate) {
    sql += ' AND week_date = ?';
    params.push(weekDate);
  }
  
  sql += ' ORDER BY age, week_date';
  
  const stmt = db.prepare(sql);
  const results = stmt.all(...params);
  
  return {
    success: true,
    data: results
  };
});
