# Itersapiens: Frontend

A student housing web application built with React and TypeScript that connects **students** looking for rooms with **householders** offering them. The platform features role-based dashboards, room search with map integration, a booking system, and image galleries.

## Table of Contents

- [Itersapiens: Frontend](#itersapiens-frontend)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
    - [Student Flow](#student-flow)
    - [Householder Flow](#householder-flow)
  - [Tech Stack](#tech-stack)
  - [Project Structure](#project-structure)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Available Scripts](#available-scripts)
  - [Architecture](#architecture)
    - [Key Architectural Decisions](#key-architectural-decisions)
  - [Features](#features)
    - [Authentication](#authentication)
    - [Room Search (Student)](#room-search-student)
    - [Room Details](#room-details)
    - [Room Creation (Householder)](#room-creation-householder)
    - [Booking System](#booking-system)
    - [Shared Components](#shared-components)
  - [Routing](#routing)
  - [State Management](#state-management)
    - [Authentication (Zustand)](#authentication-zustand)
    - [Server State (TanStack Query)](#server-state-tanstack-query)
  - [API Integration](#api-integration)
    - [API Endpoints](#api-endpoints)
  - [Authentication](#authentication-1)
  - [Docker](#docker)

## Overview

The application serves two user roles:

### Student Flow
1. Register and log in as a **Student**.
2. Browse rooms from the Home page or the Rooms page with filters (name, price range).
3. View room details including images, description, location on a map, and owner info.
4. Book a room. The room status changes to "booked".

### Householder Flow
1. Register and log in as a **Householder**.
2. Access a dedicated dashboard showing all created rooms and their pending booking requests.
3. Create new rooms with details, pricing, location (map picker), and up to 5 images.
4. Manage booking requests by approving or rejecting them.

## Tech Stack

| Layer              | Technology                                  |
|--------------------|---------------------------------------------|
| Framework          | React 19 + TypeScript                       |
| Build Tool         | Vite 7                                      |
| Routing            | React Router v7                             |
| Styling            | Tailwind CSS 4                              |
| Forms              | React Hook Form + Zod validation            |
| Server State       | TanStack React Query                        |
| Client State       | Zustand (auth persistence)                  |
| HTTP Client        | Fetch API (custom wrapper)                  |
| Maps               | Google Maps (@vis.gl/react-google-maps)     |
| Notifications      | Sonner (toast)                              |
| Linter / Formatter | Biome                                       |
| Git Hooks          | Husky                                       |

## Project Structure

```
src/
├── assets/                        # Static assets (SVGs, placeholder images)
├── features/                      # Feature-based modules (FDA)
│   ├── auth/                      # Authentication (login, register, JWT, store)
│   │   ├── components/            # NationalitySelector, PhoneInput
│   │   ├── pages/                 # login.tsx, register.tsx
│   │   ├── store/                 # authStore.ts (Zustand)
│   │   ├── types/                 # DTOs (loginRequest, registerDto, user, etc.)
│   │   └── utils/                 # tokenClaims.ts (JWT parsing)
│   ├── home/                      # Student home page (search, featured rooms)
│   ├── rooms/                     # Room search & filtering with map
│   ├── room-details/              # Individual room detail view & booking
│   ├── bookings/                  # Student's booked rooms list
│   ├── new-room/                  # Room creation form (Householder)
│   ├── owner-home/                # Householder dashboard
│   ├── owner-room-details/        # Householder room management & booking approval
│   ├── shared/                    # Reusable components (RoomCard, Footer)
│   └── not-found/                 # 404 page
├── layout/                        # MainLayout (navbar, footer, content outlet)
├── routers/                       # Route definitions, ProtectedRoute, GuestRoute
├── services/                      # API service layer
│   ├── apiService.ts              # Fetch wrapper (auth headers, error handling)
│   ├── authService.ts             # Login & register endpoints
│   ├── roomService.ts             # Room CRUD, search, image upload
│   └── bookingService.ts          # Booking CRUD & approval
├── App.tsx                        # Root component (providers)
├── main.tsx                       # Entry point (RouterProvider)
└── index.css                      # Global styles & Tailwind theme
```

## Getting Started

### Prerequisites

- **Node.js** >= 18
- **npm**
- A running instance of the .NET backend API (default: `http://localhost:5065`)
- A Google Maps API key

### Installation

```bash
# Clone the repository and navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Create a .env file (see Environment Variables section)

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173` by default.

## Environment Variables

Create a `.env` file in the project root with the following variables:

| Variable                    | Description                         | Example                   |
|-----------------------------|-------------------------------------|---------------------------|
| `VITE_API_URL`              | Backend API base URL                | `http://localhost:5065`   |
| `VITE_GOOGLE_MAPS_API_KEY`  | Google Maps JavaScript API key      | `XXXXX...`               |

## Available Scripts

| Command            | Description                                   |
|--------------------|-----------------------------------------------|
| `npm run dev`      | Start Vite development server with HMR        |
| `npm run build`    | Type-check with TypeScript and build for production |
| `npm run preview`  | Preview the production build locally           |
| `npm run lint`     | Run Biome linter on `src/`                     |
| `npm run format`   | Format code with Biome                         |
| `npm run lint-format` | Lint and format in one pass                 |

## Architecture

The project follows a **Feature-Driven Architecture (FDA)**. Each feature is a self-contained module under `src/features/` with its own pages, components, types, and utilities.

### Key Architectural Decisions

- **Feature isolation**: Each feature owns its pages, components, and types. Shared UI lives in `features/shared/`.
- **Service layer**: All API communication goes through `src/services/`. The base `apiService.ts` handles auth token injection, content-type negotiation (JSON vs FormData), and global error handling (401 logout, 403 redirect).
- **No mocked data**: The application is designed to work with a real .NET backend API.
- **Role-based rendering**: The home route (`/`) dynamically renders either `HomePage` (Student) or `OwnerHomePage` (Householder) based on the JWT role claim.

## Features

### Authentication
- Email/password login with form validation (Zod).
- Multi-step registration form supporting Student and Householder roles.
- Fields include: personal info, nationality (Latin American countries), phone with country code, profile image, gender, and birthdate.

### Room Search (Student)
- Full-text search by room name.
- Price range filters (min/max).
- Sort by price or name (ascending/descending).

### Room Details
- Image carousel with navigation.
- Room description, price, and status (Available / Booked / Unavailable).
- Owner/landlord information display.
- Google Maps location view.
- Book / Cancel booking actions.

### Room Creation (Householder)
- Form with name, description, price, and status.
- Map picker for latitude/longitude selection.
- Multi-image upload (up to 5 images) via drag-and-drop, sent as `FormData`.

### Booking System
- Students can book available rooms and cancel their bookings.
- Householders can view all booking requests per room and **approve or reject** them via a confirmation dialog.
- Booking statuses are tracked and displayed with visual indicators.

### Shared Components
- **RoomCard**: Reusable card with image carousel, price formatting (es-BO locale), and broken image fallback.
- **Footer**: Navigation links, contact info, and logout.
- **Skeleton loaders**: Displayed during data fetching for a smooth loading experience.

## Routing

| Path                 | Access       | Page                              |
|----------------------|--------------|-----------------------------------|
| `/login`             | Guest only   | Login                             |
| `/register`          | Guest only   | Registration                      |
| `/`                  | Protected    | Student Home or Householder Home  |
| `/rooms`             | Protected    | Room search (Student only)        |
| `/bookings`          | Protected    | Booked rooms list (Student only)  |
| `/details/:id`       | Protected    | Room detail view                  |
| `/owner/rooms/new`   | Protected    | Create room (Householder only)    |
| `/owner/rooms/:id`   | Protected    | Manage room (Householder only)    |
| `*`                  | Public       | 404 Not Found                     |

**Route guards:**
- `ProtectedRoute` — redirects unauthenticated users to `/login`.
- `GuestRoute` — redirects authenticated users to `/`.

## State Management

### Authentication (Zustand)
The auth store (`features/auth/store/authStore.ts`) uses Zustand with the `persist` middleware to save the access token to `localStorage`. It exposes:
- `useUser()` — current user info
- `useAccessToken()` — JWT access token
- `useAuthActions()` — `setUser`, `setAccessToken`, `setRefreshToken`, `clearAll`

### Server State (TanStack Query)
All API data fetching uses React Query with query keys such as:
- `["rooms"]`, `["rooms", "search", params]` — room listings
- `["room", id]`, `["owner-room", id]` — room details
- `["user-booking", id]` — booking status
- `["owner", "rooms"]` — householder rooms

Mutations automatically invalidate relevant queries to keep the UI in sync.

## API Integration

All HTTP requests are routed through `src/services/apiService.ts`, which provides:

- **Automatic auth**: Injects `Authorization: Bearer <token>` on every request.
- **Content handling**: Automatically sets `Content-Type` for JSON; omits it for `FormData` (image uploads).
- **Global error handling**:
  - `401 Unauthorized` — clears auth state, redirects to `/login`, shows a toast.
  - `403 Forbidden` — redirects to `/not-found`.
  - `204 No Content` — returns `null` gracefully.
- **Typed responses**: All service methods are generic-typed (`get<T>`, `post<T>`, etc.).

### API Endpoints

| Method   | Endpoint                         | Description                     |
|----------|----------------------------------|---------------------------------|
| `POST`   | `/api/login`                     | Authenticate user               |
| `POST`   | `/api/register`                  | Register new user               |
| `GET`    | `/api/rooms`                     | List all rooms                  |
| `GET`    | `/api/rooms?name=&minPrice=&...` | Search rooms with filters       |
| `GET`    | `/api/rooms/:id`                 | Get room details                |
| `GET`    | `/api/rooms/householder`         | List householder's rooms        |
| `GET`    | `/api/rooms/householder/:id`     | Get householder's room details  |
| `POST`   | `/api/rooms`                     | Create room (FormData)          |
| `GET`    | `/api/bookings`                  | List student's bookings         |
| `GET`    | `/api/bookings/:roomId`          | Check booking status for a room |
| `POST`   | `/api/bookings`                  | Create a booking                |
| `DELETE` | `/api/bookings/:roomId`          | Cancel a booking                |
| `PUT`    | `/api/bookings/approve/:id`      | Approve a booking request       |
| `PUT`    | `/api/bookings/reject/:id`       | Reject a booking request        |

## Authentication

1. **Login**: User submits credentials -> backend returns a JWT `accessToken` -> stored in Zustand (persisted to `localStorage`).
2. **Role detection**: The JWT payload contains a `role` claim (`"Student"` or `"Householder"`), parsed via `getRoleFromAccessToken()`.
3. **Session persistence**: The token is restored from `localStorage` on page reload. `ProtectedRoute` checks for its existence.
4. **Logout**: Clears the Zustand store and redirects to `/login`.

## Docker

The application includes a `Dockerfile` for containerized deployment:

```bash
# Build and run
docker build -t itersapiens-frontend .
docker run -p 3000:3000 itersapiens-frontend
```

The container uses a multi-step process:
1. Installs dependencies with `npm ci`.
2. Builds the production bundle with `npm run build`.
3. Serves the static `dist/` folder via `serve` on port **3000**.

**Base image**: `node:24.14-alpine3.23`
