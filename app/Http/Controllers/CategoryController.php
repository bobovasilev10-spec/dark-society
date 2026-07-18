<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\FilterOption;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function show($slug)
    {
        $category = Category::where('slug', $slug)->with(['products' => function ($query) {
            $query->orderBy('created_at', 'desc');
        }, 'products.images','products.options'])->first();
        if (!$category?->parent_id ) {
            $products = $category->getNestedCategoryProducts();
        }else{
            $products = $category->products;
        }

        return response()->json([
            'products' => $products,
            'parent_name' => [
                'title' => $category?->parent?->name,
                'link' => null,
            ],
            'category_name' => $category->name,
        ]);
    }
}
