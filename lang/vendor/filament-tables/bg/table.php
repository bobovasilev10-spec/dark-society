<?php

return [

    'column_toggle' => [

        'heading' => 'Колони',

    ],

    'columns' => [

        'text' => [
            'more_list_items' => 'и :count повече',
        ],

    ],

    'fields' => [

        'bulk_select_page' => [
            'label' => 'Маркирай/Размаркирай всички записи на тази страница за масови действия.',
        ],

        'bulk_select_record' => [
            'label' => 'Маркирай/Размаркирай :key запис за масови действия.',
        ],

        'search' => [
            'label' => 'Търси',
            'placeholder' => 'Търси',
            'indicator' => 'Търсене...',
        ],

    ],

    'summary' => [

        'heading' => 'Обобщение',

        'subheadings' => [
            'all' => 'Всички :label',
            'group' => ':group общо',
            'page' => 'Тази страница',
        ],

        'summarizers' => [

            'average' => [
                'label' => 'Средно',
            ],

            'count' => [
                'label' => 'Брой',
            ],

            'sum' => [
                'label' => 'Общо',
            ],

        ],

    ],

    'actions' => [

        'disable_reordering' => [
            'label' => 'Изключи пренареждане',
        ],

        'enable_reordering' => [
            'label' => 'Пренареди записите',
        ],

        'filter' => [
            'label' => 'Филтър',
        ],

        'group' => [
            'label' => 'Групирай',
        ],

        'open_bulk_actions' => [
            'label' => 'Масови действия',
        ],

        'toggle_columns' => [
            'label' => 'Изключи/Включи колони',
        ],

    ],

    'empty' => [

        'heading' => 'Няма :model',

        'description' => 'Създай нов :model, като натиснеш бутона по-долу.',

    ],

    'filters' => [

        'actions' => [

            'remove' => [
                'label' => 'Премахни филтър',
            ],

            'remove_all' => [
                'label' => 'Премахни всички филтри',
                'tooltip' => 'Премахни всички филтри и покажи всички записи.',
            ],

            'reset' => [
                'label' => 'Нулирай филтри',
            ],

        ],

        'heading' => 'Филтри',

        'indicator' => 'Активни филтри',

        'multi_select' => [
            'placeholder' => 'Всички',
        ],

        'select' => [
            'placeholder' => 'Всички',
        ],

        'trashed' => [

            'label' => 'Изтрити записи',

            'only_trashed' => 'Само изтритите записи',

            'with_trashed' => 'Със изтритите записи',

            'without_trashed' => 'Без изтритите записи',

        ],

    ],

    'grouping' => [

        'fields' => [

            'group' => [
                'label' => 'Групирай по',
                'placeholder' => 'Избери поле за групиране',
            ],

            'direction' => [

                'label' => 'Посока на групиране',

                'options' => [
                    'asc' => 'Възходяща',
                    'desc' => 'Низходяща',
                ],

            ],

        ],

    ],

    'reorder_indicator' => 'Премести записите за пренареждане.',

    'selection_indicator' => [

        'selected_count' => '1 запис маркиран|:count записа маркирани',

        'actions' => [

            'select_all' => [
                'label' => 'Избери всички :count записа',
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

                'label' => 'Посока на сортиране',

                'options' => [
                    'asc' => 'Възходяща',
                    'desc' => 'Низходяща',
                ],

            ],

        ],

    ],

];
