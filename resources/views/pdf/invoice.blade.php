<!DOCTYPE html>
<html lang="bg">
<head>
    <meta charset="UTF-8">
    <title>Проформа Фактура № {{ $order->id }}</title>
    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 12px;
            line-height: 1.5;
        }
        .header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
        }
        .header div {
            width: 48%;
        }
        .header div:last-child {
            text-align: right;
        }
        .table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        .table, .table th, .table td {
            border: 1px solid black;
        }
        .table th, .table td {
            padding: 8px;
            text-align: left;
        }
        .total {
            display: flex;
            justify-content: flex-end;
            margin-top: 20px;
        }
        .total div {
            width: 300px;
            text-align: right;
        }
        .signature {
            margin-top: 50px;
        }
    </style>
</head>
<body>
<h1>ПРОФОРМА ФАКТУРА</h1>
<p>No: {{ str_pad($order->id, 10, '0', STR_PAD_LEFT) }}, от дата: {{ \Carbon\Carbon::parse($order->created_at)->format('d-m-Y') }}</p>

<div class="header">
    <div>
        <strong>КУПУВАЧ:</strong><br>
        {{ $order->user->name }}<br>
        адрес: {{ $order->user->address }}<br>
        БУЛСТАТ: {{ $order->user->bulstat }}<br>
        М.О.Л.: {{ $order->user->mol }}
    </div>
    <div>
        <strong>ПРОДАВАЧ:</strong><br>
        КОМФОРТ ИИ ЕООД<br>
        адрес: с.Землен<br>
        БУЛСТАТ: 206889708<br>
        Банка: ДСК<br>
        Банков код: STSABGSF<br>
        Сметка: BG60STSA93000028972910
    </div>
</div>

<table class="table">
    <thead>
    <tr>
        <th>№</th>
        <th>Наименование на стоките и услугите</th>
        <th>Количество</th>
        <th>Ед.цена в €</th>
        <th>Стойност в €</th>
    </tr>
    </thead>
    <tbody>
    @foreach($order->products as $index => $item)
        <tr>
            <td>{{ $index + 1 }}</td>
            <td>{{ $item->product->name }}</td>
            <td>{{ $item->quantity }} {{ $item->product->unit }}</td>
            <td>{{ number_format($item->price, 2) }}</td>
            <td>{{ number_format($item->price * $item->quantity, 2) }}</td>
        </tr>
    @endforeach
    </tbody>
</table>

<div class="total">
    <div>
        <p>ДАНЪЧНА ОСНОВА: {{ number_format($order->total_price / 1.20, 2) }} €</p>
        <p>ДДС 20%: {{ number_format($order->total_price - ($order->total_price / 1.20), 2) }} €</p>
        <p>ОБЩА СТОЙНОСТ: {{ number_format($order->total_price, 2) }} €</p>
        <p>(словом): {{ Str::ucfirst($order->total_price_in_words) }}</p>
    </div>
</div>

<p>НАЧИН НА ПЛАЩАНЕ: /по банка/</p>

<div class="signature">
    <p>Стоката получена от: {{ $order->user->name }}</p>
    <p>ЕГН: </p>
    <p>Подпис: ______________________</p>
    <p>Съставил: СТОЯН ЖЕЛЯЗКОВ</p>
    <p>/ подпис и печат /</p>
</div>
</body>
</html>
