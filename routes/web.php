<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

// Default welcome endpoint
Route::get('/', function () {
    return response()->json([
        'message' => 'Tretproekt API - Welcome',
        'version' => '1.0.0',
        'endpoints' => [
            'api' => '/api/v1',
            'documentation' => '/api/documentation',
            'health' => '/api/health'
        ]
    ]);
})->name('home');

// Load authentication routes
require __DIR__.'/auth.php';
