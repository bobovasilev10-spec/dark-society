<?php

namespace Database\Seeders;

use App\Models\InfoPage;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class InfoPageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [];

        $data[] = [
            'title' => 'За нас',
            'slug' => 'about-us',
            'content' => '-',
            'is_top' => true,
            'is_bottom' => false,
            'is_required_for_order' => true,
        ];

        $data[] = [
            'title' => 'Условия за ползване',
            'slug' => 'terms-of-use',
            'content' => '-',
            'is_top' => false,
            'is_bottom' => true,
            'is_required_for_order' => false,
        ];

        $data[] = [
            'title' => 'Политика за личните данни',
            'slug' => 'privacy-policy',
            'content' => '-',
            'is_top'=> false,
            'is_bottom' => true,
            'is_required_for_order' => true,
        ];

        foreach($data as $item) {
            InfoPage::query()
                ->create($item);
        }
    }
}
