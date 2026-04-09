<?php
namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Faq;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FaqController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(['data' => Faq::query()->ordered()->get()]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'question' => ['required', 'string'],
            'answer' => ['required', 'string'],
            'translations' => ['nullable', 'array'],
            'sort_order' => ['nullable', 'integer'],
        ]);

        $faq = Faq::query()->create($validated);
        return response()->json(['data' => $faq], 201);
    }

    public function show(Faq $faq): JsonResponse
    {
        return response()->json(['data' => $faq]);
    }

    public function update(Request $request, Faq $faq): JsonResponse
    {
        $validated = $request->validate([
            'question' => ['sometimes', 'string'],
            'answer' => ['sometimes', 'string'],
            'translations' => ['nullable', 'array'],
            'sort_order' => ['nullable', 'integer'],
        ]);

        $faq->update($validated);
        return response()->json(['data' => $faq->fresh()]);
    }

    public function destroy(Faq $faq): JsonResponse
    {
        $faq->delete();
        return response()->json(['message' => 'Deleted.']);
    }

    public function reorder(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'order' => ['required', 'array'],
            'order.*' => ['integer'],
        ]);

        foreach ($validated['order'] as $sortOrder => $id) {
            Faq::query()->where('id', $id)->update(['sort_order' => $sortOrder + 1]);
        }

        return response()->json(['message' => 'Reordered.']);
    }
}
