<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Faq;
use App\Models\Product;
use App\Models\SiteSetting;
use App\Models\Testimonial;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Arr;

class SiteContentController extends Controller
{
    public function __invoke(): JsonResponse
    {
        $homepage = SiteSetting::query()
            ->where('key', 'homepage')
            ->first();

        return response()->json([
            'products' => Product::query()
                ->ordered()
                ->get()
                ->map(fn (Product $product) => $this->transformProduct($product))
                ->values(),
            'trustMetrics' => collect($homepage?->trust_metrics ?? [])
                ->map(fn (array $metric) => [
                    'value' => $metric['value'],
                    'suffix' => $metric['suffix'],
                    'label' => $this->translatedField($metric, 'label'),
                    'detail' => $this->translatedField($metric, 'detail'),
                ])
                ->values(),
            'processSteps' => collect($homepage?->process_steps ?? [])
                ->map(fn (array $step) => [
                    'title' => $this->translatedField($step, 'title'),
                    'desc' => $this->translatedField($step, 'desc'),
                ])
                ->values(),
            'deliveryZones' => collect($homepage?->delivery_zones ?? [])
                ->map(fn (array $zone) => [
                    'zone' => $this->translatedField($zone, 'zone'),
                    'eta' => $this->translatedField($zone, 'eta'),
                    'note' => $this->translatedField($zone, 'note'),
                ])
                ->values(),
            'buyerLogos' => $homepage?->buyer_logos ?? [],
            'heroSlides' => collect($homepage?->hero_slides ?? [])
                ->filter(fn (array $slide) => ($slide['active'] ?? true) === true)
                ->sortBy('sort_order')
                ->values()
                ->map(fn (array $slide) => [
                    'title' => $slide['title'] ?? '',
                    'subtitle' => $slide['subtitle'] ?? '',
                    'badge' => $slide['badge'] ?? '',
                    'caption' => $slide['caption'] ?? '',
                    'cta_primary' => $slide['cta_primary'] ?? '',
                    'cta_secondary' => $slide['cta_secondary'] ?? '',
                    'image_key' => $slide['image_key'] ?? 'hero',
                ])
                ->all(),
            'promoHighlights' => collect($homepage?->promo_highlights ?? [])
                ->map(fn (array $highlight) => $this->translatedField($highlight, 'text'))
                ->values(),
            'testimonials' => Testimonial::query()
                ->ordered()
                ->get()
                ->map(fn (Testimonial $testimonial) => [
                    'quote' => $this->translatedColumn($testimonial->quote, $testimonial->translations, 'quote'),
                    'name' => $testimonial->name,
                    'role' => $this->translatedColumn($testimonial->role, $testimonial->translations, 'role'),
                ])
                ->values(),
            'faqs' => Faq::query()
                ->ordered()
                ->get()
                ->map(fn (Faq $faq) => [
                    'question' => $this->translatedColumn($faq->question, $faq->translations, 'question'),
                    'answer' => $this->translatedColumn($faq->answer, $faq->translations, 'answer'),
                ])
                ->values(),
        ]);
    }

    private function transformProduct(Product $product): array
    {
        $translations = $product->translations ?? [];

        return [
            'id' => $product->slug,
            'imageKey' => $product->image_key,
            'name' => $this->translatedColumn($product->name, $translations, 'name'),
            'desc' => $this->translatedColumn($product->description, $translations, 'description'),
            'tag' => $this->translatedColumn($product->tag, $translations, 'tag'),
            'category' => $product->categories,
            'sizes' => $product->sizes,
            'uses' => $this->translatedList($product->uses, $translations, 'uses'),
            'highlights' => $this->translatedList($product->highlights, $translations, 'highlights'),
            'nutrition' => $this->translatedNutrition($product->nutrition, $translations),
        ];
    }

    private function translatedNutrition(array $nutrition, array $translations): array
    {
        $swItems = Arr::get($translations, 'sw.nutrition', []);

        return collect($nutrition)
            ->values()
            ->map(function (array $item, int $index) use ($swItems): array {
                $swItem = $swItems[$index] ?? [];

                return [
                    'label' => [
                        'en' => $item['label'],
                        'sw' => $swItem['label'] ?? $item['label'],
                    ],
                    'value' => [
                        'en' => $item['value'],
                        'sw' => $swItem['value'] ?? $item['value'],
                    ],
                ];
            })
            ->all();
    }

    private function translatedList(array $items, array $translations, string $key): array
    {
        $swItems = Arr::get($translations, "sw.$key", []);

        return collect($items)
            ->values()
            ->map(fn (string $item, int $index) => [
                'en' => $item,
                'sw' => $swItems[$index] ?? $item,
            ])
            ->all();
    }

    private function translatedField(array $item, string $field): array
    {
        return [
            'en' => $item[$field],
            'sw' => Arr::get($item, "translations.sw.$field", $item[$field]),
        ];
    }

    private function translatedColumn(string $value, ?array $translations, string $field): array
    {
        return [
            'en' => $value,
            'sw' => Arr::get($translations ?? [], "sw.$field", $value),
        ];
    }
}
