# Tretproekt Routes Documentation

## Overview

This document provides a comprehensive guide to all routes in the Tretproekt application. The routing structure is organized across three main files for better maintainability and separation of concerns.

---

## Route Files Structure

### 1. `web.php` - Web Routes
Handles traditional web application routes with the `web` middleware group.

**Routes:**
- `GET /` - Welcome endpoint
  - Returns JSON with API information
  - Name: `home`
  - No authentication required

**Includes:**
- All authentication routes from `auth.php`

### 2. `api.php` - API Routes  
Handles all API endpoints with the `api` middleware group. All API routes are prefixed with `/api`.

**Includes:**
- API version prefix: `/api/v1`
- All API responses use JSON
- Sanctum token authentication for protected routes

### 3. `auth.php` - Authentication Routes
Handles authentication flows for web application (forms and sessions).

**Structure:**
- Guest Routes (unauthenticated users only)
- Authenticated Routes (logged-in users only)

---

## Detailed Route List

### Web Routes (`web.php`)

| Method | Endpoint | Controller | Auth | Purpose |
|--------|----------|-----------|------|----------|
| GET | `/` | Welcome closure | None | API information endpoint |

### API Routes (`api.php`)

#### Public Routes (No Authentication)

| Method | Endpoint | Controller | Purpose |
|--------|----------|-----------|----------|
| GET | `/api/health` | Closure | Health check endpoint |
| POST | `/api/v1/auth/register` | AuthController@register | User registration |
| POST | `/api/v1/auth/login` | AuthController@login | User login |

#### Protected Routes (Requires Sanctum Token)

##### Authentication
| Method | Endpoint | Controller | Purpose |
|--------|----------|-----------|----------|
| POST | `/api/v1/auth/logout` | AuthController@logout | User logout |

##### Profile Management  
| Method | Endpoint | Controller | Purpose |
|--------|----------|-----------|----------|
| GET | `/api/v1/profile` | ProfileController@show | Get user profile |
| PUT | `/api/v1/profile` | ProfileController@update | Update profile |
| DELETE | `/api/v1/profile` | ProfileController@destroy | Delete profile |

##### Campaigns (REST Resource)
| Method | Endpoint | Controller | Purpose |
|--------|----------|-----------|----------|
| GET | `/api/v1/campaigns` | CampaignController@index | List campaigns |
| POST | `/api/v1/campaigns` | CampaignController@store | Create campaign |
| GET | `/api/v1/campaigns/{id}` | CampaignController@show | Get campaign |
| PUT | `/api/v1/campaigns/{id}` | CampaignController@update | Update campaign |
| DELETE | `/api/v1/campaigns/{id}` | CampaignController@destroy | Delete campaign |

##### Applications
| Method | Endpoint | Controller | Purpose |
|--------|----------|-----------|----------|
| GET | `/api/v1/applications` | ApplicationController@index | List applications |
| POST | `/api/v1/applications` | ApplicationController@store | Create application |
| GET | `/api/v1/applications/{id}` | ApplicationController@show | Get application |
| PUT | `/api/v1/applications/{id}` | ApplicationController@update | Update application |
| DELETE | `/api/v1/applications/{id}` | ApplicationController@destroy | Delete application |

##### Messages & Conversations
| Method | Endpoint | Controller | Purpose |
|--------|----------|-----------|----------|
| GET | `/api/v1/conversations` | MessageController@conversations | List conversations |
| GET | `/api/v1/conversations/{id}/messages` | MessageController@show | Get messages in conversation |
| POST | `/api/v1/messages` | MessageController@store | Send message |
| PUT | `/api/v1/messages/{id}` | MessageController@update | Update message |
| DELETE | `/api/v1/messages/{id}` | MessageController@destroy | Delete message |

##### Payments
| Method | Endpoint | Controller | Purpose |
|--------|----------|-----------|----------|
| GET | `/api/v1/payments` | PaymentController@index | List payments |
| POST | `/api/v1/payments` | PaymentController@store | Create payment |
| GET | `/api/v1/payments/{id}` | PaymentController@show | Get payment details |

### Authentication Routes (`auth.php`)

#### Guest Routes (Unauthenticated Only)

| Method | Endpoint | Controller | Name | Purpose |
|--------|----------|-----------|------|----------|
| GET | `/register` | RegisteredUserController@create | register | Show registration form |
| POST | `/register` | RegisteredUserController@store | N/A | Store new user |
| GET | `/login` | AuthenticatedSessionController@create | login | Show login form |
| POST | `/login` | AuthenticatedSessionController@store | N/A | Authenticate user |
| GET | `/forgot-password` | PasswordResetLinkController@create | password.request | Show forgot password form |
| POST | `/forgot-password` | PasswordResetLinkController@store | password.email | Send password reset email |
| GET | `/reset-password/{token}` | NewPasswordController@create | password.reset | Show reset password form |
| POST | `/reset-password` | NewPasswordController@store | password.store | Store new password |

#### Authenticated Routes (Logged-in Only)

| Method | Endpoint | Controller | Name | Purpose |
|--------|----------|-----------|------|----------|
| GET | `/verify-email` | EmailVerificationPromptController | verification.notice | Show email verification prompt |
| GET | `/verify-email/{id}/{hash}` | VerifyEmailController | verification.verify | Verify email (signed) |
| POST | `/email/verification-notification` | EmailVerificationNotificationController@store | verification.send | Resend verification email (throttled) |
| GET | `/confirm-password` | ConfirmablePasswordController@show | password.confirm | Show password confirmation form |
| POST | `/confirm-password` | ConfirmablePasswordController@store | N/A | Confirm password |
| PUT | `/password` | PasswordController@update | password.update | Update password |
| POST | `/logout` | AuthenticatedSessionController@destroy | logout | Log out user |

---

## Middleware Groups

### Web Middleware (`web`)
- Applied to routes in `web.php` and `auth.php`
- Includes session handling, CSRF protection, etc.

### API Middleware (`api`)
- Applied to routes in `api.php`
- No session support by default
- Uses Sanctum for token-based authentication

### Authentication Middleware (`auth`)
- Verifies user is authenticated
- Used in protected API and web routes

### Guest Middleware (`guest`)
- Verifies user is NOT authenticated
- Used in auth routes to redirect already-authenticated users

---

## API Usage Examples

### Register a New User
```bash
curl -X POST http://localhost/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name": "John", "email": "john@example.com", "password": "password123"}'
```

### Login User
```bash
curl -X POST http://localhost/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com", "password": "password123"}'
```

### Access Protected Route
```bash
curl -X GET http://localhost/api/v1/profile \
  -H "Authorization: Bearer YOUR_API_TOKEN"
```

### Health Check
```bash
curl -X GET http://localhost/api/health
```

---

## Best Practices

1. **API Versioning**: All API routes use `/api/v1` prefix for future compatibility
2. **Consistent Naming**: RESTful conventions followed for resource routes
3. **Separate Concerns**: Web, API, and auth routes in separate files
4. **Middleware Application**: Authentication middleware properly applied to protected routes
5. **Error Handling**: All controllers should return appropriate HTTP status codes

---

## Route Testing

To test routes locally:

1. Start Laravel development server:
   ```bash
   php artisan serve
   ```

2. Test endpoints using Postman, cURL, or similar tools

3. Use the health endpoint to verify API is working:
   ```
   GET http://localhost:8000/api/health
   ```

---

## Common Issues & Solutions

### 404 Not Found
- Verify route exists in correct route file
- Check HTTP method (GET, POST, etc.) matches
- Ensure prefix is correct (`/api/v1` for API routes)

### 401 Unauthorized
- Missing or invalid Sanctum token
- Token may have expired
- User may not have required permissions

### 403 Forbidden
- User lacks required permissions
- Check policy/gate authorization

### 422 Unprocessable Entity
- Validation errors on form data
- Check request payload matches controller validation rules

---

## Files Modified

- ✅ `routes/web.php` - Rebuilt with clean welcome endpoint
- ✅ `routes/api.php` - Rebuilt with v1 API versioning
- ✅ `routes/auth.php` - Rebuilt with organized guest/authenticated sections

---

## Last Updated
- **Date**: 2025-11-16
- **Version**: 1.0.0
- **Status**: Production Ready
