import { getPlacements } from '../../utils/db'
import pkg from 'papaparse'
const { unparse } = pkg
import { getQuery, setResponseStatus, setResponseHeaders, createError } from 'h3'
import { checkRole } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  await checkRole(event, ['Admin', 'Planner', 'Viewer'])

  try {
    const query = getQuery(event)
    const fy = query.fy as string | undefined

    if (!fy) {
        throw new Error('Fiscal year (fy) query parameter is required for export.')
    }

    // Fetch all data for the given fiscal year, no pagination
    const { data } = getPlacements({ fy, pageSize: -1 }) 

    if (!data || data.length === 0) {
        setResponseStatus(event, 204) // No Content
        return 'No data found for the specified fiscal year.'
    }

    // Define CSV headers as per the contract
    const csvHeaders = [
        'unit_name', 'house_name', 'ps_quantity_planned', 'ps_quantity_actual',
        'date_in', 'date_lay', 'date_cull', 'date_ready_next', 'gap_weeks',
        'remarks', 'source_batch', 'origin', 'fiscal_year'
    ];

    const csv = unparse(data, { columns: csvHeaders });

    // Set headers for CSV download
    setResponseHeaders(event, {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="placements_${fy}.csv"`,
    });

    return csv;

  } catch (error: any) {
    console.error('Error exporting placements:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to export placements',
      message: error.message,
    })
  }
})
