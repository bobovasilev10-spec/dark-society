<?php

return [

    'title' => 'Вход',

    'heading' => 'Влезте във вашия акаунт',

    'buttons' => [

        'submit' => [
            'label' => 'Вход',
        ],

    ],

    'fields' => [

        'email' => [
            'label' => 'Email адрес',
        ],

        'password' => [
            'label' => 'Парола',
        ],

        'remember' => [
            'label' => 'Запомни ме',
        ],

    ],

    'messages' => [
        'failed' => 'Грешни данни за вход. Опитайте отново.',
        'throttled' => 'Прекалено много грешни опити. Опитайте отново след :seconds секунди.',
    ],

];
