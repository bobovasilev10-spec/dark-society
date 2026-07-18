<!doctype html>
<html lang="bg" xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="color-scheme" content="dark">
    <meta name="supported-color-schemes" content="dark">
    <title>Потвърждение на поръчка</title>

    <style>
        body {
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            background: #0a0a0a;
            color: #ffffff;
            font-family: Arial, Helvetica, sans-serif;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }

        table {
            border-collapse: collapse;
            border-spacing: 0;
            mso-table-lspace: 0;
            mso-table-rspace: 0;
        }

        img {
            display: block;
            border: 0;
            outline: none;
            text-decoration: none;
            -ms-interpolation-mode: bicubic;
        }

        a {
            color: inherit;
            text-decoration: none;
        }

        .wrapper {
            width: 100%;
            background: #0a0a0a;
        }

        .container {
            width: 640px;
            max-width: 640px;
        }

        .card {
            background: #151515;
            border: 1px solid #2b2b2b;
        }

        .muted {
            color: #a7a7a7;
        }

        .accent {
            color: #ffffff;
        }

        .divider {
            border-top: 1px solid #333333;
        }

        @media only screen and (max-width: 680px) {
            .container,
            .mobile-full {
                width: 100% !important;
                max-width: 100% !important;
            }

            .mobile-pad {
                padding-left: 18px !important;
                padding-right: 18px !important;
            }

            .mobile-stack {
                display: block !important;
                width: 100% !important;
            }

            .mobile-center {
                text-align: center !important;
            }

            .product-image {
                width: 140px !important;
                max-width: 140px !important;
                margin: 0 auto 18px auto !important;
            }

            .headline {
                font-size: 30px !important;
                line-height: 36px !important;
            }
        }
    </style>
</head>

<body bgcolor="#0a0a0a">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
        Поръчката ти в Dark Society е приета.
    </div>

    <table role="presentation" width="100%" class="wrapper" bgcolor="#0a0a0a">
        <tr>
            <td align="center" style="padding: 24px 12px 40px;">
                <table role="presentation" width="640" class="container">

                    <tr>
                        <td align="center" style="padding: 12px 20px 28px;">
                            <a href="{{ config('app.url') }}" target="_blank">
                                <img
                                    src="{{ asset('images/logo2.webp') }}"
                                    width="90"
                                    alt="Dark Society"
                                    style="width:90px;max-width:90px;height:auto;"
                                >
                            </a>
                        </td>
                    </tr>

                    <tr>
                        <td class="card mobile-pad" bgcolor="#151515"
                            style="padding: 48px 44px; border-radius: 18px 18px 0 0;">
                            <table role="presentation" width="100%">
                                <tr>
                                    <td align="center"
                                        style="font-size:12px;line-height:18px;letter-spacing:3px;
                                        font-weight:bold;color:#a7a7a7;text-transform:uppercase;">
                                        DARK SOCIETY
                                    </td>
                                </tr>

                                <tr>
                                    <td align="center" class="headline"
                                        style="padding-top:14px;font-size:40px;line-height:46px;
                                        font-weight:bold;color:#ffffff;">
                                        Благодарим ти за поръчката!
                                    </td>
                                </tr>

                                <tr>
                                    <td align="center"
                                        style="padding-top:18px;font-size:16px;line-height:26px;color:#cfcfcf;">
                                        Здравей, {{ $mailData['buyerName'] }}.<br>
                                        Поръчката ти е приета и ще бъде обработена възможно най-скоро.
                                    </td>
                                </tr>

                                <tr>
                                    <td align="center" style="padding-top:28px;">
                                        <table role="presentation" width="100%" bgcolor="#050505"
                                            style="background:#050505;border:1px solid #333333;border-radius:12px;">
                                            <tr>
                                                <td align="center"
                                                    style="padding:18px;font-size:14px;line-height:20px;
                                                    color:#a7a7a7;letter-spacing:1px;">
                                                    НОМЕР НА ПОРЪЧКАТА
                                                    <div style="padding-top:5px;font-size:22px;line-height:28px;
                                                        font-weight:bold;color:#ffffff;">
                                                        #{{ $mailData['order_id'] }}
                                                    </div>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <tr>
                        <td class="card mobile-pad" bgcolor="#151515"
                            style="padding: 0 44px 38px; border-left:1px solid #2b2b2b;
                            border-right:1px solid #2b2b2b;">
                            <table role="presentation" width="100%">
                                <tr>
                                    <td class="divider" style="padding-top:30px;"></td>
                                </tr>

                                <tr>
                                    <td style="padding-top:26px;font-size:20px;line-height:26px;
                                        font-weight:bold;color:#ffffff;">
                                        Доставка и плащане
                                    </td>
                                </tr>

                                <tr>
                                    <td style="padding-top:18px;">
                                        <table role="presentation" width="100%">
                                            <tr>
                                                <td class="mobile-stack" width="50%" valign="top"
                                                    style="padding:0 12px 14px 0;">
                                                    <div style="font-size:12px;line-height:18px;color:#8d8d8d;
                                                        text-transform:uppercase;letter-spacing:1px;">
                                                        Начин на доставка
                                                    </div>
                                                    <div style="padding-top:5px;font-size:16px;line-height:24px;
                                                        color:#ffffff;">
                                                        {{ $mailData['deliveryType'] }}
                                                    </div>
                                                </td>

                                                <td class="mobile-stack" width="50%" valign="top"
                                                    style="padding:0 0 14px 12px;">
                                                    <div style="font-size:12px;line-height:18px;color:#8d8d8d;
                                                        text-transform:uppercase;letter-spacing:1px;">
                                                        Начин на плащане
                                                    </div>
                                                    <div style="padding-top:5px;font-size:16px;line-height:24px;
                                                        color:#ffffff;">
                                                        {{ $mailData['paymentMethod'] }}
                                                    </div>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                @if (
                                    !empty($mailData['delivery_data']['office']) ||
                                    !empty($mailData['delivery_data']['address'])
                                )
                                    <tr>
                                        <td style="padding-top:10px;">
                                            <div style="font-size:12px;line-height:18px;color:#8d8d8d;
                                                text-transform:uppercase;letter-spacing:1px;">
                                                Данни за доставка
                                            </div>
                                            <div style="padding-top:5px;font-size:16px;line-height:24px;
                                                color:#ffffff;">
                                                @if (!empty($mailData['delivery_data']['office']))
                                                    {!! $mailData['delivery_data']['office'] !!}
                                                @elseif (!empty($mailData['delivery_data']['address']))
                                                    {!! $mailData['delivery_data']['address'] !!}
                                                @endif
                                            </div>
                                        </td>
                                    </tr>
                                @endif
                            </table>
                        </td>
                    </tr>

                    <tr>
                        <td class="card mobile-pad" bgcolor="#151515"
                            style="padding: 0 44px 12px; border-left:1px solid #2b2b2b;
                            border-right:1px solid #2b2b2b;">
                            <table role="presentation" width="100%">
                                <tr>
                                    <td class="divider" style="padding-top:30px;"></td>
                                </tr>
                                <tr>
                                    <td style="padding:26px 0 18px;font-size:20px;line-height:26px;
                                        font-weight:bold;color:#ffffff;">
                                        Продукти
                                    </td>
                                </tr>

                                @foreach ($mailData['products'] as $product)
                                    <tr>
                                        <td style="padding:0 0 22px;">
                                            <table role="presentation" width="100%" bgcolor="#0d0d0d"
                                                style="background:#0d0d0d;border:1px solid #2d2d2d;
                                                border-radius:12px;">
                                                <tr>
                                                    <td class="mobile-stack" width="170" valign="top"
                                                        style="padding:18px;">
                                                        @if (empty($product['is_video']))
                                                            <img
                                                                src="{{ asset('storage/' . $product['image']) }}"
                                                                width="134"
                                                                alt="{{ $product['name'] }}"
                                                                class="product-image"
                                                                style="width:134px;max-width:134px;height:auto;
                                                                border-radius:8px;"
                                                            >
                                                        @else
                                                            <table role="presentation" width="134" height="134"
                                                                class="product-image" bgcolor="#1d1d1d"
                                                                style="width:134px;height:134px;background:#1d1d1d;
                                                                border-radius:8px;">
                                                                <tr>
                                                                    <td align="center"
                                                                        style="font-size:13px;line-height:20px;
                                                                        color:#a7a7a7;padding:12px;">
                                                                        VIDEO PRODUCT
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        @endif
                                                    </td>

                                                    <td class="mobile-stack" valign="top"
                                                        style="padding:18px 18px 18px 0;">
                                                        <div style="font-size:18px;line-height:25px;
                                                            font-weight:bold;color:#ffffff;">
                                                            {{ $product['name'] }}
                                                        </div>

                                                        @if (!empty($product['product_options']))
                                                            <div style="padding-top:10px;font-size:14px;
                                                                line-height:22px;color:#c6c6c6;">
                                                                @foreach ($product['product_options'] as $option)
                                                                    <div>
                                                                        <strong>{{ $option['option_name'] }}:</strong>
                                                                        {{ $option['name'] }}
                                                                    </div>
                                                                @endforeach
                                                            </div>
                                                        @endif

                                                        <div style="padding-top:10px;font-size:14px;
                                                            line-height:22px;color:#c6c6c6;">
                                                            Количество:
                                                            <strong style="color:#ffffff;">
                                                                {{ $product['quantity'] }}
                                                            </strong>
                                                        </div>

                                                        <div style="padding-top:4px;font-size:14px;
                                                            line-height:22px;color:#c6c6c6;">
                                                            Единична цена:
                                                            <strong style="color:#ffffff;">
                                                                {{ number_format((float) $product['single_price'], 2) }} €
                                                            </strong>
                                                        </div>

                                                        <div style="padding-top:4px;font-size:14px;
                                                            line-height:22px;color:#c6c6c6;">
                                                            Общо:
                                                            <strong style="color:#ffffff;">
                                                                {{ number_format(
                                                                    (float) $product['single_price'] * (int) $product['quantity'],
                                                                    2
                                                                ) }} €
                                                            </strong>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                @endforeach
                            </table>
                        </td>
                    </tr>

                    @php
                        $deliveryFee = (float) ($mailData['delivery_fee'] ?? 0);
                        $total = (float) ($mailData['total'] ?? 0);
                        $subtotal = max(0, $total - $deliveryFee);
                    @endphp

                    <tr>
                        <td class="card mobile-pad" bgcolor="#151515"
                            style="padding: 4px 44px 42px; border-radius:0 0 18px 18px;">
                            <table role="presentation" width="100%">
                                <tr>
                                    <td class="divider" style="padding-top:28px;"></td>
                                </tr>

                                <tr>
                                    <td style="padding-top:24px;">
                                        <table role="presentation" width="100%">
                                            <tr>
                                                <td style="padding:5px 0;font-size:15px;line-height:22px;
                                                    color:#a7a7a7;">
                                                    Стойност на продуктите
                                                </td>
                                                <td align="right"
                                                    style="padding:5px 0;font-size:15px;line-height:22px;
                                                    color:#ffffff;">
                                                    {{ number_format($subtotal, 2) }} €
                                                </td>
                                            </tr>

                                            <tr>
                                                <td style="padding:5px 0;font-size:15px;line-height:22px;
                                                    color:#a7a7a7;">
                                                    Доставка
                                                </td>
                                                <td align="right"
                                                    style="padding:5px 0;font-size:15px;line-height:22px;
                                                    color:#ffffff;">
                                                    {{ number_format($deliveryFee, 2) }} €
                                                </td>
                                            </tr>

                                            <tr>
                                                <td style="padding:18px 0 0;font-size:20px;line-height:28px;
                                                    font-weight:bold;color:#ffffff;border-top:1px solid #333333;">
                                                    Общо за плащане
                                                </td>
                                                <td align="right"
                                                    style="padding:18px 0 0;font-size:24px;line-height:30px;
                                                    font-weight:bold;color:#ffffff;border-top:1px solid #333333;">
                                                    {{ number_format($total, 2) }} €
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                <tr>
                                    <td align="center"
                                        style="padding-top:34px;font-size:14px;line-height:23px;color:#a7a7a7;">
                                        Ще се свържем с теб при необходимост от допълнително уточнение.<br>
                                        Благодарим, че избра Dark Society.
                                    </td>
                                </tr>

                                <tr>
                                    <td align="center" style="padding-top:26px;">
                                        <table role="presentation" cellspacing="0" cellpadding="0">
                                            <tr>
                                                <td bgcolor="#ffffff" style="border-radius:8px;">
                                                    <a href="{{ config('app.url') }}" target="_blank"
                                                        style="display:inline-block;padding:14px 28px;
                                                        font-size:14px;line-height:20px;font-weight:bold;
                                                        color:#000000;text-decoration:none;">
                                                        КЪМ DARK SOCIETY
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <tr>
                        <td align="center"
                            style="padding:26px 18px 0;font-size:12px;line-height:20px;color:#707070;">
                            <a href="{{ config('app.url') }}" target="_blank"
                                style="color:#a7a7a7;font-weight:bold;">
                                Dark Society
                            </a>
                            © {{ date('Y') }}
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
