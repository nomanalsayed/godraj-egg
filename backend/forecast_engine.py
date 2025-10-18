import pandas as pd
import numpy as np
from typing import Optional

def parse_standards_lirm(file_path: str) -> pd.DataFrame:
    """Parse standards_lirm CSV with phase detection"""
    df = pd.read_csv(file_path)
    
    # Handle column naming variations
    if 'week_no' in df.columns:
        df = df.rename(columns={'week_no': 'week'})
    elif 'Week' in df.columns:
        df = df.rename(columns={'Week': 'week'})
    
    # Validate required week column
    if 'week' not in df.columns:
        raise ValueError("Standards CSV missing week column. Expected 'week_no' or 'Week'")
    
    df['week'] = df['week'].astype(int)
    df = df.set_index('week')
    
    # Validate required metrics columns
    required_columns = ['mortality_pct_week', 'egg_rate_per_bird', 
                       'cumulative_hhhe', 'feed_growing_g_per_day',
                       'feed_laying_g_per_day']
    missing = [col for col in required_columns if col not in df.columns]
    if missing:
        raise ValueError(f"Missing required columns in standards data: {missing}")
    
    return df

def parse_placements(file_path: str) -> pd.DataFrame:
    """Parse placements CSV and prepare for expansion"""
    df = pd.read_csv(file_path)
    df['placement_date'] = pd.to_datetime(df['in_date'])
    df['lay_date'] = pd.to_datetime(df['lay_date'])
    df['lay_week'] = ((df['lay_date'] - df['placement_date']).dt.days // 7).astype(int)
    return df

def calculate_variance(forecast: dict, actuals: pd.DataFrame) -> dict:
    """Calculate variance between forecast and actuals"""
    variance = []
    for f in forecast['forecast']:
        week = f['week']
        if week in actuals.index:
            actual = actuals.loc[week]
            variance.append({
                "week": week,
                "he_forecast": f['he'],
                "he_actual": actual['he'],
                "he_variance": actual['he'] - f['he'],
                "doc_forecast": f['doc'],
                "doc_actual": actual.get('doc', 0),
                "doc_variance": actual.get('doc', 0) - f['doc'],
                "livability": f['livability'],
                "hhhe_cum": f['hhhe_cum']
            })
    return {
        "variance": variance,
        "summary": {
            "total_he_variance": sum(v['he_variance'] for v in variance),
            "total_doc_variance": sum(v['doc_variance'] for v in variance)
        }
    }

def calculate_forecast(standards: pd.DataFrame, placements: pd.DataFrame, actuals: Optional[pd.DataFrame] = None, hatchability: float = 86.0) -> dict:
    """Calculate multi-week forecast with weekly dependencies"""
    # Validate hatchability percentage
    if not 0 <= hatchability <= 100:
        raise ValueError("Hatchability must be between 0 and 100")
        
    # Create weekly index for 71 week cycle
    weeks = pd.RangeIndex(start=1, stop=72, name='week')
    
    # Merge standards with weekly index to ensure full coverage
    standards = standards.reindex(weeks).ffill()
    
    # Initialize DataFrame for calculations
    df = pd.DataFrame(index=weeks)
    df = df.join(standards, rsuffix='_std')
    
    # Calculate birds_on_hand with vectorized mortality calculation
    initial_birds = placements['actual_qty'].sum()
    df['birds_on_hand'] = initial_birds * (1 - df['mortality_pct_week']/100).cumprod()
    
    # Vectorized calculations
    df['weekly_HE'] = df['birds_on_hand'] * df['egg_rate_per_bird']
    df['HHHE_cum'] = df['weekly_HE'].cumsum()
    df['DOC_week'] = df['weekly_HE'] * (hatchability / 100)
    
    # Calculate lay week thresholds for all placements
    lay_weeks = placements['lay_week'].unique()
    feed_conditions = [df.index >= lay_week for lay_week in lay_weeks]
    feed_choices = [df['birds_on_hand'] * df['feed_laying_g_per_day'] / 1000] * len(lay_weeks)
    df['feed_kg'] = np.select(feed_conditions, feed_choices, 
                            default=df['birds_on_hand'] * df['feed_growing_g_per_day'] / 1000)
    
    # Generate forecast data
    forecasts = [{
        "week": week,
        "he": round(row['weekly_HE']),
        "doc": round(row['DOC_week']),
        "feed_kg": round(row['feed_kg']),
        "hhhe_cum": round(row['HHHE_cum']),
        "livability": round(row['birds_on_hand'] / initial_birds * 100, 1)
    } for week, row in df.iterrows()]

    # Calculate variance if actuals exist
    variance = []
    if actuals is not None:
        variance = [{
            "week": f["week"],
            "variance_he": round(actuals.loc[f["week"], "he"] - f["he"], 2),
            "variance_feed": round(actuals.loc[f["week"], "feed_kg"] - f["feed_kg"], 2)
        } for f in forecasts if f["week"] in actuals.index]
    
    # Generate output using vectorized calculations
    result = {
        "forecast": forecasts,
        "summary": {
            "total_he": round(df['weekly_HE'].sum(), 1),
            "total_doc": round(df['DOC_week'].sum(), 1),
            "avg_hatchability": hatchability,
            "total_feed": round(df['feed_kg'].sum(), 1)
        }
    }
    
    if variance:
        result["variance"] = variance
        result["summary"].update({
            "total_variance_he": round(sum(v['variance_he'] for v in variance), 2),
            "total_variance_feed": round(sum(v['variance_feed'] for v in variance), 2)
        })
    
    return result

def save_forecast_output(result: dict, output_dir: str = "samples"):
    """Save forecast results to CSV files"""
    os.makedirs(output_dir, exist_ok=True)
    
    # Enhance forecast data with required fields
    forecast_df = pd.DataFrame(result['forecast'])
    forecast_df['week_no'] = forecast_df['week']
    forecast_df['livability'] = forecast_df.apply(
        lambda x: round(x['he'] / x['doc'], 2) if x['doc'] > 0 else 0.0, 
        axis=1
    )
    forecast_df['hhhe_cum'] = forecast_df['doc'].cumsum()
    
    # Select and order columns to match frontend requirements
    forecast_df = forecast_df[[
        'week_no', 'he', 'doc', 'feed_kg', 'livability', 'hhhe_cum'
    ]]
    
    # Save to CSV with FY26 suffix
    forecast_df.to_csv(
        f"{output_dir}/forecast_FY26.csv",
        index=False,
        float_format="%.2f"
    )
    
    # Process variance data if exists
    if 'variance' in result:
        variance_df = pd.DataFrame(result['variance'])
        variance_df['week_no'] = variance_df['week']
        variance_df = variance_df[[
            'week_no', 'he_forecast', 'he_actual', 'he_variance',
            'doc_forecast', 'doc_actual', 'doc_variance'
        ]]
        
        variance_df.to_csv(
            f"{output_dir}/variance_FY26.csv",
            index=False,
            float_format="%.2f"
        )

def parse_weekly_actuals(file_path: Optional[str]) -> Optional[pd.DataFrame]:
    """Parse optional weekly_actuals CSV"""
    if not file_path:
        return None
    df = pd.read_csv(file_path)
    df['week'] = df['week'].astype(int)
    return df.set_index('week')
