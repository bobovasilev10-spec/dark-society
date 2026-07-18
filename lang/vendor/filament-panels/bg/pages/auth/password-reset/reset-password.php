<?php

return [

    'title' => 'Рестартирайте паролата си',

    'heading' => 'Рестартирайте паролата си',

    'form' => [

        'email' => [
            'label' => 'Имейл адрес',
        ],

        'password' => [
            'label' => 'Парола',
            'validation_attribute' => 'password',
        ],

        'password_confirmation' => [
            'label' => 'Потвърдете паролата',
        ],

        'actions' => [

            'reset' => [
                'label' => 'Рестартирайте паролата си',
            ],

        ],

    ],

    'notifications' => [

        'throttled' => [
            'title' => 'Прекалено много опити за рестартиране на паролата',
            'body' => 'Моля, опитайте отново след :seconds секунди.',
        ],

    ],

];
