# Supabase Connection Troubleshooting

## Error: ENOTFOUND hostname

This means the database hostname can't be found. Let's fix it!

---

## 🔍 Get Correct Connection Details

### Step 1: Go to Supabase Dashboard

1. Open [Supabase Dashboard](https://supabase.com/dashboard/projects)
2. Click on your project
3. Click **"Project Settings"** (gear icon, bottom left)
4. Click **"Database"** tab

### Step 2: Find Connection Info

Scroll to **"Connection Info"** section. You'll see:

```
Host: db.xxxxxxxxxxxxxxxxxxxxx.supabase.co
Database name: postgres
Port: 5432
User: postgres
Password: [your-project-password]
```

**Important:** Copy the EXACT hostname!

### Step 3: Or Use Connection String

Scroll to **"Connection string"** section:

**URI (Session Pooling):**
```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres
```

**URI (Connection Pooling) - Recommended:**
```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

---

## ✅ Two Ways to Connect

### Option 1: Direct Connection (Simple)

Use the **Host** from "Connection Info":

```env
DB_HOST=db.xxxxxxxxxxxxxxxxxxxxx.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your_password
```

### Option 2: Connection Pooling (Recommended for Production)

Parse the **URI (Connection Pooling)** string:

```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

Becomes:

```env
DB_HOST=aws-0-us-east-1.pooler.supabase.com
DB_PORT=6543
DB_NAME=postgres
DB_USER=postgres.[PROJECT-REF]
DB_PASSWORD=your_password
```

---

## 🔧 Update Your .env File

Based on what you find in Supabase, update your `.env`:

```env
PORT=5000
DB_HOST=<exact-host-from-supabase>
DB_PORT=<5432-or-6543>
DB_NAME=postgres
DB_USER=<exact-user-from-supabase>
DB_PASSWORD=f5!J6DBu++SqyDu
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
NODE_ENV=development
```

---

## 🧪 Test Connection

After updating `.env`:

```bash
npm run dev
```

Should see:
```
✅ Connected to PostgreSQL database
✅ Database tables initialized
🚀 Server running on port 5000
```

---

## ❓ Common Issues

### Issue: "db.xxxxx.supabase.co" not found

**Cause:** Project still initializing or wrong hostname

**Solution:**
1. Wait 2-3 minutes after project creation
2. Verify exact hostname in Supabase dashboard
3. Try connection pooling URL instead

### Issue: "password authentication failed"

**Cause:** Wrong password

**Solution:**
1. Check password in Supabase Project Settings → Database
2. Update `DB_PASSWORD` in `.env`

### Issue: "too many connections"

**Cause:** Using direct connection with many requests

**Solution:**
1. Use connection pooling (port 6543)
2. Update `DB_HOST` to pooler URL
3. Update `DB_PORT` to 6543

---

## 📸 Screenshot Guide

1. Supabase Dashboard → Project Settings → Database
2. Look for section: **"Connection Info"** or **"Connection string"**
3. Copy the exact values shown there

---

## 🎯 Quick Checklist

- [ ] Supabase project is fully created (status: Active)
- [ ] Copied exact hostname from Supabase dashboard
- [ ] Password matches what you set in Supabase
- [ ] Database name is `postgres` (default)
- [ ] User is `postgres` (or `postgres.xxx` for pooling)
- [ ] Port is `5432` (direct) or `6543` (pooling)

---

## 💡 Alternative: Use Full Connection String

Instead of individual variables, you can use a connection string:

### Update database.js:

```javascript
// Option: Use connection string instead
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});
```

### Update .env:

```env
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres
```

This might be easier!
