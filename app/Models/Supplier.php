<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;
use Illuminate\Database\Eloquent\SoftDeletes;

class Supplier extends Model
{
    use HasTranslations;
    use SoftDeletes;

    public $timestamps = false;

    protected $fillable = [
        'name',
    ];
    protected $translatable = [
        'name',
    ];
    public function products()
    {
        return $this->hasMany(Product::class);
    }
}
