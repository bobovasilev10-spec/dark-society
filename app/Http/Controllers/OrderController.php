<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Coupon;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use App\Services\CartService;
use App\Services\MapServices;
use App\Services\EcontService;
use App\Mail\OrderConfirmation;
use App\Services\StripeService;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Gdinko\Econt\Models\CarrierEcontCity;
use Illuminate\Support\Facades\Validator;
use Gdinko\Econt\Models\CarrierEcontOffice;
use Gdinko\Econt\Models\CarrierEcontStreet;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class OrderController extends Controller
{
    public function confirm(Request $request)
    {
        $session_id = session()->getId();
        $cart = new CartService();

        $validator = Validator::make($request->all(), [
            "buyer_name" => ["required", "string"],
            "buyer_email" => ["required", "string", "email"],
            "buyer_phone" => ["required", "string"],
            "order_confirm" => ["required"],
            "order_info" => ["nullable"],
            "delivery_type" => ["nullable"],
            "payment_method" => ["nullable"]
        ]);

        if ($validator->fails()) {
            return response()->json([
                "success" => false,
                "errors" => $validator->errors(),
            ]);
        }

        $data = $validator->valid();
        $delivery_data = [
            "delivery_fee" => 0
        ];
        if ($request->delivery_type == "econt_address") {
            $econtService = new EcontService();
            $econt_validation = $econtService->validateAddress($data);

            if (!$econt_validation["success"]) {
                return response()->json([
                    "success" => false,
                    "errors" => ["econt" => $econt_validation["message"]],
                ]);
            }

            $delivery_fee = $econtService->calculateDeliveryFee($data);
            if (!isset($delivery_fee["label"]["totalPrice"])) {
                return response()->json([
                    "success" => false,
                    "errors" => ["econt" => 'Моля, попълнете полетата. s'],
                ]);
            }

            $delivery_data = [
                "econt_city_id" => $data["econt_city_id"],
                "econt_street_id" => $data["econt_street_id"],
                "econt_street_number" => $data["econt_street_number"],
                "econt_entrance" => $data["econt_entrance"] ?? null,
                "econt_floor" => $data["econt_floor"] ?? null,
                "econt_apartment_number" => $data["econt_apartment_number"] ?? null,
                "delivery_fee" => $delivery_fee["label"]["totalPrice"]
            ];
        }
        if ($request->delivery_type == "econt_office") {
            $econtService = new EcontService();

            try {
                CarrierEcontOffice::query()
                    ->where('econt_office_id', '=', $data["econt_office_id"])->firstOrFail();
            } catch (ModelNotFoundException) {
                return response()->json([
                    "success" => false,
                    "errors" => ["econt" => trans('Please, select an office.')],
                ]);
            }

            $delivery_fee = $econtService->calculateDeliveryFee($data);
            if (!isset($delivery_fee["label"]["totalPrice"])) {
                return response()->json([
                    "success" => false,
                    "errors" => ["econt" => 'Моля, попълнете полетата.'],
                ]);
            }

            $delivery_data = [
                "econt_city_id" => $data["econt_city_id"],
                "econt_office_id" => $data["econt_office_id"],
                "delivery_fee" => $delivery_fee["label"]["totalPrice"]
            ];
        }

        if ($request->delivery_type == "store_pickup") {
            $delivery_data = [
                "delivery_fee" => 0
            ];
        }

        $order_data = [
            "user_id" => (auth()) ? (auth()->id()) : null,
            'session_id' => session()->getId(),
            "name" => $data["buyer_name"],
            "email" => $data["buyer_email"],
            "phone" => $data["buyer_phone"],
            "customer_id" => null,
            "info" => $data["order_info"] ?? null,
            "sb_idnumb" => null,
            "additional_info" => $data['additional_info'] ?? null,
            "total_price" => $cart->total + $delivery_data["delivery_fee"],
            "delivery_type" => $request->delivery_type,
            "payment_method" => $request->payment_method,
            "status" => "pending",
            "coupon_id" => $cart->coupon ? $cart->coupon->coupon_id : null,
            "feedback_hash" => md5($session_id),
        ] + $delivery_data;

        // check if checkbox "invoice_data" is checked
        if (isset($request->invoice_needed)) {
            $invoice_data = [
                "name" => $request->company_name,
                "vat" => $request->company_vat,
                "address" => $request->company_address,
                "mol" => $request->company_mol,
            ];
            $order_data["invoice_data"] = $invoice_data;
        }

        // update product quantity
        foreach ($cart->cart_items as $cart_item) {
            // update product option quantity
            if ($cart_item->options && count($cart_item->options) > 0) {
                # code...
                foreach ($cart_item->options as $option) {
                    $product_option = $cart_item->product->options()->where('id', $option['id'])->first();
                    if (!$product_option) {
                        return response()->json([
                            "success" => false,
                            "errors" => ["a" => 'Продуктът ' . $cart_item->product->name . ' не съдържа опцията ' . $option['name']],
                        ]);
                    }
                    if ($product_option->qty < $cart_item->quantity) {
                        return response()->json([
                            "success" => false,
                            "errors" => ["a" => 'Няма достатъчно количество от продукта ' . $cart_item->product->name],
                        ]);
                    }
                    $product_option->qty -= $cart_item->quantity;
                    $product_option->save();
                }
            } else if ($cart_item->product) {
                if ($cart_item->product->qty < $cart_item->quantity) {
                    return response()->json([
                        "success" => false,
                        "errors" => ["a" => 'Няма достатъчно количество от продукта ' . $cart_item->product->name],
                    ]);
                }
                $cart_item->product->qty -= $cart_item->quantity;
                $cart_item->product->save();
            }
        }
        $order_items_data = [];
        $mail_products = [];
        $order = Order::query()->create($order_data);
        foreach ($cart->cart_items as $cart_item) {
            $order_items_data[] = [
                "order_id" => $order->id,
                "product_id" => $cart_item->product_id,
                "name" => $cart_item->product->name,
                "quantity" => $cart_item->quantity,
                "price" => $cart_item->price,
                "product_options" =>
                json_encode(
                    array_map(function ($option) {
                        return [
                            'option_id' => $option['option_id'],
                            'value' => $option['name'],
                        ];
                    }, $cart_item->options)
                ),
                
            ];

            // Get the image path
            $imagePath = $cart_item->product->image;

            // Extract the file extension
            $extension = pathinfo($imagePath, PATHINFO_EXTENSION);

            // Define a list of video extensions
            $videoExtensions = ['mp4', 'mov', 'avi', 'wmv', 'flv', 'webm'];

            // Check if the extension belongs to a video format
            $isVideo = in_array(strtolower($extension), $videoExtensions);
            $mail_products[] = [
                "name" => $cart_item->product->name,
                "image" => $cart_item->product->image,
                "quantity" => $cart_item->quantity,
                "single_price" => $cart_item->price,
                "is_video" => $isVideo,
                "product_options" => collect($cart_item->options)->map(function ($option) {
                    return [
                        "id" => $option['id'],
                        "name" => $option['name'],
                        "option_name" => $option['option']['name'][app()->getLocale()] ?? reset($option['option']['name']),
                    ];
                })->toArray(),
            ];
        }

        OrderItem::query()->insert($order_items_data);
        if ($cart->coupon) {
            $coupon = Coupon::where('id', $cart->coupon->coupon_id)->first();
            $coupon->increment('usage');
        }


        $delivery_type = match ($order->delivery_type) {
            'econt_address' => "Доставка до адрес [Еконт]",
            'econt_office' => "Доставка до Еконт Офис",
            'store_transport' => "С транспорт на магазина",
            'store_pickup' => "Изпращане от магазина"
        };

        $payment_method = match ($order->payment_method) {
            "at_delivery" => "Плащане при доставка",
            'online_pos' => "Онлайн плащане",
            "bank_transfer" => "Банков трансфер"
        };
        $mail_delivery_data = [];
        if ($order->delivery_type == 'store_pickup') {
            $mail_delivery_data['address'] = 'Наш консултант ще се свърже с вас за уточняване на детайлите за изпращане.';
        } else if ($order->delivery_type == 'econt_office') {
            $office = CarrierEcontOffice::query()
                ->where('econt_office_id', $order->econt_office_id)
                ->first();
            $mail_delivery_data['office'] = 'Офис: ' . $office?->name . ' ' . $office?->city?->name;
        } else if ($order->delivery_type == 'econt_address') {
            $city = CarrierEcontCity::query()
                ->where('econt_city_id', $order->econt_city_id)
                ->first();
            $street = CarrierEcontStreet::query()
                ->where('econt_street_id', $order->econt_street_id)
                ->first();
            if ($city && $street) {
                $mail_delivery_data['address'] = 'Град: ' . $city->name . '<br>Адрес: ' . $street->name . ' ' . $order->econt_street_number . ' ' . $order->econt_entrance . ' ' . $order->econt_floor . ' ' . $order->econt_apartment_number;
            } else {
                $mail_delivery_data['address'] = 'Адрес: ' . $order->econt_street_number;
            }
        };
        $mailData = [
            "order_id" => $order->id,
            "buyerName" => $order->name,
            "buyerEmail" => $order->email,
            "buyerPhone" => $order->phone,
            "deliveryType" => $delivery_type,
            "paymentMethod" => $payment_method,
            "products" => $mail_products,
            "total" => $order->total_price / 1.9558,
            "delivery_fee" => $order->delivery_fee / 1.9558,
            "delivery_data" => $mail_delivery_data,
        ];

        if ($request->payment_method == 'online_pos') {
            $stripe = new StripeService();
            $stripe_res = $stripe->sendPaymentRequest($order_items_data, $order);
            if (isset($stripe_res['error'])) {
                return response()->json([
                    'success' => false,
                    'message' => $stripe_res['message'],
                ], 422);
            }
            
            $order->stripe_id = $stripe_res['session_id'];
            $order->save();
            $cart->clear();
            session()->put('order_id', $order->id);
            return response()->json([
                "success" => true,
                'session_id' => $stripe_res['session_id'],
                'url' => $stripe_res['url'],
            ]);
        }
        session()->put('order_id', $order->id);
        $cart->clear();

        Mail::to($mailData["buyerEmail"])->send(new OrderConfirmation($mailData));
        if (env('ORDERS_ADMIN_EMAIL')) {
            Log::info('Sending order confirmation to admin');
            Mail::to(env('ORDERS_ADMIN_EMAIL'))->send(new OrderConfirmation($mailData));
        }

        return response()->json([
            "success" => true,
            "order_id" => $order->id,
        ]);
        // return redirect(route('home'))->with('success', trans('Order sent successfully'));
    }
    public function deliveryType(Request $request)
    {

        $delivery_types = array(
            'econt_address',
            'econt_office',
            'store_transport',
            'store_pickup'
        );
        if (!in_array($request["delivery_type"], $delivery_types)) {
            return json_encode([
                "success" => false,
                "messsage" => trans("Invalid Delivery Type")
            ]);
        }
        $data = $request->input('delivery_data');
        if ($data['delivery_type'] == "store_pickup") {
            return json_encode([
                "canFinish" => true,
                "deliveryFee" => 0,
            ]);
        }

        if ($data['delivery_type'] == 'store_transport') {

            if (empty($data['store_transport_city'])) {
                return json_encode([
                    "success" => false,
                    "messsage" => trans("Select city!")
                ]);
            }

            $endPoint = CarrierEcontCity::query()
                ->where('econt_city_id', $data["store_transport_city"])
                ->first();

            if (!$endPoint) {
                return [
                    "success" => false,
                    "messsage" => trans("Invalid city.")
                ];
            }

            $mapServices = new MapServices();
            $distance = $mapServices->calcDistance($endPoint->name . ', ' . $data['store_transport_address']);
            $totalPrice = ($distance * 2) * 1.5;

            return [
                "canFinish" => true,
                "deliveryFee" => $totalPrice,
            ];
        }

        $econt = new EcontService();

        $result = $econt->calculateDeliveryFee($data);

        if (!isset($result["label"]["totalPrice"])) {
            return [
                "canFinish" => false,
                "message" => $result["message"] ?? ""
            ];
        }
        return response()->json([
            "success" => true,
            "canFinish" => true,
            "deliveryFee" => $result["label"]["totalPrice"],
        ]);
    }
}
