<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContactInquiry;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContactInquiryController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'buyerType' => ['required', 'string', 'max:100'],
            'product' => ['required', 'string', 'max:100'],
            'packaging' => ['required', 'string', 'max:100'],
            'quantity' => ['nullable', 'string', 'max:100'],
            'location' => ['required', 'string', 'max:150'],
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:120'],
            'phone' => ['required', 'string', 'max:50'],
            'language' => ['required', 'in:en,sw'],
            'message' => ['nullable', 'string', 'max:4000'],
        ]);

        $inquiry = ContactInquiry::query()->create([
            'buyer_type' => $validated['buyerType'],
            'product' => $validated['product'],
            'packaging' => $validated['packaging'],
            'quantity' => $validated['quantity'] ?? null,
            'location' => $validated['location'],
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'language' => $validated['language'],
            'message' => $validated['message'] ?? null,
            'status' => 'new',
        ]);

        return response()->json([
            'message' => 'Inquiry submitted successfully.',
            'id' => $inquiry->id,
        ], 201);
    }
}
