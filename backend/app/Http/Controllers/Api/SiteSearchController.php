<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Faq;
use App\Models\Product;
use App\Models\SiteSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;

class SiteSearchController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $query = trim((string) $request->query('q', ''));
        $tokens = $this->tokenize($query);

        if ($tokens === []) {
            return response()->json([
                'query' => $query,
                'tokens' => [],
                'results' => [],
            ]);
        }

        $homepage = SiteSetting::query()
            ->where('key', 'homepage')
            ->first();

        $entries = [
            ...Product::query()
                ->ordered()
                ->get()
                ->map(fn (Product $product) => $this->productSearchEntry($product))
                ->all(),
            ...Faq::query()
                ->ordered()
                ->get()
                ->values()
                ->map(fn (Faq $faq, int $index) => $this->faqSearchEntry($faq, $index))
                ->all(),
            ...collect($homepage?->delivery_zones ?? [])
                ->values()
                ->map(fn (array $zone, int $index) => $this->deliverySearchEntry($zone, $index))
                ->all(),
            ...collect($homepage?->process_steps ?? [])
                ->values()
                ->map(fn (array $step, int $index) => $this->processSearchEntry($step, $index))
                ->all(),
            ...collect($homepage?->trust_metrics ?? [])
                ->values()
                ->map(fn (array $metric, int $index) => $this->metricSearchEntry($metric, $index))
                ->all(),
        ];

        $scored = collect($entries)
            ->map(fn (array $entry) => $this->scoreEntry($entry, $tokens))
            ->filter();

        $preferred = $scored->contains(fn (array $entry) => $entry['matchesAllTerms'])
            ? $scored->filter(fn (array $entry) => $entry['matchesAllTerms'])
            : $scored;

        $results = $preferred
            ->sortBy([
                ['kindRank', 'asc'],
                ['score', 'desc'],
                ['sortRank', 'asc'],
                ['title.en', 'asc'],
            ])
            ->values()
            ->take(12)
            ->map(fn (array $entry) => Arr::only($entry, [
                'id',
                'kind',
                'anchor',
                'sectionId',
                'sectionLabel',
                'title',
                'description',
                'itemKey',
                'matchedTerms',
                'matchesAllTerms',
            ]))
            ->all();

        return response()->json([
            'query' => $query,
            'tokens' => $tokens,
            'results' => $results,
        ]);
    }

    private function productSearchEntry(Product $product): array
    {
        $translations = $product->translations ?? [];
        $title = $this->translatedColumn($product->name, $translations, 'name');
        $description = $this->translatedColumn($product->description, $translations, 'description');
        $tag = $this->translatedColumn($product->tag, $translations, 'tag');
        $uses = $this->translatedList($product->uses ?? [], $translations, 'uses');
        $highlights = $this->translatedList($product->highlights ?? [], $translations, 'highlights');

        return $this->makeSearchEntry(
            id: sprintf('product-%s', $product->slug),
            kind: 'product',
            anchor: sprintf('product-%s', $product->slug),
            sectionId: 'products',
            sectionLabel: $this->localizedText('Products', 'Bidhaa'),
            title: $title,
            description: $description,
            itemKey: $product->slug,
            searchable: [
                'en' => array_filter([
                    $title['en'],
                    $description['en'],
                    $tag['en'],
                    ...array_map(fn (array $item) => $item['en'], $uses),
                    ...array_map(fn (array $item) => $item['en'], $highlights),
                    ...($product->sizes ?? []),
                    ...($product->categories ?? []),
                ]),
                'sw' => array_filter([
                    $title['sw'],
                    $description['sw'],
                    $tag['sw'],
                    ...array_map(fn (array $item) => $item['sw'], $uses),
                    ...array_map(fn (array $item) => $item['sw'], $highlights),
                    ...($product->sizes ?? []),
                    ...$this->categoryTranslations($product->categories ?? []),
                ]),
            ],
            kindRank: 0,
            sortRank: (int) ($product->sort_order ?? 0),
        );
    }

    private function faqSearchEntry(Faq $faq, int $index): array
    {
        $title = $this->translatedColumn($faq->question, $faq->translations, 'question');
        $description = $this->translatedColumn($faq->answer, $faq->translations, 'answer');

        return $this->makeSearchEntry(
            id: sprintf('faq-%d', $index + 1),
            kind: 'faq',
            anchor: sprintf('faq-item-%d', $index + 1),
            sectionId: 'faq',
            sectionLabel: $this->localizedText('FAQ', 'Maswali'),
            title: $title,
            description: $description,
            itemKey: sprintf('item-%d', $index),
            searchable: [
                'en' => [$title['en'], $description['en']],
                'sw' => [$title['sw'], $description['sw']],
            ],
            kindRank: 1,
            sortRank: $index + 1,
        );
    }

    private function deliverySearchEntry(array $zone, int $index): array
    {
        $title = $this->translatedField($zone, 'zone');
        $eta = $this->translatedField($zone, 'eta');
        $description = $this->translatedField($zone, 'note');

        return $this->makeSearchEntry(
            id: sprintf('delivery-zone-%d', $index + 1),
            kind: 'delivery',
            anchor: sprintf('delivery-zone-%d', $index + 1),
            sectionId: 'coverage',
            sectionLabel: $this->localizedText('Delivery', 'Usafirishaji'),
            title: $title,
            description: $description,
            itemKey: sprintf('delivery-zone-%d', $index + 1),
            searchable: [
                'en' => [$title['en'], $description['en'], $eta['en']],
                'sw' => [$title['sw'], $description['sw'], $eta['sw']],
            ],
            kindRank: 2,
            sortRank: $index + 1,
        );
    }

    private function processSearchEntry(array $step, int $index): array
    {
        $title = $this->translatedField($step, 'title');
        $description = $this->translatedField($step, 'desc');

        return $this->makeSearchEntry(
            id: sprintf('process-step-%d', $index + 1),
            kind: 'process',
            anchor: sprintf('process-step-%d', $index + 1),
            sectionId: 'quality',
            sectionLabel: $this->localizedText('Quality Journey', 'Safari ya Ubora'),
            title: $title,
            description: $description,
            itemKey: sprintf('process-step-%d', $index + 1),
            searchable: [
                'en' => [$title['en'], $description['en']],
                'sw' => [$title['sw'], $description['sw']],
            ],
            kindRank: 3,
            sortRank: $index + 1,
        );
    }

    private function metricSearchEntry(array $metric, int $index): array
    {
        $title = $this->translatedField($metric, 'label');
        $description = $this->translatedField($metric, 'detail');

        return $this->makeSearchEntry(
            id: sprintf('trust-metric-%d', $index + 1),
            kind: 'metric',
            anchor: sprintf('trust-metric-%d', $index + 1),
            sectionId: 'trust',
            sectionLabel: $this->localizedText('Quick Snapshot', 'Muhtasari wa Haraka'),
            title: $title,
            description: $description,
            itemKey: sprintf('trust-metric-%d', $index + 1),
            searchable: [
                'en' => [$title['en'], $description['en'], (string) ($metric['value'] ?? ''), (string) ($metric['suffix'] ?? '')],
                'sw' => [$title['sw'], $description['sw'], (string) ($metric['value'] ?? ''), (string) ($metric['suffix'] ?? '')],
            ],
            kindRank: 4,
            sortRank: $index + 1,
        );
    }

    private function makeSearchEntry(
        string $id,
        string $kind,
        string $anchor,
        string $sectionId,
        array $sectionLabel,
        array $title,
        array $description,
        ?string $itemKey,
        array $searchable,
        int $kindRank,
        int $sortRank,
    ): array {
        return [
            'id' => $id,
            'kind' => $kind,
            'kindRank' => $kindRank,
            'sortRank' => $sortRank,
            'anchor' => $anchor,
            'sectionId' => $sectionId,
            'sectionLabel' => $sectionLabel,
            'title' => $title,
            'description' => $description,
            'itemKey' => $itemKey,
            '_search' => $this->normalizeText(implode(' ', [
                implode(' ', $searchable['en'] ?? []),
                implode(' ', $searchable['sw'] ?? []),
            ])),
            '_title' => $this->normalizeText(implode(' ', [$title['en'], $title['sw']])),
            '_description' => $this->normalizeText(implode(' ', [$description['en'], $description['sw']])),
        ];
    }

    private function scoreEntry(array $entry, array $tokens): ?array
    {
        $matchedTerms = array_values(array_filter(
            $tokens,
            fn (string $token) => str_contains($entry['_search'], $token),
        ));

        if ($matchedTerms === []) {
            return null;
        }

        $matchesAllTerms = count($matchedTerms) === count($tokens);
        $phrase = implode(' ', $tokens);
        $titleHits = count(array_filter(
            $tokens,
            fn (string $token) => str_contains($entry['_title'], $token),
        ));
        $descriptionHits = count(array_filter(
            $tokens,
            fn (string $token) => str_contains($entry['_description'], $token),
        ));

        $score = (count($matchedTerms) * 12)
            + ($titleHits * 18)
            + ($descriptionHits * 6)
            + (str_contains($entry['_title'], $phrase) ? 28 : 0)
            + (str_contains($entry['_search'], $phrase) ? 16 : 0)
            + ($matchesAllTerms ? 30 : 0);

        return [
            ...$entry,
            'matchedTerms' => $matchedTerms,
            'matchesAllTerms' => $matchesAllTerms,
            'score' => $score,
        ];
    }

    private function tokenize(string $query): array
    {
        $normalized = $this->normalizeText($query);
        $parts = preg_split('/[^[:alnum:]]+/u', $normalized, -1, PREG_SPLIT_NO_EMPTY) ?: [];

        return array_values(array_unique(array_filter($parts)));
    }

    private function normalizeText(string $value): string
    {
        $ascii = iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $value);
        $normalized = $ascii === false ? $value : $ascii;

        return preg_replace('/\s+/', ' ', strtolower(trim($normalized))) ?? '';
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

    private function localizedText(string $en, string $sw): array
    {
        return ['en' => $en, 'sw' => $sw];
    }

    private function categoryTranslations(array $categories): array
    {
        $labels = [
            'retail' => 'Rejareja',
            'wholesale' => 'Jumla',
            'packaged' => 'Zilizofungashwa',
            'bulk' => 'Kiasi Kikubwa',
        ];

        return array_values(array_map(
            fn (string $category) => $labels[$category] ?? $category,
            $categories,
        ));
    }
}
