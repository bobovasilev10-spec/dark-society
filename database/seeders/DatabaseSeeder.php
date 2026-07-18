<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Option;
use App\Models\Product;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        User::query()
            ->create([
                'name' => 'Admin',
                'email' => 'admin@admin.bg',
                'password' => 'password',
                'is_admin' => true,
            ]);
        Option::query()
            ->create([
                'name' => 'Размер',
            ]);


        $this->call([
            InfoPageSeeder::class,
        ]);
    }
}
