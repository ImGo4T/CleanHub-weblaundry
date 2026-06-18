<?php

namespace App\Enums;

enum DeliveryType: string
{
    case SelfPickup = 'self_pickup';
    case Delivery = 'delivery';

    public function label(): string
    {
        return match ($this) {
            self::SelfPickup => 'Ambil Sendiri',
            self::Delivery => 'Diantar Kurir',
        };
    }
}
