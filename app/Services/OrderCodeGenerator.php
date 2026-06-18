<?php

namespace App\Services;

use App\Models\Order;

class OrderCodeGenerator
{
    public function generate(): string
    {
        $date = now()->format('Ymd');
        $prefix = "CLH-{$date}-";

        $lastOrder = Order::whereDate('created_at', today())
            ->orderBy('id', 'desc')
            ->first();

        $sequence = $lastOrder
            ? ((int) substr($lastOrder->order_code, -4)) + 1
            : 1;

        return $prefix . str_pad($sequence, 4, '0', STR_PAD_LEFT);
    }
}
