# PolarTwin — Frontend

Next.js frontend for the PolarTwin Digital Twin system for Indian Antarctic Stations (Maitri & Bharati).

## Stack
- **Next.js 15** + **TypeScript**
- **Three.js / React Three Fiber** — 3D digital twin visualisation
- **Recharts** — real-time telemetry charts
- **Zustand** — global state management
- **Tailwind CSS**

## Project Structure
```
frontend/
  app/          Next.js App Router pages
  components/   Reusable UI components
  lib/          API clients & utilities
  store/        Zustand state stores
  models/       3D assets (GLTF/GLB)
```

## Quick Start (Local)

```bash
cd frontend

# Install dependencies
npm install

# Copy env file and fill in your backend URL
cp ../.env.example .env.local

# Start dev server
npm run dev
```

App will be available at `http://localhost:3000`

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend REST API base URL |
| `NEXT_PUBLIC_WS_URL` | Backend WebSocket base URL |

## Deployment (Vercel)

1. Import this repo into [Vercel](https://vercel.com)
2. Set **Root Directory** to `frontend`
3. Add the environment variables from `.env.example`
4. Deploy — Vercel auto-detects Next.js and builds it
