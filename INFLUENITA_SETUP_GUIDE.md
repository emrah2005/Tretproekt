# INFLUENITA - AI-Driven Influencer Marketing Platform
## Laravel 11 + MySQL + Tailwind Setup Guide

### ✅ CURRENT STATUS
- ✅ Laravel 11 Framework Installed
- ✅ Breeze Authentication Configured
- ✅ Tailwind CSS Ready
- ✅ Basic Project Structure Ready
- ⏳ Models & Migrations (Next Step)
- ⏳ API Endpoints (Next Step)
- ⏳ Blade Templates Matching Figma (Next Step)

---

### 🚀 QUICK START (5 Minutes)

#### 1. Setup Local Environment
```bash
cd ~/Desktop/tretproekt/Tretproekt
composer install
npm install
npm run build
```

#### 2. Configure Database

**Option A: Use SQLite (Easiest)**
```bash
# .env already configured for SQLite
touch database/database.sqlite
php artisan migrate
```

**Option B: Use MySQL**
Edit `.env`:
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=influenita
DB_USERNAME=root
DB_PASSWORD=
```
Then:
```bash
php artisan migrate
```

#### 3. Start Development Server
```bash
php artisan serve
```
Open: http://localhost:8000

---

### 📊 DATABASE SCHEMA

Models to create:
- **User** - Brand/Influencer accounts
- **Profile** - User profile with DNA vector
- **Campaign** - Marketing campaigns
- **Application** - Influencer applications
- **Message** - Chat messages
- **Thread** - Conversation threads
- **Payment** - Escrow transactions
- **Rating** - Campaign ratings

---

### 🔐 KEY FEATURES

1. **Authentication**
   - Email/Password Registration
   - Role Selection (Brand/Influencer)
   - JWT Token Management

2. **Campaign Management**
   - Create campaigns
   - Browse campaigns
   - Apply to campaigns
   - Track status

3. **Messaging**
   - In-app chat
   - Threaded conversations
   - Real-time notifications

4. **Payments (Escrow)**
   - Fund campaigns
   - Hold funds safely
   - Release on completion

5. **Ratings & Leaderboard**
   - Two-way ratings
   - Performance metrics
   - Influencer rankings

---

### 📁 PROJECT STRUCTURE

```
Tretproekt/
├── app/
│   ├── Models/              # Database models
│   ├── Http/
│   │   ├── Controllers/     # API & Web controllers
│   │   └── Requests/        # Form validation
│   └── Policies/            # Authorization
├── database/
│   ├── migrations/          # Database schemas
│   └── seeders/             # Test data
├── resources/
│   ├── views/              # Blade templates
│   │   ├── layouts/        # Layout components
│   │   ├── campaigns/      # Campaign pages
│   │   ├── messages/       # Messaging pages
│   │   └── dashboard/      # Dashboard pages
│   └── css/                # Tailwind styling
├── routes/
│   ├── web.php            # Web routes
│   ├── api.php            # API routes
│   └── auth.php           # Auth routes
└── config/                # Configuration files
```

---

### 📝 NEXT STEPS

#### Phase 1: Models & Migrations (1 hour)
1. Create User model with roles
2. Create Profile model with DNA vector
3. Create Campaign model
4. Create Application model
5. Create Message/Thread models
6. Create Payment model
7. Create Rating model

#### Phase 2: Controllers & API (2 hours)
1. Create campaign controller
2. Create application controller
3. Create message controller
4. Create payment controller
5. Create API routes
6. Add validation

#### Phase 3: Frontend UI (2 hours)
1. Create dashboard layout
2. Create campaign listing page
3. Create campaign creation form
4. Create messaging interface
5. Create profile pages
6. Style with Tailwind

#### Phase 4: Testing & Deployment (1 hour)
1. Test all endpoints
2. Test authentication
3. Test messaging
4. Deploy to server

---

### 🔗 USEFUL COMMANDS

```bash
# Create new model with migration
php artisan make:model Campaign -m

# Create controller
php artisan make:controller CampaignController --resource

# Create migration
php artisan make:migration create_campaigns_table

# Run migrations
php artisan migrate

# Rollback migrations
php artisan migrate:rollback

# Reset database
php artisan migrate:reset

# Seed database
php artisan db:seed

# Clear cache
php artisan cache:clear

# Tinker (PHP shell)
php artisan tinker
```

---

### 📚 RESOURCES

- [Laravel Documentation](https://laravel.com/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Figma Design](https://www.figma.com/design/sjnXH9GsMf4s2gKrRG0Xcn/Influenita)
- [Specification PDF](./pHXJIbkRYTGYdGh6koGi_1762431144.pdf)

---

### 🆘 TROUBLESHOOTING

**Issue: "could not find driver"**
- Use SQLite instead of MySQL
- Or install PHP MySQL extension

**Issue: Port 8000 already in use**
```bash
php artisan serve --port=8001
```

**Issue: npm build errors**
```bash
npm cache clean --force
npm install
npm run build
```

---

**Created: November 6, 2025**
**Version: Laravel 11 + Breeze + Tailwind**
