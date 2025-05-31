<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ApplicantComment>
 */
class ApplicantCommentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'applicant_id' => \App\Models\Applicant::factory(),
            'comment' => $this->faker->sentence(),
            'category_id' => \App\Models\Category::factory(),
        ];
    }

}
