<?php

namespace Database\Factories;

use App\Models\Customer;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Invoice>
 */
class InvoiceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'customer_id' => Customer::factory(),
            'month' => fake()->monthName(),
            'total' => fake()->numberBetween(100000, 2000000),
            'status' => fake()->randomElement(['paid', 'unpaid', 'pending']),
            'due_date' => fake()->dateTimeBetween('now', '+1 month'),
        ];
    }
}
