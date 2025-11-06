# FIX: MySQL Connection Error - Can't Find Sessions Table

## The Problem ⚠️

Error shows:
```
Illuminate\Database\QueryException: could not find driver 
(Connection: mysql, SQL: select * from `sessions` ...)
```

**What's happening:**
- You changed to MySQL ✅
- BUT either:
  1. MySQL is NOT running in XAMPP
  2. OR the `influenita` database doesn't exist
  3. OR the migrations weren't run

---

## QUICK FIX: 3 Steps ⭐

### Step 1: Make Sure MySQL is Running

**Check XAMPP Control Panel:**
1. Open XAMPP Control Panel
2. Look for MySQL service
3. Should show **[Stop]** button with green text
4. If it shows **[Start]** button → Click it to start!

**If MySQL won't start:**
```bash
# In Command Prompt (as Administrator):
net start MySQL80
```

### Step 2: Create the Database

1. Go to: http://localhost/phpmyadmin
2. Login: Username `root`, Password (empty)
3. Click **Databases** tab
4. Create database named: `influenita`
5. Collation: `utf8mb4_unicode_ci`

### Step 3: Run Migrations

In your project terminal:
```bash
php artisan migrate
```

**You should see:**
```
Migrating: 2014_10_12_000000_create_users_table
Migrated: 2014_10_12_000000_create_users_table

Migrating: 2024_01_01_000000_create_sessions_table
Migrated: 2024_01_01_000000_create_sessions_table
...
```

### Step 4: Restart Laravel

```bash
# Stop server: Ctrl+C
# Start again:
php artisan serve
```

### Step 5: Refresh Browser

1. Go to: http://localhost:8000
2. Press **F5**
3. **Login page appears!** ✅

---

## Verify Everything Works

### Test Steps:

1. ✅ **See login page** at http://localhost:8000
2. ✅ **Try login:**
   - Email: `test@example.com`
   - Password: `password`
3. ✅ **Should see dashboard**

---

## Troubleshooting

### Still Getting Error?

#### Check 1: Is MySQL Running?

```bash
# In Command Prompt:
mysql -u root

# If you see mysql> prompt, MySQL is running! Type: exit
```

If error "Access denied" or "Can't connect":
- Open XAMPP Control Panel
- Click [Start] next to MySQL
- Wait 5 seconds for it to start

#### Check 2: Does Database Exist?

1. Go to: http://localhost/phpmyadmin
2. Look at left sidebar
3. Should see: `influenita`
4. If not there:
   - Click **Databases** tab
   - Create new database: `influenita`

#### Check 3: Are Migrations Run?

```bash
# In your project terminal:
php artisan migrate:status
```

**Should show all migrations as: Ran**

If not:
```bash
php artisan migrate
```

#### Check 4: Database Tables Exist?

1. phpMyAdmin → Select `influenita` database
2. Should see tables:
   - users
   - sessions ← This is what's missing!
   - password_reset_tokens
   - migrations
   - jobs
   - job_batches
   - failed_jobs

If not, run migrations:
```bash
php artisan migrate
```

---

## Complete Setup Checklist

- [ ] XAMPP installed
- [ ] MySQL service running (XAMPP Control Panel [Stop] button visible)
- [ ] Database `influenita` created in phpMyAdmin
- [ ] `.env` has `DB_CONNECTION=mysql`
- [ ] `.env` has correct database settings:
  ```
  DB_HOST=127.0.0.1
  DB_DATABASE=influenita
  DB_USERNAME=root
  DB_PASSWORD=
  ```
- [ ] Migrations run: `php artisan migrate`
- [ ] Laravel server started: `php artisan serve`
- [ ] Browser refreshed: F5
- [ ] See login page at http://localhost:8000
- [ ] Can login with test@example.com / password

---

## Specific Error Scenarios

### Error: "SQLSTATE[HY000]: General error: 2054"

**Problem:** MySQL not running

**Fix:**
```bash
net stop MySQL80
net start MySQL80
```

### Error: "SQLSTATE[HY000]: General error: 1030"

**Problem:** Table not found (migrations not run)

**Fix:**
```bash
php artisan migrate
```

### Error: "Unknown database 'influenita'"

**Problem:** Database not created

**Fix:**
1. Open phpMyAdmin
2. Create database `influenita`
3. Run migrations

### Error: "Access denied for user 'root'@'localhost'"

**Problem:** Wrong password in .env

**Fix:** Check .env has:
```
DB_USERNAME=root
DB_PASSWORD=
```
(Password is EMPTY!)

---

## Commands You Need

```bash
# Check MySQL is running
mysql -u root

# Run all migrations
php artisan migrate

# Check migration status
php artisan migrate:status

# See all tables
php artisan tinker
>>> \DB::select('SHOW TABLES')
>>> exit

# Test database connection
php artisan tinker
>>> DB::connection()->getPdo()
>>> exit

# Clear cache
php artisan cache:clear

# Restart server
# Ctrl+C then:
php artisan serve
```

---

## Step-by-Step Complete Workflow

### 1. Start XAMPP MySQL
```
XAMPP Control Panel → Click [Start] next to MySQL
Wait for green status...
```

### 2. Create Database
```
http://localhost/phpmyadmin
Login: root / (no password)
Create database: influenita
```

### 3. Open Terminal in Project
```bash
cd Desktop\tretproekt\Tretproekt
```

### 4. Run Migrations
```bash
php artisan migrate
```

### 5. Start Laravel
```bash
php artisan serve
```

### 6. Open Browser
```
http://localhost:8000
```

### 7. Login Test
```
Email: test@example.com
Password: password
```

✅ **You're in!**

---

## Summary

**Error cause:** MySQL not running OR database/tables missing

**Solutions:**
1. ✅ Start MySQL in XAMPP
2. ✅ Create `influenita` database
3. ✅ Run migrations: `php artisan migrate`
4. ✅ Restart Laravel
5. ✅ Refresh browser

**Result:** Login page appears, can login with test@example.com! 🚀
