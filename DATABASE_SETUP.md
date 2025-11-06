# Database Setup Guide for Influenita

This guide will help you set up the database for your Laravel 11 Influenita project. You can choose between **MySQL** (recommended) or **MongoDB**.

---

## Option 1: MySQL Setup (Recommended)

MySQL is the standard database for Laravel and works perfectly with all Laravel features.

### Step 1: Install MySQL

#### Windows (XAMPP):
1. Download and install XAMPP from https://www.apachefriends.org/
2. Start XAMPP Control Panel
3. Start **Apache** and **MySQL** services

#### Windows (Standalone MySQL):
1. Download MySQL from https://dev.mysql.com/downloads/installer/
2. Install MySQL Server
3. Remember the root password you set during installation

### Step 2: Create Database

1. Open phpMyAdmin (if using XAMPP): `http://localhost/phpmyadmin`
   - Or use MySQL Workbench
   - Or use command line: `mysql -u root -p`

2. Create a new database:
```sql
CREATE DATABASE influenita CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Step 3: Configure Laravel .env File

1. Copy `.env.example` to `.env` (if not already done):
```bash
cp .env.example .env
```

2. Edit your `.env` file and set these values:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=influenita
DB_USERNAME=root
DB_PASSWORD=          # Leave empty if you have no password, or add your MySQL password
```

### Step 4: Run Migrations

```bash
# Clear config cache
php artisan config:clear

# Run migrations
php artisan migrate

# (Optional) Run seeders if you have any
php artisan db:seed
```

### Common MySQL Errors and Fixes

#### Error: "SQLSTATE[HY000] [2002] Connection refused"
**Solution**: MySQL service is not running
- Start MySQL in XAMPP Control Panel
- Or start MySQL service: `net start MySQL80` (Windows)

#### Error: "Access denied for user 'root'@'localhost'"
**Solution**: Wrong password
- Check your MySQL root password
- Update `DB_PASSWORD` in `.env` file
- Run: `php artisan config:clear`

#### Error: "Base table or view not found: sessions"
**Solution**: Migrations not run
- Run: `php artisan migrate`

---

## Option 2: MongoDB Setup (Alternative)

MongoDB can work with Laravel but requires additional setup and packages.

### Step 1: Install MongoDB

1. Download MongoDB from https://www.mongodb.com/try/download/community
2. Install MongoDB Community Server
3. MongoDB should start automatically as a service

### Step 2: Install PHP MongoDB Extension

#### Windows:
1. Download the correct DLL from https://pecl.php.net/package/mongodb
   - Match your PHP version (check with `php -v`)
   - Match your architecture (x64 or x86)
2. Copy `php_mongodb.dll` to your PHP extensions folder:
   - XAMPP: `C:\xampp\php\ext\`
3. Edit `php.ini` and add:
```ini
extension=mongodb
```
4. Restart Apache/PHP

### Step 3: Install Laravel MongoDB Package

```bash
composer require mongodb/laravel-mongodb
```

### Step 4: Configure Laravel for MongoDB

1. Edit `config/database.php` and add MongoDB connection:

```php
'mongodb' => [
    'driver' => 'mongodb',
    'host' => env('DB_HOST', '127.0.0.1'),
    'port' => env('DB_PORT', 27017),
    'database' => env('DB_DATABASE', 'influenita'),
    'username' => env('DB_USERNAME', ''),
    'password' => env('DB_PASSWORD', ''),
    'options' => [
        'database' => env('DB_AUTHENTICATION_DATABASE', 'admin'),
    ],
],
```

2. Update `.env` file:
```env
DB_CONNECTION=mongodb
DB_HOST=127.0.0.1
DB_PORT=27017
DB_DATABASE=influenita
DB_USERNAME=
DB_PASSWORD=
```

### Step 5: Update Models for MongoDB

Change your models to extend MongoDB's Eloquent model:

```php
// Old:
use Illuminate\Database\Eloquent\Model;

// New:
use MongoDB\Laravel\Eloquent\Model;

class Campaign extends Model
{
    protected $connection = 'mongodb';
    // ... rest of your model
}
```

### Important Notes for MongoDB:
- Not all Laravel features work with MongoDB
- Relationships work differently
- Some migrations may need to be rewritten
- Testing required for all functionality

---

## Recommended Approach

**Use MySQL** because:
1. ✅ Full Laravel support
2. ✅ All features work out of the box
3. ✅ Better for relational data (campaigns, users, applications)
4. ✅ Easier to debug and maintain
5. ✅ Your migrations are already written for MySQL

---

## Quick Start (MySQL)

```bash
# 1. Start MySQL (XAMPP or service)

# 2. Create database in phpMyAdmin or:
mysql -u root -p
CREATE DATABASE influenita;
exit;

# 3. Configure .env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=influenita
DB_USERNAME=root
DB_PASSWORD=

# 4. Run commands
php artisan config:clear
php artisan migrate
php artisan db:seed

# 5. Test
php artisan serve
```

---

## Verification

To verify your database is working:

```bash
# Test database connection
php artisan tinker
DB::connection()->getPdo();
# Should return PDO object without errors

# Check tables
php artisan db:show
# Or:
php artisan db:table campaigns
```

---

## Need Help?

1. Check if MySQL is running in XAMPP Control Panel
2. Verify database exists in phpMyAdmin
3. Check `.env` file has correct credentials
4. Run: `php artisan config:clear` after changing `.env`
5. Check Laravel logs: `storage/logs/laravel.log`

---

**Last Updated**: November 2025
**Laravel Version**: 11.x
**PHP Version**: 8.3+
