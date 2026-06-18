<?php

namespace App\Enums;

enum PickupType: string
{
    case DropOff = 'drop_off';
    case Pickup = 'pickup';

    public function label(): string
    {
        return match ($this) {
            self::DropOff => 'Antar Sendiri',
            self::Pickup => 'Dijemput Kurir',
        };
    }
}
