<?php

namespace Tests\Feature;

use App\Models\ContactInquiry;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminInquiryAuthorizationTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_inquiries_endpoint_requires_authentication(): void
    {
        $response = $this->getJson('/api/admin/inquiries');

        $response->assertUnauthorized();
    }

    public function test_admin_inquiries_endpoint_rejects_users_without_the_required_permission(): void
    {
        $this->seed();

        $viewer = User::factory()->create();
        $viewer->assignRole('viewer');

        $response = $this->actingAs($viewer)->getJson('/api/admin/inquiries');

        $response
            ->assertForbidden()
            ->assertJsonPath('message', 'You do not have the required role for this action.');
    }

    public function test_sales_managers_can_access_admin_inquiries(): void
    {
        $this->seed();

        ContactInquiry::query()->create([
            'buyer_type' => 'Retail Shop',
            'product' => 'Quality Maize',
            'packaging' => '25kg',
            'quantity' => '40 bags',
            'location' => 'Kinondoni',
            'name' => 'Buyer One',
            'email' => 'buyer@example.com',
            'phone' => '+255700000111',
            'message' => 'Need delivery this week.',
            'status' => 'new',
        ]);

        $salesManager = User::factory()->create();
        $salesManager->assignRole('sales-manager');

        $response = $this->actingAs($salesManager)->getJson('/api/admin/inquiries');

        $response
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.product', 'Quality Maize')
            ->assertJsonPath('data.0.status', 'new');
    }
}
