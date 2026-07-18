<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SubscriptionData extends Model
{
    use HasFactory;
    use HasTranslations;

    protected $fillable = ['key', 'label'];

    protected $translatable = [
        'label',
    ];
}
