# Poultry Forecasting System Documentation

## Overview
This system replaces manual Excel processes with an automated pipeline that transforms breed standards, placement data, and weekly production metrics into multi-year forecasts. The deterministic engine calculates key performance indicators while maintaining traceability from raw inputs to final forecasts.

## Data Flow Diagram
```ascii
[Standards LIRM] → [Placement Schedule] → [Weekly Engine]  
       ↓                    ↓                      ↓  
[Data Validation]    [Age Calculation]    [Feed Calculations]  
       ↓                    ↓                      ↓  
[Forecast Model] → [Monthly Aggregation] → [1.KBF-Forecaste]  
       ↓  
[Variance Analysis] → [Reports/Dashboards]
```

## Data Contracts

### A. standards_lirm (Weekly Breed Standard)
| Field                   | Type   | Unit          | Example       |
|-------------------------|--------|---------------|---------------|
| week_no                 | INT    | Weeks         | 1, 2, ..., 71 |
| egg_rate_per_bird       | FLOAT  | HE/W/B        | 0.85          |
| cumulative_hhhe         | FLOAT  | Cumulative    | 150.2         |
| mortality_pct_week      | FLOAT  | Percentage    | 0.25          |
| feed_growing_g_per_day  | FLOAT  | Grams/day     | 95.0          |
| feed_laying_g_per_day   | FLOAT  | Grams/day     | 115.0         |

### B. placements (1. KBF-Existing Place)
| Field         | Type   | Example                      |
|---------------|--------|------------------------------|
| placement_id  | UUID   | 550e8400-e29b-41d4-a716-446655440000 |
| unit          | TEXT   | FarmA                        |
| house         | TEXT   | House12                      |
| ps_qty        | INT    | 15000                        |
| actual_qty    | INT    | 14850                        |
| in_date       | DATE   | 2025-01-05                   |
| lay_date      | DATE   | 2025-04-20                   |
| cull_date     | DATE   | 2026-08-15                   |
| ready_date    | DATE   | 2026-08-29                   |
| remarks       | TEXT   | Running/Closed/Import/Local  |

### C. weekly_actuals (1. KBF-Existing Production)
| Field                   | Type   | Unit    |
|-------------------------|--------|---------|
| placement_id            | UUID   |         |
| week_no                 | INT    | Weeks   |
| male_feed_gpd           | FLOAT  | g/day   |
| female_feed_gpd         | FLOAT  | g/day   |
| avg_feed_per_female_g   | FLOAT  | g       |
| depletion_pct_week      | FLOAT  | %       |
| depletion_pct_cum       | FLOAT  | %       |
| livability_pct          | FLOAT  | %       |
| he_per_bird             | FLOAT  | HE/W/B  |
| hhhe_cum                | FLOAT  | Cumulative |

### D. forecast_monthly (1.KBF-Forecaste)
| Field               | Type   | Unit    |
|---------------------|--------|---------|
| month               | DATE   | YYYY-MM |
| fy                  | TEXT   | FY26    |
| he_lac              | FLOAT  | Lacs    |
| hatchability_pct    | FLOAT  | %       |
| doc_lac             | FLOAT  | Lacs    |
| feed_tons           | FLOAT  | MT      |
| livability_pct      | FLOAT  | %       |

## Core Formulas
```
1. birds_on_hand_week[w] = birds_on_hand_week[w-1] * (1 - mortality_pct_week[w])
2. weekly_HE = birds_on_hand_week[w] * egg_rate_per_bird[w] 
3. HHHE_cum[w] = HHHE_cum[w-1] + egg_rate_per_bird[w]
4. DOC_week = weekly_HE * (hatchability_pct / 100)
5. feed_growing_kg = Σ (birds_on_hand_day * feed_growing_g_per_day) / 1000
6. feed_laying_kg = Σ (birds_on_hand_day * feed_laying_g_per_day) / 1000
```

## Pipeline Steps
1. **Load Standards**: Import standards_lirm with week-indexed parameters
2. **Expand Placements**: Generate weekly records per placement (age = week index)
3. **Phase Detection**:
   - Weeks < lay_date: Growing phase
   - lay_date ≤ weeks ≤ cull_date: Laying phase
4. **Weekly Calculations**: Apply standards to derive HE, DOC, and feed metrics
5. **Temporal Aggregation**: Sum weekly values into monthly/FY buckets
6. **Variance Analysis**: Compare actuals vs forecast when available

## Edge Cases
- **Sexing Errors**: Additive depletion_pct_week applied when provided
- **Mid-cycle Imports**: Source flag changes without formula impact
- **Closed Houses**: Zero contribution post-cull_date
- **Sanitation Buffer**: ready_date must be ≥ cull_date + 2 weeks (configurable)

## API Endpoints
| Method | Path                   | Description                  |
|--------|------------------------|------------------------------|
| POST   | /standards/import      | Upsert breed standards       |
| POST   | /placements/import     | Manage placement schedules   |
| POST   | /actuals/import        | Update weekly metrics        |
| GET    | /forecast?fy=FY26..FY30| Retrieve forecast range      |
| GET    | /variance?fy=FY26      | Get actual vs forecast deltas|

## UI Views
- **Placement Scheduler**: Gantt chart with house timelines
- **Standards Editor**: Tabular week parameter management
- **Forecast Dashboard**: Key metrics with export capabilities
- **Variance View**: Fiscal year performance analysis

## Acceptance Criteria
1. Sample FY forecast matches Excel within ±0.1%
2. HHHE curve shows 181 at week 64 (Hubbard EP)
3. Free periods visible post-ready_date

## Sample Test Case
```markdown
**Input:**
- Placement: in_date=2025-01-01, ps_qty=10,000
- Standards: Week 1-6 egg_rate=0.82, mortality=0.2%
- Actuals: Week 1 depletion=0.1%

**Expected Output:**
Week | Birds | HE     | HHHE
1    | 9980  | 8,184  | 8,184
2    | 9960  | 8,167  | 16,351
```

## TODO/Gaps
1. Confirm monthly hatchability override mechanism
2. Verify FY definition (April-March vs calendar year)
3. Clarify pro-rating method for cross-month weeks
4. Map client sheet columns to schema fields
5. Validate sanitation buffer configuration

## Assumptions
- Default hatchability = 86% unless overridden
- Cycle length = 71 weeks unless placement specifies
- Weekly calculations use daily interpolation
- All dates use ISO 8601 format (YYYY-MM-DD)
