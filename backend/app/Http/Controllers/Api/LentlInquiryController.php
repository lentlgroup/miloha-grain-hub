<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContactInquiry;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Handles contact form submissions from the LeNTL Group corporate landing page.
 * Stores enquiries in the shared contact_inquiries table with form_type = 'lentl'.
 */
class LentlInquiryController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'          => ['required', 'string', 'max:120'],
            'phone'         => ['required', 'string', 'max:50'],
            'email'         => ['nullable', 'email', 'max:120'],
            'company'       => ['nullable', 'string', 'max:150'],
            'interest_area' => [
                'required',
                'in:pure-grains,logistics,agro-solutions,partnership,general-inquiry',
            ],
            'message'       => ['required', 'string', 'max:4000'],
        ]);

        $inquiry = ContactInquiry::query()->create([
            // Map to existing required columns (buyer_type / product used as interest proxy)
            'buyer_type'    => $validated['interest_area'],
            'product'       => $validated['interest_area'],
            'packaging'     => 'n/a',
            'location'      => 'n/a',
            // Contact details
            'name'          => $validated['name'],
            'email'         => $validated['email'] ?? '',
            'phone'         => $validated['phone'],
            // LeNTL-specific fields
            'company'       => $validated['company'] ?? null,
            'interest_area' => $validated['interest_area'],
            'message'       => $validated['message'],
            'form_type'     => 'lentl',
            'status'        => 'new',
        ]);

        return response()->json([
            'message' => 'Inquiry submitted successfully.',
            'id'      => $inquiry->id,
        ], 201);
    }
}
