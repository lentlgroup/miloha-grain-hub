<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ContactInquiryApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_contact_inquiries_can_be_created_from_the_api(): void
    {
        $payload = [
            'buyerType' => 'Wholesale Buyer',
            'product' => 'Premium Rice',
            'packaging' => '50kg',
            'quantity' => '100 bags',
            'location' => 'Dar es Salaam',
            'name' => 'Jane Buyer',
            'email' => 'jane@example.com',
            'phone' => '+255700000000',
            'language' => 'en',
            'message' => 'Need weekly supply.',
        ];

        $response = $this->postJson('/api/inquiries', $payload);

        $response
            ->assertCreated()
            ->assertJsonPath('message', 'Inquiry submitted successfully.');

        $this->assertDatabaseHas('contact_inquiries', [
            'buyer_type' => 'Wholesale Buyer',
            'product' => 'Premium Rice',
            'email' => 'jane@example.com',
            'language' => 'en',
            'status' => 'new',
        ]);
    }
}
