<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Services\CartService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Stripe;

class StripePaymentController extends Controller
{
    public function index()
    {
        return view('welcome');
    }

    public function success(Request $request)
    {

        Log::channel('stripe')->info('Stripe success', [
            'session_id' => $request->session()->getId(),
        ]);
        $order = Order::query()
            ->where('session_id', $request->session()->getId())
            ->firstOrFail();
        if ($order->payment_status === 'pending') {
            try {
                Stripe\Stripe::setApiKey(env('STRIPE_SECRET'));
                $check = Stripe\Checkout\Session::retrieve($order->stripe_id);

                if ($check->payment_status === 'paid') {
                    $order->confirmPayment($check);
                }

                Log::channel('stripe')->info('Check stripe payment', [
                    'order_id' => $order->id,
                    'payment_status' => $check->payment_status ?? null,
                    'status' => $check->status ?? null,
                ]);
            } catch (\Exception $e) {
                Log::channel('stripe')->error('Check stripe payment', [
                    'order_id' => $order->id,
                    'error' => $e->getMessage(),
                ]);
                return back()->withErrors(['error' => $e->getMessage()]);
            }
        }

        if ($order->payment_status === 'paid') {
            $cart = new CartService();
            $cart->newCart();
            // redirect to success page
            return redirect('/success');
        }

        return redirect('/');
    }
}
