# SUBHAG — Wind Energy Analysis Dashboard

A full-stack application for wind energy analysis using the **OpenOA** (Open Operational Assessment) library. It runs Monte Carlo AEP (Annual Energy Production) simulations on the **La Haute Borne** wind farm dataset and visualizes the results through an interactive dashboard.

| Layer    | Stack                                | Port   |
| -------- | ------------------------------------ | ------ |
| Frontend | Next.js 16, React 19, Recharts, pnpm | `3000` |
| Backend  | FastAPI, Uvicorn, OpenOA, Matplotlib | `8000` |

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Run Locally (without Docker)](#run-locally-without-docker)
- [Run with Docker](#run-with-docker)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [OpenOA Library — How It Works](#openoa-library--how-it-works)

---

## Prerequisites

| Tool    | Version  | Required For |
| ------- | -------- | ------------ |
| Node.js | ≥ 20     | Frontend     |
| pnpm    | ≥ 9      | Frontend     |
| Python  | ≥ 3.10   | Backend      |
| Docker  | ≥ 24     | Docker setup |
| Git     | Any      | Both         |

---

## Run Locally (without Docker)

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd SUBHAG
```

### 2. Backend

```bash
# Navigate to backend
cd backend

# (Recommended) Create a virtual environment
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the automated setup script
# (Clones OpenOA repo, extracts dataset, installs OpenOA — works on all platforms)
python setup_data.py

# Start the server
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

The backend will be available at **http://localhost:8000**.

> [!NOTE]
> If OpenOA or its data is not available, the backend automatically falls back to **Simulation Mode** and generates synthetic results.

### 3. Frontend

```bash
# Navigate to frontend (from project root)
cd frontend

# Install dependencies
pnpm install

# Create .env file (if not already present)
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env

# Start the dev server
pnpm dev
```

The frontend will be available at **http://localhost:3000**.

---

## Run with Docker

### Build & Run Backend

```bash
cd backend
docker build -t subhag-backend .
docker run -d -p 10000:10000 --name subhag-backend subhag-backend
```

> The backend Dockerfile uses a **multi-stage build** with shallow git clone, `.git` removal, and `--no-cache-dir` to minimize the final image size.

### Build & Run Frontend

```bash
cd frontend
docker build -t subhag-frontend .
docker run -d -p 3000:3000 --name subhag-frontend subhag-frontend
```

### Run Both Together (quick commands)

```bash
# From project root — build both
docker build -t subhag-backend ./backend
docker build -t subhag-frontend ./frontend

# Run both
docker run -d -p 10000:10000 --name subhag-backend subhag-backend
docker run -d -p 3000:3000 --name subhag-frontend subhag-frontend
```

### Stop & Remove Containers

```bash
docker stop subhag-backend subhag-frontend
docker rm subhag-backend subhag-frontend
```

### Viewing Logs

If you run with `-d` (detached), you can view logs with:
```bash
docker logs -f subhag-backend
```

To run in the foreground (to see logs immediately):
```bash
# Backend
docker run -p 10000:10000 --name subhag-backend subhag-backend

# Frontend
docker run -p 3000:3000 --name subhag-frontend subhag-frontend
```

> [!TIP]
> The backend Docker image uses a **source-bundle build** that patches OpenOA to separate it from heavy unused dependencies (bokeh, ipython, jupyterlab). The final image is **~600–750 MB** — suitable for free-tier platforms like Render.

---

## Environment Variables

### Frontend (`frontend/.env`)

| Variable              | Default                  | Description                  |
| --------------------- | ------------------------ | ---------------------------- |
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000`  | Backend API base URL         |

### Backend

No `.env` file is required. Configuration is handled through the Dockerfile and the OpenOA data path constants in `main.py`.

---

## Deploy to Render (Free Tier)

This backend is optimized to run on **Render's Free Tier** (512 MB RAM, < 1GB image).

1. Push this repo to GitHub.
2. Go to [render.com](https://render.com) → **New** → **Web Service**.
3. Connect your GitHub repo and select the **backend** directory.
4. Settings:
   - **Root Directory**: `backend`
   - **Runtime**: Docker
   - **Instance Type**: Free
5. Render will auto-detect the `Dockerfile` and build the image.
6. Set the frontend's `NEXT_PUBLIC_API_URL` to the Render-provided URL.

> [!NOTE]
> The backend uses a **source-bundle approach** (patches OpenOA to skip heavy unused deps like bokeh/jupyter) to keep the image size under 800 MB. The analysis runs "live" (using `num_sim=5`) to stay within the 512 MB RAM limit.



---

## Project Structure

```
SUBHAG/
├── README.md                    # This file
├── backend/
│   ├── Dockerfile               # Multi-stage optimized build
│   ├── .dockerignore
│   ├── .gitignore
│   ├── main.py                  # FastAPI server with OpenOA analysis
│   ├── setup_data.py            # Automated data setup script
│   └── requirements.txt         # Python dependencies
└── frontend/
    ├── Dockerfile               # Multi-stage Next.js build
    ├── .dockerignore
    ├── .gitignore
    ├── .env                     # API URL configuration
    ├── package.json
    ├── next.config.ts           # standalone output for Docker
    ├── app/                     # Next.js app router pages
    └── components/
        ├── analysis-dashboard.tsx   # Main dashboard (data fetching)
        ├── section-cards.tsx        # Summary metric cards
        └── charts/                  # Recharts visualizations
            ├── power-curve-chart.tsx
            ├── monthly-production-chart.tsx
            ├── aep-distribution-chart.tsx
            └── turbine-comparison-chart.tsx
```

---

## OpenOA Library — How It Works

### What is OpenOA?

[OpenOA](https://github.com/NREL/OpenOA) (Open Operational Assessment) is an open-source Python library developed by the **National Renewable Energy Laboratory (NREL)**. It provides a standardized framework for assessing the performance of operational wind farms.

This project uses a community fork at `https://github.com/NatLabRockies/OpenOA` which includes the **La Haute Borne** sample dataset.

### How Data is Fetched

The data pipeline works in three stages:

1. **Data Source**: The La Haute Borne wind farm SCADA dataset is bundled as a ZIP file inside the OpenOA repo at `examples/data/la_haute_borne.zip`. The Dockerfile unzips it during the image build.

2. **Data Loading**: The backend uses the official `project_ENGIE.prepare()` function (from the OpenOA repo's `examples/project_ENGIE.py`) to load and clean the raw CSV data into OpenOA's `PlantData` object:
   ```python
   plant = project_ENGIE.prepare(
       path=DATA_PATH,
       return_value="plantdata",
       use_cleansed=False,
   )
   ```
   This creates a structured object containing:
   - **SCADA data**: 10-minute interval turbine readings (wind speed, power output, etc.)
   - **Asset metadata**: Turbine specifications (rated power, location, etc.)

3. **Analysis**: The `MonteCarloAEP` analysis is run on the `PlantData`:
   ```python
   analysis = MonteCarloAEP(plant)
   analysis.run(num_sim=20)
   ```
   This performs 20 Monte Carlo simulations to estimate the Annual Energy Production with uncertainty bounds.

### How Data is Displayed

The backend extracts four data streams from the analysis results and sends them to the frontend as JSON:

| Chart                    | Data Source                             | Frontend Component                 |
| ------------------------ | --------------------------------------- | ---------------------------------- |
| **Power Curve**          | SCADA wind speed vs. power output, binned at 0.5 m/s intervals | `PowerCurveChart` (line chart)     |
| **Monthly Production**   | SCADA energy output aggregated by month | `MonthlyProductionChart` (bar chart) |
| **AEP Distribution**     | Histogram of Monte Carlo AEP samples    | `AEPDistributionChart` (bar chart) |
| **Turbine Comparison**   | Per-turbine capacity factor & availability | `TurbineComparisonChart` (bar chart) |

Additionally, a **matplotlib plot** is rendered server-side, encoded as a base64 PNG, and displayed in the "Backend Plot Output" card.

### Edge Cases & Fallbacks

The backend is designed to be resilient. Here are the edge cases it handles:

1. **OpenOA Not Installed** (`HAS_OPENOA = False`):
   - If the `openoa` package cannot be imported (e.g., running locally without installing it), the app detects this at startup and prints a warning.
   - All `/analyze` requests fall back to **Simulation Mode**, returning synthetic data.

2. **Dataset Not Found** (`HAS_DATA = False`):
   - If the data directory (`examples/data/la_haute_borne/`) does not exist (e.g., ZIP not extracted), the app falls back to simulation.

3. **ENGIE Loader Missing** (`HAS_ENGIE = False`):
   - If `project_ENGIE.py` cannot be imported from the OpenOA repo's `examples/` directory, simulation mode is used.

4. **Analysis Runtime Failure**:
   - If `MonteCarloAEP.run()` or data extraction throws any exception, it is caught, logged with a traceback, and the response falls back to `run_simulation_fallback()` with the error message included in `debug_note`.

5. **NaN / Infinity in Results**:
   - Scientific computations can produce `NaN` or `Inf` values which break JSON serialization. The `sanitize_floats()` function recursively walks the entire response and replaces any `NaN`/`Inf` with `0`.

6. **Missing SCADA Columns**:
   - Column names vary between datasets. The backend dynamically searches for columns containing keywords like `ws`, `windspeed`, `p_avg`, `wtur_w`, `power`, `energy`, `time`, `date` — rather than hardcoding column names.
   - If a required column is not found, that specific chart section (e.g., power curve) is returned as an empty array and the frontend conditionally hides the chart.

7. **Frontend Disconnected**:
   - The frontend performs a health check to `GET /` every 30 seconds. If the backend is unreachable, the connection status badge shows "Disconnected" and an error card is displayed when analysis is attempted.
   - Chart components are conditionally rendered only when `data.chart_data?.power_curve?.length > 0`, preventing crashes on empty arrays.

8. **Simulation Mode Indicator**:
   - When simulation data is returned, the response includes `"mode": "SIMULATION_FALLBACK"` and the `debug_note` field, which the frontend displays as a warning banner so users know they are viewing synthetic data.
