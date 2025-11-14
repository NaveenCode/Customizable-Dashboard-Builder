# Customizable Dashboard

A full-stack customizable dashboard application with user authentication and widget management.

## Features

- 🔐 User authentication (JWT-based)
- 📊 Customizable dashboard with multiple widget types
- ⏰ Clock widget with real-time updates
- 📝 Notes widget for quick note-taking
- ✅ Todo list widget for task management
- 💾 Persistent storage in PostgreSQL
- 🎨 Modern, responsive UI with Tailwind CSS

## Tech Stack

### Backend
- Node.js + Express.js
- PostgreSQL with JSONB
- JWT authentication
- bcrypt for password hashing

### Frontend
- Next.js 16 (App Router)
- React 19
- Zustand (state management)
- Tailwind CSS
- Axios

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+

### Database Setup

**Good News**: Tables are created automatically! You only need to create the database.

```bash
# Option 1: Quick command
createdb dashboard_db

# Option 2: Use our setup script
cd backend
./scripts/setup.sh

# Option 3: Manual (in psql)
CREATE DATABASE dashboard_db;
```

That's it! The `users` and `dashboards` tables will be created automatically when the backend starts.

### Backend Setup

```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Edit .env with your database credentials

npm run dev
```

The server will:
1. Connect to PostgreSQL
2. **Automatically create tables** (users, dashboards)
3. Start listening on port 5000

### Frontend Setup

```bash
cd frontend
npm install

# Create .env.local file
echo "NEXT_PUBLIC_API_URL=http://localhost:5000" > .env.local

npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Database Schema

### Automatic Schema Creation

The application uses **automatic schema management**:

```javascript
// backend/src/config/database.js
export const initDatabase = async () => {
  // Creates users table
  await client.query(`CREATE TABLE IF NOT EXISTS users (...)`);

  // Creates dashboards table
  await client.query(`CREATE TABLE IF NOT EXISTS dashboards (...)`);
};
```

This runs every time the server starts. It's safe because of `IF NOT EXISTS`.

### Schema Details

**Users Table**:
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Dashboards Table**:
```sql
CREATE TABLE dashboards (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  widgets JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id)
);
```

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/verify` - Verify JWT token
- `POST /auth/logout` - Logout user

### Dashboard
- `GET /dashboard` - Get user's dashboard
- `POST /dashboard` - Save dashboard widgets

See [API Documentation](./backend/README.md) for details.

## Project Structure

```
customizable-dashboard/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js      # Auto-creates tables!
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   └── dashboard.js
│   │   └── server.js
│   ├── scripts/
│   │   ├── setup.sh             # Database setup helper
│   │   └── setup-database.sql   # Manual SQL setup
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── lib/
│   │   └── store/
│   └── package.json
│
├── DEPLOYMENT.md                 # Deployment guide
└── README.md
```

## Deployment

The application is designed to be deployment-friendly:

✅ **Tables created automatically** - no manual SQL scripts needed
✅ **Environment-based configuration** - works anywhere
✅ **Platform-agnostic** - deploy to Heroku, Render, Vercel, AWS, etc.

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy Options

**Render** (Recommended for beginners):
1. Connect your GitHub repo
2. Add PostgreSQL database (automatic)
3. Set environment variables
4. Deploy! Tables created automatically ✨

**Vercel + Railway**:
- Frontend: Deploy to Vercel
- Backend + DB: Deploy to Railway

**Docker**:
```bash
docker-compose up -d
```

Everything is containerized and ready to go!

## Development

### Backend
```bash
cd backend
npm run dev  # Runs with nodemon (auto-restart)
```

### Frontend
```bash
cd frontend
npm run dev  # Hot reload enabled
```

## Testing APIs

Use the provided curl commands in [backend/README.md](./backend/README.md) or use the test script:

```bash
# Register
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## Common Issues

### Database Connection Error

```
error: role "postgres" does not exist
```

**Solution**: Update `.env` with your PostgreSQL username:
```env
DB_USER=your_username  # Usually your macOS username
```

### Tables Not Created

**Solution**: Check server logs for:
```
✅ Connected to PostgreSQL database
✅ Database tables initialized
```

If not showing, the server failed to start. Check your database connection.

### Port Already in Use

```bash
# Find and kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or use different port in .env
PORT=5001
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT

## Author

Built with ❤️ for learning full-stack development

---

**Key Features:**
- ✅ Automatic database schema management
- ✅ JWT authentication
- ✅ Real-time widgets
- ✅ Persistent storage
- ✅ Production-ready
