declare interface Stock {
  age: number
  week_date: string
  birds: number
  stock_type: string
}

export interface User {
  id: string
  name: string
  email: string
  roles: string[]
  token?: string
}

declare interface WeekData {
  week: number;
  male: number;
  female: number;
  depletion: number;
  livability: number;
  hand_wk_he: number;
  he_w_b: number;
  hhhe_cumm: number;
}

declare interface BudgetData {
  category: string;
  budget: number;
  actual: number;
}

declare interface ForecastData {
  week_date: string;
  total_birds: number;
  avg_age: number;
  production_rate: number;
  forecast_eggs: number;
}

declare interface PlacementSchedule {
  unit_status: string;
  ps_quantity: number;
  actual_quantity: number;
  in_date: string;
  lay_date: string;
  cull_date: string;
  ready_date: string;
  gap_weeks: number;
  remarks: string;
  status: string;
}

declare interface ProductionSummary {
  month: string;
  fy26_he: number;
  fy27_he: number;
  fy28_he: number;
  fy29_he: number;
  fy30_he: number;
  hatchability: number;
  fy26_doc: number;
  fy27_doc: number;
  fy28_doc: number;
  fy29_doc: number;
  fy30_doc: number;
}

declare interface WeeklyForecastData {
  weekHeaders: string[];
  parentStockData: Record<string, number[]>;
}

declare interface ParentStock {
  age: number
  week_date: string
  birds: number
  created_at?: string
}

declare interface ProductionData {
  age: number
  week_date: string
  production_type: string
  value: number
  created_at?: string
}

declare interface Standard {
  week: number
  male: number
  female: number
  avg_fem: number
  m_house_ps: number
  select_he: number
  hhhe_ps1: number
  hhhe_ps2: number
  depletion: number
  cumm_depl: number
  livability: number
  hand_wk_he: number
  he_w_b: number
  hhhe_cumm: number
}

declare interface Report {
  week_date: string
  age: number
  stock_count: number
  production_value: number
  weekly_production: number
  adjusted_production: number
  weekly_depletion: number
  cumulative_depletion: number
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $toast: {
      show: (options: { message: string; type?: string; timeout?: number }) => void
    }
  }
}
