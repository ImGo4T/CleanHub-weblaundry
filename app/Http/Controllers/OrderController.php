<?php

namespace App\Http\Controllers;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Http\Requests\Orders\StoreOrderRequest;
use App\Http\Requests\Orders\UpdateOrderStatusRequest;
use App\Models\Customer;
use App\Models\Order;
use App\Models\Service;
use App\Services\OrderCodeGenerator;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Order::with(['customer.user', 'service']);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('order_code', 'like', "%{$search}%")
                    ->orWhereHas('customer.user', fn ($u) => $u->where('name', 'like', "%{$search}%"));
            });
        }

        $orders = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('Orders/Index', [
            'orders' => $orders,
            'filters' => $request->only(['status', 'search']),
            'statuses' => collect(OrderStatus::cases())->map(fn ($s) => [
                'value' => $s->value,
                'label' => $s->label(),
                'color' => $s->color(),
            ]),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Orders/Create', [
            'customers' => Customer::with('user')->get()->map(fn ($c) => collect($c->except(['latitude', 'longitude']))->merge([
                'display_name' => $c->user->name . ' (' . $c->user->email . ')',
            ])),
            'services' => Service::active()->get(),
        ]);
    }

    public function store(StoreOrderRequest $request, OrderCodeGenerator $codeGenerator): RedirectResponse
    {
        $service = Service::findOrFail($request->service_id);
        $customer = Customer::findOrFail($request->customer_id);

        $order = DB::transaction(function () use ($request, $service, $customer, $codeGenerator) {
            // Hitung subtotal dari items
            $subtotal = collect($request->items)->sum(fn ($item) => $item['quantity'] * $item['price']);

            // Hitung discount dari membership
            $discountPercent = $customer->membership_tier->discountPercentage();
            $discount = $subtotal * ($discountPercent / 100);
            $totalPrice = $subtotal - $discount;

            $order = Order::create([
                'order_code' => $codeGenerator->generate(),
                'customer_id' => $request->customer_id,
                'operator_id' => $request->user()->id,
                'service_id' => $request->service_id,
                'status' => OrderStatus::Diterima->value,
                'total_weight' => $request->total_weight,
                'total_items' => $request->total_items,
                'subtotal' => $subtotal,
                'discount' => $discount,
                'total_price' => $totalPrice,
                'payment_status' => PaymentStatus::Unpaid->value,
                'pickup_type' => $request->pickup_type,
                'delivery_type' => $request->delivery_type,
                'notes' => $request->notes,
                'estimated_ready_at' => now()->addHours($service->duration_hours),
            ]);

            // Create order items
            foreach ($request->items as $item) {
                $order->items()->create($item);
            }

            // Log initial status
            $order->statusLogs()->create([
                'status' => OrderStatus::Diterima->value,
                'changed_by' => $request->user()->id,
                'notes' => 'Order created',
                'created_at' => now(),
            ]);

            return $order;
        });

        return redirect()->route('orders.index')
            ->with('success', 'Order berhasil dibuat: ' . $order->order_code);
    }

    public function show(Order $order): Response
    {
        $order->load(['customer.user', 'service', 'items', 'statusLogs.changedByUser', 'payments']);

        return Inertia::render('Orders/Show', [
            'order' => $order->except(['operator_id']),
            'statuses' => collect(OrderStatus::cases())->map(fn ($s) => [
                'value' => $s->value,
                'label' => $s->label(),
                'color' => $s->color(),
            ]),
        ]);
    }

    public function updateStatus(UpdateOrderStatusRequest $request, Order $order): RedirectResponse
    {
        $newStatus = OrderStatus::from($request->status);
        $order->updateStatus($newStatus, $request->user(), $request->notes);

        return back()->with('success', 'Status order berhasil diupdate.');
    }

    public function destroy(Order $order): RedirectResponse
    {
        if (!$order->status->isActive()) {
            return back()->with('error', 'Tidak dapat menghapus order yang sudah selesai/dibatalkan.');
        }

        $order->updateStatus(OrderStatus::Cancelled, request()->user(), 'Order cancelled');

        return redirect()->route('orders.index')
            ->with('success', 'Order berhasil dibatalkan.');
    }
}
