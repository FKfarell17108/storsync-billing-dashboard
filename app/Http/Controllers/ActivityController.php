<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use App\Models\User;
use App\Models\Customer;
use App\Models\Package;
use App\Models\Subscription;
use App\Models\Invoice;
use App\Models\Payment;

class ActivityController extends Controller
{
    public function index(Request $request)
    {
        $limit = (int) ($request->query('limit', 10));

        $mapItem = function (string $type, string $action, string $title, string $timestamp) {
            return [
                'type' => $type,
                'action' => $action,
                'title' => $title,
                'timestamp' => $timestamp,
            ];
        };

        $users = User::orderByDesc('updated_at')->take(5)->get()->map(function ($u) use ($mapItem) {
            $action = $u->updated_at > $u->created_at ? 'updated' : 'created';
            return $mapItem('user', $action, "User {$u->name}", $u->updated_at->toIso8601String());
        });

        $customers = Customer::orderByDesc('updated_at')->take(5)->get()->map(function ($c) use ($mapItem) {
            $action = $c->updated_at > $c->created_at ? 'updated' : 'created';
            return $mapItem('customer', $action, "Customer {$c->name}", $c->updated_at->toIso8601String());
        });

        $packages = Package::orderByDesc('updated_at')->take(5)->get()->map(function ($p) use ($mapItem) {
            $action = $p->updated_at > $p->created_at ? 'updated' : 'created';
            return $mapItem('package', $action, "Package {$p->name}", $p->updated_at->toIso8601String());
        });

        $subscriptions = Subscription::orderByDesc('updated_at')->take(5)->get()->map(function ($s) use ($mapItem) {
            $action = $s->updated_at > $s->created_at ? 'updated' : 'assigned';
            return $mapItem('subscription', $action, "Subscription #{$s->id} for Customer #{$s->customer_id}", $s->updated_at->toIso8601String());
        });

        $invoices = Invoice::orderByDesc('updated_at')->take(5)->get()->map(function ($i) use ($mapItem) {
            $action = $i->updated_at > $i->created_at ? 'updated' : 'created';
            return $mapItem('invoice', $action, "Invoice #{$i->id} ({$i->status})", $i->updated_at->toIso8601String());
        });

        $payments = Payment::orderByDesc('updated_at')->take(5)->get()->map(function ($p) use ($mapItem) {
            $action = $p->updated_at > $p->created_at ? 'updated' : 'paid';
            return $mapItem('payment', $action, "Payment #{$p->id} for Invoice #{$p->invoice_id}", $p->updated_at->toIso8601String());
        });

        $feed = collect()
            ->merge($users)
            ->merge($customers)
            ->merge($packages)
            ->merge($subscriptions)
            ->merge($invoices)
            ->merge($payments)
            ->sortByDesc('timestamp')
            ->values()
            ->take($limit);

        return response()->json($feed);
    }
}
