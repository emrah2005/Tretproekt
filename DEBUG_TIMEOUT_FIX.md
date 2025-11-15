# PHP Timeout Bug - Debug & Fix Guide

## Problem Summary
The Laravel application was throwing a **PHP Fatal error: Maximum execution time of 30 seconds exceeded** when accessed via XAMPP.

## Root Cause Identified
The timeout was caused by **mismatched controller methods in web.php routes**:

1. **ProfileController Issue**: The ProfileController was refactored to be API-focused with methods:
   - `show(Request $request)` - Returns JSON
   - `update(Request $request)` - Returns JSON
   - `destroy(Request $request)` - Returns JSON

2. **Web Routes Calling Non-Existent Methods**: The `routes/web.php` file was trying to call methods that don't exist:
   ```php
   Route::get('/profile', [ProfileController::class, 'edit'])  // ❌ edit() doesn't exist
   Route::patch('/profile', [ProfileController::class, 'update']) // ❌ wrong signature
   ```

3. **View Rendering Issues**: Routes were trying to render views that don't exist:
   ```php
   return view('welcome');  // ❌ view file missing
   return view('dashboard'); // ❌ view file missing
   ```

This caused Laravel to throw errors or infinite loops, hitting the 30-second timeout.

## Solution Applied
Simplified `routes/web.php` to only include essential routes:

```php
Route::get('/', function () {
    return response()->json([
        'message' => 'Influenita API - Welcome',
        'version' => '1.0.0',
        'documentation' => 'See /api/documentation or check the API_COMPLETE_SETUP.md file',
    ]);
});
```

## Steps to Apply Fix

### Step 1: Pull Latest Changes
```bash
cd C:\Users\emrah\Desktop\tretproekt\Tretproekt
git pull origin main
```

### Step 2: Clear Laravel Cache (Important!)
```bash
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear
```

### Step 3: Restart Apache (if using XAMPP)
1. Open XAMPP Control Panel
2. Click **Stop** on Apache
3. Wait 2 seconds
4. Click **Start** on Apache

### Step 4: Test the Fix
Reload: `http://localhost/tretproekt/Tretproekt/public/`

You should see:
```json
{
  "message": "Influenita API - Welcome",
  "version": "1.0.0",
  "documentation": "See /api/documentation or check the API_COMPLETE_SETUP.md file"
}
```

## Files Changed
- ✅ `routes/web.php` - Simplified to API-only routes
- ✅ `routes/auth.php` - No changes needed (already correct)
- ✅ `app/Http/Controllers/ProfileController.php` - Already API-focused

## Testing API Endpoints
After applying the fix, test these endpoints:

```bash
# Test 1: Welcome endpoint
curl http://localhost/tretproekt/Tretproekt/public/

# Test 2: Register a brand user
curl -X POST http://localhost/tretproekt/Tretproekt/public/api/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Brand","email":"brand@test.com","password":"password123","user_type":"brand"}'

# Test 3: Login
curl -X POST http://localhost/tretproekt/Tretproekt/public/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"brand@test.com","password":"password123"}'
```

## Common Issues & Solutions

### Issue: Still getting timeout after pulling
**Solution**: 
1. Make sure to run `php artisan cache:clear`
2. Restart Apache completely
3. Hard refresh browser: `Ctrl+Shift+Delete` (Shift+Cmd+Delete on Mac)

### Issue: 404 errors on API endpoints
**Solution**:
1. Ensure you're accessing the correct path with `/public/` in it
2. Check that routes/api.php exists and contains your API routes
3. Run `php artisan route:list` to see all registered routes

### Issue: Database connection errors
**Solution**:
1. Ensure MySQL is running
2. Check `.env` file has correct DB credentials
3. Run migrations: `php artisan migrate`

## Next Steps
1. ✅ Pull changes from GitHub
2. ✅ Clear all caches
3. ✅ Restart Apache
4. ✅ Test welcome endpoint
5. ⏳ Test all API endpoints (register, login, profile, campaigns, etc.)
6. ⏳ Set up database if not done
7. ⏳ Run migrations

## Timeline of Changes
- **Commit**: `8331458` - Fixed web.php routes
- **Date**: November 15, 2025
- **Author**: Debug & Fix Process
