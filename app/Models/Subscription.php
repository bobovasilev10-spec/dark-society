<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Subscription extends Model
{
    use HasFactory;
    use HasTranslations;
    // Define constants for subscription types
    const TYPE_SINGLE = 'single';
    const TYPE_MONTHLY = 'monthly';


    protected $fillable = [
        'name',
        'content',
        'image',
        'type',
        'price',
        'slug',
        'subscription_data',
        'is_active',
        "requires_delivery"
    ];
    protected $translatable = [
        'name',
        'content',
    ];
    protected $casts = [
        'subscription_data' => 'array',
    ];
    protected $appends = ['promo_price', 'active_promo_price', 'subscription_data_with_labels'];

    public function getSubscriptionDataWithLabelsAttribute()
    {
        // Get the stored keys from the subscription_data column
        $keys = $this->subscription_data ?? [];

        // Retrieve the corresponding labels from the SubscriptionData model
        $subscriptionData = SubscriptionData::whereIn('key', $keys)->get();

        // Map keys to labels
        return $subscriptionData->map(function ($data) {
            return [
                'key' => $data->key,
                'label' => $data->label,
            ];
        });
    }
    public function prices()
    {
        return $this->hasMany(SubscriptionPrice::class);
    }
    // You can also create a method to get all types if needed
    public static function types()
    {
        return [
            self::TYPE_SINGLE => 'Единичен',
            self::TYPE_MONTHLY => 'Месечен',
        ];
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
