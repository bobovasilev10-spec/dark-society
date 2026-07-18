<?php

return [

    'title' => 'Веификация на имейл адреса',

    'heading' => 'Верифицирайте вашия имейл адрес',

    'actions' => [

        'resend_notification' => [
            'label' => 'Изпрати отново имейл за верификация',
        ],

    ],

    'messages' => [
        'notification_not_received' => 'Не сте получили имейла, който изпратихме?',
        'notification_sent' => 'Изпратихме имейл до :email с инструкции как да верифицирате вашия имейл адрес.',
    ],

    'notifications' => [

        'notification_resent' => [
            'title' => 'Изпратихме отново имейла.',
        ],

        'notification_resend_throttled' => [
            'title' => 'Прекалено много опити за изпращане отново',
            'body' => 'Моля, опитайте отново след :seconds секунди.',
        ],

    ],

];
