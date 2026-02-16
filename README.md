# SUBHAG — Wind Energy Analysis Dashboard 🌬️

A full-stack application for wind energy analysis using the **OpenOA** (Open Operational Assessment) library. It runs Monte Carlo AEP (Annual Energy Production) simulations on the **La Haute Borne** wind farm dataset and visualizes the results through an interactive dashboard.

**Live Demo:** [https://subhag-open-oa-assignment.vercel.app/](https://subhag-open-oa-assignment.vercel.app/)  
**Backend API:** [https://subhag-openoa-assignment.onrender.com](https://subhag-openoa-assignment.onrender.com)

| Layer | Stack | Port |
| :--- | :--- | :--- |
| **Frontend** | Next.js 16, React 19, Recharts, Tailwind CSS | `3000` |
| **Backend** | FastAPI, Uvicorn, OpenOA, Pandas, Matplotlib | `10000` |
| **Infrastructure** | Docker, Render (Backend), Vercel (Frontend) | - |

---

## ⚠️ Architectural Decision: Cloud Resource Optimization

**Why does the Live Demo use Pre-Computed Data?**

The OpenOA `MonteCarloAEP` simulation is computationally intensive, requiring the processing of years of high-frequency SCADA data. This process typically consumes **>1GB of RAM**, which exceeds the strict **512MB RAM limit** of the Render Free Tier.

To ensure stability and prevent Out-Of-Memory (OOM) crashes in the production environment, we implemented a **Pre-Computation Strategy**:
1.  **Production (Render):** Serves validated, pre-calculated analysis results derived from the La Haute Borne dataset. This ensures instant response times and zero server crashes.
2.  **Development (Local):** Runs the full, real-time Monte Carlo simulation logic.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Run Locally (Full Analysis Mode)](#run-locally-full-analysis-mode)
- [Run with Docker](#run-with-docker)
- [Project Structure](#project-structure)
- [OpenOA Library — How It Works](#openoa-library--how-it-works)

---

## Prerequisites

| Tool | Version | Required For |
| :--- | :--- | :--- |
| Node.js | ≥ 20 | Frontend |
| pnpm | ≥ 9 | Frontend |
| Python | ≥ 3.10 | Backend |
| Docker | ≥ 24 | Containerization |
| Git | Any | Version Control |

---

## Run Locally (Full Analysis Mode)

Running locally allows you to witness the **actual OpenOA library** performing live calculations on your machine.

### 1. Clone the repository

```bash
git clone [https://github.com/1mansri/Subhag-OpenOA-Assignment](https://github.com/1mansri/Subhag-OpenOA-Assignment)
cd Subhag-OpenOA-Assignment

```

### 2. Backend Setup

```bash
# Navigate to backend
cd backend

# Create and activate virtual environment
python -m venv venv
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the automated setup script
# (Clones OpenOA repo, extracts dataset, installs OpenOA)
python setup_data.py

# Start the server
uvicorn main:app --host 0.0.0.0 --port 10000 --reload

```

The backend will be available at **http://localhost:10000**.

> [!NOTE]
> If the OpenOA library or data is missing, the system will automatically fall back to **Simulation Mode** (synthetic data) to prevent crashes.

### 3. Frontend Setup

```bash
# Navigate to frontend (from project root)
cd frontend

# Install dependencies
pnpm install

# Create .env file
echo "NEXT_PUBLIC_API_URL=http://localhost:10000" > .env

# Start the dev server
pnpm dev

```

The frontend will be available at **http://localhost:3000**.

---

## Run with Docker

### Option A: Run Both (Quick Start)

```bash
# From project root
docker build -t subhag-backend ./backend
docker build -t subhag-frontend ./frontend

docker run -d -p 10000:10000 --name subhag-backend subhag-backend
docker run -d -p 3000:3000 --name subhag-frontend subhag-frontend

```

### Option B: Backend Optimization Details

The backend Dockerfile uses a **multi-stage build** to optimize for size:

1. **Builder Stage:** Installs full OpenOA stack (numpy, pandas, etc.) and performs the heavy installation.
2. **Runner Stage:** Copies only the necessary artifacts.
3. **Result:** Final image size is reduced from >2GB to **~750MB**, making it suitable for free-tier deployments.

To view logs:

```bash
docker logs -f subhag-backend

```

---

## Project Structure

```
SUBHAG/
├── README.md                    # Documentation
├── backend/
│   ├── Dockerfile               # Multi-stage optimized build
│   ├── main.py                  # FastAPI server & Analysis Logic
│   ├── setup_data.py            # Automated data setup script
│   ├── requirements.txt         # Python dependencies
│   └── data/                    # (Generated) Local storage for OpenOA data
└── frontend/
    ├── Dockerfile               # Next.js build
    ├── app/                     # Next.js App Router
    └── components/
        ├── analysis-dashboard.tsx   # Main Interface
        └── charts/                  # Recharts Visualizations

```

---

## OpenOA Library — How It Works

### What is OpenOA?

[OpenOA](https://github.com/NREL/OpenOA) (Open Operational Assessment) is an open-source Python library developed by **NREL**. It provides a standardized framework for assessing wind farm performance.

### The Data Pipeline (Local/Live Mode)

When running locally, the application executes the full scientific pipeline:

1. **Data Ingestion**: The backend extracts the **La Haute Borne** SCADA dataset (bundled as a ZIP in the OpenOA repo).
2. **Data Cleaning**: It uses `project_ENGIE.prepare()` to clean and normalize raw 10-minute interval turbine readings.
3. **Monte Carlo Simulation**:
```python
# Actual code running in backend/main.py (Local Mode)
analysis = MonteCarloAEP(plant)
analysis.run(num_sim=20)

```


This performs 20 iterations of Monte Carlo simulations to calculate the P50 AEP (Annual Energy Production) and uncertainty bounds.

### Edge Case Handling

The system is designed for resilience across different environments:

| Scenario | System Behavior |
| --- | --- |
| **Local / High RAM** | Runs full **Live Analysis** using OpenOA. |
| **Cloud / Low RAM** | Serves **Pre-Computed** validated results to avoid OOM kills. |
| **Missing Library** | Falls back to **Simulation Mode** (Synthetic Data) with a warning. |
| **Backend Offline** | Frontend shows "Disconnected" badge and disables analysis. |

---

### Deployment

To deploy on **Render (Free Tier)**:

1. Connect your GitHub repo.
2. Select **Docker** Runtime.
3. The `Dockerfile` automatically detects the environment and ensures the lightweight server is built.
4. Set `NEXT_PUBLIC_API_URL` in your Vercel/Frontend project to the Render backend URL.
