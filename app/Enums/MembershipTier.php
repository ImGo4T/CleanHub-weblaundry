<?php

namespace App\Enums;

enum MembershipTier: string
{
    case Bronze = 'bronze';
    case Silver = 'silver';
    case Gold = 'gold';

    public function label(): string
    {
        return match ($this) {
            self::Bronze => 'Bronze Member',
            self::Silver => 'Silver Member',
            self::Gold => 'Gold Member',
        };
    }

    public function discountPercentage(): float
    {
        return match ($this) {
            self::Bronze => 0.0,
            self::Silver => 5.0,
            self::Gold => 10.0,
        };
    }

    public function pointsMultiplier(): float
    {
        return match ($this) {
            self::Bronze => 1.0,
            self::Silver => 1.5,
            self::Gold => 2.0,
        };
    }
}
