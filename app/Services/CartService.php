<?php

namespace App\Services;

// use App\Models\CartCoupon;
use App\Models\Order;
// use App\Models\Coupon;
use App\Models\Coupon;
use App\Models\Product;
use App\Models\CartItem;
use App\Models\CartCoupon;

class CartService
{
    public $cart_items;
    public $total;
    public $coupon;
    public $weight;
    public $discount_amount;
    public $last_order;
    public $requiers_delivery;

    public function __construct()
    {
        $this->reload();
    }

    public function reload()
    {
        $this->cart_items = $this->loadCartItems();
        $this->coupon = $this->loadCoupon();
        $this->total = $this->calculateTotal();
        $this->weight = $this->weight();
        $this->last_order = $this->getLastOrder();
        $this->requiers_delivery = $this->requireDelivery();
    }

    public function requireDelivery()
    {
        return $this->cart_items->isNotEmpty();
    }
    public function getLastOrder()
    {
        // get order_id from session
        $order_id = session()->get('order_id', null);

        if (!$order_id) {
            return false;
        }

        $order = Order::query()
            ->with(['products', 'products.product'])
            //->where('id', 27) // TODO: change to last order
            ->where('id', $order_id)
            ->first();
        if (!$order) {
            return false;
        }
        if ($order->payment_method === 'online_pos') {
            if ($order->payment_status == 'paid') {
                $order->message = "Поръчка #{$order->id} е платена успешно";
            } else {
                $order->message = "Поръчка #{$order->id} е създадена успешно. Очаква плащане.";
            }
        } else {
            $order->message = "Поръчка #{$order->id} е създадена успешно.";
        }
        return $order;
    }
    public function weight()
    {
        $weight = 0;
        foreach ($this->cart_items as $cart_item) {
            if ($cart_item->product) {
                # code...
                $weight += $cart_item->quantity * $cart_item->product->weight;
            }
        }
        return $weight;
    }

    public function addToCart($item_id, $quantity, $options = [])
    {
        // dd($item_id, $quantity, $options, $type);
        // Determine the model based on type
        $item = Product::query()->findOrFail($item_id);

        $field = 'product_id';

        // Check if the same product is already in the cart
        if ($field === 'product_id') {
            $cart_item = $this->cart_items
                ->where($field, $item_id)
                ->filter(function ($item) use ($options) {
                    if (empty($options)) {
                        // No options -> match only by product_id
                        return !isset($cartItem->options) || empty($cartItem->options);
                    }
                    // Check if the options match (i.e., option_id is the same)
                    return isset($item->options[0]['id']) && $item->options[0]['id'] == $options[0]['id'];
                })
                ->first();
        } 

        $price = $item->promo_price ? $item->promo_price : $item->price;

        if ($cart_item) {
            // If item already exists, increase quantity instead of creating new item
            $cart_item->update([
                'quantity' => $cart_item->quantity + $quantity,
                'price' => $price, // Update price in case of changes
            ]);
        } else {
            // Create a new cart item if not found
            $cart_item = CartItem::query()->create([
                'session_id' => session()->getId(),
                'user_id' => auth()->id() ?: null,
                $field => $item_id, // Create the cart item for the selected product
                'quantity' => $quantity,
                'price' => $price,
                'options' => $options,
            ]);

            // Add item to cart list
            $this->cart_items->push($cart_item);
        }

        // Reload cart to ensure it's up-to-date
        $this->reload();

        return $this->cart_items;
    }


    public function clear()
    {
        $sessionId = session()->getId();
        CartItem::query()
            ->where('session_id', $sessionId)
            ->delete();
        $coupon = $this->coupon;
        if ($coupon) {
            $coupon->delete();
        }
        $this->reload();
    }

    public function applyCoupon($code)
    {
        // if coupon is already applied, remove it
        if ($this->coupon) {
            $this->coupon->delete();
        }

        $coupon = Coupon::query()
            ->where('code', $code)
            ->active()
            ->usable()
            ->valid()
            ->first();
        if (!$coupon) {
            return false;
        }
        if (!$coupon->isUsable()) {
            return false;
        }
        if ($coupon->minimum_amount > $this->total) {
            return
                [
                    'success' => false,
                    'message' => 'Coupon requires a minimum amount',
                    'minimum_amount' => $coupon->minimum_amount,
                ];
        }
        $cart_coupon = CartCoupon::query()
            ->create([
                'session_id' => session()->getId(),
                'user_id' => auth()->id() ?: null,
                'coupon_id' => $coupon->id,
            ]);
        $this->reload();
        return $this->cart_items;
    }
    public function removeCoupon()
    {
        if ($this->coupon) {
            $this->coupon->delete();
        }
        $this->reload();
        return $this->cart_items;
    }
    private function loadCartItems()
    {
        // move cart items from session to user if user is logged in
        $cart_items = CartItem::with('product')
            ->where('session_id', session()->getId())
            ->orWhere('user_id', auth()->id() ?: 0)
            ->get()
            ->each(function ($cart_item) {
                if (auth()->id()) {
                    $cart_item->update([
                        'user_id' => auth()->id()
                    ]);
                }
                $cart_item->update([
                    'session_id' => session()->getId(),
                ]);
            });

        return $cart_items;
    }

    private function loadCoupon()
    {
        $coupon = CartCoupon::query()
            ->where('session_id', session()->getId())
            ->orWhere('user_id', auth()->id() ?: 0)
            ->first();

        return $coupon;
    }

    public function calculateTotal()
    {

        $total = $this->cart_items->sum(function ($item) {
            return $item->total;
        });
        if ($this->coupon) {
            $discount = $this->coupon->calculateDiscount($total);
            $this->discount_amount = $discount;
            $total -= $discount;
        }
        return $total;
    }

    public function newCart()
    {
        // renew session_id
        session()->regenerate();
        $this->reload();
    }
}
