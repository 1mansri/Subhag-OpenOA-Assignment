# ── Stage 1: Build — Clone repo, extract data, install deps ──
FROM python:3.10-slim AS builder

RUN apt-get update && \
    apt-get install -y --no-install-recommends git unzip && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Shallow clone (skip full git history — saves ~100 MB)
RUN git clone --depth 1 https://github.com/NatLabRockies/OpenOA.git OpenOA_Repo

# Extract dataset
RUN unzip OpenOA_Repo/examples/data/la_haute_borne.zip \
    -d OpenOA_Repo/examples/data/la_haute_borne/

# Remove .git directory and the ZIP (no longer needed)
RUN rm -rf OpenOA_Repo/.git \
    OpenOA_Repo/examples/data/la_haute_borne.zip

# Install OpenOA + example deps + server deps in one layer
# usage of -e is replaced by standard install to ensure files are in site-packages correctly
WORKDIR /app/OpenOA_Repo
RUN pip install --no-cache-dir --default-timeout=1000 \
    ".[examples]" 

WORKDIR /app
RUN pip install --no-cache-dir --default-timeout=1000 \
    fastapi uvicorn

# ── Stage 2: Runtime — Copy only what's needed ──
FROM python:3.10-slim AS runner

WORKDIR /app

# Copy installed Python packages from builder
COPY --from=builder /usr/local/lib/python3.10/site-packages /usr/local/lib/python3.10/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# Copy the OpenOA repo (data + examples scripts only — no .git)
# We need examples/project_ENGIE.py and examples/data
COPY --from=builder /app/OpenOA_Repo/examples /app/OpenOA_Repo/examples
# We don't need to copy 'openoa' folder if it was installed via pip install .
# But let's keep the structure expected by main.py just in case data paths rely on it.
COPY --from=builder /app/OpenOA_Repo/pyproject.toml /app/OpenOA_Repo/pyproject.toml

# Copy our application code
COPY main.py .
COPY requirements.txt .

# Render uses port 10000 by default
ENV PORT=10000
EXPOSE 10000

# Added --forwarded-allow-ips '*' to trust Render proxy headers
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-10000} --forwarded-allow-ips '*'"]