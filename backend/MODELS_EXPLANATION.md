# PostgreSQL Models - Mongoose-Style Organization

## Why PostgreSQL Schemas Feel Different from MongoDB

### The Core Difference

**MongoDB (NoSQL)**:
- Schema is **optional** (even with Mongoose)
- Collections created **automatically** when you insert data
- Schema exists only in your code (for validation)
- Database doesn't enforce structure

**PostgreSQL (SQL)**:
- Schema is **required**
- Tables must be **explicitly created** before use
- Schema exists in **both code and database**
- Database **strictly enforces** structure

---

## MongoDB vs PostgreSQL - Side by Side

### MongoDB with Mongoose

```javascript
// models/User.js
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Usage
await User.create({ email: 'test@example.com', password: 'hashed' });
const user = await User.findOne({ email: 'test@example.com' });
```

**What happens**:
1. Schema defined in code
2. Collection created automatically on first insert
3. MongoDB stores data as documents (JSON-like)

### PostgreSQL with Our New Model Pattern

```javascript
// models/userModel.js
export const userSchema = {
  tableName: 'users',
  columns: {
    id: 'SERIAL PRIMARY KEY',
    email: 'VARCHAR(255) UNIQUE NOT NULL',
    password: 'VARCHAR(255) NOT NULL',
    created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP'
  }
};

export class UserModel {
  async create(email, password) { ... }
  async findByEmail(email) { ... }
}

// Usage
import { User } from './models/index.js';

await User.create('test@example.com', 'hashed');
const user = await User.findByEmail('test@example.com');
```

**What happens**:
1. Schema defined in code
2. Table created explicitly via `initModels()`
3. PostgreSQL stores data in structured rows/columns

---

## Old Structure vs New Structure

### Old Way (What You Had)

```
backend/
└── src/
    └── config/
        └── database.js          ← Everything in one file
```

```javascript
// database.js
export const initDatabase = async () => {
  await client.query(`CREATE TABLE users (...)`);
  await client.query(`CREATE TABLE dashboards (...)`);
};

// In routes
const result = await pool.query('SELECT * FROM users WHERE email = $1');
```

**Problems**:
- SQL scattered across route files
- Hard to reuse queries
- Doesn't look like Mongoose
- No central model definition

### New Way (Mongoose-Style)

```
backend/
└── src/
    └── models/
        ├── index.js            ← Central export (like Mongoose)
        ├── userModel.js        ← User schema + methods
        └── dashboardModel.js   ← Dashboard schema + methods
```

```javascript
// models/index.js (Similar to Mongoose)
export const User = new UserModel(pool);
export const Dashboard = new DashboardModel(pool);

// In routes (Clean like Mongoose!)
import { User } from '../models/index.js';

const user = await User.findByEmail(email);
const newUser = await User.create(email, hashedPassword);
```

**Benefits**:
✅ Looks like Mongoose pattern
✅ SQL queries in one place
✅ Reusable methods
✅ Easy to test
✅ Organized like MongoDB projects

---

## How to Use the New Model Structure

### 1. Update server.js

```javascript
// OLD
import { initDatabase } from './config/database.js';
await initDatabase();

// NEW
import { initModels } from './models/index.js';
await initModels();
```

### 2. Use Models in Routes

**Before (Old Way)**:
```javascript
// routes/auth.js
const result = await pool.query(
  'SELECT * FROM users WHERE email = $1',
  [email]
);
const user = result.rows[0];
```

**After (New Way)**:
```javascript
// routes/auth.js
import { User } from '../models/index.js';

const user = await User.findByEmail(email);
```

Much cleaner! Just like Mongoose!

---

## Complete Example: User Registration

### MongoDB with Mongoose

```javascript
// models/User.js
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});
const User = mongoose.model('User', userSchema);

// routes/auth.js
const existingUser = await User.findOne({ email });
if (existingUser) return res.status(400).json({ error: 'User exists' });

const user = await User.create({ email, password: hashedPassword });
```

### PostgreSQL with Our New Pattern

```javascript
// models/userModel.js
export class UserModel {
  async findByEmail(email) {
    const result = await this.pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0];
  }

  async create(email, password) {
    const result = await this.pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *',
      [email, password]
    );
    return result.rows[0];
  }
}

// routes/auth.js
import { User } from '../models/index.js';

const existingUser = await User.findByEmail(email);
if (existingUser) return res.status(400).json({ error: 'User exists' });

const user = await User.create(email, hashedPassword);
```

**Almost identical!** 🎉

---

## Why PostgreSQL Still Needs Table Creation

### The Question:
"Why can't PostgreSQL just create tables automatically like MongoDB creates collections?"

### The Answer:

**MongoDB (Document Store)**:
```javascript
// This works immediately - no table creation needed
db.users.insert({
  email: 'test@example.com',
  age: 25,
  tags: ['developer', 'designer']
});

// Different structure? No problem!
db.users.insert({
  email: 'another@example.com',
  name: 'John',
  preferences: { theme: 'dark' }
});
```

**PostgreSQL (Relational DB)**:
```sql
-- This FAILS if table doesn't exist
INSERT INTO users (email, age) VALUES ('test@example.com', 25);
-- Error: relation "users" does not exist

-- PostgreSQL needs to know:
-- 1. What columns exist?
-- 2. What are their data types?
-- 3. What are the constraints?
-- 4. How do tables relate to each other?

-- That's why we need:
CREATE TABLE users (
  id SERIAL PRIMARY KEY,        ← Must define
  email VARCHAR(255) NOT NULL,  ← Must define
  age INTEGER                   ← Must define
);
```

**Why?**
- **MongoDB**: Flexible, each document can have different fields
- **PostgreSQL**: Strict, all rows must follow the same structure

---

## Best of Both Worlds

### What We Built:

1. **Schema in Code** (like MongoDB)
   - `userModel.js`, `dashboardModel.js`
   - Clean model definitions
   - Reusable methods

2. **Automatic Creation** (like MongoDB)
   - `initModels()` runs on startup
   - Creates tables automatically
   - No manual SQL scripts

3. **Strong Typing** (PostgreSQL benefit)
   - Guaranteed data structure
   - Relationships enforced
   - Data integrity

4. **Clean API** (like Mongoose)
   - `User.create()`
   - `User.findByEmail()`
   - `Dashboard.findByUserId()`

---

## Migration Path

### Option 1: Keep Current Code (Simple)
Your current code works perfectly! It's just organized differently.

### Option 2: Use New Model Structure (Mongoose-like)
Follow these steps:

1. **Update server.js**:
```javascript
import { initModels } from './models/index.js';
await initModels();
```

2. **Update routes to use models**:
```javascript
import { User, Dashboard } from '../models/index.js';
```

3. **Replace direct SQL with model methods**:
```javascript
// Before
const result = await pool.query('SELECT * FROM users...');

// After
const user = await User.findByEmail(email);
```

---

## Summary

| Feature | MongoDB + Mongoose | PostgreSQL (Old) | PostgreSQL (New Models) |
|---------|-------------------|------------------|-------------------------|
| Schema in code | ✅ | ✅ | ✅ |
| Auto table creation | ✅ | ✅ | ✅ |
| Clean model API | ✅ | ❌ | ✅ |
| Organized like Mongoose | ✅ | ❌ | ✅ |
| Reusable methods | ✅ | ❌ | ✅ |
| Strong typing | ❌ | ✅ | ✅ |

**Bottom Line**: You CAN organize PostgreSQL schemas just like MongoDB! I've created the model structure for you. It's optional to use, but it makes your code cleaner and more familiar.

---

## Which Should You Use?

**Current Structure** (config/database.js):
- ✅ Simple
- ✅ Works great for small apps
- ✅ Less code
- ❌ SQL scattered in routes

**New Model Structure** (models/):
- ✅ Organized like Mongoose
- ✅ Reusable queries
- ✅ Easier to test
- ✅ Scales better
- ❌ Slightly more code

**My Recommendation**: Start with what you have (it works!). If you want to practice professional patterns, migrate to the model structure.
