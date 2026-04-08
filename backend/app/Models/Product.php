<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'slug',
        'name',
        'description',
        'tag',
        'image_key',
        'categories',
        'sizes',
        'uses',
        'highlights',
        'nutrition',
        'translations',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'categories' => 'array',
            'sizes' => 'array',
            'uses' => 'array',
            'highlights' => 'array',
            'nutrition' => 'array',
            'translations' => 'array',
        ];
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order')->orderBy('id');
    }
}
