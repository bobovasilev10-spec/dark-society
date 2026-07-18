<?php

namespace App\Models;

use Illuminate\Support\Facades\Log;
use Intervention\Image\ImageManager;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Spatie\Translatable\HasTranslations;
use Intervention\Image\Drivers\Gd\Driver;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use SoftDeletes;
    use HasTranslations;

    protected $appends = ['promo_price', 'active_promo_price', 'image_path'];
    protected $fillable = [
        'category_id',
        'supplier_id',
        'name',
        'slug',
        'description',
        'unit',
        'price',
        'image',
        'coverage',
        'is_active',
        'is_featured',
        'weight',
        'webp',
        'qty',
    ];
    protected $translatable = [
        'name',
        'description',
        'unit',
    ];
    public function prices()
    {
        return $this->hasMany(ProductPrice::class);
    }
    public function images()
    {
        return $this->hasMany(ProductImage::class);
    }
    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }
    public function options()
    {
        return $this->hasMany(ProductOption::class)
            ->orderBy('option_id')
            ->with('option');
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    public function getImagePathAttribute()
    {

        return asset('storage/' . $this->image);
    }

    public function getRouteKeyName()
    {
        return 'slug';
    }
    public function getPromoPriceAttribute()
    {
        $promo_price = $this->prices()->where('date_from', '<=', now())->where('date_to', '>=', now())->first();
        if (!$promo_price) {
            return null;
        }
        if ($promo_price->discount_type == 'fixed') {
            return $promo_price->value;
        }
        if ($promo_price->discount_type == 'percentage') {
            $discount =  $this->price * $promo_price->value / 100;
            return number_format($this->price - $discount, 2, '.', '');
        }
    }

    public function getActivePromoPriceAttribute()
    {
        $promo_price = $this->prices()->where('date_from', '<=', now())->where('date_to', '>=', now())->first();
        return $promo_price;
    }
}
