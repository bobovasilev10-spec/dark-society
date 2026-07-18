<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductFilter extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'filter_option_id',
        'name',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function filter()
    {
        return $this->belongsTo(FilterOption::class, 'filter_option_id');
    }
}
