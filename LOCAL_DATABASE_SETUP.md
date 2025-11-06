# Local Database Setup - phpMyAdmin & XAMPP for Payment System

## Why Local with phpMyAdmin?

✅ **Full Control** - Your database, your computer
✅ **Visual Management** - See all payment data instantly
✅ **No Internet Required** - Completely offline
✅ **Free & Included** - Already in XAMPP
✅ **Perfect for Development** - Test payments safely

---

## QUICK START: 5-Minute Setup

### 1. Download XAMPP
- Go to: https://www.apachefriends.org
- Download: **XAMPP for Windows (8.2.12)**
- Run the installer

### 2. Install XAMPP
- Click through wizard
- Install to: `C:\xampp` (default)
- Make sure to check: Apache, MySQL, PHP, phpMyAdmin
- Click Finish

### 3. Start Services
- Open **XAMPP Control Panel**
- Click **[Start]** next to Apache
- Click **[Start]** next to MySQL
- Wait for both to turn green "Running"

### 4. Create Database
- Open: http://localhost/phpmyadmin
- Login: Username `root`, Password (empty)
- Click "Databases" tab
- Create: `influenita`

### 5. Connect Laravel
- Open `.env` file in your project
- Update:
```
DB_HOST=127.0.0.1
DB_DATABASE=influenita
DB_USERNAME=root
DB_PASSWORD=
```

### 6. Run Migrations
```bash
php artisan migrate
```

### 7. Start Your App
```bash
php artisan serve
```

✅ Done! Visit http://localhost:8000

---

## Detailed Setup Instructions

### Download XAMPP

1. Visit: https://www.apachefriends.org
2. Select **XAMPP for Windows** (choose latest PHP version, e.g., 8.2.12)
3. Click the download link
4. Once downloaded, run the `.exe` installer

### Install XAMPP

1. When installer opens, click "Next"
2. **Installation Folder**: Keep default `C:\xampp`
3. **Components**: Ensure these are checked:
   - ☑ Apache
   - ☑ MySQL  
   - ☑ PHP
   - ☑ phpMyAdmin
4. Click "Next" → "Install"
5. Wait for installation to complete
6. Click "Finish"
7. Select "Yes" if asked to start XAMPP Control Panel

### Start XAMPP Services

1. **XAMPP Control Panel** should now be open
2. You'll see services like:
   ```
   Apache          [ ] Start
   MySQL           [ ] Start  
   ```
3. Click **[Start]** button next to **Apache** → Wait for green status
4. Click **[Start]** button next to **MySQL** → Wait for green status
5. Both should show: **[Stop]** and green text

### Create Database in phpMyAdmin

1. Open your browser
2. Go to: `http://localhost/phpmyadmin`
3. You should see login page:
   ```
   Username: root
   Password: (leave empty)
   ```
4. Click "Login"
5. On left sidebar, look for "Databases" or "New database"
6. Enter database name: `influenita`
7. Choose collation: `utf8mb4_unicode_ci`
8. Click "Create"
9. ✅ Database created!

---

## Configure Laravel to Use phpMyAdmin Database

### Update .env File

1. Open your project folder in VS Code or any text editor
2. Find and open `.env` file (in project root)
3. Find these lines and update them:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=influenita
DB_USERNAME=root
DB_PASSWORD=
DB_COLLATION=utf8mb4_unicode_ci
```

**Important:** 
- `DB_PASSWORD=` should be **empty** (no value after `=`)
- Save the file

### Run Migrations

1. Open **Command Prompt** in your project directory
2. Type:
   ```bash
   php artisan migrate
   ```
3. You should see output like:
   ```
   Migrating: 2014_10_12_000000_create_users_table
   Migrated: 2014_10_12_000000_create_users_table (0.x s)
   
   Migrating: 2024_01_01_000000_create_campaigns_table
   Migrated: 2024_01_01_000000_create_campaigns_table (0.x s)
   ...
   ```
4. ✅ If all succeed, your database is connected!

### Verify in phpMyAdmin

1. Go back to: http://localhost/phpmyadmin
2. On left, click on **influenita** database
3. You should see tables:
   - users
   - campaigns
   - profiles
   - applications
   - messages
   - threads
   - **payments** ← Your payment table!
   - ratings

---

## Working with Payments in phpMyAdmin

### View All Payments

1. In phpMyAdmin, select **influenita** database
2. Click on **payments** table
3. Click **Browse** tab
4. You'll see all payment records with columns:
   - `id` - Payment ID
   - `campaign_id` - Which campaign
   - `amount` - Payment amount
   - `status` - pending/completed/failed
   - `created_at` - When created

### Create Test Payment

1. In payments table, click **Insert** tab
2. Fill in these fields:
   ```
   campaign_id: 1
   brand_id: 1
   influencer_id: 2
   amount: 500.00
   status: pending
   payment_method: escrow
   transaction_reference: TEST001
   ```
3. Click **Go**
4. ✅ Test payment created!

### Update Payment Status

1. In payments table, click **Browse**
2. Find a payment row
3. Click the **Edit** (pencil) icon
4. Change `status` from `pending` to `completed`
5. Click **Go**
6. ✅ Status updated!

### Delete a Payment (for testing)

1. In payments table, click **Browse**
2. Check the checkbox next to payment
3. At bottom, click **Delete**
4. Confirm

---

## Start Your Laravel Application

### Step 1: Make sure XAMPP is running
- Check XAMPP Control Panel
- Apache: [Stop] with green text = Running ✅
- MySQL: [Stop] with green text = Running ✅

### Step 2: Start Laravel Server

1. Open **Command Prompt** in your project folder
2. Type:
   ```bash
   php artisan serve
   ```
3. You should see:
   ```
   Starting Laravel development server: http://127.0.0.1:8000
   ```

### Step 3: Open in Browser

1. Open browser
2. Go to: `http://localhost:8000`
3. Your app should load! ✅

---

## Real-Time Payment Monitoring

While developing:

1. Keep Laravel running in one Command Prompt
2. Have phpMyAdmin open in browser tab: http://localhost/phpmyadmin
3. Navigate to influenita → payments → Browse
4. Press **F5** to refresh and see new payments added in real-time
5. Watch `status` change as payments are processed

---

## phpMyAdmin Useful Tasks

### Export/Backup Database

1. Select **influenita** database
2. Click **Export** tab
3. Click **Go**
4. Save the `.sql` file (this is your backup)

### Reset Database (Delete All Data)

1. Select **influenita** database
2. Click **Drop** button (bottom right)
3. Confirm
4. Run `php artisan migrate` to recreate empty tables

### View Table Structure

1. Click table name (e.g., "payments")
2. Click **Structure** tab
3. See all columns, data types, and constraints

### Run SQL Query

1. Click **SQL** tab (top left)
2. Enter query, e.g.:
   ```sql
   SELECT * FROM payments WHERE status='pending';
   ```
3. Click **Go**

---

## Troubleshooting

### "Connection refused" error in Laravel

**Problem:** MySQL not running

**Solution:**
1. Open XAMPP Control Panel
2. Click **[Start]** next to MySQL
3. Wait for green "Running" status
4. Retry Laravel command

### "Access denied for user 'root'@'localhost'" 

**Problem:** Wrong password in .env

**Solution:**
1. Check .env has:
   - `DB_USERNAME=root`
   - `DB_PASSWORD=` (empty!)
2. Save file
3. Stop and restart Laravel server

### phpMyAdmin login fails

**Problem:** MySQL crashed or not responding

**Solution:**
1. XAMPP Control Panel → Click **[Stop]** next to MySQL
2. Wait 3 seconds
3. Click **[Start]** next to MySQL
4. Refresh browser

### Laravel migrations fail

**Problem:** Database not created or connections issue

**Solution:**
1. Check MySQL running in XAMPP
2. Check database "influenita" exists in phpMyAdmin
3. Check .env has correct credentials
4. Run: `php artisan migrate --verbose` (shows detailed errors)

### "SQLSTATE[HY000]: General error: 1030"

**Problem:** Disk space or MySQL issue

**Solution:**
```bash
# Restart MySQL via command line
net stop MySQL80
net start MySQL80
```

---

## MongoDB Alternative?

You asked about MongoDB - **for payments, stick with MySQL** because:

✅ MySQL advantages for payments:
- ACID transactions (safe money handling)
- Relationships (campaigns → payments → users)
- Transactions roll back if error occurs
- Better data integrity

❌ MongoDB disadvantages for payments:
- Not designed for financial data
- Transactions less robust
- Harder to query relationships
- Overkill for structured payment data

**Use MySQL (phpMyAdmin) for payments!** 💰

You can still use MongoDB for other features (comments, logs, etc) if desired, but payments must be in MySQL.

---

## Quick Command Reference

```bash
# In Command Prompt (project folder):

# Start Laravel
php artisan serve

# Run all migrations
php artisan migrate

# Rollback migrations
php artisan migrate:rollback

# Fresh migrations (delete all data)
php artisan migrate:fresh

# Check if database connected
php artisan tinker
>>> DB::connection()->getPdo()
>>> exit
```

---

## Your Setup is Complete ✅

- ✅ XAMPP installed with MySQL
- ✅ phpMyAdmin accessible at http://localhost/phpmyadmin
- ✅ "influenita" database created
- ✅ Laravel migrations run
- ✅ All tables created (including payments)
- ✅ Ready to build payment features!

**Start building your payment system!**
