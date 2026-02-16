<?php

namespace App\Http\Controllers;

use App\Models\Invoice;

class InvoiceController extends Controller
{
    public function index()
    {
        return Invoice::with('customer')->latest()->get();
    }

    public function show(Invoice $invoice)
    {
        return $invoice->load('customer');
    }
}
