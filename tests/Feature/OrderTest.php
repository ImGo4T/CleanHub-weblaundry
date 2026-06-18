<?php

use App\Enums\MembershipTier;
use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Enums\ServiceUnitType;
use App\Enums\UserRole;
use App\Models\Customer;
use App\Models\Order;
use App\Models\Service;
use App\Models\User;

function createAdmin(): User
{
    return User::factory()->create(['role' => UserRole::Admin->value]);
}

function createOperator(): User
{
    return User::factory()->create(['role' => UserRole::Operator->value]);
}

function createPelangganWithCustomer(MembershipTier $tier = MembershipTier::Bronze): array
{
    $user = User::factory()->create(['role' => UserRole::Pelanggan->value]);
    $customer = Customer::create([
        'user_id' => $user->id,
        'address' => 'Test address',
        'membership_tier' => $tier->value,
    ]);
    return [$user, $customer];
}

function createService(): Service
{
    return Service::create([
        'name' => 'Test Service',
        'price_per_kg' => 10000,
        'price_per_item' => 0,
        'unit_type' => ServiceUnitType::Kg->value,
        'duration_hours' => 24,
        'is_active' => true,
    ]);
}

// ── Access Control ──────────────────────────────────────────────

test('guests cannot access orders index', function () {
    $this->get('/orders')->assertRedirect('/login');
});

test('admin can access orders index', function () {
    $this->actingAs(createAdmin());
    $this->get('/orders')->assertOk();
});

test('operator can access orders index', function () {
    $this->actingAs(createOperator());
    $this->get('/orders')->assertOk();
});

test('pelanggan cannot access orders index', function () {
    [$user] = createPelangganWithCustomer();
    $this->actingAs($user);
    $this->get('/orders')->assertStatus(403);
});

// ── Create Order ──────────────────────────────────────────────

test('admin can create an order', function () {
    $admin = createAdmin();
    $service = createService();
    [$pelangganUser, $customer] = createPelangganWithCustomer(MembershipTier::Silver);

    $this->actingAs($admin)->post('/orders', [
        'customer_id' => $customer->id,
        'service_id' => $service->id,
        'total_weight' => 2.5,
        'pickup_type' => 'drop_off',
        'delivery_type' => 'self_pickup',
        'items' => [
            ['item_name' => 'Kemeja', 'quantity' => 3, 'price' => 5000],
            ['item_name' => 'Celana', 'quantity' => 1, 'price' => 8000],
        ],
    ])->assertRedirect('/orders');

    $order = Order::first();
    expect($order)->not->toBeNull();
    expect($order->order_code)->toStartWith('CLH-');
    expect($order->customer_id)->toBe($customer->id);
    expect($order->status)->toBe(OrderStatus::Diterima);
    expect($order->payment_status)->toBe(PaymentStatus::Unpaid);
    // subtotal = 3*5000 + 1*8000 = 23000
    // discount = 23000 * 5% (silver) = 1150
    // total = 23000 - 1150 = 21850
    expect((float) $order->subtotal)->toBe(23000.0);
    expect((float) $order->discount)->toBe(1150.0);
    expect((float) $order->total_price)->toBe(21850.0);
    expect($order->items()->count())->toBe(2);
    expect($order->statusLogs()->count())->toBe(1);
});

test('order code format is correct', function () {
    $admin = createAdmin();
    $service = createService();
    [$pelangganUser, $customer] = createPelangganWithCustomer();

    $this->actingAs($admin)->post('/orders', [
        'customer_id' => $customer->id,
        'service_id' => $service->id,
        'total_weight' => 1,
        'pickup_type' => 'drop_off',
        'delivery_type' => 'self_pickup',
        'items' => [
            ['item_name' => 'Test Item', 'quantity' => 1, 'price' => 10000],
        ],
    ]);

    $order = Order::first();
    $expected = 'CLH-' . now()->format('Ymd') . '-0001';
    expect($order->order_code)->toBe($expected);
});

test('gold member gets 10% discount', function () {
    $admin = createAdmin();
    $service = createService();
    [$pelangganUser, $customer] = createPelangganWithCustomer(MembershipTier::Gold);

    $this->actingAs($admin)->post('/orders', [
        'customer_id' => $customer->id,
        'service_id' => $service->id,
        'pickup_type' => 'drop_off',
        'delivery_type' => 'self_pickup',
        'items' => [
            ['item_name' => 'Jas', 'quantity' => 1, 'price' => 50000],
        ],
    ]);

    $order = Order::first();
    expect((float) $order->subtotal)->toBe(50000.0);
    expect((float) $order->discount)->toBe(5000.0); // 10% of 50000
    expect((float) $order->total_price)->toBe(45000.0);
});

test('bronze member gets no discount', function () {
    $admin = createAdmin();
    $service = createService();
    [$pelangganUser, $customer] = createPelangganWithCustomer(MembershipTier::Bronze);

    $this->actingAs($admin)->post('/orders', [
        'customer_id' => $customer->id,
        'service_id' => $service->id,
        'pickup_type' => 'drop_off',
        'delivery_type' => 'self_pickup',
        'items' => [
            ['item_name' => 'Baju', 'quantity' => 1, 'price' => 10000],
        ],
    ]);

    $order = Order::first();
    expect((float) $order->discount)->toBe(0.0);
    expect((float) $order->total_price)->toBe(10000.0);
});

// ── Show Order ──────────────────────────────────────────────

test('admin can view order detail', function () {
    $admin = createAdmin();
    $service = createService();
    [$pelangganUser, $customer] = createPelangganWithCustomer();

    $this->actingAs($admin)->post('/orders', [
        'customer_id' => $customer->id,
        'service_id' => $service->id,
        'pickup_type' => 'drop_off',
        'delivery_type' => 'self_pickup',
        'items' => [['item_name' => 'Item', 'quantity' => 1, 'price' => 10000]],
    ]);

    $order = Order::first();
    $this->actingAs($admin)->get("/orders/{$order->id}")->assertOk();
});

// ── Update Status ──────────────────────────────────────────────

test('operator can update order status', function () {
    $admin = createAdmin();
    $operator = createOperator();
    $service = createService();
    [$pelangganUser, $customer] = createPelangganWithCustomer();

    $this->actingAs($admin)->post('/orders', [
        'customer_id' => $customer->id,
        'service_id' => $service->id,
        'pickup_type' => 'drop_off',
        'delivery_type' => 'self_pickup',
        'items' => [['item_name' => 'Item', 'quantity' => 1, 'price' => 10000]],
    ]);

    $order = Order::first();

    $this->actingAs($operator)->patch("/orders/{$order->id}/status", [
        'status' => OrderStatus::Dicuci->value,
        'notes' => 'Sedang dicuci',
    ])->assertRedirect();

    $order->refresh();
    expect($order->status)->toBe(OrderStatus::Dicuci);
    expect($order->statusLogs()->count())->toBe(2);
});

test('updating status to selesai sets completed_at', function () {
    $admin = createAdmin();
    $service = createService();
    [$pelangganUser, $customer] = createPelangganWithCustomer();

    $this->actingAs($admin)->post('/orders', [
        'customer_id' => $customer->id,
        'service_id' => $service->id,
        'pickup_type' => 'drop_off',
        'delivery_type' => 'self_pickup',
        'items' => [['item_name' => 'Item', 'quantity' => 1, 'price' => 10000]],
    ]);

    $order = Order::first();

    $this->actingAs($admin)->patch("/orders/{$order->id}/status", [
        'status' => OrderStatus::Selesai->value,
    ]);

    $order->refresh();
    expect($order->status)->toBe(OrderStatus::Selesai);
    expect($order->completed_at)->not->toBeNull();
});

// ── Cancel Order ──────────────────────────────────────────────

test('admin can cancel an active order', function () {
    $admin = createAdmin();
    $service = createService();
    [$pelangganUser, $customer] = createPelangganWithCustomer();

    $this->actingAs($admin)->post('/orders', [
        'customer_id' => $customer->id,
        'service_id' => $service->id,
        'pickup_type' => 'drop_off',
        'delivery_type' => 'self_pickup',
        'items' => [['item_name' => 'Item', 'quantity' => 1, 'price' => 10000]],
    ]);

    $order = Order::first();

    $this->actingAs($admin)->delete("/orders/{$order->id}")->assertRedirect('/orders');

    $order->refresh();
    expect($order->status)->toBe(OrderStatus::Cancelled);
});

// ── Validation ──────────────────────────────────────────────

test('store order requires customer_id', function () {
    $admin = createAdmin();
    $service = createService();

    $this->actingAs($admin)->post('/orders', [
        'service_id' => $service->id,
        'pickup_type' => 'drop_off',
        'delivery_type' => 'self_pickup',
        'items' => [['item_name' => 'Item', 'quantity' => 1, 'price' => 10000]],
    ])->assertSessionHasErrors('customer_id');
});

test('store order requires at least one item', function () {
    $admin = createAdmin();
    $service = createService();
    [$pelangganUser, $customer] = createPelangganWithCustomer();

    $this->actingAs($admin)->post('/orders', [
        'customer_id' => $customer->id,
        'service_id' => $service->id,
        'pickup_type' => 'drop_off',
        'delivery_type' => 'self_pickup',
        'items' => [],
    ])->assertSessionHasErrors('items');
});
