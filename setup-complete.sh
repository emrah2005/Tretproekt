#!/bin/bash

echo "🚀 Setting up Influenita - Complete Backend & Frontend..."

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}Starting setup process...${NC}\n"

# ============================================
# BACKEND FILES
# ============================================

# 1. Create routes/api.php
echo -e "${BLUE}[1/20] Creating routes/api.php...${NC}"
cat > routes/api.php << 'EOFAPI'
<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CampaignController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\PaymentController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);
    
    // Campaigns
    Route::apiResource('campaigns', CampaignController::class);
    
    // Applications
    Route::post('/applications', [ApplicationController::class, 'store']);
    Route::get('/applications', [ApplicationController::class, 'index']);
    
    // Messages
    Route::get('/conversations', [MessageController::class, 'conversations']);
    Route::post('/messages', [MessageController::class, 'store']);
    Route::get('/conversations/{id}/messages', [MessageController::class, 'show']);
    
    // Payments
    Route::get('/payments', [PaymentController::class, 'index']);
    Route::post('/payments', [PaymentController::class, 'store']);
});
EOFAPI
echo -e "${GREEN}✓ routes/api.php created${NC}\n"

# 2. Create AuthController
echo -e "${BLUE}[2/20] Creating AuthController...${NC}"
cat > app/Http/Controllers/AuthController.php << 'EOFAUTH'
<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'fullName' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'userType' => 'required|in:influencer,brand',
            'phone' => 'nullable|string',
            'location' => 'nullable|string',
        ]);

        $user = User::create([
            'name' => $validated['fullName'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'user_type' => $validated['userType'],
        ]);

        Profile::create([
            'user_id' => $user->id,
            'phone' => $validated['phone'] ?? null,
            'location' => $validated['location'] ?? null,
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $user->load('profile'),
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $user->load('profile'),
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out successfully']);
    }
}
EOFAUTH
echo -e "${GREEN}✓ AuthController created${NC}\n"

# 3. Update User model
echo -e "${BLUE}[3/20] Updating User model...${NC}"
cat > app/Models/User.php << 'EOFUSER'
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    protected $fillable = [
        'name',
        'email',
        'password',
        'user_type',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function profile()
    {
        return $this->hasOne(Profile::class);
    }

    public function campaigns()
    {
        return $this->hasMany(Campaign::class, 'brand_id');
    }

    public function applications()
    {
        return $this->hasMany(Application::class, 'influencer_id');
    }

    public function sentMessages()
    {
        return $this->hasMany(Message::class, 'sender_id');
    }

    public function receivedMessages()
    {
        return $this->hasMany(Message::class, 'receiver_id');
    }

    public function ratings()
    {
        return $this->hasMany(Rating::class, 'rated_user_id');
    }
}
EOFUSER
echo -e "${GREEN}✓ User model updated${NC}\n"

# 4. Update Campaign model
echo -e "${BLUE}[4/20] Updating Campaign model...${NC}"
cat > app/Models/Campaign.php << 'EOFCAMPAIGN'
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Campaign extends Model
{
    use HasFactory;

    protected $fillable = [
        'brand_id',
        'title',
        'description',
        'brief',
        'budget',
        'currency',
        'category',
        'start_date',
        'end_date',
        'status',
        'target_influencers',
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'budget' => 'decimal:2',
    ];

    public function brand()
    {
        return $this->belongsTo(User::class, 'brand_id');
    }

    public function applications()
    {
        return $this->hasMany(Application::class);
    }
}
EOFCAMPAIGN
echo -e "${GREEN}✓ Campaign model updated${NC}\n"

# 5. Update Profile model
echo -e "${BLUE}[5/20] Updating Profile model...${NC}"
cat > app/Models/Profile.php << 'EOFPROFILE'
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Profile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'phone',
        'location',
        'bio',
        'avatar',
        'social_platforms',
        'niches',
        'content_types',
        'collaboration_types',
        'pricing',
        'portfolio_url',
    ];

    protected $casts = [
        'social_platforms' => 'array',
        'niches' => 'array',
        'content_types' => 'array',
        'collaboration_types' => 'array',
        'pricing' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
EOFPROFILE
echo -e "${GREEN}✓ Profile model updated${NC}\n"

# 6. Update Application model
echo -e "${BLUE}[6/20] Updating Application model...${NC}"
cat > app/Models/Application.php << 'EOFAPPLICATION'
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Application extends Model
{
    use HasFactory;

    protected $fillable = [
        'campaign_id',
        'influencer_id',
        'status',
        'message',
        'proposed_price',
    ];

    protected $casts = [
        'proposed_price' => 'decimal:2',
    ];

    public function campaign()
    {
        return $this->belongsTo(Campaign::class);
    }

    public function influencer()
    {
        return $this->belongsTo(User::class, 'influencer_id');
    }
}
EOFAPPLICATION
echo -e "${GREEN}✓ Application model updated${NC}\n"

# 7. Update Message model
echo -e "${BLUE}[7/20] Updating Message model...${NC}"
cat > app/Models/Message.php << 'EOFMESSAGE'
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Message extends Model
{
    use HasFactory;

    protected $fillable = [
        'thread_id',
        'sender_id',
        'receiver_id',
        'content',
        'read_at',
    ];

    protected $casts = [
        'read_at' => 'datetime',
    ];

    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    public function receiver()
    {
        return $this->belongsTo(User::class, 'receiver_id');
    }

    public function thread()
    {
        return $this->belongsTo(Thread::class);
    }
}
EOFMESSAGE
echo -e "${GREEN}✓ Message model updated${NC}\n"

# 8. Update Thread model
echo -e "${BLUE}[8/20] Updating Thread model...${NC}"
cat > app/Models/Thread.php << 'EOFTHREAD'
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Thread extends Model
{
    use HasFactory;

    protected $fillable = [
        'participant_one_id',
        'participant_two_id',
    ];

    public function messages()
    {
        return $this->hasMany(Message::class);
    }

    public function participantOne()
    {
        return $this->belongsTo(User::class, 'participant_one_id');
    }

    public function participantTwo()
    {
        return $this->belongsTo(User::class, 'participant_two_id');
    }
}
EOFTHREAD
echo -e "${GREEN}✓ Thread model updated${NC}\n"

# 9. Update Payment model
echo -e "${BLUE}[9/20] Updating Payment model...${NC}"
cat > app/Models/Payment.php << 'EOFPAYMENT'
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'campaign_id',
        'influencer_id',
        'amount',
        'status',
        'payment_method',
        'transaction_id',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
    ];

    public function campaign()
    {
        return $this->belongsTo(Campaign::class);
    }

    public function influencer()
    {
        return $this->belongsTo(User::class, 'influencer_id');
    }
}
EOFPAYMENT
echo -e "${GREEN}✓ Payment model updated${NC}\n"

# 10. Update Rating model
echo -e "${BLUE}[10/20] Updating Rating model...${NC}"
cat > app/Models/Rating.php << 'EOFRATING'
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Rating extends Model
{
    use HasFactory;

    protected $fillable = [
        'campaign_id',
        'rater_id',
        'rated_user_id',
        'score',
        'comment',
    ];

    protected $casts = [
        'score' => 'integer',
    ];

    public function campaign()
    {
        return $this->belongsTo(Campaign::class);
    }

    public function rater()
    {
        return $this->belongsTo(User::class, 'rater_id');
    }

    public function ratedUser()
    {
        return $this->belongsTo(User::class, 'rated_user_id');
    }
}
EOFRATING
echo -e "${GREEN}✓ Rating model updated${NC}\n"

# 11. Update CampaignController
echo -e "${BLUE}[11/20] Updating CampaignController...${NC}"
cat > app/Http/Controllers/CampaignController.php << 'EOFCAMPAIGNCTRL'
<?php

namespace App\Http\Controllers;

use App\Models\Campaign;
use Illuminate\Http\Request;

class CampaignController extends Controller
{
    public function index()
    {
        $campaigns = Campaign::with('brand')->where('status', 'active')->latest()->get();
        return response()->json($campaigns);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'budget' => 'required|numeric|min:0',
            'category' => 'required|string',
            'brief' => 'nullable|string',
        ]);

        $campaign = Campaign::create([
            'brand_id' => auth()->
