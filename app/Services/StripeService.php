<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Stripe;
use Illuminate\Support\Facades\Log;

class StripeService
{
    public function sendPaymentRequest($order_items, $order)
    {
        Stripe\Stripe::setApiKey(env('STRIPE_SECRET'));
        $line_items = [];
        
        foreach ($order_items as $item) {
            $price_eur = $item['price'] / 1.9558;
            $line_items[] = [
                'price_data' => [
                    'currency' => 'eur',
                    'unit_amount' => round($price_eur * 100),
                    'product_data' => [
                        'name' => $item['name'],
                        'description' => 'test', // need to be changed
                        // 'description' => $item->product_options, // need to be changed
                    ],
                ],
                'quantity' => $item['quantity'],
            ];
        }
        try {
            $session = Stripe\Checkout\Session::create([
                'payment_method_types' => ['card'],
                'line_items' => $line_items,
                'mode' => 'payment',
                'success_url' => route('stripe.success'),
                'cancel_url' => route('stripe.index'),
            ]);
        } catch (\Exception $e) {
            return [ 'error' => true, 'message' => $e->getMessage(), ];
        }
        Log::channel('stripe')->info('Create stripe session', [
            'order_id' => $order->id,
            'session_id' => $session->id,
            'url' => $session->url,
        ]);

        return [
            'session_id' => $session->id,
            'url' => $session->url,
        ];

    }
}
