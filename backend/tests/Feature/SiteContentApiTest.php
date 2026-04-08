<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SiteContentApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_site_content_endpoint_returns_seeded_content(): void
    {
        $this->seed();

        $response = $this->getJson('/api/site-content');

        $response
            ->assertOk()
            ->assertJsonCount(4, 'products')
            ->assertJsonCount(4, 'faqs')
            ->assertJsonCount(3, 'testimonials')
            ->assertJsonCount(4, 'trustMetrics')
            ->assertJsonPath('products.0.id', 'rice')
            ->assertJsonPath('products.0.imageKey', 'rice')
            ->assertJsonPath('products.0.name.en', 'Premium Rice')
            ->assertJsonPath('products.0.name.sw', 'Mchele Bora')
            ->assertJsonPath('faqs.0.question.en', 'Do you support both small and bulk orders?')
            ->assertJsonPath('faqs.0.question.sw', 'Je, mnahudumia oda ndogo na kubwa?');
    }

    public function test_site_search_endpoint_returns_anchored_results_for_multi_word_queries(): void
    {
        $this->seed();

        $response = $this->getJson('/api/site-search?q=retail%20shelves');

        $response
            ->assertOk()
            ->assertJsonPath('tokens.0', 'retail')
            ->assertJsonPath('tokens.1', 'shelves')
            ->assertJsonPath('results.0.kind', 'product')
            ->assertJsonPath('results.0.anchor', 'product-packaged')
            ->assertJsonPath('results.0.sectionId', 'products')
            ->assertJsonPath('results.0.title.en', 'Packaged Products')
            ->assertJsonPath('results.0.matchesAllTerms', true);
    }

    public function test_site_search_endpoint_matches_swahili_queries(): void
    {
        $this->seed();

        $response = $this->getJson('/api/site-search?q=rejareja');

        $response
            ->assertOk()
            ->assertJsonCount(1, 'tokens')
            ->assertJsonPath('results.0.anchor', 'product-rice')
            ->assertJsonPath('results.0.sectionLabel.sw', 'Bidhaa');
    }
}
