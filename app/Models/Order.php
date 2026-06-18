<?php

namespace App\Models;

use App\Enums\DeliveryType;
use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Enums\PickupType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    protected $fillable = [
        'order_code',
        'customer_id',
        'operator_id',
        'service_id',
        'status',
        'total_weight',
        'total_items',
        'subtotal',
        'discount',
        'total_price',
        'payment_status',
        'pickup_type',
        'delivery_type',
        'notes',
        'estimated_ready_at',
        'completed_at',
    ];

    protected function casts(): array
    {
        return [
            'status' => OrderStatus::class,
            'payment_status' => PaymentStatus::class,
            'pickup_type' => PickupType::class,
            'delivery_type' => DeliveryType::class,
            'total_weight' => 'decimal:2',
            'total_items' => 'integer',
            'subtotal' => 'decimal:2',
            'discount' => 'decimal:2',
            'total_price' => 'decimal:2',
            'estimated_ready_at' => 'datetime',
            'completed_at' => 'datetime',
        ];
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function operator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'operator_id');
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function statusLogs(): HasMany
    {
        return $this->hasMany(OrderStatusLog::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function scopeActive($query)
    {
        return $query->whereNotIn('status', [
            OrderStatus::Selesai->value,
            OrderStatus::Cancelled->value,
        ]);
    }

    public function scopeByStatus($query, OrderStatus $status)
    {
        return $query->where('status', $status->value);
    }

    public function updateStatus(OrderStatus $newStatus, User $changedBy, ?string $notes = null): void
    {
        $this->update(['status' => $newStatus]);

        $this->statusLogs()->create([
            'status' => $newStatus->value,
            'changed_by' => $changedBy->id,
            'notes' => $notes,
            'created_at' => now(),
        ]);

        if ($newStatus === OrderStatus::Selesai) {
            $this->update(['completed_at' => now()]);
        }
    }

    public function totalPaid(): float
    {
        return $this->payments()
            ->where('status', 'verified')
            ->sum('amount');
    }

    public function remainingBalance(): float
    {
        return $this->total_price - $this->totalPaid();
    }
}
