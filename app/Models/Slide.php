<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;

class Slide extends Model
{
    use HasTranslations;

    protected $appends = [
        'image_url',
    ];

    protected $fillable = [
        'title',
        'image',
        'is_active',
        'subtitle',
        'button_text',
        'button_link'
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
    protected $translatable = [
        'title',
        'subtitle',
        'button_text',
    ];
    public function getImageUrlAttribute()
    {
        return asset('storage/' . $this->image);
    }
}
