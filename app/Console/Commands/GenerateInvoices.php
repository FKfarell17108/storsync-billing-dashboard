<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Subscription;
use App\Models\Invoice;
use Carbon\Carbon;

class GenerateInvoices extends Command
{
    protected $signature = 'billing:generate';

    protected $description = 'Generate monthly invoices';

    public function handle()
    {
        $month = Carbon::now()->format('Y-m');

        $subscriptions = Subscription::with(['customer', 'package'])->get();

        foreach ($subscriptions as $sub) {

            // Cek apakah invoice bulan ini sudah ada
            $exists = Invoice::where('customer_id', $sub->customer_id)
                ->where('month', $month)
                ->exists();

            if ($exists) {
                continue;
            }

            Invoice::create([
                'customer_id' => $sub->customer_id,
                'month' => $month,
                'total' => $sub->package->price,
                'status' => 'unpaid',
                'due_date' => Carbon::now()->addDays(10),
            ]);
        }

        $this->info('Invoices generated successfully');
    }
}
