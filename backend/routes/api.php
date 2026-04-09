<?php

use App\Http\Controllers\Api\Admin\AuthController;
use App\Http\Controllers\Api\Admin\FaqController;
use App\Http\Controllers\Api\Admin\InquiryController as AdminInquiryController;
use App\Http\Controllers\Api\Admin\PermissionController as AdminPermissionController;
use App\Http\Controllers\Api\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Api\Admin\RoleController as AdminRoleController;
use App\Http\Controllers\Api\Admin\SiteSettingController;
use App\Http\Controllers\Api\Admin\TestimonialController;
use App\Http\Controllers\Api\Admin\UserController as AdminUserController;
use App\Http\Controllers\Api\ContactInquiryController;
use App\Http\Controllers\Api\SiteContentController;
use App\Http\Controllers\Api\SiteSearchController;
use Illuminate\Support\Facades\Route;

// Public endpoints
Route::get('/site-content', SiteContentController::class);
Route::get('/site-search', SiteSearchController::class);
Route::post('/inquiries', [ContactInquiryController::class, 'store']);

// Admin auth (public)
Route::prefix('admin')->group(function (): void {
    Route::post('/login', [AuthController::class, 'login']);
});

// Admin authenticated routes
Route::prefix('admin')
    ->middleware(['auth:sanctum'])
    ->group(function (): void {

        // Current user
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);

        // Inquiries
        Route::get('/inquiries/stats', [AdminInquiryController::class, 'stats']);
        Route::apiResource('/inquiries', AdminInquiryController::class)->only(['index', 'show', 'update', 'destroy']);

        // Content management
        Route::apiResource('/products', AdminProductController::class);
        Route::post('/products/reorder', [AdminProductController::class, 'reorder']);

        Route::apiResource('/testimonials', TestimonialController::class);
        Route::post('/testimonials/reorder', [TestimonialController::class, 'reorder']);

        Route::apiResource('/faqs', FaqController::class);
        Route::post('/faqs/reorder', [FaqController::class, 'reorder']);

        Route::get('/site-settings', [SiteSettingController::class, 'show']);
        Route::put('/site-settings', [SiteSettingController::class, 'update']);

        // RBAC
        Route::apiResource('/users', AdminUserController::class);
        Route::apiResource('/roles', AdminRoleController::class);
        Route::apiResource('/permissions', AdminPermissionController::class);
    });
