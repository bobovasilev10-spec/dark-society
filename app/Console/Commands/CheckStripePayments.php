<?php

namespace App\Console\Commands;

use App\Models\Order;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Stripe;

class CheckStripePayments extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:check-stripe-payments';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check stripe payments';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $orders = Order::where('stripe_id', '!=', null)
            ->where('payment_status', 'pending')
            ->get();

        foreach ($orders as $order) {
            try {
                Stripe\Stripe::setApiKey(env('STRIPE_SECRET'));
                $check = Stripe\Checkout\Session::retrieve($order->stripe_id);

                if ($check->payment_status === 'paid') {
                    $order->confirmPayment($check);
                } else {
                    if ($check->status == "expired") {
                        $order->payment_status = 'expired';
                        $order->save();
                    }
                }

                Log::channel('stripe')->info('Check stripe payment', [
                    'order_id' => $order->id,
                    'payment_status' => $check->payment_status ?? null,
                    'status' => $check->status ?? null,
                ]);
            } catch (\Exception $e) {
                $this->info($e->getMessage());
            }
        }
    }
}
