<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MedicalPerson extends Model
{
    use HasFactory;
    use HasTranslations;

    protected $fillable = [
        'name',
        'specialization',
        'content',
        'image'
    ];
    protected $translatable = [
        'name',
        'specialization',
        'content'
    ];

}
