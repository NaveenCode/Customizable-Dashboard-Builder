# Deployment Guide

This guide explains how to deploy the Customizable Dashboard application.

## Database Schema Management

### How It Works

The application uses **automatic schema creation**:

1. **Tables are created automatically** when the backend starts
2. The `initDatabase()` function runs on server startup
3. Uses `CREATE TABLE IF NOT EXISTS` - safe to run multiple times

### What You Need to Set Up Manually

#### Option 1: Quick Setup (For Development)

```bash
# 1. Make sure PostgreSQL is installed and running
brew services start postgresql  # macOS
# or
sudo service postgresql start   # Linux

# 2. Create the database
createdb dashboard_db

# 3. That's it! Tables will be created automatically when you start the server
```

#### Option 2: Using the Setup Script

```bash
# Navigate to backend folder
cd backend

# Make the script executable
chmod +x scripts/setup.sh

# Run the setup script
./scripts/setup.sh
```

#### Option 3: Manual SQL Setup

```bash
# Connect to PostgreSQL
psql -U postgres

# Run the setup script
\i backend/scripts/setup-database.sql

# Exit
\q
```

## Environment Variables

### Backend (.env)

Create `backend/.env`:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=dashboard_db
DB_USER=your_postgres_user
DB_PASSWORD=your_password
JWT_SECRET=change_this_to_a_random_secure_string
NODE_ENV=production
```

### Frontend (.env.local)

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Deployment Steps

### Local Deployment

```bash
# 1. Setup database
cd backend
./scripts/setup.sh

# 2. Install backend dependencies
npm install

# 3. Start backend
npm start

# 4. In a new terminal, setup frontend
cd frontend
npm install

# 5. Build frontend
npm run build

# 6. Start frontend
npm start
```

### Production Deployment

#### Option A: Platform as a Service (Heroku, Render, Railway)

1. **Database**:
   - These platforms provide PostgreSQL add-ons
   - Database and user are created automatically
   - You just get a `DATABASE_URL`

2. **Backend**:
   - Tables are created automatically on first startup
   - No manual SQL needed!

3. **Environment Variables**:
   - Set via platform dashboard
   - Example for Render:
     ```
     DB_HOST=<from-database-addon>
     DB_PORT=5432
     DB_NAME=<from-database-addon>
     DB_USER=<from-database-addon>
     DB_PASSWORD=<from-database-addon>
     JWT_SECRET=<generate-random-string>
     NODE_ENV=production
     ```

#### Option B: VPS (DigitalOcean, AWS EC2, etc.)

1. **Install PostgreSQL**:
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

2. **Create Database**:
```bash
sudo -u postgres psql
CREATE DATABASE dashboard_db;
CREATE USER dashboard_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE dashboard_db TO dashboard_user;
\q
```

3. **Clone & Setup**:
```bash
git clone <your-repo>
cd customizable-dashboard/backend
npm install
npm start  # Tables created automatically!
```

4. **Setup Frontend**:
```bash
cd ../frontend
npm install
npm run build
npm start
```

#### Option C: Docker (Recommended for Production)

Create `docker-compose.yml` in root:

```yaml
version: '3.8'

services:
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: dashboard_db
      POSTGRES_USER: dashboard_user
      POSTGRES_PASSWORD: secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      DB_HOST: db
      DB_PORT: 5432
      DB_NAME: dashboard_db
      DB_USER: dashboard_user
      DB_PASSWORD: secure_password
      JWT_SECRET: your_jwt_secret
      NODE_ENV: production
    depends_on:
      - db

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:5000
    depends_on:
      - backend

volumes:
  postgres_data:
```

Then run:
```bash
docker-compose up -d
```

The database AND tables are created automatically!

## Database Migrations (Optional - For Future Changes)

If you want to add more tables or modify schemas later, consider using a migration tool:

### Option 1: node-pg-migrate

```bash
npm install node-pg-migrate

# Create migration
npx node-pg-migrate create add-new-table

# Run migrations
npx node-pg-migrate up
```

### Option 2: Knex.js

```bash
npm install knex

# Create migration
npx knex migrate:make add_new_table

# Run migrations
npx knex migrate:latest
```

## Sharing with Others

### For Teammates/Developers

1. Share the repository
2. They run:
```bash
# Backend
cd backend
npm install
createdb dashboard_db  # One-time setup
npm run dev            # Tables created automatically!

# Frontend
cd frontend
npm install
npm run dev
```

### For End Users/Demos

Deploy to a platform and share the URL:
- **Vercel** (Frontend): Free, automatic deployments
- **Render** (Backend + DB): Free tier available
- **Railway** (Full stack): Easy setup

## Verification

After deployment, verify everything works:

```bash
# 1. Check backend health
curl http://your-backend-url/

# 2. Check database connection
# Look for this in logs:
✅ Connected to PostgreSQL database
✅ Database tables initialized

# 3. Test registration
curl -X POST http://your-backend-url/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# 4. Check tables were created
psql -U your_user -d dashboard_db -c "\dt"
# Should show: users, dashboards
```

## Summary

✅ **Tables are created automatically** - no manual SQL needed
✅ **Only the database needs to be created once**
✅ **Safe to restart** - uses `IF NOT EXISTS`
✅ **Platform-agnostic** - works on any hosting provider
✅ **Easy to share** - teammates just need to create the database

The key point: **Your code already handles schema creation perfectly!** You just need to ensure the database exists.
