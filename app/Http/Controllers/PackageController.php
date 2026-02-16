<?php

namespace App\Http\Controllers;

use App\Models\Package;
use Illuminate\Http\Request;

class PackageController extends Controller
{
    // List paket
    public function index()
    {
        return Package::latest()->get();
    }

    // Tambah paket
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required',
            'speed' => 'required',
            'price' => 'required|numeric',
        ]);

        $package = Package::create($validated);

        return response()->json($package, 201);
    }

    // Detail paket
    public function show(Package $package)
    {
        return $package;
    }

    // Update paket
    public function update(Request $request, Package $package)
    {
        $package->update($request->all());

        return response()->json($package);
    }

    // Hapus paket
    public function destroy(Package $package)
    {
        $package->delete();

        return response()->json(['message' => 'Package deleted']);
    }
}
