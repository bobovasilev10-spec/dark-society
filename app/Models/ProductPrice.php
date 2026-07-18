<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductPrice extends Model
{
    use HasFactory;
    use HasFactory;

    protected $fillable = [
        'product_id',
        'discount_type',
        'value',
        'date_from',
        'date_to',
    ];

    protected $casts = [
        'date_from' => 'datetime',
        'date_to' => 'datetime',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
