from fastapi import FastAPI, UploadFile, File, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from typing import List
from functools import wraps
from fastapi.responses import JSONResponse
import pandas as pd
from backend.forecast_engine import (
    parse_standards_lirm,
    parse_placements,
    parse_weekly_actuals,
    calculate_forecast,
    save_forecast_output,
    calculate_variance
)
from backend.sap_parser import parse_sap_file, reconcile_with_variance, SAPFormatError
import os
from tempfile import NamedTemporaryFile

# Auth models and utilities
class User(BaseModel):
    username: str
    roles: List[str] = ["viewer"]
    disabled: bool = False

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def role_required(required_roles: List[str]):
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # In a real implementation, decode JWT and verify roles
            # For now using placeholder user based on token
            user = get_current_user(oauth2_scheme)
            if not any(role in user.roles for role in required_roles):
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Insufficient permissions"
                )
            return await func(*args, **kwargs)
        return wrapper
    return decorator

async def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    # Placeholder implementation - in real system would decode JWT
    return User(
        username="devuser",
        roles=["admin"]  # Default to admin for development
    )

app = FastAPI()

def save_uploaded_file(file: UploadFile, filename: str) -> str:
    """Save uploaded file to temporary location"""
    temp_dir = "temp_uploads"
    os.makedirs(temp_dir, exist_ok=True)
    file_path = os.path.join(temp_dir, filename)
    
    with open(file_path, "wb") as f:
        f.write(file.file.read())
    
    return file_path

@app.get("/forecast")
@role_required(["viewer", "planner", "admin"])
async def get_forecast():
    try:
        # Read from fixed file paths
        standards = parse_standards_lirm("samples/standards_lirm.csv")
        placements = parse_placements("samples/placements.csv")
        actuals = parse_weekly_actuals("samples/weekly_actuals.csv")

        # Calculate forecast
        forecast_data = calculate_forecast(standards, placements, actuals)
        save_forecast_output(forecast_data)
        
        return JSONResponse(content=forecast_data)
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": f"Forecast error: {str(e)}"}
        )

@app.post("/variance")
@role_required(["planner", "admin"]) 
async def calculate_variance_endpoint(
    actuals_file: UploadFile = File(...), 
    hatchability: float = 86.0
):
    try:
        # Save uploaded actuals file
        actuals_path = save_uploaded_file(actuals_file, "weekly_actuals.csv")
        
        standards = parse_standards_lirm("samples/standards_lirm.csv")
        placements = parse_placements("samples/placements.csv")
        actuals = parse_weekly_actuals(actuals_path)
        
        # Calculate with user-provided hatchability
        forecast = calculate_forecast(standards, placements, actuals, hatchability)
        variance_data = calculate_variance(forecast, actuals)
        
        # Generate output files
        save_forecast_output(forecast)
        
        return JSONResponse(content={
            "variance": variance_data,
            "output_files": {
                "forecast": "samples/forecast_FY26.csv",
                "variance": "samples/variance_FY26.csv"
            }
        })
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": f"Variance calculation failed: {str(e)}"}
        )

@app.post("/api/sap/upload")
@role_required(["planner", "admin"])
async def sap_upload(file: UploadFile = File(...)):
    try:
        file_path = save_uploaded_file(file, file.filename)
        parsed_data = parse_sap_file(file_path)
        reconcile_with_variance(parsed_data)
        return {"status": "success", "processed_records": len(parsed_data)}
    except SAPFormatError as e:
        return JSONResponse(
            status_code=400,
            content={"error": f"SAP format error: {str(e)}"}
        )
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": f"Processing failed: {str(e)}"}
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
