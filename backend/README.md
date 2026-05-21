# Itersapiens Backend

ASP.NET Core Web API for the Itersapiens student housing platform, built with .NET 10 and Clean Architecture.

## Tech Stack

| Concern | Technology |
| --- | --- |
| Framework | ASP.NET Core .NET 10 |
| Language | C# |
| Database | PostgreSQL |
| ORM | Entity Framework Core + Npgsql |
| Auth | ASP.NET Core Identity + JWT Bearer |
| Storage | AWS S3 |
| Email | Resend |
| API docs | OpenAPI + Scalar |
| Testing | xUnit, NSubstitute, FluentAssertions |
| Container runtime | ASP.NET runtime image |

## Project Structure

```text
src/
|-- HousingApp.Api/             Presentation layer, controllers, middleware, DI setup
|-- HousingApp.Application/     Use cases, DTOs, repository interfaces, Result<T>
|-- HousingApp.Domain/          Domain entities, enums, typed errors
`-- HousingApp.Infrastructure/  EF Core, repositories, migrations, S3 storage

tests/
|-- HousingApp.Application.Tests/
`-- HousingApp.IntegrationTests/
```

Dependency direction:

```text
Api -> Application -> Domain
Infrastructure -> Application -> Domain
```

## Environment Variables

For local Docker Compose, configure the root `.env` from `.env.example`. For local non-container development, provide equivalent environment variables or user secrets.

| Variable | Purpose |
| --- | --- |
| `ConnectionStrings__DefaultConnection` | PostgreSQL connection string for container/env-var configuration |
| `ConnectionStrings:DefaultConnection` | Same setting using .NET colon notation |
| `Frontend__Origin` | Allowed CORS origin |
| `Jwt__SecretKey` | JWT signing key |
| `Jwt__Issuer` | Expected JWT issuer |
| `Jwt__Audience` | Expected JWT audience |
| `Jwt__ExpirationInMinutes` | Access token lifetime |
| `AWS__AccessKey`, `AWS__SecretKey`, `AWS__Region` | AWS S3 credentials/config |
| `Storage__BucketName` | S3 bucket name |
| `Google__ClientId` | Google OAuth client ID |
| `Resend__ApiKey`, `Resend__FromEmail` | Email delivery configuration |

Development defaults such as launch URLs live in `src/HousingApp.Api/Properties/launchSettings.json`.

## Run Locally

Start PostgreSQL yourself or use the root Compose database:

```bash
docker compose up -d db
```

Restore and apply migrations:

```bash
cd backend
dotnet restore
dotnet tool install --global dotnet-ef
dotnet ef database update --project src/HousingApp.Infrastructure --startup-project src/HousingApp.Api
```

Run the API:

```bash
make run
# or
dotnet run --project src/HousingApp.Api
```

Default local URLs:

```text
API:  http://localhost:5065
Docs: http://localhost:5065/docs
```

## Testing

Run all backend tests:

```bash
dotnet test
```

Run a specific suite:

```bash
dotnet test tests/HousingApp.Application.Tests/HousingApp.Application.Tests.csproj
dotnet test tests/HousingApp.IntegrationTests/HousingApp.IntegrationTests.csproj
```

Unit tests focus on application use cases with mocked dependencies. Integration tests live in `tests/HousingApp.IntegrationTests` and are executed by their own CI workflow.

## Docker

The backend Dockerfile is multi-stage:

1. `mcr.microsoft.com/dotnet/sdk:10.0` build stage restores and publishes the API.
2. `mcr.microsoft.com/dotnet/aspnet:10.0` runtime stage runs `HousingApp.Api.dll`.
3. The container exposes port `8080`.

Build and run directly:

```bash
docker build -t itersapiens-backend .
docker run --env-file ../.env -p 8080:8080 itersapiens-backend
```

For direct Docker usage, the connection string must point to a reachable database host. Inside Compose, use the Compose service name `db`.

## Docker Compose

From the repository root:

```bash
docker compose up --build
```

Development Compose:

- Builds the `build` target from the Dockerfile.
- Runs `dotnet run --project src/HousingApp.Api/HousingApp.Api.csproj --no-launch-profile`.
- Bind-mounts `./backend/src` into `/workspace/src`.
- Exposes `${BACKEND_PORT:-8080}` on the host.
- Waits for the `db` healthcheck before starting.

Production-like Compose:

```bash
docker compose -f docker-compose.yaml -f docker-compose.prod.yml up --build -d api
```

Production Compose:

- Uses the final runtime image.
- Runs with `ASPNETCORE_ENVIRONMENT=Production`.
- Sets `ASPNETCORE_URLS=http://+:8080`.
- Uses no source bind mounts.
- Restarts with `unless-stopped`.

## CI/CD

Backend workflows live in `.github/workflows`.

| Workflow | Triggers | Purpose |
| --- | --- | --- |
| `backend-unit-test.yml` | Push to `feature/**`, PR to `develop` | Builds application test project and runs unit tests |
| `backend-integration-test.yml` | Push to `main`, PR to `develop` | Builds integration test project and runs integration tests |
| `backend-publish.yml` | Push to `main`, PR to `main` or `release/**` | Publishes the API and uploads `backend-artifact` |
| `build-reusable.yml` | Called by backend workflows | Shared restore/build/artifact workflow |
| `app-deploy.yml` | Push/PR to `main`, manual dispatch | Builds Docker image, pushes it, and deploys through SSH |

Deployment workflow behavior:

1. Builds the backend Docker image from `./backend`.
2. Pushes it to Docker Hub as `itersapiens-backend:1.0`.
3. Writes production environment variables on the server.
4. Pulls the new image.
5. Stops/removes the previous backend container.
6. Runs the new container with `--env-file` and `-p <BACKEND_PORT>:8080`.

## Architecture Notes

- Controllers map HTTP requests to application use cases.
- Application use cases return `Result<T>` for expected business failures.
- Repositories and unit of work abstractions keep EF Core out of the application layer.
- Global exception handling prevents stack traces from leaking to clients.
- Role-based authorization is enforced with ASP.NET Core policies/attributes.
- S3 storage returns presigned URLs instead of public permanent file URLs.
- EF Core migrations own schema changes.
