<?php
namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SiteSettingController extends Controller
{
    public function show(): JsonResponse
    {
        $setting = SiteSetting::query()->where('key', 'homepage')->first();
        return response()->json(['data' => $setting]);
    }

    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'trust_metrics' => ['nullable', 'array'],
            'process_steps' => ['nullable', 'array'],
            'delivery_zones' => ['nullable', 'array'],
            'buyer_logos' => ['nullable', 'array'],
            'promo_highlights' => ['nullable', 'array'],
        ]);

        $setting = SiteSetting::query()->updateOrCreate(
            ['key' => 'homepage'],
            $validated
        );

        return response()->json(['data' => $setting]);
    }
}
