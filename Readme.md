# Dynamic Form Builder System

## Overview

A full-stack Dynamic Form Builder where admins create forms and users fill and update their responses. The system demonstrates strong backend and frontend architecture with secure authentication, role-based access control, and scalable database design.

---

## Tech Stack

### Backend
- Node.js
- Express.js
- PostgreSQL
- Sequelize ORM
- JWT Authentication (localStorage-based)
- Redis (Token Blacklist)

### Frontend
- React (Hooks)
- React Router
- TanStack Query (React Query)
- Context API (Auth State)
- Tailwind CSS

---

## Architecture

### Backend Architecture

```
Routes → Controllers → Services → Models → Database
```

- **Routes** handle API endpoints
- **Controllers** handle request/response
- **Services** contain business logic
- **Models** define database schema
- **Middleware** handles authentication, authorization, validation, and errors
- **Utils** contains reusable helper functions (e.g. JWT token generation and verification)
- **Validators** contains request body validation schemas and methods used by middleware

### Frontend Architecture

```
Pages → Components → Services → Context → UI
```

- **Pages** represent screens (Login, Signup, Forms, Fill Form)
- **Components** are reusable UI elements
- **Services** handle API calls
- **Context** manages global authentication state
- **TanStack Query** manages server state and caching

---

## Authentication & Authorization

### Authentication

- JWT-based authentication
- Token stored in **localStorage** (sent via `Authorization: Bearer <token>` header)
- On login, token is saved to localStorage and loaded into Context
- On logout, token is removed from localStorage and blacklisted in Redis

> 
### Role-Based Access Control (RBAC)

| Role  | Permissions |
|-------|-------------|
| ADMIN | Create and manage all forms |
| USER  | View forms, submit responses, update their own submitted responses |

RBAC is enforced at:
- Route level (authorization middleware)
- Service level (data filtering)

---

## Key Features

### Pagination
- All form list endpoints support pagination via `page` and `limit` query parameters
- Backend returns paginated results with total count for frontend to render page controls

### Dynamic Form Builder (Admin Only)
- Only **admins** can create forms
- Supports multiple field types:
  - Text
  - Number
  - Dropdown
  - Date
  - Checkbox

### Form Response (Users Only)
- Users can **fill out** any published form
- Submitting again **updates** the existing response — no duplicate responses (upsert via `POST /forms/:id/submit`)
- Each user has one response per form, replaced in-place on resubmission

### Validations
- **Frontend:** Form field validation before submission (required fields, type checks, etc.)
- **Backend (form creation):** Validates title, field labels, types, dropdown options, checkbox options, and numeric validation rules (`min`, `max`, `minLength`, `maxLength`)
- **Backend (form submission):** Per-field validation including required checks, type checks (NUMBER, DATE), text length constraints, numeric range constraints, dropdown option validation, and conditional field evaluation (fields are only validated if their condition is met)

### Dynamic Response Handling (EAV Pattern)
- Uses `Response` and `ResponseValue` tables
- Allows flexible schema without DB migrations
- Supports any combination of dynamic fields

### Conditional Fields

- Conditional fields are only shown/validated when their condition evaluates to true
- Submission skips validation for fields whose condition is not met

### Transactions
- Sequelize transactions used during **form creation** and **form update**
- Form creation: form + all fields created atomically
- Form update: existing fields destroyed and recreated atomically within a transaction

### Redis Integration
- Token blacklist on logout
- Prevents reuse of revoked tokens

### Admin Seeder
- Runs automatically on server startup (via `utils/bcrypt.util.js`)
- Checks if an admin user already exists before creating one (idempotent)
- Seeds admin credentials from environment variables (`ADMIN_EMAIL`, `ADMIN_PASSWORD`)
- Password is hashed with bcrypt before storing

### Error Handling

**Backend — Global Error Middleware:**
- Catches all errors passed via `next(err)` across routes and controllers
- Responds with a consistent JSON shape: `{ success: false, message }`
- Uses `err.status` if set (e.g. from `createError`), falls back to `500`

**Frontend — React Error Boundary:**
- Class component wrapping the app tree
- Catches unhandled render/component errors via `getDerivedStateFromError`
- Renders a fallback UI (`Something went wrong.`) instead of crashing the whole app

### Logging
- Structured logging in services
- Helps with debugging and tracing execution flow

---

## Frontend Flow

### Login Flow
```
User → Login API → JWT received → Saved to localStorage → Context updated → Redirect to dashboard
```

### Protected Routing
- Implemented using `ProtectedRoute`
- Reads token directly from localStorage via Context on app load
- Redirects unauthenticated users to login

### Data Fetching
- TanStack Query handles all API calls, caching, refetching, and error states

### State Management
- Context API manages auth state (user, role, token)

### Styling
- Tailwind CSS for fast, consistent UI

---

## Backend Flow

### Request Lifecycle
```
Request → Route → Auth Middleware (Utils: JWT) → Authorization Middleware → Validation Middleware (Validators) → Controller → Service → Database
```

### Authentication Flow
```
Login        → Verify credentials → Generate JWT → Return token to client
Request      → Read Authorization header → Verify token → Attach user to request
Logout       → Add token to Redis blacklist → Remove from client
```

### RBAC Flow
```
Request → Middleware attaches user + role → Service enforces role rules → Response returned
```

---

## Database Design

### Tables

| Table | Description |
|-------|-------------|
| Users | Stores user accounts and roles |
| Forms | Forms created by admins |
| Fields | Fields belonging to each form |
| Responses | One response per user per form |
| ResponseValues | Individual field values within a response |

### Relationships

- `User` → `Forms` (one-to-many)
- `Form` → `Fields` (one-to-many)
- `Form` → `Responses` (one-to-many)
- `Response` → `ResponseValues` (one-to-many)

---

## Security

- Password hashing with **bcrypt**
- JWT stored in **localStorage** with Bearer token headers
- RBAC enforced at backend (route + service layers)
- Input validation on both **frontend and backend**
- Redis used for **token invalidation** on logout

---



## API Overview

### Auth Routes (`/auth`)

| Method | Endpoint | Middleware | Description |
|--------|----------|------------|-------------|
| POST | `/auth/register` | None | Register a new user |
| POST | `/auth/login` | None | Login and receive JWT |
| POST | `/auth/logout` | `authenticate` | Logout and blacklist token in Redis |

### Form Routes (`/forms`)

| Method | Endpoint | Middleware | Description |
|--------|----------|------------|-------------|
| POST | `/forms` | `authenticate`, `isAdmin`, `validate(createFormSchema)` | Create a new form (Admin only) |
| GET | `/forms?page=&limit=` | `authenticate` | List all forms with pagination |
| GET | `/forms/:id` | None | Get a single form with its fields |
| PUT | `/forms/:id` | `authenticate`, `isAdmin`, `validate(createFormSchema)` | Update a form (Admin only) |
| POST | `/forms/:id/submit` | `authenticate` | Submit or update response (upsert — creates on first submit, replaces values on resubmit) |
| GET | `/forms/:id/responses` | `authenticate` | Get the authenticated user's response for a form (returns `{}` if none) |

---

## Key Learnings

-# Dynamic Form Builder – Key Technical Implementations

## 1. Database Transactions (Sequelize)
- Used Sequelize transactions to ensure atomic operations
- Applied during:
  - Form creation
  - Field insertion
  - Validation/options storage
- Ensures:
  - Full success OR full rollback (no partial data)

---

## 2. EAV Pattern (Entity-Attribute-Value)
- Implemented dynamic schema using EAV pattern
- Structure:
  - Entity → Form
  - Attribute → Field
  - Value → User input
- Benefits:
  - No schema changes required
  - Supports dynamic fields (text, dropdown, checkbox, etc.)

---

## 3. Layered Architecture
- Followed clean structure:
  Routes → Controllers → Services → Database
- Separation of concerns:
  - Routes → API endpoints
  - Controllers → request/response handling
  - Services → business logic
  - Models → DB interaction

---

## 4. Validation Layers
- Frontend (React):
  - Required fields
  - Type validations
- Backend (Node.js):
  - Data validation
  - Security checks
- Ensures data integrity and prevents invalid input

---

## 5. RBAC (Role-Based Access Control)
- Roles implemented:
  - Admin → Manage forms
  - User → Fill forms
- Restricts unauthorized access

---

## 6. JWT Authentication
- Used JWT for authentication
- Token stored in localStorage
- Middleware used to protect routes

---

## 7. Redis for Token Invalidation
- Stored blacklisted tokens in Redis on logout
- Prevents reuse of expired/invalid tokens
- Adds extra security layer

---

## 8. Dynamic Form Rendering (React)
- UI generated dynamically from backend response
- Supports:
  - Field types
  - Validation rules
  - Options (dropdown, radio, etc.)
- No hardcoded forms

---

## 9. React Context (Global State)
- Managed global authentication state
- Stored:
  - User data
  - Token
- Avoided prop drilling

---

## 10. TanStack Query
- Used for server-state management
- Features:
  - Data fetching
  - Caching
  - Auto refetch
- Improves performance and UX

---

## 11. Concurrency Handling
- Prevented duplicate submissions
- Managed conflicting updates


---

## 12. Centralized Error Handling
- Implemented global error middleware in Express
- Ensures:
  - Consistent API responses
  - Cleaner code structure
---



## Conclusion

I built a dynamic form builder using Node.js, React, and PostgreSQL with an EAV-based schema for flexibility. I used Sequelize transactions to ensure atomic operations during form creation, implemented RBAC and JWT authentication with Redis-based token invalidation, and followed a clean layered architecture. On the frontend, I used React Context and TanStack Query for efficient state and server data management
