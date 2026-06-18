<?php

use App\Http\Controllers\CustomerController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ServiceController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public routes
Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('home');

// Authenticated routes (all roles)
Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
});

// Admin & Operator routes
Route::middleware(['auth', 'role:admin,operator'])->group(function () {
    // Orders
    Route::resource('orders', OrderController::class)->except(['edit', 'update']);
    Route::patch('orders/{order}/status', [OrderController::class, 'updateStatus'])->name('orders.status');

    // Payments
    Route::get('orders/{order}/payments', [PaymentController::class, 'index'])->name('payments.index');
    Route::post('payments', [PaymentController::class, 'store'])->name('payments.store');
    Route::patch('payments/{payment}/verify', [PaymentController::class, 'verify'])->name('payments.verify');

    // Customers
    Route::resource('customers', CustomerController::class);
});

// Admin only routes
Route::middleware(['auth', 'role:admin'])->group(function () {
    // Services (Master Data)
    Route::resource('services', ServiceController::class);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
