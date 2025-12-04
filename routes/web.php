<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/public', function () {
    return view('app'); // Change 'app' to your main SPA blade if different
});
