# Start Laravel Frontend - Step-by-Step Guide

## Quick Start: 3 Steps to See Your Frontend

### Step 1: Make Sure MySQL is Running
Open XAMPP Control Panel and click **[Start]** next to MySQL
- Should show: **[Stop]** in green = Running ✅

### Step 2: Open Terminal in Your Project
Open **Command Prompt** in your project folder:
```
C:\Users\YourName\Desktop\tretproekt\Tretproekt
```

### Step 3: Start Laravel Server
Type this command:
```bash
php artisan serve
```

You should see:
```
Starting Laravel development server: http://127.0.0.1:8000
```

### Step 4: Open in Browser
1. Open your browser
2. Go to: **http://localhost:8000**
3. Your Laravel app loads! ✅

---

## Detailed Walkthrough

### Prerequisites Before Starting

**Check these are done:**
- ✅ XAMPP installed
- ✅ MySQL service running in XAMPP
- ✅ Laravel project exists at: `~/Desktop/tretproekt/Tretproekt`
- ✅ `.env` file configured with database credentials

### Step 1: Start MySQL Service

**In XAMPP Control Panel:**

1. Open XAMPP (from Start Menu)
2. Look for these services:
   ```
   Apache        [Start]  [Stop]
   MySQL         [Start]  [Stop]
   ```
3. Click **[Start]** next to MySQL
4. Wait a few seconds...
5. Should change to: **[Stop]** with green status
6. ✅ MySQL is running!

**Note:** You do NOT need to start Apache

### Step 2: Open Terminal in Project Folder

**Method 1: Windows Explorer (Easiest)**
1. Open Windows File Explorer
2. Navigate to: `C:\Users\YourName\Desktop\tretproekt\Tretproekt`
3. In the address bar, type: `cmd`
4. Press **Enter**
5. Command Prompt opens in this folder

**Method 2: Manual Navigation**
1. Open Command Prompt
2. Type:
   ```bash
   cd Desktop\tretproekt\Tretproekt
   ```
3. Press **Enter**
4. You're in your project folder

**Method 3: VS Code**
1. Open your project in VS Code
2. Click: Terminal → New Terminal (top menu)
3. Terminal opens at your project root

### Step 3: Start Laravel Development Server

**In your open terminal, type:**
```bash
php artisan serve
```

**You should see this output:**
```
   _                               
  / \   _ __ __ _ _ __ __ _ _ __  
 / _ \ | '__/ _` | '__/ _` | '_ \ 
/ ___ \| | | (_| | | | (_| | | | |
/_/   \_\_|  \__,_|_|  \__,_|_| |_|

Laravel 11.x.x

Starting Laravel development server: http://127.0.0.1:8000
[Thu Nov  6 21:30:45 2024] 127.0.0.1:63829 "GET / HTTP/1.1" 200 ...
```

**This means the server is running!** ✅

### Step 4: View Your Frontend in Browser

1. Open your web browser (Chrome, Firefox, Edge, etc.)
2. In address bar, type: **http://localhost:8000**
3. Press **Enter**
4. Your Laravel app loads!

**What you should see:**
- Laravel Breeze login page
- OR your custom homepage
- Styled with Tailwind CSS

---

## What You're Seeing (Your Frontend)

### Laravel Breeze Default Pages

When you first load `http://localhost:8000`, you see:

**Unauthenticated (Not Logged In):**
- Welcome page with login/register buttons
- Tailwind CSS styling
- Responsive design

**Authenticated (After Login):**
- Dashboard page
- User profile links
- Settings
- Logout button

### To Test Login

**Default Breeze Account:**
- Email: `test@example.com`
- Password: `password`

(These are created when you run migrations)

---

## Common URLs in Your App

After server starts, try visiting:

| URL | What You See |
|-----|-------------|
| http://localhost:8000 | Home page |
| http://localhost:8000/login | Login page |
| http://localhost:8000/register | Registration page |
| http://localhost:8000/dashboard | Dashboard (after login) |
| http://localhost:8000/profile | Profile settings (after login) |

---

## Understanding What's Running

### Two Separate Services

**1. MySQL Database:**
- Running in: XAMPP Control Panel
- Stores: All your data (campaigns, payments, users, etc.)
- Started by: Clicking [Start] in XAMPP

**2. Laravel Web Server:**
- Running in: Command Prompt/Terminal
- Serves: Your HTML, CSS, JavaScript
- Started by: `php artisan serve`
- Visible at: http://localhost:8000

**Both must be running!**

---

## Your Frontend Files Location

### Blade Templates (HTML)
```
resources/
  └── views/
      └── layouts/
          └── app.blade.php  ← Main layout
      └── auth/
          └── login.blade.php
          └── register.blade.php
      └── dashboard.blade.php
```

### CSS & Tailwind
```
resources/
  └── css/
      └── app.css  ← Tailwind CSS
  └── js/
      └── app.js
```

### Compiled Assets
```
public/
  └── build/
      └── app.css  ← Compiled CSS
      └── app.js   ← Compiled JavaScript
```

---

## Making Changes to Frontend

### Edit Blade Templates

**Example: Change welcome page**

1. Open: `resources/views/welcome.blade.php`
2. Edit any HTML
3. Save file (Ctrl+S)
4. Refresh browser (F5 or Ctrl+R)
5. See changes instantly! ✅

**No restart needed for template changes**

### Edit Styling

**If you edit Tailwind classes:**

1. Edit: `resources/css/app.css`
2. In terminal, rebuild:
   ```bash
   npm run build
   ```
3. Refresh browser
4. See new styles!

---

## Accessing Your Database (phpMyAdmin)

**While Laravel is running, you can also check database:**

1. Open: http://localhost/phpmyadmin
2. Login: Username `root`, Password (empty)
3. Select `influenita` database
4. See tables: users, campaigns, payments, etc.
5. View data created by your app

---

## Terminal Commands Cheat Sheet

### Start Server
```bash
php artisan serve
```

### Stop Server
```
Press Ctrl+C in terminal
```

### Start on Different Port
```bash
php artisan serve --port=8001
# Then visit: http://localhost:8001
```

### Restart Server
```bash
# Press Ctrl+C to stop
# Then:
php artisan serve
```

### Clear Cache
```bash
php artisan cache:clear
```

### View Routes
```bash
php artisan route:list
```

---

## Troubleshooting

### "Connection refused" - Can't access http://localhost:8000

**Problem:** Server not running

**Solution:**
1. Check terminal shows: "Starting Laravel development server"
2. If not, type: `php artisan serve`
3. Wait for message
4. Try browser again

### Page shows blank or error

**Problem 1:** MySQL not running
- **Fix:** Start MySQL in XAMPP Control Panel

**Problem 2:** `.env` not configured
- **Fix:** Check `.env` has correct DB credentials
- **Fix:** Run: `php artisan key:generate`

**Problem 3:** Migrations not run
- **Fix:** Stop server (Ctrl+C)
- **Fix:** Run: `php artisan migrate`
- **Fix:** Start server again: `php artisan serve`

### "Table doesn't exist" error

**Problem:** Migrations not executed

**Solution:**
1. Stop Laravel server (Ctrl+C)
2. Run: `php artisan migrate`
3. Start server again: `php artisan serve`

### Styles not showing (page looks plain)

**Problem:** CSS not compiled

**Solution:**
```bash
# Stop server first (Ctrl+C)
npm run build
# Start server again
php artisan serve
```

### "Port 8000 already in use"

**Problem:** Another app using port 8000

**Solution 1:** Use different port
```bash
php artisan serve --port=8001
```

**Solution 2:** Kill process on port 8000
```bash
# Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

---

## Your Frontend Development Workflow

### Every Time You Work:

1. **Start MySQL** in XAMPP Control Panel
   ```
   Click [Start] next to MySQL
   ```

2. **Open Terminal** in project folder
   ```
   cd Desktop\tretproekt\Tretproekt
   ```

3. **Start Laravel Server**
   ```bash
   php artisan serve
   ```

4. **Open Browser** and go to
   ```
   http://localhost:8000
   ```

5. **Edit Files** (templates, CSS, etc.)
   - Blade templates: Refresh browser to see changes
   - CSS: Run `npm run build` if you change Tailwind

6. **Keep Server Running** in terminal
   - Don't close the terminal window
   - Leave it running while you develop

7. **When Done**
   - Press Ctrl+C in terminal to stop server
   - Stop MySQL in XAMPP (optional)

---

## Next Steps After Server Starts

### 1. Verify It Works
- ✅ Visit http://localhost:8000
- ✅ See login page
- ✅ Try login with test@example.com / password

### 2. Make Your First Change
- Edit: `resources/views/welcome.blade.php`
- Change any text
- Save file
- Refresh browser
- See your change! ✅

### 3. Create Campaign Pages
- Create new Blade templates in `resources/views/`
- Add routes in `routes/web.php`
- Match Figma design
- Style with Tailwind CSS

### 4. Connect to Your API
- Create routes in `routes/api.php`
- Add controller logic
- Call from frontend JavaScript

---

## Quick Checklist

- [ ] XAMPP installed
- [ ] MySQL running (XAMPP Control Panel)
- [ ] Terminal open in project folder
- [ ] `php artisan serve` running
- [ ] Browser at http://localhost:8000
- [ ] See Laravel Breeze pages
- [ ] Can login with test@example.com
- [ ] phpMyAdmin at http://localhost/phpmyadmin shows database
- [ ] Ready to build! 🚀

---

## You're Ready!

Your Laravel frontend is now running and accessible at **http://localhost:8000**

Next: Edit Blade templates and build your Figma design! 🎉
