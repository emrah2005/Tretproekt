# FIX: "could not find driver (Connection: sqlite)" Error

## The Problem ⚠️

Your `.env` file is set to use **SQLite** but you're using **MySQL**.

Error message:
```
Illuminate\Database\QueryException: could not find driver 
(Connection: sqlite, SQL: select * from "sessions"...)
```

---

## Quick Fix: 2 Minutes ⭐

### Step 1: Open Your `.env` File

1. Open your project folder in VS Code
2. Find `.env` file (in project root)
3. Open it

### Step 2: Find and Change DB_CONNECTION

**Find this line:**
```
DB_CONNECTION=sqlite
```

**Change it to:**
```
DB_CONNECTION=mysql
```

### Step 3: Verify Your Database Settings

Make sure you have these lines (update if needed):

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=influenita
DB_USERNAME=root
DB_PASSWORD=
DB_COLLATION=utf8mb4_unicode_ci
```

### Step 4: Save the File

Press **Ctrl+S** to save

### Step 5: Restart Laravel Server

1. In your terminal, press **Ctrl+C** to stop the server
2. Type:
   ```bash
   php artisan serve
   ```
3. Wait for message: "Starting Laravel development server..."

### Step 6: Refresh Browser

1. Go to **http://localhost:8000**
2. Press **F5** to refresh
3. **Error is gone!** ✅

---

## What You Should See Now

### Success Page
You should see:
- Laravel Breeze welcome page
- Login/Register buttons
- Tailwind CSS styling
- No errors!

### Test Login
- Email: `test@example.com`
- Password: `password`

Then you're on the dashboard! ✅

---

## Why This Happened

**SQLite:** Lightweight database, good for simple apps, but you don't have it installed
**MySQL:** Production-grade, what you're using with XAMPP

Laravel defaults to SQLite, so the `.env` was set to that.

---

## Before/After Comparison

### BEFORE (Wrong) ❌
```env
DB_CONNECTION=sqlite
DB_DATABASE=database/database.sqlite
```
**Error:** "could not find driver (Connection: sqlite...)"

### AFTER (Correct) ✅
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_DATABASE=influenita
DB_USERNAME=root
DB_PASSWORD=
```
**Result:** Works perfectly!

---

## Complete .env Database Section

**Copy this entire section and replace in your .env:**

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=influenita
DB_USERNAME=root
DB_PASSWORD=
DB_COLLATION=utf8mb4_unicode_ci
```

---

## Troubleshooting If Still Error

### Still getting SQLite error?

1. Make sure MySQL is running in XAMPP
2. Make sure you saved the `.env` file
3. Make sure you restarted Laravel server (Ctrl+C and `php artisan serve` again)
4. Try: `php artisan cache:clear`

### Getting "Access denied for user 'root'@'localhost'"?

Check your `.env` has:
```env
DB_USERNAME=root
DB_PASSWORD=
```

(Password should be EMPTY)

### Getting "Unknown database 'influenita'"?

1. Open phpMyAdmin: http://localhost/phpmyadmin
2. Create database named `influenita`
3. Refresh Laravel (F5)

---

## Next Steps After Fix

1. ✅ View http://localhost:8000
2. ✅ Test login
3. ✅ Run migrations:
   ```bash
   php artisan migrate
   ```
4. ✅ Start building your frontend!

---

## Commands to Know

```bash
# Clear cache (helps with config changes)
php artisan cache:clear

# Test database connection
php artisan tinker
>>> DB::connection()->getPdo()
>>> exit

# See all database tables
php artisan tinker
>>> \DB::select('SHOW TABLES')
>>> exit
```

---

## Summary

✅ **Problem:** `.env` set to SQLite
✅ **Solution:** Change `DB_CONNECTION=sqlite` to `DB_CONNECTION=mysql`
✅ **Time to fix:** 2 minutes

**You're now fixed and ready to go!** 🚀
