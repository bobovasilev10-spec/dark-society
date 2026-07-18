<?php

namespace App\Models;

use App\Services\EcontService;
use Illuminate\Support\Carbon;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Gdinko\Econt\Models\CarrierEcontCity;
use Gdinko\Econt\Models\CarrierEcontOffice;
use Gdinko\Econt\Models\CarrierEcontStreet;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'session_id',

        'name',
        'email',
        'phone',

        'additional_info',

        'total_price',

        'payment_method',
        'payment_data',
        'payment_status',

        'delivery_data',
        'delivery_status',

        'invoice',
        'invoice_data',

        'status',

        'econt_city_id',
        'econt_office_id',
        'econt_street_id',
        'econt_street_number',
        'econt_entrance',
        'econt_floor',
        'econt_apartment_number',
        'econt_label',
        'delivery_type',
        'delivery_fee',
        'coupon_id',

        'stripe_id',
        'stripe_data',
    ];

    protected $casts = [
        'payment_data' => 'array',
        'delivery_data' => 'array',
        'invoice_data' => 'array',
        'stripe_data' => 'array',
    ];
    protected $appends = ['coupon_details', 'order_number', 'items_total', 'delivery_address', "payment_status_text"];

    protected static function boot()
    {
        parent::boot();
        static::deleting(function ($model) {
            foreach ($model->products as $order_item) {
                if ($order_item->product_options) {
                    foreach ($order_item->product_options as $option) {
                        $product_option = ProductOption::query()->where('product_id', $order_item->product_id)->where('option_id', $option['option_id'])->first();
                        $product_option->qty += $order_item->quantity;
                        $product_option->save();
                    }
                }
            }
        });
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function products()
    {
        return $this->hasMany(OrderItem::class);
    }
    

    public function getOrderNumberAttribute()
    {
        return str_pad($this->id, 6, '0', STR_PAD_LEFT);
    }

    public function getItemsTotalAttribute()
    {
        return $this->products->sum(function ($item) {
            return $item->price * $item->quantity;
        });
    }

    public function getDeliveryAddressAttribute()
    {
        if ($this->delivery_type === 'econt_address') {
            return $this->econt_street->name . ' ' . $this->econt_street_number . ', ' . $this->econt_city->name;
        } elseif ($this->delivery_type === 'econt_office') {
            return $this->econt_office->name;
        } else {
            return 'Взимане от магазина';
        }
    }

    public function getPaymentStatusTextAttribute()
    {
        return match ($this->payment_status) {
            'pending' => 'Очакващо',
            'paid' => 'Платено',
            'failed' => 'Неуспешно',
            default => 'Неизвестно',
        };
    }
    public function calculateTotal()
    {
        $total = $this->total_price;
        // $total = 0;
        // foreach ($this->products as $product) {
        //     $total += $product->price * $product->quantity;
        // }

        $deliveryPrice = $this->calcEcontDeliveryFee();

        $this->total_price = $total + $deliveryPrice;
        $this->saveQuietly();

        return $this->total_price;
    }

    public function confirmPayment($stripe_data = null)
    {
        $this->payment_status = 'paid';
        if ($stripe_data) {
            $this->stripe_data = $stripe_data;
        }
        $this->save();
    }


    public function getStatusTextAttribute(): string
    {
        $status = $this->getStatuses();

        return $status[$this->status];
    }

    public static function getStatuses(): array
    {
        return [
            'pending' => 'Чакаща обработка',
            'processing' => 'В процес на обработка',
            'completed' => 'Завършена',
            'rejected' => 'Отхвърлена',
        ];
    }
    public static function getDeliveryStatuses(): array
    {
        return [
            'pending' => 'Изчакващо',
            'sent' => 'Изпратено',
            'waiting' => 'Очакващо клиент',
            'completed' => 'Приключено',
            'cancelled' => 'Отказано',
        ];
    }
    public static function getDeliveryMethods(): array
    {
        return [
            'pickup' => 'Взимане от магазина',
            'delivery' => 'Доставка до адрес',
        ];
    }
    public function econt_city()
    {
        return $this->belongsTo(CarrierEcontCity::class, 'econt_city_id', 'econt_city_id');
    }

    public function econt_street()
    {
        return $this->belongsTo(CarrierEcontStreet::class, 'econt_street_id', 'econt_street_id');
    }

    public function econt_office()
    {
        return $this->belongsTo(CarrierEcontOffice::class, 'econt_office_id', 'econt_office_id');
    }
    public function get_delivery_type()
    {
        return match ($this->delivery_type) {
            'econt_address' => "Доставка до адрес [Еконт]",
            'econt_office' => "Доставка до Еконт Офис",
            'store_transport' => "С транспорт на магазина",
            'store_pickup' => "Изпращане от магазина"
        };
    }
    public function calcEcontDeliveryFee()
    {
        if (!in_array($this->delivery_type, ['econt_address', 'econt_office'])) {
            return 0;
        }

        Log::info('Calculating delivery fee for order: ' . $this->id);

        $econt = new EcontService();

        // $data = [ delivery_type, econt_city, econt_street, econt_street_number, econt_office ]
        $data = [
            'delivery_type' => $this->delivery_type,
            'econt_city_id' => $this->econt_city_id,
            'econt_street_id' => $this->econt_street_id,
            'econt_street_number' => $this->econt_street_number,
            'econt_office_id' => $this->econt_office_id
        ];

        $total = $this->total;

        $weight = 0;
        foreach ($this->order_items as $item) {
            $weight += $item->quantity * $item->weight;
        }

        $label = $econt->calculateDeliveryFee($data, $total, $weight);

        Log::info($label);

        if (isset($label["label"]["totalPrice"])) {
            $this->delivery_fee = $label["label"]["totalPrice"];
            $this->save();
        } else {
            $this->delivery_fee = 0;
            $this->save();
        }

        return $this->delivery_fee;
    }
    public function econtLabel()
    {
        if (is_null($this->econt_label)) {
            $econt = new EcontService();
            $result = $econt->createLabelFromOrder($this);

            $folder = 'public/orders/';
            $name = Carbon::now()->timestamp . '-order-' . $this->id . '.pdf';

            Storage::disk('local')->put($folder . $name, file_get_contents($result["label"]["pdfURL"]));

            $path = 'storage/orders/' . $name;

            $this->update(['econt_label' => $path]);
        } else {
            $path = $this->econt_label;
        }

        return $path;
    }
    public function getCouponDetailsAttribute()
    {
        if ($this->coupon_id) {
            $coupon = Coupon::where('id', $this->coupon_id)->first();
            $total = $this->products->sum(function ($item) {
                return $item->price * $item->quantity;
            });
            // calculate discount amount when is percent to number
            if ($coupon->discount_type === 'percent') {
                $discount = $total * $coupon->discount / 100;
                // discount to 2 decimal places
                $discount = number_format($discount, 2);
            } else {
                $discount = $coupon->discount;
            }
            return [
                'Код' => $coupon->code,
                'Отстъпка' => $coupon->discount . ($coupon->discount_type === 'percent' ? '%' : 'лв.') . ($coupon->discount_type === 'percent' ? "($discount) лв." : ''),
                'Тип на отстъпката' => ($coupon->discount_type === 'percent' ? '%' : 'лв.'),
            ];
        }
        return [
            'Код' => 'Не е използван',
            'Отстъпка' => '-',
            'Тип на отстъпката' => '-',
        ];
    }
}
