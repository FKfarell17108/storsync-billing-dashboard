<?php

namespace Database\Seeders;

use App\Models\Customer;
use App\Models\Invoice;
use App\Models\Package;
use App\Models\Payment;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create known Admin and User accounts
        User::updateOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin',
                'password' => Hash::make('Admin123!'),
                'role' => 'admin',
                'email_verified_at' => now(),
            ]
        );
        User::updateOrCreate(
            ['email' => 'user@example.com'],
            [
                'name' => 'User',
                'password' => Hash::make('User123!'),
                'role' => 'user',
                'email_verified_at' => now(),
            ]
        );
        // Additional random users
        User::factory(8)->create();

        // 2. Create 10 Packages
        $packages = Package::factory(10)->create();

        // 3. Create 10 Customers
        $customers = Customer::factory(10)->create();

        // 4. Create Subscriptions (1 per customer, picking a random package)
        foreach ($customers as $customer) {
            Subscription::factory()->create([
                'customer_id' => $customer->id,
                'package_id' => $packages->random()->id,
            ]);

            // 5. Create Invoices (1-3 per customer)
            $invoices = Invoice::factory(rand(1, 3))->create([
                'customer_id' => $customer->id,
            ]);

            // 6. Create Payments for Paid Invoices
            foreach ($invoices as $invoice) {
                if ($invoice->status === 'paid') {
                    Payment::factory()->create([
                        'invoice_id' => $invoice->id,
                        'amount' => $invoice->total,
                    ]);
                }
            }
        }
    }
}
