<?php

namespace App\Http\Controllers;

use App\Models\Subscription;
use Illuminate\Http\Request;

class SubscriptionController extends Controller
{
    // list subscription
    public function index()
    {
        return Subscription::with(['customer', 'package'])->get();
    }

    // assign paket ke customer
    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'package_id' => 'required|exists:packages,id',
            'start_date' => 'required|date',
        ]);

        // pastikan 1 customer hanya punya 1 paket
        Subscription::updateOrCreate(
            ['customer_id' => $validated['customer_id']],
            $validated
        );

        return response()->json(['message' => 'Subscription updated']);
    }

    // detail
    public function show(Subscription $subscription)
    {
        return $subscription->load(['customer', 'package']);
    }

    // update
    public function update(Request $request, Subscription $subscription)
    {
        $subscription->update($request->all());
        return $subscription;
    }

    // delete
    public function destroy(Subscription $subscription)
    {
        $subscription->delete();
        return response()->json(['message' => 'Subscription removed']);
    }
}
