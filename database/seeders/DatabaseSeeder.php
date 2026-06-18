<?php

namespace Database\Seeders;

use App\Enums\MembershipTier;
use App\Enums\ServiceUnitType;
use App\Enums\UserRole;
use App\Models\Customer;
use App\Models\Service;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Super Admin
        $admin = User::create([
            'name' => 'Admin CleanHub',
            'email' => 'admin@cleanhub.id',
            'phone' => '081234567890',
            'role' => UserRole::Admin->value,
            'password' => bcrypt('password'),
        ]);

        // Operator / Kasir
        $operator = User::create([
            'name' => 'Kasir CleanHub',
            'email' => 'kasir@cleanhub.id',
            'phone' => '081234567891',
            'role' => UserRole::Operator->value,
            'password' => bcrypt('password'),
        ]);

        // Sample Pelanggan
        $pelanggan1 = User::create([
            'name' => 'Budi Santoso',
            'email' => 'budi@email.com',
            'phone' => '081234567892',
            'role' => UserRole::Pelanggan->value,
            'password' => bcrypt('password'),
        ]);

        Customer::create([
            'user_id' => $pelanggan1->id,
            'address' => 'Jl. Merdeka No. 10, Jakarta',
            'membership_tier' => MembershipTier::Silver->value,
            'points' => 150,
        ]);

        $pelanggan2 = User::create([
            'name' => 'Siti Rahayu',
            'email' => 'siti@email.com',
            'phone' => '081234567893',
            'role' => UserRole::Pelanggan->value,
            'password' => bcrypt('password'),
        ]);

        Customer::create([
            'user_id' => $pelanggan2->id,
            'address' => 'Jl. Sudirman No. 25, Jakarta',
            'membership_tier' => MembershipTier::Gold->value,
            'points' => 500,
        ]);

        $pelanggan3 = User::create([
            'name' => 'Andi Wijaya',
            'email' => 'andi@email.com',
            'phone' => '081234567894',
            'role' => UserRole::Pelanggan->value,
            'password' => bcrypt('password'),
        ]);

        Customer::create([
            'user_id' => $pelanggan3->id,
            'address' => 'Jl. Gatot Subroto No. 5, Jakarta',
            'membership_tier' => MembershipTier::Bronze->value,
            'points' => 0,
        ]);

        // Sample Services
        $services = [
            [
                'name' => 'Cuci Basah',
                'description' => 'Cuci biasa dengan air dan deterjen',
                'price_per_kg' => 7000,
                'price_per_item' => 0,
                'unit_type' => ServiceUnitType::Kg->value,
                'duration_hours' => 48,
                'is_active' => true,
            ],
            [
                'name' => 'Cuci Kering',
                'description' => 'Cuci dan pengeringan tanpa setrika',
                'price_per_kg' => 10000,
                'price_per_item' => 0,
                'unit_type' => ServiceUnitType::Kg->value,
                'duration_hours' => 48,
                'is_active' => true,
            ],
            [
                'name' => 'Cuci + Setrika',
                'description' => 'Cuci lengkap dengan setrika dan pewangi',
                'price_per_kg' => 15000,
                'price_per_item' => 0,
                'unit_type' => ServiceUnitType::Kg->value,
                'duration_hours' => 72,
                'is_active' => true,
            ],
            [
                'name' => 'Setrika Only',
                'description' => 'Hanya setrika tanpa cuci',
                'price_per_kg' => 5000,
                'price_per_item' => 0,
                'unit_type' => ServiceUnitType::Kg->value,
                'duration_hours' => 24,
                'is_active' => true,
            ],
            [
                'name' => 'Dry Clean',
                'description' => 'Cuci kering untuk bahan khusus (jas, gaun, sutra)',
                'price_per_kg' => 0,
                'price_per_item' => 25000,
                'unit_type' => ServiceUnitType::Item->value,
                'duration_hours' => 72,
                'is_active' => true,
            ],
            [
                'name' => 'Express (6 Jam)',
                'description' => 'Layanan express selesai dalam 6 jam',
                'price_per_kg' => 30000,
                'price_per_item' => 0,
                'unit_type' => ServiceUnitType::Kg->value,
                'duration_hours' => 6,
                'is_active' => true,
            ],
        ];

        foreach ($services as $service) {
            Service::create($service);
        }
    }
}
