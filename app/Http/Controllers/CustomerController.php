<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    // List customer
    public function index()
    {
        return Customer::latest()->get();
    }

    // Tambah customer
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required',
            'email' => 'required|email',
            'phone' => 'required',
            'address' => 'required',
        ]);

        $customer = Customer::create($validated);

        return response()->json($customer, 201);
    }

    // Detail customer
    public function show(Customer $customer)
    {
        return $customer;
    }

    // Update customer
    public function update(Request $request, Customer $customer)
    {
        $customer->update($request->all());

        return response()->json($customer);
    }

    // Hapus customer
    public function destroy(Customer $customer)
    {
        $customer->delete();

        return response()->json(['message' => 'Customer deleted']);
    }
}
