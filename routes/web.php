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

// Simple welcome endpoint
Route::get('/', function () {
    return response()->json([
        'message' => 'Influenita API - Welcome',
        'version' => '1.0.0',
        'documentation' => 'See /api/documentation or check the API_COMPLETE_SETUP.md file',
    ]);
});

// Authentication routes
require __DIR__.'/auth.php';
