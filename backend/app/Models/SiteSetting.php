<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SiteSetting extends Model
{
    protected $fillable = [
        'key',
        'trust_metrics',
        'process_steps',
        'delivery_zones',
        'buyer_logos',
        'promo_highlights',
    ];

    protected function casts(): array
    {
        return [
            'trust_metrics' => 'array',
            'process_steps' => 'array',
            'delivery_zones' => 'array',
            'buyer_logos' => 'array',
            'promo_highlights' => 'array',
        ];
    }
}
