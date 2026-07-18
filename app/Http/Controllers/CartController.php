<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\CartItem;
use App\Models\CartCoupon;
use Illuminate\Http\Request;
use App\Models\ProductOption;
use App\Services\CartService;

class CartController extends Controller
{
    public function getCart()
    {
        $cart = new CartService();

        return response()->json([
            'success' => true,
            'cart' => $cart,
        ]);
    }


    //     $product = Product::query()
    //         ->where('id', $request->product_id)
    //         ->first();
    //     if (!$product) {
    //         return response()->json([
    //             'message' => 'Product not found',
    //         ], 404);
    //     }
    //     $product_option = ProductOption::query()
    //         ->where('id', $request->option_id)
    //         ->where('product_id', $request->product_id)
    //         ->with('option')
    //         ->first();
    //     $options = [];
    //     if ($product_option) {
    //         $options[] =  $product_option;
    //     }
    //     $cart = new CartService();

    //     $cart->addToCart($product->id, $request->quantity, $options); // array of options

    //     return response()->json([
    //         'success' => true,
    //         'cart' => $cart,
    //     ]);
    // }
    public function addToCart(Request $request)
    {
        $request->validate([
            'product_id' => 'nullable|integer',
            'quantity' => 'required|integer|min:1',
            'option_id' => 'nullable|integer',
        ]);

        $cart = new CartService();

        $options = $this->getOptions($request->product_id, $request->option_id);

        $cart->addToCart(
            $request->product_id,
            $request->quantity,
            $options
        );

        return response()->json([
            'success' => true,
            'cart' => $cart,
        ]);
    }

    // Helper method to get product options
    private function getOptions($product_id, $option_id)
    {
        if (!$option_id) {
            return [];
        }

        $product_option = ProductOption::query()
            ->where('id', $option_id)
            ->where('product_id', $product_id)
            ->with('option')
            ->first();

        return $product_option ? [$product_option] : [];
    }

    public function removeFromCart(Request $request)
    {
        $request->validate([
            'cart_item_id' => 'required|integer',
        ]);

        $cart_item = CartItem::query()
            ->where('session_id', session()->getId())
            ->where('id', $request->cart_item_id)
            ->first();

        if ($cart_item) {
            $cart_item->delete();
        }

        $cart = new CartService();

        return response()->json([
            'success' => true,
            'cart' => $cart,
        ]);
    }
    public function clearCart()
    {
        $cart = new CartService();
        $cart->clear();

        return response()->json([
            'success' => true,
            'cart' => $cart,
        ]);
    }
    public function updateCart(Request $request)
    {
        $request->validate([
            'cart_item_id' => 'required|integer',
            'quantity' => 'required|integer|min:1',
        ]);

        $cart_item = CartItem::query()
            ->where('session_id', session()->getId())
            ->where('id', $request->cart_item_id)
            ->first();

        if ($cart_item) {
            $cart_item->quantity = $request->quantity;
            $cart_item->save();
        }

        $cart = new CartService();

        return response()->json([
            'success' => true,
            'cart' => $cart,
        ]);
    }
    public function addCoupon(Request $request)
    {
        $request->validate([
            'coupon' => 'required|string',
        ]);

        $cart = new CartService();
        $coupon = $cart->applyCoupon($request->coupon);
        if (!$coupon) {
            return response()->json([
                "success" => false,
                'message' => "Купонът не е намерен",
            ]);
        } else if (isset($coupon['minimum_amount'])) {
            return response()->json([
                "success" => false,
                'message' => "Купонът изисква минимална стойност за използване - " . $coupon['minimum_amount'] . " лв.",
            ]);
        }

        return response()->json([
            'success' => true,
            'cart' => $cart,
        ]);
    }

    public function removeCoupon()
    {
        $cart = new CartService();
        $cart->removeCoupon();

        return response()->json([
            'success' => true,
            'cart' => $cart,
        ]);
    }
}
