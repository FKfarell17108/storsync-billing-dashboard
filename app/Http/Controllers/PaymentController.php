<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function index()
    {
        return Payment::with('invoice')->latest()->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'invoice_id' => 'required|exists:invoices,id',
            'amount' => 'required|numeric|min:0',
            'payment_date' => 'required|date',
            'method' => 'required|string|max:255',
        ]);

        $payment = Payment::create($validated);

        return response()->json($payment, 201);
    }

    public function show(Payment $payment)
    {
        return $payment->load('invoice');
    }

    public function update(Request $request, Payment $payment)
    {
        $validated = $request->validate([
            'invoice_id' => 'exists:invoices,id',
            'amount' => 'numeric|min:0',
            'payment_date' => 'date',
            'method' => 'string|max:255',
        ]);

        $payment->update($validated);

        return response()->json($payment);
    }

    public function destroy(Payment $payment)
    {
        $payment->delete();

        return response()->json(['message' => 'Payment deleted successfully']);
    }
}
