<?php

namespace App\Http\Controllers;

use App\Models\Subscription;


class SubscriptionController extends Controller
{
    public function getAllSubscriptions()
    {
        $subscriptions = Subcription::query()
            ->where('is_active', true)
            ->with(['image']);
        if (!subscriptions) {
            return response()->json([
                'success' => false,
                'message' => 'Subsriptions not found'
            ]);
        }

        return response()->json([
            'success' => true,
            'subscriptions' => $subscriptions
        ]);
    }

    public function getOneSubscription($slug)
    {
        $subscription = Subscription::query()
            ->where('slug', $slug)
            ->where('is_active', true)
            ->with(['image']);

        if (!$subscription) {
            return response()->json([
                'success' => false,
                'message' => 'Subscription not found'
            ]);
        };

        return response()->json([
            'success' => true,
            'subscription' => $subscription
        ]);
    }
}