<?php

namespace App\Http\Controllers;

use Illuminate\Support\Str;
use App\Models\Product;
use App\Models\Category;
use App\Models\Client;
use App\Models\InfoPage;
use App\Models\MedicalPerson;
use App\Models\Slide;
use App\Models\Subscription;
use Illuminate\Http\Request;

class BaseController extends Controller
{
    public function index()
    {
        // Set locale from session
        $locale = session('locale', 'bg'); // Default to 'en' if not set
        app()->setLocale($locale);

        $urlParts = explode('/', url()->full());
        $route = $urlParts[count($urlParts) - 2];
        $route_single = $urlParts[count($urlParts) - 1];

        // Default SEO tags
        $ceo_tags = [
            'title' => __('seo.default'),
            'description' => __('seo.default'),
            'image' => asset('images/yoloony.jpg'),
            'url' => url()->full()
        ];

        if ($route == 'category') {
            $category = Category::where('slug', end($urlParts))->first();

            $ceo_tags['title'] = __('seo.category', ['name' => $category?->name ?? config('app.name')]);
        }

        if ($route == 'product') {
            $product = Product::where('slug', end($urlParts))->first();

            if ($product) {
                $image = $product->webp ? $product->webp : $product->image;
                $ceo_tags = [
                    'title' => __('seo.product', ['name' => $product->name]),
                    'description' => __('seo.default'),
                    'image' => asset('storage/' . $image) ?? asset('images/yoloony.jpg'),
                    'url' => url()->full()
                ];
            }
        }

        if ($route == 'info-page') {
            $page = InfoPage::where('slug', end($urlParts))->first();

            $ceo_tags['title'] = __('seo.info_page', ['title' => $page?->title ?? config('app.name')]);
        }

        if ($route == 'subscription') {
            $subscription = Subscription::where('slug', end($urlParts))->first();

            $ceo_tags['title'] = __('seo.subscription', ['name' => $subscription?->name ?? config('app.name')]);
        } elseif ($route_single == 'subscription') {
            $ceo_tags['title'] = __('seo.subscription_general');
        }

        if ($route_single == 'clients') {
            $ceo_tags['title'] = __('seo.clients');
        }

        if ($route_single == 'medical-teams') {
            $ceo_tags['title'] = __('seo.medical_teams');
        }

        return view('welcome', ['ceo_tags' => $ceo_tags]);
    }

    public function baseData()
    {
        $categories = Category::with('children')->where('parent_id', null)->get();

        $infoPages = InfoPage::where('is_active', true)->get();
        $slides = Slide::where('is_active', true)->get();
        $subcription = Subscription::where('is_active', true)->get();
        $new_products = Product::where('is_active', true)->with('category', 'images', 'options')->orderBy('created_at', 'desc')->take(10)->get();
        return response()->json([
            'success' => true,
            'data' => [
                'categories' => $categories,
                'info_pages' => $infoPages,
                'slides' => $slides,
                'new_products' => $new_products,
                'subcription' => $subcription
            ]
        ]);
    }

    public function InfoPage($slug)
    {
        $infoPage = InfoPage::where('slug', $slug)->first();
        if (!$infoPage) {
            return response()->json([
                'message' => 'Страницата не е намерена'
            ], 404);
        }
        return response()->json([
            'success' => true,
            'data' => $infoPage
        ]);
    }
    public function getClients()
    {
        $clients = Client::all();
        if (!$clients) {
            return response()->json([
                'message' => 'Страницата не е намерена'
            ], 404);
        }
        return response()->json([
            'success' => true,
            'data' => $clients
        ]);
    }
    public function getMedicalPersonnel()
    {
        $medical = MedicalPerson::all();
        if (!$medical) {
            return response()->json([
                'message' => 'Страницата не е намерена'
            ], 404);
        }
        return response()->json([
            'success' => true,
            'data' => $medical
        ]);
    }
    public function changeLocale(Request $request)
    {
        $locale = $request->input('language');

        if (in_array($locale, ['en', 'bg'])) { // Add more languages if needed
            session()->put('locale', $locale);
            app()->setLocale($locale);
        }

        return response()->json(['message' => 'Locale changed successfully']);
    }

}
