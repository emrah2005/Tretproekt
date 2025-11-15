# Complete API Setup Guide for Influenita

This guide contains all necessary code to make your API work completely.

## STEP 1: Update routes/api.php

```php
<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CampaignController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\PaymentController;
use Illuminate\Support\Facades\Route;

// Test endpoint
Route::get('/test', function () {
    return response()->json(['message' => 'API is working!', 'status' => 'success']);
});

// Public Auth Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // Profile
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::delete('/profile', [ProfileController::class, 'destroy']);
    
    // Campaigns
    Route::apiResource('campaigns', CampaignController::class);
    
    // Applications
    Route::apiResource('applications', ApplicationController::class);
    
    // Messages
    Route::get('/conversations', [MessageController::class, 'conversations']);
    Route::get('/conversations/{id}/messages', [MessageController::class, 'show']);
    Route::post('/messages', [MessageController::class, 'store']);
    
    // Payments
    Route::apiResource('payments', PaymentController::class);
});
```

## STEP 2: Create Missing Controllers

Copy these into your app/Http/Controllers directory.

See individual controller files for full implementation.

## STEP 3: Update Models with Relationships

All models need proper relationship definitions - see model files.

## STEP 4: Run Migrations

```bash
php artisan migrate:fresh
```

## STEP 5: Test API

```bash
# Register
POST /api/register
{
  "email": "user@example.com",
  "password": "password123",
  "userType": "brand"
}

# Login
POST /api/login
{
  "email": "user@example.com",
  "password": "password123"
}

# Get Profile (authenticated)
GET /api/profile
Header: Authorization: Bearer {token}
```


## Controllers Code

### app/Http/Controllers/CampaignController.php

```php
<?php
namespace App\Http\Controllers;

use App\Models\Campaign;
use Illuminate\Http\Request;

class CampaignController extends Controller
{
    public function index()
    {
        return response()->json(Campaign::all(), 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'budget' => 'required|numeric|min:0',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
        ]);

        $campaign = $request->user()->campaigns()->create($validated);
        return response()->json($campaign, 201);
    }

    public function show(Campaign $campaign)
    {
        return response()->json($campaign, 200);
    }

    public function update(Request $request, Campaign $campaign)
    {
        $this->authorize('update', $campaign);
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'budget' => 'sometimes|numeric|min:0',
        ]);
        $campaign->update($validated);
        return response()->json($campaign, 200);
    }

    public function destroy(Campaign $campaign)
    {
        $this->authorize('delete', $campaign);
        $campaign->delete();
        return response()->json(['message' => 'Campaign deleted'], 200);
    }
}
```

### app/Http/Controllers/ApplicationController.php

```php
<?php
namespace App\Http\Controllers;

use App\Models\Application;
use Illuminate\Http\Request;

class ApplicationController extends Controller
{
    public function index(Request $request)
    {
        return response()->json(
            $request->user()->applications()->with('campaign')->get(),
            200
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'campaign_id' => 'required|exists:campaigns,id',
            'cover_letter' => 'sometimes|string',
            'proposed_rate' => 'sometimes|numeric',
        ]);

        $application = $request->user()->applications()->create($validated);
        return response()->json($application, 201);
    }

    public function show(Application $application)
    {
        return response()->json($application->load(['campaign', 'influencer']), 200);
    }

    public function update(Request $request, Application $application)
    {
        $validated = $request->validate([
            'status' => 'sometimes|in:pending,accepted,rejected,completed',
        ]);
        $application->update($validated);
        return response()->json($application, 200);
    }

    public function destroy(Application $application)
    {
        $application->delete();
        return response()->json(['message' => 'Application deleted'], 200);
    }
}
```

### app/Http/Controllers/MessageController.php

```php
<?php
namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\Thread;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function conversations(Request $request)
    {
        $conversations = Thread::where('user_one_id', $request->user()->id)
            ->orWhere('user_two_id', $request->user()->id)
            ->with('messages')
            ->latest('last_message_at')
            ->get();
        return response()->json($conversations, 200);
    }

    public function show(Thread $thread)
    {
        return response()->json($thread->load('messages.sender'), 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'thread_id' => 'required|exists:threads,id',
            'content' => 'required|string',
        ]);

        $message = Message::create([
            'thread_id' => $validated['thread_id'],
            'sender_id' => $request->user()->id,
            'content' => $validated['content'],
        ]);

        Thread::find($validated['thread_id'])->update(['last_message_at' => now()]);
        return response()->json($message, 201);
    }
}
```

### app/Http/Controllers/PaymentController.php

```php
<?php
namespace App\Http\Controllers;

use App\Models\Payment;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function index(Request $request)
    {
        return response()->json($request->user()->payments()->get(), 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'contract_id' => 'required|exists:contracts,id',
            'amount' => 'required|numeric|min:0',
            'payment_method' => 'required|in:credit_card,bank_transfer,paypal',
        ]);

        $payment = Payment::create([
            'contract_id' => $validated['contract_id'],
            'user_id' => $request->user()->id,
            'amount' => $validated['amount'],
            'payment_method' => $validated['payment_method'],
        ]);

        return response()->json($payment, 201);
    }

    public function show(Payment $payment)
    {
        return response()->json($payment, 200);
    }
}
```
