# MySQL Setup Guide for Influenita

## FASTEST OPTION: PlanetScale (Recommended - 5 minutes) ⭐

PlanetScale provides free MySQL-compatible databases with zero setup. Perfect for development.

### Step 1: Create PlanetScale Account
1. Go to https://planetscale.com
2. Click "Get started"
3. Sign up with GitHub (or email)
4. Verify your email

### Step 2: Create Database
1. Click "Create new database"
2. Name it: `influenita`
3. Select region closest to you
4. Click "Create database"

### Step 3: Get Connection Credentials
1. Click on your database → "Connect"
2. Choose "General" tab
3. Copy the connection string (looks like: `mysql://root:pscale_pw@aws.connect.psdb.cloud/influenita?sslaccept=strict`)

### Step 4: Update .env File

In your project root folder, find `.env` file and update these lines:

```
DB_CONNECTION=mysql
DB_HOST=aws.connect.psdb.cloud
DB_PORT=3306
DB_DATABASE=influenita
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_SSL_MODE=REQUIRED
```

**To find exact credentials:**
- In PlanetScale "Connect" tab, select "Laravel" from dropdown
- Copy the exact values shown there

### Step 5: Run Migrations

Open terminal/command prompt in your project folder and run:

```bash
php artisan migrate
```

**Expected output:**
```
Migrating: 2024_01_01_000000_create_campaigns_table
Migrated: 2024_01_01_000000_create_campaigns_table (x.xxx s)
Migrating: 2024_01_01_000001_create_profiles_table
Migrated: 2024_01_01_000001_create_profiles_table (x.xxx s)
...
```

If you see `Migration table created successfully` - you're done! ✅

### Step 6: Test Your App

```bash
php artisan serve
```

Visit http://localhost:8000 - your app should now load without errors!

---

## ALTERNATIVE OPTION: Local MySQL with XAMPP

If you prefer to work completely locally without cloud services:

### Step 1: Install XAMPP
1. Download: https://www.apachefriends.org (Windows 8.2.12)
2. Run installer
3. Install to default location (C:\xampp)
4. When prompted, install MySQL as a service

### Step 2: Start MySQL Service

**On Windows:**
```bash
# Open Command Prompt as Administrator
net start MySQL80
```

**Or use XAMPP Control Panel:**
1. Open XAMPP Control Panel
2. Click "Start" button next to "MySQL"

### Step 3: Create Database

```bash
mysql -u root
```

Then type:
```sql
CREATE DATABASE influenita;
EXIT;
```

### Step 4: Update .env File

```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=influenita
DB_USERNAME=root
DB_PASSWORD=
```

### Step 5: Run Migrations

```bash
php artisan migrate
```

### Step 6: Start Your App

```bash
php artisan serve
```

---

## Troubleshooting

### Error: "SQLSTATE[HY000] [2054] The server requested authentication method unknown to the client"

**Solution:**
Add this to your `.env`:
```
DB_COLLATION=utf8mb4_unicode_ci
```

Or in MySQL:
```sql
ALTER USER 'username'@'host' IDENTIFIED WITH mysql_native_password BY 'password';
```

### Error: "Access denied for user 'root'@'localhost'"

**Check your credentials** in `.env` file:
- For PlanetScale: Make sure you copied credentials exactly from "Connect" tab
- For Local MySQL: Default username is `root`, password is empty

### Error: "SQLSTATE[HY000]: General error: 1030"

**MySQL service not running:**
```bash
net start MySQL80  # Windows
```

Or use XAMPP Control Panel to start MySQL.

### Error: "PDOException: could not find driver"

**PHP MySQL driver not installed:**

Check if MySQLi driver is enabled in PHP:
```bash
php -m | grep -i mysql  # Mac/Linux
php -m | findstr /i mysql  # Windows
```

If not installed, uncomment this line in `php.ini`:
```
extension=pdo_mysql
extension=mysqli
```

---

## Verify Database Connection

To test if your database is connected, run:

```bash
php artisan tinker
```

Then type:
```php
>>> DB::connection()->getPdo()
>>> exit
```

If you see connection object (no error), you're connected! ✅

---

## Next Steps After Database Setup

1. Run migrations: `php artisan migrate`
2. Start server: `php artisan serve`
3. Visit http://localhost:8000
4. Test login with: email: `test@example.com`, password: `password`

---

## Database Tables Created

After migrations run, these tables are created in your database:

- `users` - User accounts
- `campaigns` - Marketing campaigns
- `profiles` - User profiles (Influencers/Brands)
- `applications` - Campaign applications
- `messages` - Messaging system
- `threads` - Message threads
- `payments` - Payment tracking
- `ratings` - Campaign ratings

View all tables:
```bash
php artisan tinker
>>> \DB::connection()->getDoctrineConnection()->getSchemaManager()->listTableNames()
```

---

## Environment Variables Reference

**PlanetScale:**
```
DB_CONNECTION=mysql
DB_HOST=aws.connect.psdb.cloud
DB_PORT=3306
DB_DATABASE=influenita
DB_USERNAME=your-username
DB_PASSWORD=your-password
```

**Local MySQL:**
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=influenita
DB_USERNAME=root
DB_PASSWORD=
```

---

## Still Having Issues?

1. Double-check `.env` file (copy values exactly as they appear in PlanetScale)
2. Make sure database exists: `SHOW DATABASES;`
3. Check MySQL is running: `mysql -u root -p` (if you can connect, service is running)
4. Clear Laravel cache: `php artisan cache:clear`
5. Regenerate app key: `php artisan key:generate`

---

## Quick Start Commands Checklist

```bash
# After setting up database credentials in .env:

# 1. Clear cache
php artisan cache:clear

# 2. Run migrations
php artisan migrate

# 3. Start server
php artisan serve

# 4. Open browser
# Visit http://localhost:8000
```

✅ **Your database is ready!**
