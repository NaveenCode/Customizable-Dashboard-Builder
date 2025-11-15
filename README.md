# Customizable Dashboard

A full-stack customizable dashboard application with drag-and-drop widgets and user authentication.

## Tools, Frameworks, and Libraries

### Backend

- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.x
- **Database**: PostgreSQL 14+ with node-postgres (pg)
- **Authentication**: jsonwebtoken (JWT), bcrypt
- **Middleware**: CORS, cookie-parser, body-parser
- **Architecture Pattern**: MVC (Routes + Controllers)

### Frontend

- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Drag & Drop**: react-grid-layout

## Authentication Method

**Token-based authentication with HTTP-only cookies**

- JWTs are generated on login with 7-day expiration
- Tokens are stored in HTTP-only cookies (not localStorage) for security
- Backend validates JWT on protected routes using middleware
- Frontend extracts user info by decoding JWT payload client-side
- Cookie-based approach prevents XSS attacks while maintaining stateless authentication

**Flow:**

1. User registers/logs in → Backend creates JWT
2. JWT stored in HTTP-only cookie
3. Frontend reads cookie automatically on requests
4. Backend middleware validates token on protected routes
5. User data persists across page refreshes via token decoding

## Architecture Decisions and Trade-offs

### Backend Architecture

**MVC Pattern with Controllers**

- Routes handle HTTP routing only
- Controllers contain business logic
- Trade-off: More files but better separation of concerns

**PostgreSQL with JSONB**

- Widget data stored as JSONB instead of separate tables
- Trade-off: Flexible schema, less relational integrity
- Benefit: Easy to add new widget types without migrations

**Automatic Schema Creation**

- Tables created via `CREATE TABLE IF NOT EXISTS` on server start
- Trade-off: No migration history, but simple deployment
- Benefit: Zero manual setup, works on any PostgreSQL instance

**Direct Database Connection (not ORM)**

- Using pg client directly instead of Sequelize/Prisma
- Trade-off: No query builder, but full SQL control
- Benefit: Lightweight, no abstraction overhead

### Frontend Architecture

**Next.js App Router**

- Using newest Next.js routing paradigm
- Trade-off: Less documentation/community examples vs Pages Router
- Benefit: Better performance, native React 19 support

**Zustand for State Management**

- Chosen over Redux/Context API
- Trade-off: State resets on refresh (solved via JWT decoding)
- Benefit: Minimal boilerplate, simple API

**Client-side JWT Decoding**

- User info extracted from JWT payload on client
- Trade-off: Payload visible to client (no sensitive data stored)
- Benefit: No additional API calls to fetch user data

**Auto-save Pattern**

- Widgets save on blur instead of explicit save buttons
- Trade-off: No user control over save timing
- Benefit: Better UX, no forgotten changes

### Security Decisions

**HTTP-only Cookies**

- Not accessible via JavaScript
- Trade-off: Can't read token on client easily
- Benefit: Protected against XSS attacks

**Password Hashing**

- bcrypt with salt rounds = 10
- Trade-off: Slower login/register vs plain text
- Benefit: Industry standard security

**No Refresh Tokens**

- Single JWT with 7-day expiration
- Trade-off: User must re-login every 7 days
- Benefit: Simpler implementation

## Known Limitations

### Functional Limitations

1. **No real-time collaboration** - Multiple users can't edit the same dashboard simultaneously
2. **No widget sharing** - Users cannot share widgets between accounts
3. **No undo/redo** - No history of dashboard changes
4. **No mobile drag-and-drop** - react-grid-layout has limited touch support
5. **No widget customization** - Limited styling options per widget
6. **No data export** - Cannot export dashboard configuration or widget data
7. **Single dashboard per user** - No support for multiple dashboards

### Security Limitations

1. **No rate limiting** - Vulnerable to brute force attacks
2. **No email verification** - Users can register with any email
3. **No password reset** - Forgotten passwords cannot be recovered
4. **No HTTPS enforcement** - Relies on deployment platform for SSL
5. **Session revocation** - No way to invalidate JWTs before expiration
6. **No CSRF protection** - Relies on SameSite cookie attribute

### Scalability Limitations

1. **Single database connection** - Not using connection pooling
2. **No caching layer** - Every request hits the database
3. **No pagination** - Loads all widgets at once
4. **Synchronous operations** - No background jobs or queues
5. **No CDN for assets** - Static files served from Next.js server

### Data Limitations

1. **JSONB storage** - Difficult to query individual widget properties
2. **No data validation schema** - Widget data not validated beyond basic type checking
3. **No audit trail** - Cannot track who changed what and when
4. **No soft deletes** - Deleted data is permanently removed

### Development Limitations

1. **No automated tests** - No unit, integration, or E2E tests
2. **No API documentation** - No Swagger/OpenAPI spec
3. **No error logging service** - Errors only logged to console
4. **No performance monitoring** - No APM or analytics

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
echo "NEXT_PUBLIC_API_URL=http://localhost:5000" > .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deployment Guides

- [Quick Deploy Guide](./QUICK_DEPLOY.md) - 15-minute setup
- [Full Deployment Guide](./FREE_DEPLOYMENT.md) - Detailed with screenshots

## Project Structure

```
customizable-dashboard/
├── backend/
│   ├── src/
│   │   ├── config/database.js       # PostgreSQL connection & schema
│   │   ├── controllers/             # Business logic
│   │   ├── middleware/auth.js       # JWT verification
│   │   ├── routes/                  # API routes
│   │   └── server.js                # Express app
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/                     # Next.js pages
│   │   ├── components/              # React components
│   │   ├── lib/                     # API & auth utilities
│   │   └── store/                   # Zustand state
│   └── package.json
│
└── README.md
```
