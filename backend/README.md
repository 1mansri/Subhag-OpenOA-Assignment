# SUBHAG — Backend

FastAPI server that runs wind energy analysis using the **OpenOA** library on the La Haute Borne wind farm dataset.

**Stack**: Python 3.10 · FastAPI · Uvicorn · OpenOA · Matplotlib · NumPy

---

## Quick Start (Local)

```bash
# Create & activate virtual environment
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# Install base dependencies
pip install -r requirements.txt

# Run the automated setup script (clones OpenOA repo + extracts dataset + installs OpenOA)
python setup_data.py

# Start the server
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Server will be live at **http://localhost:8000**.

### What `setup_data.py` Does

The script automates the full OpenOA setup (cross-platform — works on Windows, macOS, Linux):

1. **Shallow-clones** the [NatLabRockies/OpenOA](https://github.com/NatLabRockies/OpenOA) repo into `OpenOA_Repo/`
2. **Extracts** the La Haute Borne dataset ZIP using Python's `zipfile` (no `unzip` CLI needed)
3. **Installs** OpenOA with `[examples]` dependencies via pip

It is idempotent — running it again skips steps that are already done.

> [!NOTE]
> If OpenOA or its dataset are not set up, the server automatically runs in **Simulation Mode** — all endpoints still work but return synthetic data.

---

## Docker

```bash
# Build (multi-stage — final image is smaller)
docker build -t subhag-backend .

# Run
docker run -d -p 8000:8000 --name subhag-backend subhag-backend
```

### Docker Image Optimizations

The Dockerfile uses a **multi-stage build** to reduce the final image size:

| Optimization                    | Savings        |
| ------------------------------- | -------------- |
| Shallow git clone (`--depth 1`) | ~100 MB        |
| Remove `.git/` directory        | ~50 MB         |
| Remove source ZIP after extract | ~15 MB         |
| `--no-cache-dir` on pip install | ~200 MB        |
| Multi-stage: no git/unzip in runner | ~80 MB     |
| Single pip install layer        | Layer overhead |

---

## API Endpoints

### `GET /` — Health Check

```json
{
  "status": "Backend Active",
  "engine": "OpenOA",
  "library_installed": true,
  "data_available": true,
  "engie_loader": true
}
```

### `POST /analyze` — Run Analysis

Runs Monte Carlo AEP simulation on the La Haute Borne dataset.

**Request:**
```json
{ "plant_name": "La Haute Borne" }
```

**Response** (abbreviated):
```json
{
  "status": "success",
  "mode": "REAL_DATA",
  "aep_gwh": 14.25,
  "uncertainty": "4.5%",
  "plot_image": "data:image/png;base64,...",
  "chart_data": {
    "power_curve": [...],
    "monthly_production": [...],
    "aep_distribution": [...],
    "turbine_comparison": [...],
    "summary": { ... }
  }
}
```

When in simulation mode: `"mode": "SIMULATION_FALLBACK"` with `debug_note` explaining why.

---

## Project Structure

```
backend/
├── main.py              # FastAPI app — all routes and OpenOA logic
├── setup_data.py        # Automated data setup script
├── requirements.txt     # Python dependencies
├── Dockerfile           # Multi-stage optimized build
├── .dockerignore
├── .gitignore
└── OpenOA_Repo/         # (created by setup_data.py, gitignored)
```

---

## Edge Cases Handled

| Scenario | Behavior |
|----------|----------|
| OpenOA not installed | Falls back to simulation mode |
| Dataset not extracted | Falls back to simulation mode |
| `project_ENGIE.py` not importable | Falls back to simulation mode |
| `MonteCarloAEP` throws exception | Catches error, returns simulation |
| NaN/Inf in results | `sanitize_floats()` replaces with `0` |
| SCADA column names vary | Dynamic column detection via keyword matching |
| `analysis.plot()` fails | Falls back to manual histogram rendering |
