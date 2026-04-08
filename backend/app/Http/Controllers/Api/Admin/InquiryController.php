<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactInquiry;
use Illuminate\Http\JsonResponse;

class InquiryController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'data' => ContactInquiry::query()
                ->latest()
                ->get([
                    'id',
                    'buyer_type',
                    'product',
                    'packaging',
                    'quantity',
                    'location',
                    'name',
                    'email',
                    'phone',
                    'message',
                    'status',
                    'created_at',
                ]),
        ]);
    }
}
