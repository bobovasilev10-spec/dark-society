<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', session()->exists('locale') ? session()->get('locale') : app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" type="image/png" href={{ asset('images/yoloony-dark.png') }}>

    <meta name="csrf-token" content="{{ csrf_token() }}">
    @if (isset($ceo_tags))
        <title>{{ $ceo_tags['title'] }}</title>
        <meta property="og:type" content="website">
        <meta property="og:locale" content="bg_BG">
        <meta property="og:title" content="{{ $ceo_tags['title'] }}">
        <meta property="og:description" content="{{ $ceo_tags['description'] }}">
        <meta name="twitter:title" content="{{ $ceo_tags['title'] }}">
        <meta name="twitter:description" content="{{ $ceo_tags['description'] }}">
        <meta name="description" content="{{ $ceo_tags['description'] }}">
        <meta property="og:url" content="{{ $ceo_tags['url'] }}">
        <meta property="og:image" content="{{ $ceo_tags['image'] }}">
    @endif
    <meta property="og:image:width" content="430">
    <meta property="og:image:height" content="287">
    <meta name="twitter:card" content="summary_large_image">
    <meta property="og:image:type" content="image/jpeg">
    <meta name="geo.region" content="bg">
    <meta name="geo.country" content="bg">
    <meta name="ROBOTS" content="INDEX, FOLLOW">
    <meta name="REVISIT-AFTER" content="1 DAYS">
    <meta name="RATING" content="GENERAL">
    <meta http-equiv="Content-Language" content="bg">
    <meta name="DISTRIBUTION" content="GLOBAL">
    <meta name="AUTHOR" content="yoloony">
    <meta name="COPYRIGHT" content="Copyright (c) 2025 yoloony">
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,600&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
        integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A=="
        crossorigin="anonymous" referrerpolicy="no-referrer" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,100..900;1,100..900&display=swap"
        rel="stylesheet">
</head>
<link rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
    crossorigin="anonymous" referrerpolicy="no-referrer" />

<body class="font-sans antialiased dark:bg-black dark:text-white/50">
    <div id="root"></div>
    @viteReactRefresh
    @vite(['resources/js/src/index.jsx'])
</body>

</html>
