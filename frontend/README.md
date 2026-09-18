# Frontend

React 19 + Vite + TypeScript SPA for Task Manager, styled with Tailwind CSS
and shadcn-style components.

## Run locally

```bash
npm install
npm run dev
```

Starts on `:5173` and calls the API at `http://localhost:8080/api` by
default (see the backend README to run it).

## Environment variables

| Variable | Purpose | Default |
|---|---|---|
| `VITE_API_URL` | Base URL of the backend API | `http://localhost:8080/api` |

Set it in a `.env.local` file (gitignored) for local overrides, or pass it
as a Docker build arg (`--build-arg VITE_API_URL=...`) for production
builds - Vite resolves `import.meta.env.*` at build time, not runtime.

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Dev server with HMR |
| `npm run build` | Type-check (`tsc -b`) then production build to `dist/` |
| `npm run lint` | Oxlint |
| `npm run preview` | Preview the production build locally |

## Docker

```bash
docker build --build-arg VITE_API_URL=https://api.example.com/api -t task-manager-frontend .
docker run -p 8080:8080 task-manager-frontend
```

The image builds static files with Vite, then serves them with nginx. nginx
listens on the port given by the `PORT` env var (defaults to `8080`,
required by Cloud Run) via an `envsubst`-templated config
(`nginx.conf.template`), with SPA fallback routing for `react-router-dom`.
