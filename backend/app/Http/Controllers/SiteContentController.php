<?php

namespace App\Http\Controllers;

use App\Models\Faq;
use App\Models\Product;
use App\Models\Testimonial;
use App\Models\SiteSetting;
use Illuminate\Http\JsonResponse;

class SiteContentController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @return JsonResponse
     */
    public function __invoke(): JsonResponse
    {
        $faqs = Faq::all();
        $products = Product::all();
        $testimonials = Testimonial::all();
        $siteSettings = SiteSetting::first();

        return response()->json([
            'faqs' => $faqs,
            'products' => $products,
            'testimonials' => $testimonials,
            'siteSettings' => $siteSettings,
        ]);
    }
}