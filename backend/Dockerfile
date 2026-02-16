# ── Stage 1: Builder (Heavy Analysis) ──
FROM python:3.10-slim AS builder

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends git unzip

WORKDIR /app

# Clone OpenOA repo (depth 1 to save space)
RUN git clone --depth 1 https://github.com/NatLabRockies/OpenOA.git OpenOA_Repo

# Extract the example dataset
WORKDIR /app/OpenOA_Repo/examples/data
RUN unzip la_haute_borne.zip -d la_haute_borne && rm la_haute_borne.zip

# Remove .git directory to save space
WORKDIR /app
RUN rm -rf OpenOA_Repo/.git

# Copy patching script
COPY patch_openoa.py .
RUN python patch_openoa.py OpenOA_Repo/openoa

# Install heavy dependencies needed for build-time analysis
# We need numpy, pandas, scipy, sklearn, statsmodels, matplotlib, pygam, etc.
WORKDIR /app
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
    "pyyaml"

# Copy source code for analysis
# We manually copy OpenOA source so it can be imported
ENV PYTHONPATH=/app/OpenOA_Repo
# Or rely on save_results.py adding it to path

# Copy the analysis script
COPY save_results.py .

# Run the analysis to generate results.json
# This might take a few minutes during build
RUN python save_results.py

# ── Stage 2: Runtime (Lightweight) ──
FROM python:3.10-slim AS runner

WORKDIR /app

# Install ONLY the lightweight web server dependencies
# No scientific libraries needed at runtime!
RUN pip install --no-cache-dir \
    "fastapi" \
    "uvicorn" \
    "python-multipart"

# Copy the pre-computed results
COPY --from=builder /app/results.json .

# Copy the lightweight main script (renamed to main.py)
COPY main_static.py main.py

# Expose port
EXPOSE 10000

# Run the server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "10000"]