<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Applicant;
use Illuminate\Database\Eloquent\Factories\Factory;

class ApplicantSeeder extends Seeder
{
    protected $model = Applicant::class;
    
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Applicant::factory()->count(10)->create();
    }
}
