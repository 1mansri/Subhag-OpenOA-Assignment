
import json
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalysisRequest(BaseModel):
    plant_name: str = "La Haute Borne"

# Load the pre-computed results
RESULTS_FILE = "results.json"
try:
    with open(RESULTS_FILE, "r") as f:
        PRE_COMPUTED_RESULTS = json.load(f)
    print(f"✅ Loaded pre-computed results from {RESULTS_FILE}")
except Exception as e:
    print(f"❌ Failed to load results.json: {e}")
    # Fallback structure to prevent crash
    PRE_COMPUTED_RESULTS = {
        "status": "error",
        "error": "Pre-computed results not found on server.",
        "mode": "ERROR_FALLBACK"
    }

@app.get("/")
def health_check():
    return {
        "status": "Backend Active (Static Mode)",
        "engine": "OpenOA (Pre-computed)",
        "library_installed": False,  # True runtime OpenOA is absent
        "data_available": True,      # Results are available
        "engie_loader": False,
    }

@app.post("/analyze")
def run_analysis(request: AnalysisRequest):
    """
    Returns the pre-computed OpenOA analysis results.
    The heavy Monte Carlo simulation was run during the Docker build process.
    """
    return PRE_COMPUTED_RESULTS
