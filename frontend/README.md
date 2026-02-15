# SUBHAG — Frontend

Interactive dashboard for visualizing wind energy analysis results from the OpenOA backend.

**Stack**: Next.js 16 · React 19 · Recharts · Tailwind CSS v4 · Radix UI · pnpm

---

## Quick Start

```bash
# Install dependencies
pnpm install

# Create environment file
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env

# Start dev server
pnpm dev
```

Open **http://localhost:3000** in your browser.

> The backend must be running at port `8000` for analysis to work. Without it, the dashboard will show a "Backend Unavailable" message.

---

## Docker

```bash
# Build
docker build -t subhag-frontend .

# Run
docker run -d -p 3000:3000 --name subhag-frontend subhag-frontend
```

The Dockerfile uses a **multi-stage build** (deps → builder → runner) with Next.js `standalone` output for a minimal production image.

---

## Environment Variables

| Variable              | Default                 | Description          |
| --------------------- | ----------------------- | -------------------- |
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | Backend API base URL |

---

## Project Structure

```
frontend/
├── app/
│   ├── layout.tsx              # Root layout with sidebar
│   ├── page.tsx                # Home page
│   └── globals.css             # Global styles & theme tokens
├── components/
│   ├── analysis-dashboard.tsx  # Main dashboard — fetches data, manages state
│   ├── section-cards.tsx       # Summary metric cards (AEP, uncertainty, etc.)
│   ├── status-badge.tsx        # Connection status indicator
│   ├── app-sidebar.tsx         # Navigation sidebar
│   ├── site-header.tsx         # Top header bar
│   ├── theme-toggle.tsx        # Dark/Light mode toggle
│   ├── charts/
│   │   ├── power-curve-chart.tsx          # Wind speed vs power output
│   │   ├── monthly-production-chart.tsx   # Monthly energy bar chart
│   │   ├── aep-distribution-chart.tsx     # Monte Carlo AEP histogram
│   │   └── turbine-comparison-chart.tsx   # Per-turbine performance bars
│   └── ui/                     # Reusable UI primitives (shadcn/ui)
├── types/
│   └── api.ts                  # TypeScript types for API responses
├── hooks/                      # Custom React hooks
├── lib/                        # Utility functions
├── Dockerfile                  # Multi-stage production build
├── .dockerignore
├── .gitignore
├── next.config.ts              # standalone output enabled
├── package.json
└── tsconfig.json
```

---

## How It Works

1. On mount, `analysis-dashboard.tsx` performs a **health check** (`GET /`) to verify backend connectivity.
2. When the user clicks **"Run Analysis"**, a `POST /analyze` request is sent to the backend.
3. The response contains chart data arrays and a base64-encoded matplotlib plot.
4. Four Recharts components render the data:
   - **Power Curve** — wind speed vs actual/ideal power
   - **Monthly Production** — expected vs actual energy by month
   - **AEP Distribution** — Monte Carlo simulation histogram
   - **Turbine Comparison** — capacity factor & availability per turbine

Charts are **conditionally rendered** — if any data array is empty, that chart is hidden instead of crashing.

---

## Available Scripts

| Command      | Description                 |
| ------------ | --------------------------- |
| `pnpm dev`   | Start development server    |
| `pnpm build` | Create production build     |
| `pnpm start` | Serve production build      |
| `pnpm lint`  | Run ESLint                  |
