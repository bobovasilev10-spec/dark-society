<?php

namespace App\Services\imports;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Support\Str;
use App\Models\FilterOption;
use App\Services\ImageService;
use Illuminate\Support\Facades\Log;
use PhpOffice\PhpSpreadsheet\IOFactory;


class ProductImport
{
    public $filePath;

    public function __construct()
    {
        $this->filePath = database_path('files/pitbull.xlsx');
    }
    public function import()
    {
        $spreadsheet = IOFactory::load($this->filePath);
        $worksheet = $spreadsheet->getActiveSheet();
        $worksheet_array = $worksheet->toArray();
        array_shift($worksheet_array);
        // dd($worksheet_array[5]);
        Log::info('products importing');

        foreach ($worksheet_array as $item) {
            $title = $item[4];
            if (!$title) {
                continue;
            }
            $pattern = '/size:([A-Z0-9]+(?:\/[0-9]+)?)/';
            preg_match_all($pattern, $item[6], $matches);
            $sizes = $matches[1];
            $pattern = '/https:\/\/[^,}]+/';

            // Use preg_match_all to find all URLs in the string
            preg_match_all($pattern, $item[9], $matches);
            $images = $matches[0];

            $image_url = array_shift($images);;
            $price_attributes = str_replace('лв.', '', $item[5]);
            $price = floatval($price_attributes);

            $category_id = $this->getCategoryId($item[8]); // винилови подови на K2

            $slug = Str::slug($title, '-', 'bg');
            if ($image_url) {
                $image = new ImageService($image_url);
                $image = $image->download();
            }else{
                $image = null;
            }

            $product = Product::updateOrCreate([
                'slug' => $slug,
            ], [
                'name' => $title,
                'description' => $item[7] ?? null,
                'category_id' => $category_id,
                'slug' => $slug,
                'price' => $price,
                'image' => $image,
                'weight' => 0.5
            ]);
            $images = collect($images);
            $images->map(function ($image_url) use ($product) {
                $image = new ImageService($image_url);
                $image = $image->download();
                $product->images()->create([
                    'image_path' => $image
                ]);
            });

            $sizes = collect($sizes);
            $sizes->map(function ($size) use ($product) {
                $product->options()->create([
                    'name' => $size,
                    'in_stock' => 1,
                    'option_id' => 1
                ]);
            });

        }
        Log::info('products imported');
    }

  public function getCategoryId($string)
  {
      $categories = explode(', ', $string);
        if (empty($categories)) {
            return null; // or handle error as needed
        }
        $parentCategoryName = $categories[0];
        $parentCategory = Category::where('name', $parentCategoryName)->first();

        if (!$parentCategory) {
            // If the parent category does not exist, create it
            $parentCategory = Category::create([
                'name' => $parentCategoryName,
                'slug' => Str::slug($parentCategoryName, '-', 'bg')
            ]);
        }
        // Initialize the parent category ID
        $parentCategoryId = $parentCategory->id;
        // Process each additional category
        for ($i = 1; $i < count($categories); $i++) {
            $childCategoryName = $categories[$i];

            // Check if the child category already exists under the parent category
            $childCategory = Category::where('name', $childCategoryName)
                ->where('parent_id', $parentCategoryId)
                ->first();

            if (!$childCategory) {
                // If the child category does not exist, create it
                $childCategory = Category::create([
                    'name' => $childCategoryName,
                    'slug' => Str::slug($childCategoryName, '-', 'bg'),
                    'parent_id' => $parentCategoryId
                ]);
            }

            // Update the parent category ID for the next level of children
            $parentCategoryId = $childCategory->id;
        }

        // Return the final category ID (which is the ID of the deepest child category)
        return $parentCategoryId;
  }
}
