# Itersapiens: Backend

ASP.NET Core Web API for the Itersapiens student housing platform, built with **.NET 10** and following **Clean Architecture** principles.

## Table of Contents

- [Itersapiens: Backend](#itersapiens-backend)
  - [Table of Contents](#table-of-contents)
  - [Tech Stack](#tech-stack)
  - [Project Structure](#project-structure)
  - [Architecture \& Design Patterns](#architecture--design-patterns)
    - [Design Patterns](#design-patterns)
    - [Domain Model](#domain-model)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Configuration](#configuration)
    - [Running the API](#running-the-api)
  - [Testing](#testing)
    - [Unit Tests](#unit-tests)
    - [Running Tests](#running-tests)
    - [CI](#ci)
  - [Production Good Practices](#production-good-practices)
    - [Global Exception Handling](#global-exception-handling)
    - [Result\<T\> — Functional Error Handling](#resultt--functional-error-handling)
    - [JWT Authentication with Strict Validation](#jwt-authentication-with-strict-validation)
    - [Role-Based Authorization (RBAC)](#role-based-authorization-rbac)
    - [Per-IP Rate Limiting](#per-ip-rate-limiting)
    - [CORS with Explicit Origin](#cors-with-explicit-origin)
    - [AWS S3 with Presigned URLs](#aws-s3-with-presigned-urls)
    - [Database Schema via EF Core Migrations](#database-schema-via-ef-core-migrations)

## Tech Stack

| Layer              | Technology                                          |
|--------------------|-----------------------------------------------------|
| Framework          | ASP.NET Core (.NET 10)                              |
| Language           | C#                                                  |
| ORM                | Entity Framework Core + Npgsql                      |
| Database           | PostgreSQL                                          |
| Authentication     | ASP.NET Core Identity + JWT Bearer                  |
| Cloud Storage      | AWS S3 (AWSSDK.S3)                                  |
| API Docs           | OpenAPI + Scalar                                    |
| Rate Limiting      | Built-in ASP.NET Core Rate Limiter (per-IP policy)  |
| Naming Convention  | EFCore.NamingConventions (snake_case)               |

## Project Structure

```
src/
├── HousingApp.Api/                    # Presentation layer
│   ├── Controllers/                   # HTTP endpoints (Login, Register, Room, Booking)
│   ├── Exception/                     # GlobalExceptionHandler (centralized error handling)
│   ├── Extensions/                    # IServiceCollection extension methods per concern
│   │   ├── ApplicationServicesExtensions.cs
│   │   ├── AuthExtensions.cs
│   │   ├── AwsExtensions.cs
│   │   ├── CorsExtensions.cs
│   │   ├── DatabaseExtensions.cs
│   │   ├── IdentityExtensions.cs
│   │   └── RateLimiterExtension.cs
│   ├── Policies/                      # Rate limiter policy definitions
│   ├── Requests/                      # API request models (input contracts)
│   └── Program.cs                     # App bootstrap and middleware pipeline
│
├── HousingApp.Application/            # Business logic layer
│   ├── Auth/
│   │   ├── DTOs/                      # Data transfer objects for auth flows
│   │   └── UseCases/                  # LoginUseCase, RegisterUseCase (+ interfaces)
│   ├── Booking/
│   │   ├── DTO/
│   │   └── UseCases/                  # Create, Delete, Approve, Reject, GetStudentBookings
│   ├── Room/
│   │   ├── DTO/
│   │   └── UseCases/                  # Create, GetRooms, GetRoomDetail, GetHouseholderRooms, etc.
│   ├── Repositories/                  # Repository interfaces (IBooking, IPerson, IRoom, IUser)
│   ├── Storage/                       # IStorageService abstraction + StorageType enum
│   ├── UnitOfWork/                    # Unit of Work interfaces (Auth, Booking, Room)
│   └── Result.cs                      # Generic Result<T> for functional error handling
│
├── HousingApp.Domain/                 # Core domain layer (no framework dependencies)
│   ├── Entities/                      # Business objects: User, Person, Room, Booking, etc.
│   ├── Enums/                         # Roles, BookingStatus, RoomStatus
│   └── Error/                         # Typed error objects: AuthError, BookingError, RoomError, etc.
│
└── HousingApp.Infrastructure/         # Data access & external services layer
    ├── Persistence/
    │   ├── Context/                   # HousingApplicationDbContext (EF Core)
    │   ├── Models/                    # EF Core entity models (mapped to DB tables)
    │   ├── Repositories/              # Concrete repository implementations
    │   └── UnitOfWork/                # Concrete Unit of Work implementations
    ├── Storage/                       # S3StorageService (AWS S3 implementation)
    └── Migrations/                    # EF Core database migrations

tests/
├── HousingApp.Application.Tests/      # Unit tests for Application layer use cases
│   ├── Auth/                          # LoginUseCaseTests, RegisterUseCaseTests
│   ├── Booking/                       # CreateBookingUseCaseTests, DeleteBookingUseCaseTests,
│   │                                  # ApproveBookingUseCaseTests, RejectBookingUseCaseTests
│   └── Room/                          # CreateRoomUseCaseTests
```

## Architecture & Design Patterns

The backend follows **Clean Architecture** with a strict dependency rule: outer layers depend on inner layers, never the reverse.

```
Api  →  Application  →  Domain
Infrastructure  →  Application  →  Domain
```

### Design Patterns

| Pattern | Where | Purpose |
|---|---|---|
| **Repository** | `Application/Repositories/` → `Infrastructure/Repositories/` | Abstracts data access; controllers never touch EF Core directly |
| **Unit of Work** | `Application/UnitOfWork/` → `Infrastructure/UnitOfWork/` | Groups repository operations into a single transaction boundary |
| **Use Case** | `Application/**/UseCases/` | Encapsulates one business operation per class (SRP); each use case has a paired interface |
| **Result\<T\>** | `Application/Result.cs` | Functional error handling — returns `Success<T>` or `Failure<Error>` instead of throwing exceptions for expected failures |
| **DTO** | `Application/**/DTO*/` | Decouples API contracts from domain entities and EF Core models |
| **Global Exception Handler** | `Api/Exception/GlobalExceptionHandler.cs` | Catches unhandled exceptions and returns consistent error responses without leaking stack traces |
| **Service Extension Methods** | `Api/Extensions/` | Each infrastructure concern (DB, Auth, CORS, AWS, Rate Limiter) is registered in its own extension method, keeping `Program.cs` clean |
| **Dependency Injection** | Throughout | All dependencies are constructor-injected via ASP.NET Core's built-in DI container; no static state |
| **RBAC** | Controllers | Role-based authorization enforced with `[Authorize(Roles = "Student")]` / `"Householder"` attributes |

### Domain Model

```
User (IdentityUser)
 └── Person           # Profile: name, phone, nationality, gender, avatar
      └── Room        # Rental: name, price, location, status, images
           └── Booking  # Reservation: student ↔ room, with BookingStatus
```

Statuses are stored as lookup tables (`RoomStatusModel`, `BookingStatusModel`) for referential integrity.

## Getting Started

### Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- PostgreSQL instance (local or cloud)
- AWS account with an S3 bucket and an IAM user with `s3:PutObject` / `s3:GetObject` permissions
- `dotnet-ef` CLI tool: `dotnet tool install --global dotnet-ef`

### Configuration

The API reads secrets from environment variables or a `.env` file (not committed to source control). The required keys are:

| Key | Description | Example |
|-----|-------------|---------|
| `ConnectionStrings:DefaultConnection` | PostgreSQL connection string | `Host=localhost;Database=housing;Username=postgres;Password=...` |
| `Jwt:SecretKey` | Secret used to sign JWT tokens (min. 32 chars) | `your-very-long-secret-key` |
| `AWS:AccessKey` | AWS IAM access key ID | `AKIAIOSFODNN7EXAMPLE` |
| `AWS:SecretKey` | AWS IAM secret access key | `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY` |
| `AWS:Region` | AWS region for the S3 bucket | `us-east-1` |

Additional non-secret settings live in `appsettings.json` / `appsettings.Development.json`:

```json
{
  "Jwt": {
    "Audience": "housing-app",
    "Issuer": "housing-api",
    "ExpirationInMinutes": 60
  },
  "AllowedOrigins": ["http://localhost:5173"],
  "AWS": {
    "BucketName": "your-s3-bucket-name"
  }
}
```

### Running the API

```bash
# Navigate to the backend directory
cd backend

# Apply database migrations
dotnet ef database update --project src/HousingApp.Infrastructure --startup-project src/HousingApp.Api

# Run the API (development)
make run
# or directly:
dotnet run --project src/HousingApp.Api
```

The API will be available at `http://localhost:5065`. Interactive API docs (Scalar) are at `http://localhost:5065/docs`.

## Testing

The backend has two dedicated test projects under `tests/`, managed with **xUnit** and using **Central Package Management** (`Directory.Packages.props`) for consistent NuGet versions across all projects.

### Unit Tests

**Project:** `tests/HousingApp.Application.Tests`

Tests are written against the Application layer use cases in isolation. All external dependencies (repositories, unit of work, storage) are replaced with fakes using **NSubstitute**. Assertions are written with **FluentAssertions**.

| Test class | Use case under test | Scenarios covered |
|---|---|---|
| `LoginUseCaseTests` | `LoginUseCase` | Success, user not found, wrong password |
| `RegisterUseCaseTests` | `RegisterUseCase` | Success, email already in use, invalid role, admin role denied |
| `CreateBookingUseCaseTests` | `CreateBookingUseCase` | Success, room already booked, room not available |
| `DeleteBookingUseCaseTests` | `DeleteBookingUseCase` | Success (pending), booking not found, already approved, already denied |
| `ApproveBookingUseCaseTests` | `ApproveBookingUseCase` | Success (pending), booking not found, already approved, already cancelled |
| `RejectBookingUseCaseTests` | `RejectBookingUseCase` | Success (pending), booking not found |
| `CreateRoomUseCaseTests` | `CreateRoomUseCase` | Success (0–5 images), householder not found, invalid room status, booked status blocked, non-image file type, max images exceeded |

Test libraries:

| Library | Version | Purpose |
|---|---|---|
| xUnit | 2.9.3 | Test framework |
| NSubstitute | 5.3.0 | Mocking/faking dependencies |
| FluentAssertions | 8.9.0 | Readable assertion API |
| coverlet.collector | 6.0.4 | Code coverage collection |

### Running Tests

```bash
# All tests from the backend root
dotnet test
```

### CI

A GitHub Actions workflow (`.github/workflows/dotnet.yml`) runs the unit test suite automatically:
- **Triggers**: pushes to `feature/**` branches and pull requests targeting `develop`.
- **Steps**: restore → build → `dotnet test`.

---

## Production Good Practices

### Global Exception Handling

Unhandled exceptions are caught by `GlobalExceptionHandler` (`Api/Exception/GlobalExceptionHandler.cs`), which:
- Logs the full exception using `ILogger<GlobalExceptionHandler>` (structured logging with message and stack trace).
- Returns a `500 Internal Server Error` with a generic `ServerError.UnknownError` response body — no stack traces or internal details are ever sent to the client.

### Result\<T\> — Functional Error Handling

Business logic uses `Result<T>` (`Application/Result.cs`) instead of exceptions for expected failures. Use cases return either `Result<T>.Success(value)` or `Result<T>.Failure(error)`. Controllers then check `result.IsSuccess` and map to the appropriate HTTP status code. This means:
- No try/catch scattered across the codebase for business errors.
- Error responses always come from typed domain error objects (`AuthError`, `BookingError`, `RoomError`, etc.), not raw exception messages.

### JWT Authentication with Strict Validation

Configured in `Api/Extensions/AuthExtensions.cs` with the following validation enforced on every request:

| Parameter | Value | Effect |
|---|---|---|
| `ValidateIssuerSigningKey` | `true` | Rejects tokens signed with any other key |
| `ValidateIssuer` | `true` | Rejects tokens from unexpected issuers |
| `ValidateAudience` | `true` | Rejects tokens intended for other services |
| `ValidateLifetime` | `true` | Rejects expired tokens |
| `ClockSkew` | `TimeSpan.Zero` | No tolerance window — tokens expire exactly on time |
| `MapInboundClaims` | `false` | Claim names are used as-is (no WS-Federation remapping) |

### Role-Based Authorization (RBAC)

Every protected endpoint declares its required role explicitly via `[Authorize(Roles = "...")]`. Students and Householders can only access their own endpoints — there is no shared "authenticated user" catch-all.

### Per-IP Rate Limiting

A global fixed-window rate limiter is applied to all requests (`Api/Extensions/RateLimiterExtension.cs`):
- **Limit**: 40 requests per 60-second window, partitioned by `RemoteIpAddress`.
- **Rejection**: Returns `429 Too Many Requests` when the limit is exceeded.
- The policy name (`fixed-by-ip`) is defined as a constant in `RateLimiterPolicies.cs` to avoid magic strings.

### CORS with Explicit Origin

`Api/Extensions/CorsExtensions.cs` reads the allowed origin from `Frontend:Origin` in configuration and passes it to `WithOrigins()`. No wildcard (`*`) is used; only the configured frontend URL is allowed.

### AWS S3 with Presigned URLs

`Infrastructure/Storage/S3StorageService.cs` handles all file storage:
- Files are uploaded directly to S3 with `PutObjectAsync`. The bucket is not public.
- File access uses `GetPreSignedURL` with a 10-minute default expiration. Clients never receive a permanent public URL.
- S3 object keys are namespaced by storage type and entity ID, with a `Guid`-prefixed filename to avoid collisions: `{type}/{entityId}/{guid}_{filename}`.

### Database Schema via EF Core Migrations

All schema changes are managed through EF Core Migrations (`Infrastructure/Migrations/`). The database is never modified manually. Migrations are applied explicitly with `dotnet ef database update` before running the application.
