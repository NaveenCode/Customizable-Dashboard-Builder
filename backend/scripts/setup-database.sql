-- Database Setup Script for Customizable Dashboard
-- This script creates the database and user for the application

-- Step 1: Create database (if it doesn't exist)
-- Note: This must be run by a PostgreSQL superuser (like postgres)

-- Check if database exists, if not create it
SELECT 'CREATE DATABASE dashboard_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'dashboard_db')\gexec

-- Step 2: Create user (optional - only if you want a dedicated user)
-- Uncomment these lines if you want to create a new user for the app

-- CREATE USER dashboard_user WITH PASSWORD 'your_secure_password_here';
-- GRANT ALL PRIVILEGES ON DATABASE dashboard_db TO dashboard_user;

-- Step 3: Connect to the database
\c dashboard_db

-- The tables will be created automatically by the application
-- when it starts (see src/config/database.js)

-- But if you want to create them manually, here they are:

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS dashboards (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  widgets JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_dashboards_user_id ON dashboards(user_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Done!
\echo 'Database setup complete!'
