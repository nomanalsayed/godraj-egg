# Fiscal Year Configuration Implementation

## Implementation Overview
Provides toggle between April-March and January-December fiscal year cycles through:
- Frontend settings interface
- Backend configuration flag (`fiscal_year_mode`)
- Modified aggregation logic in forecasting engine

## Core Components

### Frontend Changes
1. New fiscal year toggle in Settings panel
2. Date display formatting adjustments
3. Report header FY cycle indicators

### Backend Changes
```python
# forecast_engine.py
FISCAL_YEAR_MODE = os.getenv('FISCAL_YEAR_MODE', 'apr_mar')  # Default to April-March

def calculate_fy_range(date: datetime):
    if FISCAL_YEAR_MODE == 'jan_dec':
        return (date.replace(month=1, day=1), date.replace(month=12, day=31))
    else: 
        # Existing April-March logic
        if date.month >= 4:
            return (date.replace(month=4, day=1), date.replace(year=date.year+1, month=3, day=31))
        else:
            return (date.replace(year=date.year-1, month=4, day=1), date.replace(month=3, day=31))
```

### Validation Suite
1. Unit Tests
   - Boundary date assertions
   - Cross-FY aggregation checks
   
2. Integration Tests
   ```gherkin
   Scenario: FY toggle persistence
     Given I'm logged in as admin
     When I change fiscal year mode to "Jan-Dec"
     Then reports should display FY2026 as Jan 2026 - Dec 2026
   ```

3. Manual Verification Checklist
- [ ] All report totals match both FY modes
- [ ] Historical data maintains original FY context
- [ ] Export formats include FY mode metadata

## Migration Plan
1. Shadow mode running for 1 sprint
2. Dual calculation comparison
3. Full cutover after validation
