<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    protected $fillable = [
        'order_id',
        'product_id',
        'name',
        'quantity',
        'price',
        'product_options',
    ];
    protected $casts = [
        'product_options' => 'array',
    ];

    protected $appends = ['options'];
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $order = $model->order;
            $order->total_price += ($model->price * $model->quantity) + $order->delivery_fee;
            $order->save();

            if ($model->product_options && count($model->product_options) > 0) {
                foreach ($model->product_options as $option) {
                    $product_option = ProductOption::query()->where('product_id', $model->product_id)->where('option_id', $option['option_id'])->first();
                    $product_option->qty -= $model->quantity;
                    $product_option->save();
                }
            }else if($model->product_id){
                $model->product->qty -= $model->quantity;
                $model->product->save();
            }
        });

        static::updating(function ($model) {
            $order = $model->order;
            $order->total_price -= $model->getOriginal('price') * $model->getOriginal('quantity');
            $order->total_price += $model->price * $model->quantity;
            $order->save();

            if ($model->product_options && count($model->product_options) > 0) {
                foreach ($model->product_options as $option) {
                    $product_option = ProductOption::query()->where('product_id', $model->product_id)->where('option_id', $option['option_id'])->first();
                    $product_option->qty += $model->getOriginal('quantity');
                    $product_option->qty -= $model->quantity;
                    $product_option->save();
                }
            } else if ($model->product_id) {
                $model->product->qty -= $model->quantity;
                $model->product->save();
            }
        });

        static::deleting(function ($model) {
            $order = $model->order;
            $order->total_price -= $model->price * $model->quantity;
            $order->save();

            if ($model->product_options && count($model->product_options) > 0) {
                foreach ($model->product_options as $option) {
                    $product_option = ProductOption::query()->where('product_id', $model->product_id)->where('option_id', $option['option_id'])->first();
                    $product_option->qty += $model->quantity;
                    $product_option->save();
                }
            } else if ($model->product_id) {
                $model->product->qty += $model->quantity;
                $model->product->save();
            }
        });
    }
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function getOptionsAttribute()
    {
        if($this->product_options && count($this->product_options) > 0){
            $options = [];
            foreach ($this->product_options as $option) {
                $options[] = ProductOption::query()->with('option')->findOrFail($option['option_id']);
            }
            return $options;
        }

    }
}
