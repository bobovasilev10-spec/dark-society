<?php

return [

    'label' => 'Странициране',

    'overview' => '{1} Показване на 1 резултат|[2,*] Показване на :first до :last от :total резултати',

    'fields' => [

        'records_per_page' => [

            'label' => 'На страница',

            'options' => [
                'all' => 'Всички',
            ],

        ],

    ],

    'actions' => [

        'go_to_page' => [
            'label' => 'Към страница :page',
        ],

        'next' => [
            'label' => 'Следваща',
        ],

        'previous' => [
            'label' => 'Предишна',
        ],

    ],

];
