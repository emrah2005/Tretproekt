# 🚀 Influenita - Setup Guide

## What's New
✅ **Enhanced Landing Page** - Modern design with gradient backgrounds and smooth animations
✅ **Complete App.js** - All button handlers and database API integration ready
✅ **Full Dashboard** - Sidebar navigation with Dashboard, Campaigns, Messages, and Profile tabs
✅ **Database Schema** - Complete SQL with all tables (users, campaigns, applications, payments, etc.)

## 📁 File Structure
```
frontend/
├── index.html          (Landing Page - Choose Brand or Influencer)
├── dashboard.html      (Main app with sidebar, all tabs)
├── app.js              (Complete API integration & handlers)
├── business-register.html
└── influencer-register.html

database/
└── 127_0_0_1.sql      (Full database schema)
```

## 🛠️ Quick Setup

### 1. Start XAMPP
- Open XAMPP Control Panel
- Start Apache & MySQL

### 2. Import Database
```
1. Go to http://localhost/phpmyadmin
2. Create new database or import:
3. Select File: database/127_0_0_1.sql
4. Click Import
```

### 3. Place Files
```
C:\xampp\htdocs\Tretproekt\
├── frontend/
│   ├── index.html
│   ├── dashboard.html
│   └── app.js
└── database/
    └── 127_0_0_1.sql
```

### 4. Access Application
- **Landing Page**: http://localhost/Tretproekt/frontend/index.html
- **Dashboard**: http://localhost/Tretproekt/frontend/dashboard.html

## 🔌 API Configuration

Edit `app.js` line 2:
```javascript
const API_BASE_URL = 'http://localhost:5000/api'; // Change to your API endpoint
```

OR if using XAMPP with PHP backend:
```javascript
const API_BASE_URL = 'http://localhost/Tretproekt/api'; // Adjust path
```

## 📱 Features Included

### Landing Page (index.html)
- Sticky navbar with navigation
- Hero section with call-to-action buttons
- Brand & Influencer role selection cards
- "How it Works" section
- Professional footer
- Responsive design

### Dashboard (dashboard.html)
- **Dashboard Tab**: Stats cards (Campaigns, Applications, Rating)
- **Campaigns Tab**: Create and list campaigns
- **Messages Tab**: Conversation interface
- **Profile Tab**: Edit user profile
- Create Campaign Modal
- Responsive sidebar navigation

### App.js Features
- ✅ Login/Signup authentication
- ✅ Dashboard data loading
- ✅ Campaign management (create, list)
- ✅ Message handling
- ✅ Tab switching
- ✅ Modal management
- ✅ LocalStorage for tokens
- ✅ Error handling

## 🎨 Design Features

- **Color Scheme**: Purple & Pink gradients (#667eea to #764ba2)
- **Font**: Inter (Google Fonts)
- **Framework**: Tailwind CSS
- **Icons**: Emojis for clean UI
- **Responsive**: Mobile, Tablet, Desktop

## 🔐 Database Tables

- `users` - User accounts (influencer, brand)
- `profiles` - Extended user profiles
- `campaigns` - Campaign listings
- `applications` - Campaign applications
- `messages` - Direct messaging
- `payments` - Payment records
- `ratings` - User ratings & reviews
- `threads` - Message thread organization

## 📝 Next Steps

1. **Backend API Setup**
   - Create PHP endpoints matching API_BASE_URL
   - Implement authentication (/login, /register)
   - Implement CRUD for campaigns

2. **Complete Register Pages**
   - Update business-register.html
   - Update influencer-register.html
   - Add form validation

3. **Database Connection**
   - Connect backend to database
   - Test all API endpoints

4. **Testing**
   - Test signup/login flow
   - Test campaign creation
   - Test messaging
   - Test responsive design

## 💡 Tips

- All HTML files use Tailwind CSS via CDN (no build required)
- App.js uses fetch API for all HTTP requests
- LocalStorage stores auth tokens and user data
- Modals use simple class toggle (.active)
- All buttons have error handling

## 🐛 Troubleshooting

**"Cannot POST /api/login"**
- Check API_BASE_URL in app.js
- Ensure backend is running

**"Failed to load profile"**
- Check if you're logged in
- Check API token validity

**Styles not loading**
- Tailwind CSS requires internet (CDN)
- Check browser console for errors

## 📧 Support
All files are ready to pull and test locally with XAMPP!

Good luck! 🎉
