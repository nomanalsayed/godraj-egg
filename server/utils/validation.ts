
export function validateParentStockInput (data: any) {
  const errors = []
  if (!data.age || !data.week_date || !data.value) {
    errors.push('Missing required fields')
  }
  if (isNaN(data.age) || data.age < 0 || data.age > 100) {
    errors.push('Invalid age')
  }
  if (isNaN(data.value) || data.value < 0) {
    errors.push('Invalid value')
  }
  if (!/\d{4}-\d{2}-\d{2}/.test(data.week_date)) {
    errors.push('Invalid week_date format')
  }
  return errors
}

export function validatePlacement (data: any) {
  const errors = []
  if (!data.unit_name || !data.house_name || !data.ps_quantity_planned || !data.date_in || !data.fiscal_year) {
    errors.push('Missing required fields')
  }
  if (isNaN(data.ps_quantity_planned) || data.ps_quantity_planned < 0) {
    errors.push('Invalid ps_quantity_planned')
  }
  if (data.ps_quantity_actual && (isNaN(data.ps_quantity_actual) || data.ps_quantity_actual < 0)) {
    errors.push('Invalid ps_quantity_actual')
  }
  if (!/\d{4}-\d{2}-\d{2}/.test(data.date_in)) {
    errors.push('Invalid date_in format')
  }
  if (data.date_lay && !/\d{4}-\d{2}-\d{2}/.test(data.date_lay)) {
    errors.push('Invalid date_lay format')
  }
  if (data.date_cull && !/\d{4}-\d{2}-\d{2}/.test(data.date_cull)) {
    errors.push('Invalid date_cull format')
  }
  if (data.date_ready_next && !/\d{4}-\d{2}-\d{2}/.test(data.date_ready_next)) {
    errors.push('Invalid date_ready_next format')
  }
  return errors
}
