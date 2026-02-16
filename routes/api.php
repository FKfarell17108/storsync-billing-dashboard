<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\PackageController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ActivityController;

// Public routes
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // User Management (Admin only usually, but for now open to auth)
    // In a real app, use Policies or Middleware for 'admin' check
    Route::get('/users-list', [UserController::class, 'index']);
    Route::apiResource('users', UserController::class);

    Route::apiResource('customers', CustomerController::class);
    Route::apiResource('packages', PackageController::class);
    Route::apiResource('subscriptions', SubscriptionController::class);
    Route::apiResource('invoices', InvoiceController::class);
    Route::apiResource('payments', PaymentController::class);
    Route::get('/activity', [ActivityController::class, 'index']);
});
