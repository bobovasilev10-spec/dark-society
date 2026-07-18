<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\Supplier;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class StockSeeder extends Seeder
{
    public function run(): void
    {
        // open file
        $file = fopen(database_path('files/all_stocks.csv'), 'r');

        // read file
        while (($line = fgetcsv($file)) !== false) {
            // skip header
            if ($line[0] === 'name') {
                continue;
            }

            // map
            $line = array_map('trim', $line);

            $name = $line[0];
            $categoryName = $line[1];
            $mainCategoryName = $line[2];
            $distributor = $line[3];

            $supplier = Supplier::query()
                ->firstOrCreate([
                    'name' => $distributor
                ]);

            $mainCategory = Category::query()
                ->firstOrCreate([
                    'name' => $mainCategoryName
                ], [
                    'parent_id' => null,
                    'slug' => Str::slug($mainCategoryName, '-', 'bg')
                ]);

            $category = Category::query()
                ->firstOrCreate([
                    'name' => $categoryName,
                    'parent_id' => $mainCategory->id
                ], [
                    'parent_id' => $mainCategory->id,
                    'slug' => Str::slug($categoryName, '-', 'bg')
                ]);

            // create stock
            Product::query()
                ->firstOrCreate([
                    'name' => $name,
                    ],[
                    'category_id' => $category->id,
                    'supplier_id' => $supplier->id,
                    'slug' => Str::slug($name, '-', 'bg')
                ]);


        }
    }
}
