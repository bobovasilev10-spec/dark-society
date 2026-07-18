<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Coupon extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'user_id',
        'code',
        'discount_type',
        'discount',
        'minimum_amount',
        'date_from',
        'date_to',
        'quantity',
        'is_active',
        'usage',
    ];

    protected $casts = [
        'date_from' => 'datetime',
        'date_to' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeValid($query)
    {
        return $query
            ->where('date_from', '<=', now())
            ->where(function ($query) {
                $query->whereNull('date_to')
                    ->orWhere('date_to', '>=', now());
            });
    }

    public function scopeUsable($query)
    {
        return $query
            ->where('quantity', null)
            ->orWhere('quantity', '>', 0);
    }

    public function isUsable()
    {
        if (is_null($this->quantity)) {
            return true;
        }

        // The coupon is usable if the usage count is less than the quantity limit.
        return $this->usage < $this->quantity;
    }
}
