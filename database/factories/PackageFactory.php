<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Package>
 */
class PackageFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->word() . ' Package',
            'speed' => fake()->numberBetween(10, 1000) . ' Mbps',
            'price' => fake()->numberBetween(100000, 2000000),
        ];
    }
}
