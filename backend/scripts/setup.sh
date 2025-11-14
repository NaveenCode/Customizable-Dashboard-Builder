#!/bin/bash

# Database Setup Script for Customizable Dashboard
# This script automates the database creation process

echo "🚀 Starting database setup..."

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '#' | xargs)
else
    echo "❌ .env file not found!"
    echo "Please create a .env file first"
    exit 1
fi

# Check if PostgreSQL is running
if ! pg_isready -q; then
    echo "❌ PostgreSQL is not running!"
    echo "Please start PostgreSQL first"
    exit 1
fi

echo "✅ PostgreSQL is running"

# Create database if it doesn't exist
echo "📦 Creating database '$DB_NAME'..."

# Try to create database (will fail silently if it exists)
psql -U "$DB_USER" -tc "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'" | grep -q 1 || \
psql -U "$DB_USER" -c "CREATE DATABASE $DB_NAME"

if [ $? -eq 0 ]; then
    echo "✅ Database '$DB_NAME' is ready"
else
    echo "⚠️  Database might already exist (this is okay)"
fi

# The tables will be created automatically when the app starts
echo "✅ Database setup complete!"
echo ""
echo "ℹ️  Note: Tables will be created automatically when you run 'npm start'"
echo ""
echo "🎯 Next steps:"
echo "   1. Run: npm install"
echo "   2. Run: npm run dev"
echo ""
