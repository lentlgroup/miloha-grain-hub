<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactInquiry;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InquiryController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = ContactInquiry::query()->latest();

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $search = '%' . $request->search . '%';
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', $search)
                  ->orWhere('email', 'like', $search)
                  ->orWhere('product', 'like', $search)
                  ->orWhere('location', 'like', $search);
            });
        }

        return response()->json(['data' => $query->get()]);
    }

    public function show(ContactInquiry $inquiry): JsonResponse
    {
        return response()->json(['data' => $inquiry]);
    }

    public function update(Request $request, ContactInquiry $inquiry): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['sometimes', 'in:new,in-progress,resolved,archived'],
            'follow_up_note' => ['nullable', 'string', 'max:4000'],
        ]);

        $inquiry->update($validated);

        return response()->json(['data' => $inquiry->fresh()]);
    }

    public function destroy(ContactInquiry $inquiry): JsonResponse
    {
        $inquiry->delete();
        return response()->json(['message' => 'Inquiry deleted.']);
    }

    public function stats(): JsonResponse
    {
        return response()->json([
            'total' => ContactInquiry::query()->count(),
            'new' => ContactInquiry::query()->where('status', 'new')->count(),
            'in_progress' => ContactInquiry::query()->where('status', 'in-progress')->count(),
            'resolved' => ContactInquiry::query()->where('status', 'resolved')->count(),
            'archived' => ContactInquiry::query()->where('status', 'archived')->count(),
        ]);
    }
}
