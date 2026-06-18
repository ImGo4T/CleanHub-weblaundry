<?php

namespace App\Http\Controllers;

use App\Enums\OrderStatus;
use App\Models\Customer;
use App\Models\Order;
use App\Models\Payment;
use App\Models\Service;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        // Pelanggan: tampilkan orders milik sendiri
        if ($user->isPelanggan()) {
            $customerQuery = fn ($q) => $q->where('user_id', $user->id);

            $orders = Order::whereHas('customer', $customerQuery)
                ->with(['service', 'items'])
                ->latest()
                ->take(10)
                ->get()
                ->map(fn ($order) => $order->except(['operator_id']));

            $totalSpent = Order::whereHas('customer', $customerQuery)
                ->where('status', OrderStatus::Selesai->value)
                ->sum('total_price');

            return Inertia::render('Dashboard/Index', [
                'orders' => $orders,
                'stats' => [
                    'total_orders' => Order::whereHas('customer', $customerQuery)->count(),
                    'active_orders' => Order::whereHas('customer', $customerQuery)->active()->count(),
                    'completed_orders' => Order::whereHas('customer', $customerQuery)
                        ->where('status', OrderStatus::Selesai->value)->count(),
                    'total_spent' => (float) $totalSpent,
                ],
            ]);
        }

        // Admin / Operator: dashboard dengan stats lengkap
        $todayOrders = Order::whereDate('created_at', today())->count();
        $activeOrders = Order::active()->count();
        $todayRevenue = (float) Payment::whereHas('order', fn ($q) => $q->whereDate('orders.created_at', today()))
            ->where('status', 'verified')
            ->sum('amount');
        $totalCustomers = Customer::count();
        $totalRevenue = (float) Payment::where('status', 'verified')->sum('amount');
        $monthRevenue = (float) Payment::where('status', 'verified')
            ->whereMonth('paid_at', now()->month)
            ->whereYear('paid_at', now()->year)
            ->sum('amount');

        // Status breakdown for pipeline visualization
        $statusBreakdown = collect(OrderStatus::cases())
            ->filter(fn ($s) => $s->isActive())
            ->map(fn ($s) => [
                'status' => $s->value,
                'label' => $s->label(),
                'color' => $s->color(),
                'count' => Order::where('status', $s->value)->count(),
            ]);

        $recentOrders = Order::with(['customer.user', 'service', 'operator'])
            ->latest()
            ->take(8)
            ->get()
            ->map(fn ($order) => $order->except(['operator_id']));

        return Inertia::render('Dashboard/Index', [
            'stats' => [
                'today_orders' => $todayOrders,
                'active_orders' => $activeOrders,
                'today_revenue' => $todayRevenue,
                'total_customers' => $totalCustomers,
                'total_revenue' => $totalRevenue,
                'month_revenue' => $monthRevenue,
            ],
            'status_breakdown' => $statusBreakdown,
            'recent_orders' => $recentOrders,
        ]);
    }
}
