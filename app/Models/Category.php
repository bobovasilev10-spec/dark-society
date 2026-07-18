<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;
use Illuminate\Database\Eloquent\SoftDeletes;

class Category extends Model
{
    use SoftDeletes;
    use HasTranslations;

    public $timestamps = false;

    protected $fillable = [
        'parent_id',
        'name',
        'slug',
        'image',
        'mapped_id',
    ];
    protected $translatable = [
        'name',
    ];
    public function parent()
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(Category::class, 'parent_id');
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }

    public function getRouteKeyName()
    {
        return 'slug';
    }

    public function mappedCategory()
    {
        return $this->belongsTo(Category::class, 'mapped_id');
    }

    public function mappedTo()
    {
        return $this->hasMany(Category::class, 'mapped_id');
    }

    public function mappedToProducts()
    {
        return $this->hasManyThrough(Product::class, Category::class, 'mapped_id', 'category_id', 'id', 'id');
    }

    public function getNestedCategories()
    {
        $categories = Category::all();

        $grouped = $categories->groupBy('parent_id');

        $rootCategories = $grouped->get(null); // Root categories have null as parent_id

        return $this->buildTree($rootCategories, $grouped);
    }
    public function getNestedCategoryProducts()
    {
        // Fetch child categories along with their products
        $grouped = Category::where('parent_id', $this->id)
            ->with(['products.images', 'products.options'])  // Eager load child categories' products
            ->get();

        // Get the products of the current category itself
        $currentCategoryProducts = $this->products()->with(['images', 'options'])->orderBy('created_at','desc')->get();

        // Flatten and map the products from all child categories
        $childCategoryProducts = $grouped->flatMap(function ($category) {
            return $category->products;
        });

        // Combine current category products with child category products
        $allProducts = $currentCategoryProducts->merge($childCategoryProducts);
        return $allProducts->sortByDesc('created_at')->values()->toArray();
    }

    private function buildTree($categories, $grouped)
    {
        return $categories->map(function ($category) use ($grouped) {
            $category->children = $grouped->get($category->id) ? $this->buildTree($grouped->get($category->id), $grouped) : [];
            return $category;
        });
    }
}
