<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Client extends Model
{
    use HasFactory;
    use HasTranslations;

    protected $fillable = [
        'name',
        'description',
        'image_before',
        'image_after',
        'weight_loss',
        'weight_gain',
    ];

    protected $translatable = [
        'name',
        'description',
    ];
}
