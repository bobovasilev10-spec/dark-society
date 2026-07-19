<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BaseController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\EcontController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\StripePaymentController;
use App\Http\Controllers\ContactUsController;


// Auth routes
//create a registration request route and limit the request to 10 per minute
Route::post('/register', [AuthController::class, 'register'])->name('register.store')->middleware('throttle:20,1');

//User data handling and auth
Route::post('/login', [AuthController::class, 'login'])->name('login.store');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
Route::post('/change-password', [AuthController::class, 'changePassword'])->name('change-password');

Route::post('/reset-password', [AuthController::class, 'sendResetLinkEmail'])
    ->middleware('guest')
    ->name('password.reset.store');

Route::post('/check-reset-token', [AuthController::class, 'checkResetToken'])
    ->middleware('guest')
    ->name('check-reset-token');

Route::post('/set-new-password', [AuthController::class, 'setNewPassword'])
    ->middleware('guest')
    ->name('set-new-password');


Route::post('/update-user', [AuthController::class, 'updateUser']);
Route::get('/user-orders', [AuthController::class, 'userOrders'])->name('user-orders');

// Base data routes
Route::get('/base_json', [BaseController::class, 'baseData']);
Route::get('/info_page_json/{slug}', [BaseController::class, 'InfoPage']);

// Product routes
Route::get('/category_json/{slug}', [CategoryController::class, 'show']);
Route::get('/product_json/{slug}', [ProductController::class, 'getOne']);
Route::get('/search_json', [ProductController::class, 'search']);
Route::get('/product_images_to_webp', [ProductController::class, 'getAll']);

//Econt API

Route::get('/econt/get_cities', [EcontController::class, 'getCities'])->name('econt.get.cities');
Route::get('/econt/get_offices', [EcontController::class, 'getOffices'])->name('econt.get.offices');
Route::get('/econt/get_streets', [EcontController::class, 'getStreets'])->name('econt.get.streets');
Route::get('/econt/validate_address', [EcontController::class, 'validateAddress'])->name('econt.validate.address');
/// cart
Route::get('/cart_json', [CartController::class, 'getCart']);
Route::post('/cart/add', [CartController::class, 'addToCart']);
Route::post('/cart/remove', [CartController::class, 'removeFromCart']);
Route::post('/cart/clear', [CartController::class, 'clearCart']);
Route::post('/cart/update', [CartController::class, 'updateCart']);
Route::post('/order/delivery_type', [OrderController::class, 'deliveryType'])->name('order.delivery.type');
Route::post('/cart/use-coupon', [CartController::class, 'addCoupon']);
Route::post('/cart/remove-coupon', [CartController::class, 'removeCoupon']);
// Order
Route::post('/order/confirm', [OrderController::class, 'confirm']);

// Stripe
Route::get('/stripe', [StripePaymentController::class, 'index'])->name('stripe.index');
Route::get('/stripe-success', [StripePaymentController::class, 'success'])->name('stripe.success');

Route::get('/stripe-test', [StripePaymentController::class, 'testCheckout'])->name('stripe.test');
Route::get('/test-order', [OrderController::class, 'testOrder'])->name('test-order');

// locale
Route::post('/changeLocale', [BaseController::class, 'changeLocale']);

// Contact us
Route::post('/contact-us', [ContactUsController::class, 'store'])->name('contact-us.store');

Route::get('/{any}', [BaseController::class, 'index'])->where('any', '.*')->name('home');

require __DIR__ . '/auth.php';
