<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['name' => 'Skills'],
            ['name' => 'Experience'],
            ['name' => 'Education'],
            ['name' => 'Certifications'],
            ['name' => 'Languages'],
            ['name' => 'Projects'],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
