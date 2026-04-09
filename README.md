# Itersapiens — Student Housing App

A full-stack web platform that connects **students** looking for rooms with **householders** who offer them, built for the Latin American market.

Students can search, filter, and book rooms. Householders can list rooms, upload images, set locations on a map, and manage booking requests — all through a role-aware interface backed by a secure REST API.

## Architecture Overview

```
housing-student-app/
├── frontend/   # React 19 + TypeScript SPA (Vite)
└── backend/    # ASP.NET Core Web API (.NET 10)
```

Both sides are independently deployable and communicate via a REST API with JWT authentication.

## Tech Stack Summary

| Side     | Key Technologies                                              |
|----------|---------------------------------------------------------------|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS 4, TanStack Query, Zustand, React Router v7, Google Maps |
| Backend  | ASP.NET Core (.NET 10), Entity Framework Core, PostgreSQL, ASP.NET Core Identity, JWT, AWS S3 |

For a detailed breakdown of each side, see:
- [frontend/README.md](frontend/README.md)
- [backend/README.md](backend/README.md)

## Features at a Glance

- **Role-based access**: Student and Householder roles with dedicated flows and route guards.
- **Room search**: Full-text search with price filters, sort options, and map view.
- **Booking system**: Students book rooms; householders approve or reject requests. Householders can also explicitly reject pending requests.
- **Image uploads**: Up to 5 images per room, stored in AWS S3.
- **Map integration**: Google Maps for location display and map-based room creation.
- **Rate limiting**: Per-IP rate limiting on the API to prevent abuse.

## Getting Started

### Prerequisites

| Requirement | Minimum Version |
|---|---|
| Node.js | 18 |
| npm | bundled with Node |
| .NET SDK | 10.0 |
| PostgreSQL | 14+ |
| AWS account | — (S3 bucket required) |
| Google Maps API key | — (Maps JavaScript API enabled) |

---

### Backend Setup

1. **Navigate to the backend directory:**

   ```bash
   cd backend
   ```

2. **Configure secrets.** The API requires the following environment variables (or a `.env` file in the `backend/` directory):

   | Variable | Description |
   |---|---|
   | `ConnectionStrings:DefaultConnection` | PostgreSQL connection string |
   | `Jwt:SecretKey` | Secret key for signing JWT tokens |
   | `AWS:AccessKey` | AWS IAM access key ID |
   | `AWS:SecretKey` | AWS IAM secret access key |
   | `AWS:Region` | AWS region (e.g. `us-east-1`) |

   Non-secret settings (JWT audience/issuer, S3 bucket name, allowed CORS origins) are configured in `src/HousingApp.Api/appsettings.json`.

3. **Install the EF Core CLI tool** (if not already installed):

   ```bash
   dotnet tool install --global dotnet-ef
   ```

4. **Apply database migrations:**

   ```bash
   dotnet ef database update \
     --project src/HousingApp.Infrastructure \
     --startup-project src/HousingApp.Api
   ```

5. **Run the API:**

   ```bash
   make run
   # or:
   dotnet run --project src/HousingApp.Api
   ```

   The API will be available at `http://localhost:5065`.
   Interactive API docs (Scalar UI): `http://localhost:5065/docs`

---

### Frontend Setup

1. **Navigate to the frontend directory:**

   ```bash
   cd frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Create a `.env` file** in the `frontend/` directory:

   ```env
   VITE_API_URL=http://localhost:5065
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   ```

   | Variable | Description |
   |---|---|
   | `VITE_API_URL` | Base URL of the running backend API |
   | `VITE_GOOGLE_MAPS_API_KEY` | Google Maps JavaScript API key |

4. **Start the development server:**

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`.

---


## Testing

The backend has currently one test project under `backend/tests/`:

| Project | Type | Tools |
|---|---|---|
| `HousingApp.Application.Tests` | Unit | xUnit, NSubstitute, FluentAssertions |

Unit tests cover all Application layer use cases (Auth, Room, Booking) in isolation with mocked dependencies.

A GitHub Actions workflow runs the unit test suite on every push to `feature/**` branches and on pull requests targeting `develop`.

See [backend/README.md](backend/README.md#testing) for full details on running tests and the CI setup.

---

### Docker (Frontend only)

The frontend includes a production-ready `Dockerfile`:

```bash
cd frontend
docker build -t itersapiens-frontend .
docker run -p 3000:3000 itersapiens-frontend
```

The container builds the static bundle with `npm run build` and serves it via `serve` on port **3000**.
