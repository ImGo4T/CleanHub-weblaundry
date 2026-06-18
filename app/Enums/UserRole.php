<?php

namespace App\Enums;

enum UserRole: string
{
    case Admin = 'admin';
    case Operator = 'operator';
    case Pelanggan = 'pelanggan';

    public function label(): string
    {
        return match ($this) {
            self::Admin => 'Super Admin',
            self::Operator => 'Operator / Kasir',
            self::Pelanggan => 'Pelanggan',
        };
    }

    public function canAccessDashboard(): bool
    {
        return match ($this) {
            self::Admin, self::Operator => true,
            self::Pelanggan => true,
        };
    }

    public function canManageOrders(): bool
    {
        return in_array($this, [self::Admin, self::Operator]);
    }

    public function canManageMasterData(): bool
    {
        return $this === self::Admin;
    }
}
