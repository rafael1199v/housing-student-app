# Itersapiens Frontend

React + TypeScript single-page application for the Itersapiens student housing platform. It provides role-aware flows for students and householders, room search, booking management, maps, authentication, and localized UI.

## Tech Stack

| Concern | Technology |
| --- | --- |
| Framework | React 19 + TypeScript |
| Build | Vite 7 |
| Routing | React Router v7 |
| Styling | Tailwind CSS 4 |
| Forms | React Hook Form + Zod |
| Server state | TanStack Query |
| Client state | Zustand |
| Testing | Vitest + Testing Library |
| Lint/format | Biome |
| Container runtime | NGINX unprivileged image |

## Project Structure

```text
src/
|-- assets/
|-- features/
|   |-- auth/
|   |-- bookings/
|   |-- home/
|   |-- new-room/
|   |-- owner-home/
|   |-- owner-room-details/
|   |-- room-details/
|   `-- rooms/
|-- layout/
|-- routers/
|-- services/
|-- shared/
|   |-- components/
|   `-- providers/
|-- App.tsx
|-- i18n.ts
|-- main.tsx
`-- index.css
```

The app follows a feature-driven structure: feature-owned pages/components/types stay under `src/features`, while cross-cutting reusable UI/providers live under `src/shared`.

## Environment Variables

Create `frontend/.env` for local non-container development:

```env
VITE_API_URL=http://localhost:5065
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
VITE_GOOGLE_MAPS_ID=your_google_maps_id
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

| Variable | Purpose |
| --- | --- |
| `VITE_API_URL` | Base URL of the backend API |
| `VITE_GOOGLE_MAPS_API_KEY` | Google Maps JavaScript API key |
| `VITE_GOOGLE_MAPS_ID` | Google Maps map ID |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID for the Google sign-in button |

For Docker Compose, these values are read from the root `.env` file.

## Run Locally

```bash
cd frontend
npm install
npm run dev
```

Default local URL:

```text
http://localhost:5173
```

Make sure the backend is reachable through `VITE_API_URL`.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Starts the Vite dev server with HMR |
| `npm run build` | Runs TypeScript build and creates the production bundle |
| `npm run preview` | Serves the production bundle locally with Vite preview |
| `npm run lint` | Runs Biome checks over `src/` |
| `npm run format` | Formats `src/` with Biome |
| `npm run lint-format` | Runs Biome checks with safe writes |
| `npm run test` | Runs Vitest |
| `npm run test -- --run` | Runs Vitest once, suitable for CI |

## Testing

Run the frontend validation suite locally:

```bash
npm run lint
npm run test -- --run
npm run build
```

Focused examples:

```bash
npx vitest run src/i18n.test.ts
npx vitest run src/features/bookings/pages/index.test.tsx
```

Tests use Vitest with the `jsdom` environment and `src/test/setupTests.ts`.

## Docker

The frontend Dockerfile is multi-stage:

1. `node:20-alpine` builder installs dependencies with `npm ci`.
2. Vite builds the static bundle using the provided build args.
3. `nginxinc/nginx-unprivileged:alpine` serves `dist/` on container port `8080`.

Build and run the image directly:

```bash
docker build \
  --build-arg VITE_API_URL=http://localhost:8080 \
  --build-arg VITE_GOOGLE_MAPS_API_KEY=your_key \
  --build-arg VITE_GOOGLE_MAPS_ID=your_map_id \
  --build-arg VITE_GOOGLE_CLIENT_ID=your_client_id \
  -t itersapiens-frontend .

docker run -p 3000:8080 itersapiens-frontend
```

The included `nginx.conf` supports SPA routing with:

```nginx
try_files $uri $uri/ /index.html;
```

## Docker Compose

From the repository root:

```bash
docker compose up --build
```

Development Compose uses the `builder` target and runs:

```bash
npm run dev -- --host
```

It bind-mounts `./frontend/src` for source hot reload and exposes `${FRONTEND_PORT:-5173}`.

Production-like Compose:

```bash
docker compose -f docker-compose.yaml -f docker-compose.prod.yml up --build -d frontend
```

The production frontend container exposes NGINX on container port `8080`, mapped to `${FRONTEND_PORT:-3000}`.

## CI/CD

Frontend validation is handled by `.github/workflows/frontend-validation.yml`.

Triggers:

- Pushes to `feature/**`.
- Pull requests targeting `develop`.

Pipeline steps:

1. Checkout repository.
2. Setup Node.js 21.
3. Install dependencies with `npm install`.
4. Run `npm run lint`.
5. Run Vitest with verbose reporter.
6. Run `npm run build`.

Production deployment is handled by the root `.github/workflows/app-deploy.yml`. That workflow builds the frontend Docker image with production Vite build args, pushes it to Docker Hub, then restarts the frontend container on the server through SSH.

## API Integration

All HTTP calls go through `src/services/apiService.ts`, which handles:

- Base URL from `VITE_API_URL`.
- JWT authorization header injection.
- JSON vs `FormData` content handling.
- Global `401`/`403` handling.
- Typed service responses.
