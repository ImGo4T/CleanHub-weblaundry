<?php

namespace App\Enums;

enum ServiceUnitType: string
{
    case Kg = 'kg';
    case Item = 'item';
    case Both = 'both';

    public function label(): string
    {
        return match ($this) {
            self::Kg => 'Per Kilogram',
            self::Item => 'Per Item',
            self::Both => 'Kg / Item',
        };
    }
}
