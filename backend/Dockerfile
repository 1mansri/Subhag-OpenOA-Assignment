# ── Stage 1: Build — Clone repo, patch source, install only needed deps ──
FROM python:3.10-slim AS builder

RUN apt-get update && \
    apt-get install -y --no-install-recommends git unzip && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Shallow clone (skip full git history)
RUN git clone --depth 1 https://github.com/NatLabRockies/OpenOA.git OpenOA_Repo

# Extract dataset
RUN unzip OpenOA_Repo/examples/data/la_haute_borne.zip \
    -d OpenOA_Repo/examples/data/la_haute_borne/

# Remove .git directory and the ZIP (no longer needed)
RUN rm -rf OpenOA_Repo/.git \
    OpenOA_Repo/examples/data/la_haute_borne.zip

# ── Patch OpenOA source to lazy-import unused heavy deps ──
# This lets us skip installing bokeh (~80MB), IPython (~30MB), ipywidgets (~20MB), eia-python
COPY patch_openoa.py .
RUN python patch_openoa.py OpenOA_Repo/openoa

# ── Install dependencies ──
WORKDIR /app

# Install ONLY the dependencies actually used by our code paths
# Core scientific stack (required by MonteCarloAEP and other analysis modules):
#   numpy, pandas, scipy, scikit-learn, statsmodels, matplotlib, pygam, attrs, tqdm
# Data/schema deps (required by PlantData):
#   pyproj, shapely, tabulate, pytz, pyyaml
# Server:
#   fastapi, uvicorn, python-multipart
#
# EXCLUDED (patched out): bokeh, ipython, ipywidgets, eia-python
# EXCLUDED (never needed): jupyterlab, xarray, netcdf4, h5py, h5pyd, cdsapi
RUN pip install --no-cache-dir --default-timeout=1000 \
    "numpy>=1.24" \
    "pandas>=2.2,<3" \
    "scipy>=1.7" \
    "scikit-learn>=1.0,<1.7" \
    "statsmodels>=0.13.3" \
    "matplotlib>=3.6" \
    "pygam>=0.11.0" \
    "attrs>=22.2" \
    "tqdm>=4.28.1" \
    "pyproj>=3.5" \
    "shapely>=1.8" \
    "tabulate" \
    "pytz" \
    "pyyaml" \
    "fastapi" \
    "uvicorn" \
    "python-multipart"



# ── Stage 2: Runtime — Copy only what's needed ──
FROM python:3.10-slim AS runner

WORKDIR /app

# Copy installed Python packages from builder
COPY --from=builder /usr/local/lib/python3.10/site-packages /usr/local/lib/python3.10/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# Copy the patched OpenOA source package directly (bypassing pip install)
# This ensures we get the exact patched source without build issues
COPY --from=builder /app/OpenOA_Repo/openoa /app/openoa

# Copy the example data scripts and data
COPY --from=builder /app/OpenOA_Repo/examples /app/OpenOA_Repo/examples

COPY --from=builder /app/OpenOA_Repo/pyproject.toml /app/OpenOA_Repo/pyproject.toml

# Copy our application code
COPY main.py .
COPY requirements.txt .

# Render uses port 10000 by default
ENV PORT=10000
EXPOSE 10000

# Trust Render proxy headers
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-10000} --forwarded-allow-ips '*'"]