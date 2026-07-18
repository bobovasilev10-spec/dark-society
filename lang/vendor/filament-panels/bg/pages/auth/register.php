<?php

return [

    'title' => 'Регистрация',

    'heading' => 'Създайте нов акаунт',

    'actions' => [

        'login' => [
            'before' => 'или',
            'label' => 'влезте във вашия акаунт',
        ],

    ],

    'form' => [

        'email' => [
            'label' => 'Имейл адрес',
        ],

        'name' => [
            'label' => 'Име',
        ],

        'password' => [
            'label' => 'Парола',
            'validation_attribute' => 'password',
        ],

        'password_confirmation' => [
            'label' => 'Потвърдете паролата',
        ],

        'actions' => [

            'register' => [
                'label' => 'Създайте акаунт',
            ],

        ],

    ],

    'notifications' => [

        'throttled' => [
            'title' => 'Прекалено много опити за регистрация',
            'body' => 'Моля, опитайте отново след :seconds секунди',
        ],

    ],

];
