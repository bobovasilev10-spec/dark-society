<?php

return [

    'columns' => [

        'tags' => [
            'more' => 'и още :count',
        ],

        'messages' => [
            'copied' => 'Копирано',
        ],

    ],

    'fields' => [

        'bulk_select_page' => [
            'label' => 'Маркирай/размаркирай всички записи за общо действие.',
        ],

        'bulk_select_record' => [
            'label' => 'Маркирай/размаркирай записи за общо действие.',
        ],

        'search_query' => [
            'label' => 'Търсене',
            'placeholder' => 'Търси...',
        ],

    ],

    'pagination' => [

        'label' => 'Странициране',

        'overview' => '{1} Показване на 1 резултат|[2,*] Показване резултати от :first до :last от общо :total',

        'fields' => [

            'records_per_page' => [

                'label' => 'на страница',

                'options' => [
                    'all' => 'Всички',
                ],

            ],

        ],

        'buttons' => [

            'go_to_page' => [
                'label' => 'Иди на страница :page',
            ],

            'next' => [
                'label' => 'Следваща',
            ],

            'previous' => [
                'label' => 'Предишна',
            ],

        ],

    ],

    'buttons' => [

        'disable_reordering' => [
            'label' => 'Завърши подреждането',
        ],

        'enable_reordering' => [
            'label' => 'Подреди записите',
        ],

        'filter' => [
            'label' => 'Филтър',
        ],

        'open_actions' => [
            'label' => 'Виж възможни действия',
        ],

        'toggle_columns' => [
            'label' => 'Скрий/Покажи колони',
        ],

    ],

    'empty' => [

        'heading' => 'Няма резултати',

        'buttons' => [

            'reset_column_searches' => [
                'label' => 'Изчисти търсенето',
            ],

        ],

    ],

    'filters' => [

        'buttons' => [

            'remove' => [
                'label' => 'Премахни филтъра',
            ],

            'remove_all' => [
                'label' => 'Премахни всички филтри',
                'tooltip' => 'Премахни всички филтри',
            ],

            'reset' => [
                'label' => 'Нулиране на филтрите',
            ],

        ],

        'indicator' => 'Актививай филтрите',

        'multi_select' => [
            'placeholder' => 'Всички',
        ],

        'select' => [
            'placeholder' => 'Всички',
        ],

        'trashed' => [

            'label' => 'Изтрити записи',

            'only_trashed' => 'Само изтритите записи',

            'with_trashed' => 'Всички със изтритите записи',

            'without_trashed' => 'Всички без изтритите записи',

        ],

    ],

    'reorder_indicator' => 'Превлачи записите на желаната позиция.',

    'selection_indicator' => [

        'selected_count' => '1 запис е избран.|:count записи са избрани.',

        'buttons' => [

            'select_all' => [
                'label' => 'Маркирай всички :count',
            ],

            'deselect_all' => [
                'label' => 'Размаркирай всички',
            ],

        ],

    ],

    'sorting' => [

        'fields' => [

            'column' => [
                'label' => 'Сортирай по',
            ],

            'direction' => [

                'label' => 'Ред на сортиране',

                'options' => [
                    'asc' => 'Възходящ ред',
                    'desc' => 'Низходящ ред',
                ],

            ],

        ],

    ],

];
