<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;

class InfoPage extends Model
{
    use HasTranslations;

    protected $fillable = [
        'title',
        'slug',
        'content',
        'is_active',
        'is_top',
        'is_bottom',
        'is_required_for_order',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'is_top' => 'boolean',
        'is_bottom' => 'boolean',
        'is_required_for_order' => 'boolean',
    ];
    protected $translatable = [
        'content',
        'title',
    ];
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeTop($query)
    {
        return $query->where('is_top', true);
    }

    public function scopeBottom($query)
    {
        return $query->where('is_bottom', true);
    }

    public function scopeRequiredForOrder($query)
    {
        return $query->where('is_required_for_order', true);
    }
}
