<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactInquiry extends Model
{
    protected $fillable = [
        'buyer_type',
        'product',
        'packaging',
        'quantity',
        'location',
        'name',
        'email',
        'phone',
        'language',
        'company',
        'interest_area',
        'form_type',
        'message',
        'status',
        'follow_up_note',
    ];
}
