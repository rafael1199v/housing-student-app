# Itersapiens - Student Housing App

Full-stack platform that connects students looking for rooms with householders who publish rental spaces. The app includes role-based authentication, room search, bookings, image uploads, Google Maps, email flows, Dockerized local/prod environments, and GitHub Actions CI/CD.

## Architecture

```text
housing-student-app/
|-- frontend/   React 19 + TypeScript + Vite SPA
|-- backend/    ASP.NET Core Web API (.NET 10)
|-- docker-compose.yaml
|-- docker-compose.override.yml
|-- docker-compose.prod.yml
`-- .github/workflows/
```

| Area | Main technologies |
| --- | --- |
| Frontend | React 19, TypeScript, Vite, Tailwind CSS 4, TanStack Query, Zustand, React Router, Google Maps |
| Backend | ASP.NET Core .NET 10, EF Core, PostgreSQL, ASP.NET Core Identity, JWT, AWS S3, Resend |
| DevOps | Docker, Docker Compose, NGINX, GitHub Actions, Docker Hub |

See the service-specific docs for deeper details:

- [frontend/README.md](frontend/README.md)
- [backend/README.md](backend/README.md)

## Prerequisites

| Tool | Recommended version |
| --- | --- |
| Node.js | 20+ locally, CI currently uses Node 21 |
| npm | Bundled with Node |
| .NET SDK | 10.0.x |
| Docker + Docker Compose | Recent Docker Desktop or Docker Engine |
| PostgreSQL | 14+ if running without containers |

External services needed for the full app:

- AWS S3 bucket and credentials.
- Google Maps API key.
- Google OAuth client ID.
- Resend API key for email.

## Environment Variables

Copy the example file and fill in real values:

```bash
cp .env.example .env
```

The root `.env` is used by Docker Compose. Important values:

| Variable | Used by | Purpose |
| --- | --- | --- |
| `FRONTEND_PORT` | Compose | Host port for the frontend container, defaults to `5173` in dev and `3000` in prod examples |
| `BACKEND_PORT` | Compose | Host port for the API container, defaults to `8080` |
| `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT` | Compose/Postgres | Database container configuration |
| `FRONTEND_ORIGIN` | Backend | CORS allowed origin |
| `JWT_SECRET_KEY`, `JWT_ISSUER`, `JWT_AUDIENCE`, `JWT_EXPIRATION_MINUTES` | Backend | JWT validation/signing settings |
| `AWS_ACCESS_KEY`, `AWS_SECRET_KEY`, `AWS_REGION`, `STORAGE_BUCKET_NAME` | Backend | S3 storage settings |
| `GOOGLE_CLIENT_ID` | Backend | Google auth client ID validation/config |
| `RESEND_API_KEY`, `RESEND_FROM_EMAIL` | Backend | Email delivery settings |
| `CONNECTION_STRING_DEFAULT_CONNECTION` | Backend | PostgreSQL connection string |
| `VITE_API_URL`, `VITE_GOOGLE_MAPS_API_KEY`, `VITE_GOOGLE_MAPS_ID`, `VITE_GOOGLE_CLIENT_ID` | Frontend | Build/runtime configuration for Vite |

## Run Locally Without Containers

Start PostgreSQL yourself or run only the database with Docker:

```bash
docker compose up -d db
```

Run the backend:

```bash
cd backend
dotnet restore
dotnet ef database update --project src/HousingApp.Infrastructure --startup-project src/HousingApp.Api
dotnet run --project src/HousingApp.Api
```

The API runs at `http://localhost:8082` with docs at `http://localhost:8082/docs`.

Run the frontend in another terminal:

```bash
cd frontend
npm install
npm run dev
```

The Vite dev server runs at `http://localhost:5173`.

Useful root Make targets:

```bash
make backend
make frontend
make dev-db
```

## Run With Docker Compose

Development mode uses `docker-compose.yaml` plus the auto-loaded `docker-compose.override.yml`.

```bash
cp .env.example .env
docker compose up --build
```

Development containers:

| Service | Container | Host port | Notes |
| --- | --- | --- | --- |
| `frontend` | `itersapiens-frontend-dev` | `${FRONTEND_PORT:-5173}` | Vite dev server with source bind mount |
| `api` | `housing-api-dev` | `${BACKEND_PORT:-8080}` | .NET SDK build stage with source bind mount |
| `db` | `itersapiens-db-dev` | `${DB_PORT:-5432}` | PostgreSQL with named volume |

Production-like Compose uses the prod override:

```bash
docker compose -f docker-compose.yaml -f docker-compose.prod.yml up --build -d
```

```bash
docker compose --env-file .env.prod -f docker-compose.yaml -f docker-compose.prod.yml up --build -d
```

Production containers:

| Service | Container | Host port | Notes |
| --- | --- | --- | --- |
| `frontend` | `itersapiens-frontend-prod` | `${FRONTEND_PORT:-3000}` -> container `8080` | Static Vite build served by unprivileged NGINX |
| `api` | `housing-api-prod` | `${BACKEND_PORT:-8080}` -> container `8080` | Published ASP.NET Core runtime image |
| `db` | `itersapiens-db-prod` | `${DB_PORT:-5432}` | PostgreSQL with prod named volume |

Useful container commands:

```bash
docker compose logs -f
docker compose logs -f api
docker compose down
docker compose -f docker-compose.yaml -f docker-compose.prod.yml down
```

## Docker Images

Frontend:

```bash
docker build \
  --build-arg VITE_API_URL=http://localhost:8080 \
  --build-arg VITE_GOOGLE_MAPS_API_KEY=your_key \
  --build-arg VITE_GOOGLE_MAPS_ID=your_map_id \
  --build-arg VITE_GOOGLE_CLIENT_ID=your_client_id \
  -t itersapiens-frontend ./frontend

docker run -p 3000:8080 itersapiens-frontend
```

The frontend image builds the Vite bundle and serves `dist/` with `nginxinc/nginx-unprivileged:alpine` on container port `8080`.

Backend:

```bash
docker build -t itersapiens-backend ./backend
docker run --env-file .env -p 8080:8080 itersapiens-backend
```

The backend image restores, publishes, and runs `HousingApp.Api.dll` on container port `8080`.

## Testing

Frontend:

```bash
cd frontend
npm run lint
npm run test -- --run
npm run build
```

Backend:

```bash
cd backend
dotnet test
dotnet test tests/HousingApp.Application.Tests/HousingApp.Application.Tests.csproj
dotnet test tests/HousingApp.IntegrationTests/HousingApp.IntegrationTests.csproj
```

## CI/CD Pipeline

GitHub Actions workflows live in `.github/workflows`.

| Workflow | Triggers | What it does |
| --- | --- | --- |
| `frontend-validation.yml` | Push to `feature/**`, PR to `develop` | Installs dependencies, runs Biome lint, Vitest, and production build |
| `backend-unit-test.yml` | Push to `feature/**`, PR to `develop` | Uses reusable .NET build, then runs application unit tests |
| `backend-integration-test.yml` | Push to `main`, PR to `develop` | Uses reusable .NET build, then runs integration tests |
| `backend-publish.yml` | Push to `main`, PR to `main` or `release/**` | Publishes backend artifact |
| `app-deploy.yml` | Push/PR to `main`, manual dispatch | Builds and pushes frontend/backend Docker images to Docker Hub, then deploys via SSH |
| `build-reusable.yml` | Called by backend workflows | Restores, builds, and uploads compiled backend output |

Deployment workflow details:

- Builds frontend image from `./frontend` with Vite build args.
- Builds backend image from `./backend`.
- Pushes both images to Docker Hub tags `itersapiens-frontend:1.0` and `itersapiens-backend:1.0`.
- Connects to the production host through SSH.
- Writes a production `.env` on the host.
- Pulls the latest images, replaces old containers, and runs both services.

Required GitHub secrets/vars include Docker Hub credentials, SSH connection data, JWT settings, AWS/Resend credentials, Google keys, database connection string, and public frontend/backend ports.
