<?php

namespace App\Models;

use App\Enums\ServiceUnitType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Service extends Model
{
    protected $fillable = [
        'name',
        'description',
        'price_per_kg',
        'price_per_item',
        'unit_type',
        'duration_hours',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'price_per_kg' => 'decimal:2',
            'price_per_item' => 'decimal:2',
            'unit_type' => ServiceUnitType::class,
            'duration_hours' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function calculatePrice(?float $weight = null, ?int $itemCount = null): float
    {
        $price = 0;

        if ($this->unit_type === ServiceUnitType::Kg && $weight) {
            $price = $weight * $this->price_per_kg;
        } elseif ($this->unit_type === ServiceUnitType::Item && $itemCount) {
            $price = $itemCount * $this->price_per_item;
        } elseif ($this->unit_type === ServiceUnitType::Both) {
            if ($weight) {
                $price += $weight * $this->price_per_kg;
            }
            if ($itemCount) {
                $price += $itemCount * $this->price_per_item;
            }
        }

        return $price;
    }
}
