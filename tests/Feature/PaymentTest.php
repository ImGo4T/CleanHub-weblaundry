<?php

use App\Enums\MembershipTier;
use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Enums\ServiceUnitType;
use App\Enums\TransactionStatus;
use App\Enums\UserRole;
use App\Models\Customer;
use App\Models\Order;
use App\Models\Payment;
use App\Models\Service;
use App\Models\User;

function createOrderForPayment(): array
{
    $admin = User::factory()->create(['role' => UserRole::Admin->value]);
    $service = Service::create([
        'name' => 'Test Service',
        'price_per_kg' => 10000,
        'price_per_item' => 0,
        'unit_type' => ServiceUnitType::Kg->value,
        'duration_hours' => 24,
        'is_active' => true,
    ]);
    $user = User::factory()->create(['role' => UserRole::Pelanggan->value]);
    $customer = Customer::create([
        'user_id' => $user->id,
        'membership_tier' => MembershipTier::Bronze->value,
    ]);
    $order = Order::create([
        'order_code' => 'CLH-20260615-0001',
        'customer_id' => $customer->id,
        'operator_id' => $admin->id,
        'service_id' => $service->id,
        'status' => OrderStatus::Diterima->value,
        'subtotal' => 50000,
        'discount' => 0,
        'total_price' => 50000,
        'payment_status' => PaymentStatus::Unpaid->value,
        'pickup_type' => 'drop_off',
        'delivery_type' => 'self_pickup',
    ]);

    return [$admin, $order];
}

// ── Access Control ──────────────────────────────────────────────

test('guests cannot access payments page', function () {
    [, $order] = createOrderForPayment();
    $this->get("/orders/{$order->id}/payments")->assertRedirect('/login');
});

test('admin can access payments page', function () {
    [$admin, $order] = createOrderForPayment();
    $this->actingAs($admin)->get("/orders/{$order->id}/payments")->assertOk();
});

test('pelanggan cannot access payments page', function () {
    [, $order] = createOrderForPayment();
    $user = User::factory()->create(['role' => UserRole::Pelanggan->value]);
    $this->actingAs($user)->get("/orders/{$order->id}/payments")->assertStatus(403);
});

// ── Record Payment ──────────────────────────────────────────────

test('admin can record a cash payment', function () {
    [$admin, $order] = createOrderForPayment();

    $this->actingAs($admin)->post('/payments', [
        'order_id' => $order->id,
        'amount' => 50000,
        'method' => 'cash',
        'reference' => '',
    ])->assertRedirect();

    $payment = Payment::first();
    expect($payment)->not->toBeNull();
    expect((float) $payment->amount)->toBe(50000.0);
    // Cash payments are auto-verified
    expect($payment->status)->toBe(TransactionStatus::Verified);
    expect($payment->paid_at)->not->toBeNull();

    // Order payment status should be updated to paid
    $order->refresh();
    expect($order->payment_status)->toBe(PaymentStatus::Paid);
});

test('transfer payment is pending until verified', function () {
    [$admin, $order] = createOrderForPayment();

    $this->actingAs($admin)->post('/payments', [
        'order_id' => $order->id,
        'amount' => 50000,
        'method' => 'transfer',
        'reference' => 'TRX123456',
    ])->assertRedirect();

    $payment = Payment::first();
    expect($payment->status)->toBe(TransactionStatus::Pending);
    expect($payment->paid_at)->toBeNull();
    expect($payment->reference)->toBe('TRX123456');

    $order->refresh();
    expect($order->payment_status)->toBe(PaymentStatus::Unpaid);
});

test('partial payment sets order payment status to partial', function () {
    [$admin, $order] = createOrderForPayment();

    $this->actingAs($admin)->post('/payments', [
        'order_id' => $order->id,
        'amount' => 20000,
        'method' => 'cash',
    ]);

    $order->refresh();
    expect($order->payment_status)->toBe(PaymentStatus::Partial);
});

test('full payment sets order payment status to paid', function () {
    [$admin, $order] = createOrderForPayment();

    $this->actingAs($admin)->post('/payments', [
        'order_id' => $order->id,
        'amount' => 50000,
        'method' => 'cash',
    ]);

    $order->refresh();
    expect($order->payment_status)->toBe(PaymentStatus::Paid);
});

// ── Verify Payment ──────────────────────────────────────────────

test('admin can verify a pending payment', function () {
    [$admin, $order] = createOrderForPayment();

    $payment = Payment::create([
        'order_id' => $order->id,
        'amount' => 50000,
        'method' => 'transfer',
        'status' => TransactionStatus::Pending->value,
        'reference' => 'TRX999',
    ]);

    $this->actingAs($admin)->patch("/payments/{$payment->id}/verify")->assertRedirect();

    $payment->refresh();
    expect($payment->status)->toBe(TransactionStatus::Verified);
    expect($payment->paid_at)->not->toBeNull();
});

test('verifying full payment updates order to paid', function () {
    [$admin, $order] = createOrderForPayment();

    $payment = Payment::create([
        'order_id' => $order->id,
        'amount' => 50000,
        'method' => 'transfer',
        'status' => TransactionStatus::Pending->value,
    ]);

    $this->actingAs($admin)->patch("/payments/{$payment->id}/verify");

    $order->refresh();
    expect($order->payment_status)->toBe(PaymentStatus::Paid);
});

// ── Validation ──────────────────────────────────────────────

test('payment requires amount', function () {
    [$admin, $order] = createOrderForPayment();

    $this->actingAs($admin)->post('/payments', [
        'order_id' => $order->id,
        'method' => 'cash',
    ])->assertSessionHasErrors('amount');
});

test('payment requires valid method', function () {
    [$admin, $order] = createOrderForPayment();

    $this->actingAs($admin)->post('/payments', [
        'order_id' => $order->id,
        'amount' => 10000,
        'method' => 'bitcoin',
    ])->assertSessionHasErrors('method');
});
