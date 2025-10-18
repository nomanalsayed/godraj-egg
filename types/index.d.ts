declare interface Stock {
  age: number
  week_date: string
  birds: number
  stock_type: string
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
