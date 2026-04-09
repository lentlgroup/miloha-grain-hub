<?php
namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TestimonialController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(['data' => Testimonial::query()->ordered()->get()]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'quote' => ['required', 'string'],
            'name' => ['required', 'string', 'max:150'],
            'role' => ['nullable', 'string', 'max:150'],
            'translations' => ['nullable', 'array'],
            'sort_order' => ['nullable', 'integer'],
        ]);

        $t = Testimonial::query()->create($validated);
        return response()->json(['data' => $t], 201);
    }

    public function show(Testimonial $testimonial): JsonResponse
    {
        return response()->json(['data' => $testimonial]);
    }

    public function update(Request $request, Testimonial $testimonial): JsonResponse
    {
        $validated = $request->validate([
            'quote' => ['sometimes', 'string'],
            'name' => ['sometimes', 'string', 'max:150'],
            'role' => ['nullable', 'string', 'max:150'],
            'translations' => ['nullable', 'array'],
            'sort_order' => ['nullable', 'integer'],
        ]);

        $testimonial->update($validated);
        return response()->json(['data' => $testimonial->fresh()]);
    }

    public function destroy(Testimonial $testimonial): JsonResponse
    {
        $testimonial->delete();
        return response()->json(['message' => 'Deleted.']);
    }

    public function reorder(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'order' => ['required', 'array'],
            'order.*' => ['integer'],
        ]);

        foreach ($validated['order'] as $sortOrder => $id) {
            Testimonial::query()->where('id', $id)->update(['sort_order' => $sortOrder + 1]);
        }

        return response()->json(['message' => 'Reordered.']);
    }
}
