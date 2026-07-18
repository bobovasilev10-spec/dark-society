<?php

return [

    'title' => 'Вход',

    'heading' => 'Вход',

    'actions' => [

        'register' => [
            'before' => 'или',
            'label' => 'създайте акаунт',
        ],

        'request_password_reset' => [
            'label' => 'Забравена парола?',
        ],

    ],

    'form' => [

        'email' => [
            'label' => 'Имейл адрес',
        ],

        'password' => [
            'label' => 'Парола',
        ],

        'remember' => [
            'label' => 'Запомни ме',
        ],

        'actions' => [

            'authenticate' => [
                'label' => 'Вход',
            ],

        ],

    ],

    'messages' => [

        'failed' => 'Грешен имейл адрес или парола.',

    ],

    'notifications' => [

        'throttled' => [
            'title' => 'Прекалено много опити за вход',
            'body' => 'Моля, опитайте отново след :seconds секунди.',
        ],

    ],

];
