<?php
namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'data' => Product::query()->ordered()->get(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:200'],
            'description' => ['required', 'string'],
            'tag' => ['nullable', 'string', 'max:100'],
            'image_key' => ['nullable', 'string', 'max:100'],
            'categories' => ['nullable', 'array'],
            'sizes' => ['nullable', 'array'],
            'uses' => ['nullable', 'array'],
            'highlights' => ['nullable', 'array'],
            'nutrition' => ['nullable', 'array'],
            'translations' => ['nullable', 'array'],
            'sort_order' => ['nullable', 'integer'],
        ]);

        $validated['slug'] = $validated['slug'] ?? Str::slug($validated['name']);

        $product = Product::query()->create($validated);

        return response()->json(['data' => $product], 201);
    }

    public function show(Product $product): JsonResponse
    {
        return response()->json(['data' => $product]);
    }

    public function update(Request $request, Product $product): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:200'],
            'description' => ['sometimes', 'string'],
            'tag' => ['nullable', 'string', 'max:100'],
            'image_key' => ['nullable', 'string', 'max:100'],
            'categories' => ['nullable', 'array'],
            'sizes' => ['nullable', 'array'],
            'uses' => ['nullable', 'array'],
            'highlights' => ['nullable', 'array'],
            'nutrition' => ['nullable', 'array'],
            'translations' => ['nullable', 'array'],
            'sort_order' => ['nullable', 'integer'],
        ]);

        $product->update($validated);

        return response()->json(['data' => $product->fresh()]);
    }

    public function destroy(Product $product): JsonResponse
    {
        $product->delete();
        return response()->json(['message' => 'Product deleted.']);
    }

    public function reorder(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'order' => ['required', 'array'],
            'order.*' => ['integer'],
        ]);

        foreach ($validated['order'] as $sortOrder => $id) {
            Product::query()->where('id', $id)->update(['sort_order' => $sortOrder + 1]);
        }

        return response()->json(['message' => 'Reordered.']);
    }
}
