
export default defineEventHandler(() => {
  return {
    data: [
      {
        unit_status: 'Running',
        ps_quantity: 9500,
        actual_quantity: 9450,
        in_date: '2025-01-15',
        lay_date: '2025-06-20',
        cull_date: '2026-07-10',
        ready_date: '2026-08-01',
        gap_weeks: 4,
        remarks: 'On track',
        status: 'running'
      },
      {
        unit_status: 'Closed',
        ps_quantity: 9200,
        actual_quantity: 9180,
        in_date: '2024-03-10',
        lay_date: '2024-08-15',
        cull_date: '2025-09-01',
        ready_date: '2025-09-22',
        gap_weeks: 3,
        remarks: 'Cycle complete',
        status: 'closed'
      },
      {
        unit_status: 'Ready for Next Cycle',
        ps_quantity: 9600,
        actual_quantity: 0,
        in_date: '2026-09-01',
        lay_date: '2027-02-05',
        cull_date: '2028-03-01',
        ready_date: '2028-03-22',
        gap_weeks: 3,
        remarks: 'Awaiting new batch',
        status: 'ready'
      },
    ]
  }
})
