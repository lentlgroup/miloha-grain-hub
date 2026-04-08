<?php

use App\Http\Controllers\Api\Admin\InquiryController as AdminInquiryController;
use App\Http\Controllers\Api\ContactInquiryController;
use App\Http\Controllers\Api\SiteContentController;
use App\Http\Controllers\Api\SiteSearchController;
use Illuminate\Support\Facades\Route;

Route::get('/site-content', SiteContentController::class);
Route::get('/site-search', SiteSearchController::class);
Route::post('/inquiries', [ContactInquiryController::class, 'store']);

Route::prefix('admin')
    ->middleware(['auth', 'role:super-admin,sales-manager', 'permission:manage-inquiries'])
    ->group(function (): void {
        Route::get('/inquiries', [AdminInquiryController::class, 'index']);
    });
