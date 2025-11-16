<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CampaignController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\PaymentController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Health check endpoint
Route::get('/health', function () {
    return response()->json([
        'status' => 'OK',
        'message' => 'API is running',
        'timestamp' => now()
    ]);
});

// Public API routes - No authentication required
Route::prefix('v1')->group(function () {
    // Authentication endpoints
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);
});

// Protected API routes - Authentication required (Sanctum)
Route::middleware('auth:sanctum')->prefix('v1')->group(function () {
    // Authentication
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    
    // Profile management
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::delete('/profile', [ProfileController::class, 'destroy']);
    
    // Campaigns (REST resource)
    Route::apiResource('campaigns', CampaignController::class);
    
    // Applications
    Route::get('/applications', [ApplicationController::class, 'index']);
    Route::post('/applications', [ApplicationController::class, 'store']);
    Route::get('/applications/{id}', [ApplicationController::class, 'show']);
    Route::put('/applications/{id}', [ApplicationController::class, 'update']);
    Route::delete('/applications/{id}', [ApplicationController::class, 'destroy']);
    
    // Messages and conversations
    Route::get('/conversations', [MessageController::class, 'conversations']);
    Route::get('/conversations/{id}/messages', [MessageController::class, 'show']);
    Route::post('/messages', [MessageController::class, 'store']);
    Route::put('/messages/{id}', [MessageController::class, 'update']);
    Route::delete('/messages/{id}', [MessageController::class, 'destroy']);
    
    // Payments
    Route::get('/payments', [PaymentController::class, 'index']);
    Route::post('/payments', [PaymentController::class, 'store']);
    Route::get('/payments/{id}', [PaymentController::class, 'show']);
});
