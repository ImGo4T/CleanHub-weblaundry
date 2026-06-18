<?php

use App\Enums\MembershipTier;
use App\Enums\UserRole;
use App\Models\Customer;
use App\Models\User;

// ── Access Control ──────────────────────────────────────────────

test('guests cannot access customers index', function () {
    $this->get('/customers')->assertRedirect('/login');
});

test('admin can access customers index', function () {
    $admin = User::factory()->create(['role' => UserRole::Admin->value]);
    $this->actingAs($admin)->get('/customers')->assertOk();
});

test('operator can access customers index', function () {
    $operator = User::factory()->create(['role' => UserRole::Operator->value]);
    $this->actingAs($operator)->get('/customers')->assertOk();
});

test('pelanggan cannot access customers index', function () {
    $user = User::factory()->create(['role' => UserRole::Pelanggan->value]);
    $this->actingAs($user)->get('/customers')->assertStatus(403);
});

// ── Create Customer ──────────────────────────────────────────────

test('admin can create a customer', function () {
    $admin = User::factory()->create(['role' => UserRole::Admin->value]);

    $this->actingAs($admin)->post('/customers', [
        'name' => 'John Doe',
        'email' => 'john@test.com',
        'phone' => '081122334455',
        'password' => 'password123',
        'password_confirmation' => 'password123',
        'address' => 'Jl. Test No. 1',
    ])->assertRedirect('/customers');

    $user = User::where('email', 'john@test.com')->first();
    expect($user)->not->toBeNull();
    expect($user->name)->toBe('John Doe');
    expect($user->role->value)->toBe(UserRole::Pelanggan->value);

    $customer = Customer::where('user_id', $user->id)->first();
    expect($customer)->not->toBeNull();
    expect($customer->address)->toBe('Jl. Test No. 1');
    expect($customer->membership_tier)->toBe(MembershipTier::Bronze);
});

test('create customer requires name', function () {
    $admin = User::factory()->create(['role' => UserRole::Admin->value]);

    $this->actingAs($admin)->post('/customers', [
        'email' => 'john@test.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ])->assertSessionHasErrors('name');
});

test('create customer requires unique email', function () {
    $admin = User::factory()->create(['role' => UserRole::Admin->value]);
    User::factory()->create(['email' => 'existing@test.com']);

    $this->actingAs($admin)->post('/customers', [
        'name' => 'Test User',
        'email' => 'existing@test.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ])->assertSessionHasErrors('email');
});

// ── Show Customer ──────────────────────────────────────────────

test('admin can view customer detail', function () {
    $admin = User::factory()->create(['role' => UserRole::Admin->value]);
    $user = User::factory()->create(['role' => UserRole::Pelanggan->value]);
    $customer = Customer::create([
        'user_id' => $user->id,
        'address' => 'Test address',
    ]);

    $this->actingAs($admin)->get("/customers/{$customer->id}")->assertOk();
});

// ── Delete Customer ──────────────────────────────────────────────

test('admin can delete customer without active orders', function () {
    $admin = User::factory()->create(['role' => UserRole::Admin->value]);
    $user = User::factory()->create(['role' => UserRole::Pelanggan->value]);
    $customer = Customer::create([
        'user_id' => $user->id,
        'address' => 'Test',
    ]);

    $this->actingAs($admin)->delete("/customers/{$customer->id}")->assertRedirect('/customers');

    expect(Customer::find($customer->id))->toBeNull();
    expect(User::find($user->id))->toBeNull();
});

// ── Search ──────────────────────────────────────────────

test('customers can be searched by name', function () {
    $admin = User::factory()->create(['role' => UserRole::Admin->value]);
    $user = User::factory()->create(['name' => 'Budi Santoso', 'role' => UserRole::Pelanggan->value]);
    Customer::create(['user_id' => $user->id]);

    $this->actingAs($admin)->get('/customers?search=Budi')
        ->assertOk();
});
