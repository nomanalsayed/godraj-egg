
import { defineEventHandler, readBody, createError } from 'h3'
import { upsertPlacements, type Placement } from '~/server/utils/db'
import { validatePlacement } from '~/server/utils/validation'

// Custom date parser to remove the date-fns dependency
const parseDate = (dateStr: string | undefined | null): string | null => {
    if (!dateStr || dateStr.trim() === '') return null;

    // Try YYYY-MM-DD format first (e.g., 2023-05-26)
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        const d = new Date(dateStr);
        if (!isNaN(d.getTime())) return dateStr;
    }

    // Try dd-MMM-yy format (e.g., 09-Dec-22)
    const parts = dateStr.match(/^(\d{1,2})-([A-Za-z]{3})-(\d{2})$/);
    if (parts) {
        const day = parseInt(parts[1], 10);
        const monthStr = parts[2].toLowerCase();
        const year = parseInt(parts[3], 10);
        const months: Record<string, number> = { 'jan': 0, 'feb': 1, 'mar': 2, 'apr': 3, 'may': 4, 'jun': 5, 'jul': 6, 'aug': 7, 'sep': 8, 'oct': 9, 'nov': 10, 'dec': 11 };
        
        if (monthStr in months) {
            const month = months[monthStr];
            const fullYear = 2000 + year; // Assuming 21st century for 2-digit years
            const d = new Date(Date.UTC(fullYear, month, day));
            if (!isNaN(d.getTime())) {
                // Return as YYYY-MM-DD
                return d.toISOString().split('T')[0];
            }
        }
    }
    return null; // Return null if no format matches
};

export default defineEventHandler(async (event) => {
  try {
    const { data } = await readBody<{ data: any[] }>(event);

    if (!Array.isArray(data)) {
      throw createError({ statusCode: 400, message: 'Invalid request body.' });
    }

    const errors: { row: number, errors: string[] }[] = []

    const processedRows = data.map((row, index) => {
      const plannedQty = parseInt(row.ps_quantity_planned, 10);
      const placement = {
        unit_name: row.unit_name,
        house_name: row.house_name,
        ps_quantity_planned: isNaN(plannedQty) ? 0 : plannedQty,
        ps_quantity_actual: row.ps_quantity_actual ? parseInt(row.ps_quantity_actual, 10) : null,
        date_in: parseDate(row.date_in),
        date_lay: parseDate(row.date_lay),
        date_cull: parseDate(row.date_cull),
        date_ready_next: parseDate(row.date_ready_next),
        remarks: row.remarks,
        source_batch: row.source_batch,
        origin: row.origin,
        fiscal_year: row.fiscal_year,
        status: row.status,
      };

      const validationErrors = validatePlacement(placement)
      if (validationErrors.length > 0) {
        errors.push({ row: index + 1, errors: validationErrors })
      }

      return placement;
    });

    if (errors.length > 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        data: { errors }
      })
    }

    const validPlacements = processedRows.filter(p => p.date_in && p.ps_quantity_planned > 0);
    
    if (validPlacements.length > 0) {
      upsertPlacements(validPlacements as Omit<Placement, 'id'>[]);
    }

    return { statusCode: 200, message: `Data processed. Found ${validPlacements.length} valid rows.` };

  } catch (error: any) {
    console.error('--- Error during data processing ---', error);
    throw createError({
      statusCode: 500,
      statusMessage: `Error during data processing: ${error.message}`,
    });
  }
})
