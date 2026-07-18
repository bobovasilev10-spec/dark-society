<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CartCoupon extends Model
{
    use HasFactory;

    protected $fillable = [
        'session_id',
        'user_id',
        'coupon_id',
    ];

    public function coupon()
    {
        return $this->belongsTo(Coupon::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function calculateDiscount($total)
    {
        if (!$this->coupon || $total < $this->coupon->minimum_amount) {
            return 0;
        }

        if ($this->coupon->discount_type == 'fixed') {
            return $this->coupon->discount;
        }

        if ($this->coupon->discount_type == 'percent') {
            return $total * $this->coupon->discount / 100;
        }

        return 0;
    }
}
