<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Log;
use Intervention\Image\ImageManager;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Drivers\Gd\Driver;

class ProductController extends Controller
{
    public function getOne($slug)
    {
        $product = Product::query()
            ->where('slug', $slug)
            ->with(['images', 'category','options'])
            ->firstOrFail();
        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found'
            ]);
        }

        $similar_products = Product::query()
            ->where('category_id', $product->category_id)
            ->with('images')
            ->take(4)
            ->inRandomOrder()
            ->get();

        return response()->json([
            'success' => true,
            'product' => $product,
            'similar_products' => $similar_products,
        ]);
    }

    public function search()
    {
        // Get the search keyword and category_id from the request
        $search = request()->get('search');
        $category_id = request()->get('category');
        // Find the parent category based on the provided category_id
        $category = Category::with('children')->find($category_id);

        if (!$category) {
            $products = Product::when($search, function ($query, $search) {
                return $query->where('name', 'like', "%$search%");
            })
                ->limit(16)
                ->get();
        } else {


            // Get the IDs of the category and all its children
            $categoryIds = $this->getCategoryAndChildrenIds($category);

            // Query products where the category_id is in the array of category IDs
            $products = Product::whereIn('category_id', $categoryIds)
                ->when($search, function ($query, $search) {
                    return $query->where('name', 'like', "%$search%");
                })
                ->get();
        }
        // Return the products in JSON format
        return response()->json([
            'success' => true,
            'products' => $products
        ]);
    }

    // Helper method to get the IDs of the category and all its children
    private function getCategoryAndChildrenIds($category)
    {
        $categoryIds = [$category->id]; // Include the parent category ID

        // Recursive function to collect all children category IDs
        $category->children->each(function ($childCategory) use (&$categoryIds) {
            $categoryIds[] = $childCategory->id;
            $categoryIds = array_merge($categoryIds, $this->getCategoryAndChildrenIds($childCategory));
        });

        return $categoryIds;
    }
    public function getAll()
    {
        $products = Product::with('images')->get();
        foreach ($products as $product) {
            $model = $product;
            //return true;
            $dir = 'products';
            $path = 'storage/image/webp/' . $dir . '/';
            $filename = pathinfo('storage/' . $model->image, PATHINFO_FILENAME);

            if (!is_dir($path)) {
                mkdir($path, 0777, true);
            }
            try {
                $manager = new ImageManager(new Driver());
                $image = $manager->read('storage/' . $model->image);
                $image->toWebp(90);
                $webp_path = 'image/webp/' . $dir . '/' . $filename . '.webp';
                Storage::put('public/' . $webp_path, $image->encode());
                Storage::disk('public')->delete($model->image);

                $model->update([
                    "image" => $webp_path
                ]);
                //code...
            } catch (\Throwable $th) {
                Log::info($th);
            }
            foreach ($product->images as $image) {
                $image_model = $image;
                //return true;
                $dir = 'products';
                $path = 'storage/image/webp/' . $dir . '/';
                $filename = pathinfo('storage/' . $image_model->image_path, PATHINFO_FILENAME);

                if (!is_dir($path)) {
                    mkdir($path, 0777, true);
                }
                try {
                    $manager = new ImageManager(new Driver());
                    $image = $manager->read('storage/' . $image_model->image_path);
                    $image->toWebp(90);
                    $webp_path = 'image/webp/' . $dir . '/' . $filename . '.webp';
                    Storage::put('public/' . $webp_path, $image->encode());
                    Storage::disk('public')->delete($image_model->image_path);
                    $image_model->update([
                        "image_path" => $webp_path
                    ]);
                    //code...
                } catch (\Throwable $th) {
                    Log::info($th);
                }
            }
        }
        return response()->json([
            'success' => true,
        ]);
    }
}
